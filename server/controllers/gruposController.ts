import type { Request, Response } from 'express';
import { getMemoryDB, isUsingMemoryStore, getPool } from '../db/database.js';
import type { AuthenticatedRequest } from '../middleware/auth.js';
import type { GrupoConexion } from '../types/index.js';

export async function getGrupos(req: Request, res: Response): Promise<void> {
  const { sede, categoria, dia, q, estado } = req.query;

  try {
    if (!isUsingMemoryStore() && getPool()) {
      let query = `
        SELECT g.*, s.nombre AS sede_nombre, c.nombre AS categoria_nombre,
          (SELECT COUNT(*) FROM solicitudes_grupo sg WHERE sg.grupo_id = g.id) AS solicitudes_count
        FROM grupos_conexion g
        LEFT JOIN sedes s ON g.sede_id = s.id
        LEFT JOIN categorias c ON g.categoria_id = c.id
        WHERE 1=1
      `;
      const params: any[] = [];

      if (estado) {
        query += ' AND g.estado = ?';
        params.push(estado);
      } else {
        query += " AND g.estado = 'activo'";
      }

      if (sede && sede !== 'todas' && sede !== 'all') {
        query += ' AND g.sede_id = ?';
        params.push(parseInt(sede as string, 10));
      }

      if (categoria && categoria !== 'todas' && categoria !== 'all') {
        query += ' AND g.categoria_id = ?';
        params.push(parseInt(categoria as string, 10));
      }

      if (dia && dia !== 'todos') {
        query += ' AND g.dia_semana = ?';
        params.push(dia);
      }

      if (q) {
        query += ' AND (g.nombre LIKE ? OR g.barrio_zona LIKE ? OR g.nombre_lider LIKE ? OR g.descripcion LIKE ?)';
        const searchTerm = `%${q}%`;
        params.push(searchTerm, searchTerm, searchTerm, searchTerm);
      }

      query += ' ORDER BY g.dia_semana ASC, g.hora ASC';

      const [rows] = await getPool()!.query(query, params);
      res.json(rows);
      return;
    }

    const memoryDB = getMemoryDB();
    let grupos = [...memoryDB.grupos];

    if (estado) {
      grupos = grupos.filter(g => g.estado === estado);
    } else {
      grupos = grupos.filter(g => g.estado === 'activo');
    }

    if (sede && sede !== 'todas' && sede !== 'all') {
      const sedeIdNum = parseInt(sede as string, 10);
      grupos = grupos.filter(g => g.sede_id === sedeIdNum);
    }

    if (categoria && categoria !== 'todas' && categoria !== 'all') {
      const catIdNum = parseInt(categoria as string, 10);
      grupos = grupos.filter(g => g.categoria_id === catIdNum);
    }

    if (dia && dia !== 'todos') {
      grupos = grupos.filter(g => g.dia_semana === dia);
    }

    if (q) {
      const term = (q as string).toLowerCase();
      grupos = grupos.filter(
        g =>
          g.nombre.toLowerCase().includes(term) ||
          g.barrio_zona.toLowerCase().includes(term) ||
          g.nombre_lider.toLowerCase().includes(term) ||
          g.descripcion.toLowerCase().includes(term)
      );
    }

    // Attach request counts
    const result = grupos.map(g => ({
      ...g,
      solicitudes_count: memoryDB.solicitudes.filter(s => s.grupo_id === g.id).length
    }));

    res.json(result);
  } catch (err: any) {
    console.error('Error al obtener grupos:', err);
    res.status(500).json({ error: 'Error al listar los grupos de conexión.' });
  }
}

