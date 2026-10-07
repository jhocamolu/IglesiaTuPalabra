import type { Request, Response } from 'express';
import { getMemoryDB, isUsingMemoryStore, getPool } from '../db/database.js';
import type { Evento } from '../types/index.js';

export async function getEventos(req: Request, res: Response): Promise<void> {
  const { sede, categoria, incluir_pasados, estado } = req.query;

  try {
    const now = new Date().toISOString();

    if (!isUsingMemoryStore() && getPool()) {
      let query = `
        SELECT e.*, s.nombre AS sede_nombre, c.nombre AS categoria_nombre 
        FROM eventos e
        LEFT JOIN sedes s ON e.sede_id = s.id
        LEFT JOIN categorias c ON e.categoria_id = c.id
        WHERE 1=1
      `;
      const params: any[] = [];

      if (estado) {
        query += ' AND e.estado = ?';
        params.push(estado);
      } else {
        query += " AND e.estado = 'publicado'";
      }

      if (sede && sede !== 'todas' && sede !== 'all') {
        query += ' AND (e.sede_id = ? OR e.sede_id IS NULL)';
        params.push(parseInt(sede as string, 10));
      }

      if (categoria && categoria !== 'todas' && categoria !== 'all') {
        query += ' AND e.categoria_id = ?';
        params.push(parseInt(categoria as string, 10));
      }

      if (incluir_pasados !== 'true') {
        query += ' AND (e.fecha_fin >= ? OR (e.fecha_fin IS NULL AND e.fecha_inicio >= ?))';
        params.push(now, now);
      }

      query += ' ORDER BY e.fecha_inicio ASC';

      const [rows] = await getPool()!.query(query, params);
      res.json(rows);
      return;
    }

    const memoryDB = getMemoryDB();
    let eventos = [...memoryDB.eventos];

    if (estado) {
      eventos = eventos.filter(e => e.estado === estado);
    } else {
      eventos = eventos.filter(e => e.estado === 'publicado');
    }

    if (sede && sede !== 'todas' && sede !== 'all') {
      const sedeIdNum = parseInt(sede as string, 10);
      eventos = eventos.filter(e => e.sede_id === sedeIdNum || e.sede_id === null || e.sede_id === undefined);
    }

    if (categoria && categoria !== 'todas' && categoria !== 'all') {
      const catIdNum = parseInt(categoria as string, 10);
      eventos = eventos.filter(e => e.categoria_id === catIdNum);
    }

    if (incluir_pasados !== 'true') {
      eventos = eventos.filter(e => {
        const compareDate = e.fecha_fin || e.fecha_inicio;
        return new Date(compareDate).getTime() >= Date.now() - (24 * 60 * 60 * 1000); // within last 24h
      });
    }

    eventos.sort((a, b) => new Date(a.fecha_inicio).getTime() - new Date(b.fecha_inicio).getTime());

    res.json(eventos);
  } catch (err: any) {
    console.error('Error al listar eventos:', err);
    res.status(500).json({ error: 'Error al obtener los eventos.' });
  }
}

export async function getEventoById(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  try {
    const eventoId = parseInt(id, 10);

    if (!isUsingMemoryStore() && getPool()) {
      const [rows] = await getPool()!.query<any[]>(
        `SELECT e.*, s.nombre AS sede_nombre, c.nombre AS categoria_nombre 
         FROM eventos e
         LEFT JOIN sedes s ON e.sede_id = s.id
         LEFT JOIN categorias c ON e.categoria_id = c.id
         WHERE e.id = ? LIMIT 1`,
        [eventoId]
      );
      if (rows.length === 0) {
        res.status(404).json({ error: 'Evento no encontrado.' });
        return;
      }
      res.json(rows[0]);
      return;
    }

    const memoryDB = getMemoryDB();
    const evento = memoryDB.eventos.find(e => e.id === eventoId);
    if (!evento) {
      res.status(404).json({ error: 'Evento no encontrado.' });
      return;
    }

    res.json(evento);
  } catch (err: any) {
    console.error('Error al obtener evento:', err);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
}

export async function createEvento(req: Request, res: Response): Promise<void> {
  const {
    titulo,
    descripcion,
    fecha_inicio,
    fecha_fin,
    sede_id,
    categoria_id,
    lugar,
    direccion,
    imagen_url,
    estado = 'publicado',
    destacado = 0,
    cupos_max,
    enlace_registro
  } = req.body;

  if (!titulo || !fecha_inicio || !categoria_id || !lugar) {
    res.status(400).json({ error: 'Título, fecha de inicio, categoría y lugar son obligatorios.' });
    return;
  }

  const slug = titulo
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-') + '-' + Date.now().toString().slice(-4);

  try {
    const parsedSedeId = sede_id ? parseInt(sede_id, 10) : null;
    const parsedCatId = parseInt(categoria_id, 10);

    if (!isUsingMemoryStore() && getPool()) {
      const [result] = await getPool()!.query<any>(
        `INSERT INTO eventos (titulo, slug, descripcion, fecha_inicio, fecha_fin, sede_id, categoria_id, lugar, direccion, imagen_url, estado, destacado, cupos_max, enlace_registro)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [titulo, slug, descripcion || '', fecha_inicio, fecha_fin || null, parsedSedeId, parsedCatId, lugar, direccion || null, imagen_url || null, estado, destacado ? 1 : 0, cupos_max || null, enlace_registro || null]
      );

      const [newRow] = await getPool()!.query<any[]>('SELECT * FROM eventos WHERE id = ?', [result.insertId]);
      res.status(201).json(newRow[0]);
      return;
    }

    const memoryDB = getMemoryDB();
    const sedeObj = memoryDB.sedes.find(s => s.id === parsedSedeId);
    const catObj = memoryDB.categorias.find(c => c.id === parsedCatId);

    const newEvento: Evento = {
      id: Date.now(),
      titulo,
      slug,
      descripcion: descripcion || '',
      fecha_inicio,
      fecha_fin: fecha_fin || null,
      sede_id: parsedSedeId,
      sede_nombre: sedeObj ? sedeObj.nombre : 'Ambas sedes',
      categoria_id: parsedCatId,
      categoria_nombre: catObj ? catObj.nombre : 'General',
      lugar,
      direccion: direccion || '',
      imagen_url: imagen_url || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
      estado,
      destacado: destacado ? 1 : 0,
      cupos_max: cupos_max ? parseInt(cupos_max, 10) : null,
      enlace_registro: enlace_registro || null,
      created_at: new Date().toISOString()
    };

    memoryDB.eventos.unshift(newEvento);
    res.status(201).json(newEvento);
  } catch (err: any) {
    console.error('Error al crear evento:', err);
    res.status(500).json({ error: 'Error al registrar el evento.' });
  }
}

export async function updateEvento(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const eventoId = parseInt(id, 10);
  const data = req.body;

  try {
    if (!isUsingMemoryStore() && getPool()) {
      await getPool()!.query(
        `UPDATE eventos SET
          titulo = COALESCE(?, titulo),
          descripcion = COALESCE(?, descripcion),
          fecha_inicio = COALESCE(?, fecha_inicio),
          fecha_fin = COALESCE(?, fecha_fin),
          sede_id = COALESCE(?, sede_id),
          categoria_id = COALESCE(?, categoria_id),
          lugar = COALESCE(?, lugar),
          direccion = COALESCE(?, direccion),
          imagen_url = COALESCE(?, imagen_url),
          estado = COALESCE(?, estado),
          destacado = COALESCE(?, destacado),
          cupos_max = COALESCE(?, cupos_max),
          enlace_registro = COALESCE(?, enlace_registro)
         WHERE id = ?`,
        [
          data.titulo,
          data.descripcion,
          data.fecha_inicio,
          data.fecha_fin,
          data.sede_id,
          data.categoria_id,
          data.lugar,
          data.direccion,
          data.imagen_url,
          data.estado,
          data.destacado !== undefined ? (data.destacado ? 1 : 0) : undefined,
          data.cupos_max,
          data.enlace_registro,
          eventoId
        ]
      );
      const [rows] = await getPool()!.query<any[]>('SELECT * FROM eventos WHERE id = ?', [eventoId]);
      res.json(rows[0]);
      return;
    }

    const memoryDB = getMemoryDB();
    const evento = memoryDB.eventos.find(e => e.id === eventoId);
    if (!evento) {
      res.status(404).json({ error: 'Evento no encontrado.' });
      return;
    }

    Object.assign(evento, data);
    res.json(evento);
  } catch (err: any) {
    console.error('Error al actualizar evento:', err);
    res.status(500).json({ error: 'Error al actualizar el evento.' });
  }
}

export async function deleteEvento(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const eventoId = parseInt(id, 10);

  try {
    if (!isUsingMemoryStore() && getPool()) {
      await getPool()!.query('DELETE FROM eventos WHERE id = ?', [eventoId]);
      res.json({ message: 'Evento eliminado correctamente.' });
      return;
    }

    const memoryDB = getMemoryDB();
    const index = memoryDB.eventos.findIndex(e => e.id === eventoId);
    if (index === -1) {
      res.status(404).json({ error: 'Evento no encontrado.' });
      return;
    }

    memoryDB.eventos.splice(index, 1);
    res.json({ message: 'Evento eliminado correctamente.' });
  } catch (err: any) {
    console.error('Error al eliminar evento:', err);
    res.status(500).json({ error: 'Error al eliminar el evento.' });
  }
}