export async function getGrupoById(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const grupoId = parseInt(id, 10);

  try {
    if (!isUsingMemoryStore() && getPool()) {
      const [rows] = await getPool()!.query<any[]>(
        `SELECT g.*, s.nombre AS sede_nombre, c.nombre AS categoria_nombre 
         FROM grupos_conexion g
         LEFT JOIN sedes s ON g.sede_id = s.id
         LEFT JOIN categorias c ON g.categoria_id = c.id
         WHERE g.id = ? LIMIT 1`,
        [grupoId]
      );
      if (rows.length === 0) {
        res.status(404).json({ error: 'Grupo de conexión no encontrado.' });
        return;
      }
      res.json(rows[0]);
      return;
    }

    const memoryDB = getMemoryDB();
    const grupo = memoryDB.grupos.find(g => g.id === grupoId);
    if (!grupo) {
      res.status(404).json({ error: 'Grupo de conexión no encontrado.' });
      return;
    }

    res.json(grupo);
  } catch (err: any) {
    console.error('Error al obtener grupo:', err);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
}

export async function createGrupo(req: AuthenticatedRequest, res: Response): Promise<void> {
  const {
    nombre,
    categoria_id,
    sede_id,
    nombre_lider,
    contacto_lider,
    dia_semana,
    hora,
    hora_formato,
    barrio_zona,
    ubicacion_aproximada,
    descripcion,
    cupo_maximo = 15,
    estado = 'activo'
  } = req.body;

  if (!nombre || !categoria_id || !sede_id || !nombre_lider || !dia_semana || !barrio_zona) {
    res.status(400).json({ error: 'Faltan campos obligatorios para el grupo de conexión.' });
    return;
  }

  try {
    const liderId = req.user?.rol === 'lider' ? req.user.id : (req.body.lider_id || req.user?.id || null);
    const parsedCatId = parseInt(categoria_id, 10);
    const parsedSedeId = parseInt(sede_id, 10);

    if (!isUsingMemoryStore() && getPool()) {
      const [result] = await getPool()!.query<any>(
        `INSERT INTO grupos_conexion 
          (nombre, categoria_id, sede_id, lider_id, nombre_lider, contacto_lider, dia_semana, hora, hora_formato, barrio_zona, ubicacion_aproximada, descripcion, cupo_maximo, estado)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          nombre,
          parsedCatId,
          parsedSedeId,
          liderId,
          nombre_lider,
          contacto_lider || '',
          dia_semana,
          hora || '19:00:00',
          hora_formato || '7:00 PM',
          barrio_zona,
          ubicacion_aproximada || '',
          descripcion || '',
          cupo_maximo,
          estado
        ]
      );
      const [newRow] = await getPool()!.query<any[]>('SELECT * FROM grupos_conexion WHERE id = ?', [result.insertId]);
      res.status(201).json(newRow[0]);
      return;
    }

    const memoryDB = getMemoryDB();
    const sedeObj = memoryDB.sedes.find(s => s.id === parsedSedeId);
    const catObj = memoryDB.categorias.find(c => c.id === parsedCatId);

    const newGrupo: GrupoConexion = {
      id: Date.now(),
      nombre,
      categoria_id: parsedCatId,
      categoria_nombre: catObj ? catObj.nombre : 'General',
      sede_id: parsedSedeId,
      sede_nombre: sedeObj ? sedeObj.nombre : 'Sede',
      lider_id: liderId,
      nombre_lider,
      contacto_lider: contacto_lider || '',
      dia_semana,
      hora: hora || '19:00:00',
      hora_formato: hora_formato || '7:00 PM',
      barrio_zona,
      ubicacion_aproximada: ubicacion_aproximada || '',
      descripcion: descripcion || '',
      cupo_maximo: parseInt(cupo_maximo, 10) || 15,
      estado,
      solicitudes_count: 0,
      created_at: new Date().toISOString()
    };

    memoryDB.grupos.push(newGrupo);
    res.status(201).json(newGrupo);
  } catch (err: any) {
    console.error('Error al crear grupo:', err);
    res.status(500).json({ error: 'Error al registrar grupo de conexión.' });
  }
}

export async function updateGrupo(req: AuthenticatedRequest, res: Response): Promise<void> {
  const { id } = req.params;
  const grupoId = parseInt(id, 10);
  const data = req.body;

  try {
    // Check permission: If role is lider, must be assigned to this group
    if (req.user?.rol === 'lider') {
      let isOwner = false;
      if (!isUsingMemoryStore() && getPool()) {
        const [rows] = await getPool()!.query<any[]>('SELECT * FROM grupos_conexion WHERE id = ?', [grupoId]);
        if (rows[0] && rows[0].lider_id === req.user.id) {
          isOwner = true;
        }
      } else {
        const memoryDB = getMemoryDB();
        const found = memoryDB.grupos.find(g => g.id === grupoId);
        if (found && (found.lider_id === req.user.id || found.nombre_lider.includes(req.user.nombre))) {
          isOwner = true;
        }
      }

      if (!isOwner) {
        res.status(403).json({ error: 'Como líder, únicamente tienes autorización para gestionar tu propio grupo.' });
        return;
      }
    }

    if (!isUsingMemoryStore() && getPool()) {
      await getPool()!.query(
        `UPDATE grupos_conexion SET
          nombre = COALESCE(?, nombre),
          categoria_id = COALESCE(?, categoria_id),
          sede_id = COALESCE(?, sede_id),
          nombre_lider = COALESCE(?, nombre_lider),
          contacto_lider = COALESCE(?, contacto_lider),
          dia_semana = COALESCE(?, dia_semana),
          hora = COALESCE(?, hora),
          hora_formato = COALESCE(?, hora_formato),
          barrio_zona = COALESCE(?, barrio_zona),
          ubicacion_aproximada = COALESCE(?, ubicacion_aproximada),
          descripcion = COALESCE(?, descripcion),
          cupo_maximo = COALESCE(?, cupo_maximo),
          estado = COALESCE(?, estado)
         WHERE id = ?`,
        [
          data.nombre,
          data.categoria_id,
          data.sede_id,
          data.nombre_lider,
          data.contacto_lider,
          data.dia_semana,
          data.hora,
          data.hora_formato,
          data.barrio_zona,
          data.ubicacion_aproximada,
          data.descripcion,
          data.cupo_maximo,
          data.estado,
          grupoId
        ]
      );
      const [rows] = await getPool()!.query<any[]>('SELECT * FROM grupos_conexion WHERE id = ?', [grupoId]);
      res.json(rows[0]);
      return;
    }

    const memoryDB = getMemoryDB();
    const grupo = memoryDB.grupos.find(g => g.id === grupoId);
    if (!grupo) {
      res.status(404).json({ error: 'Grupo no encontrado.' });
      return;
    }

    Object.assign(grupo, data);
    res.json(grupo);
  } catch (err: any) {
    console.error('Error al actualizar grupo:', err);
    res.status(500).json({ error: 'Error al actualizar grupo de conexión.' });
  }
}

export async function deleteGrupo(req: AuthenticatedRequest, res: Response): Promise<void> {
  const { id } = req.params;
  const grupoId = parseInt(id, 10);

  try {
    if (req.user?.rol !== 'admin') {
      res.status(403).json({ error: 'Solo un administrador general puede eliminar grupos de conexión.' });
      return;
    }

    if (!isUsingMemoryStore() && getPool()) {
      await getPool()!.query('DELETE FROM grupos_conexion WHERE id = ?', [grupoId]);
      res.json({ message: 'Grupo eliminado exitosamente.' });
      return;
    }

    const memoryDB = getMemoryDB();
    const index = memoryDB.grupos.findIndex(g => g.id === grupoId);
    if (index === -1) {
      res.status(404).json({ error: 'Grupo no encontrado.' });
      return;
    }

    memoryDB.grupos.splice(index, 1);
    res.json({ message: 'Grupo eliminado exitosamente.' });
  } catch (err: any) {
    console.error('Error al eliminar grupo:', err);
    res.status(500).json({ error: 'Error al eliminar grupo de conexión.' });
  }
}
