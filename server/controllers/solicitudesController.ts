import type { Request, Response } from 'express';
import { getMemoryDB, isUsingMemoryStore, getPool } from '../db/database.js';
import type { AuthenticatedRequest } from '../middleware/auth.js';
import type { SolicitudGrupo } from '../types/index.js';

export async function createSolicitud(req: Request, res: Response): Promise<void> {
  const { grupo_id, nombre_completo, telefono, email, mensaje } = req.body;

  if (!grupo_id || !nombre_completo || !telefono || !email) {
    res.status(400).json({ error: 'Todos los campos principales (nombre, teléfono, correo y grupo) son requeridos.' });
    return;
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ error: 'El formato del correo electrónico no es válido.' });
    return;
  }

  try {
    const parsedGrupoId = parseInt(grupo_id, 10);

    if (!isUsingMemoryStore() && getPool()) {
      const [result] = await getPool()!.query<any>(
        `INSERT INTO solicitudes_grupo (grupo_id, nombre_completo, telefono, email, mensaje, estado)
         VALUES (?, ?, ?, ?, ?, 'pendiente')`,
        [parsedGrupoId, nombre_completo.trim(), telefono.trim(), email.trim().toLowerCase(), mensaje || '']
      );

      res.status(201).json({
        message: '¡Tu solicitud ha sido recibida con éxito! Un líder del grupo se pondrá en contacto contigo pronto.',
        solicitudId: result.insertId
      });
      return;
    }

    const memoryDB = getMemoryDB();
    const grupo = memoryDB.grupos.find(g => g.id === parsedGrupoId);

    const newSolicitud: SolicitudGrupo = {
      id: Date.now(),
      grupo_id: parsedGrupoId,
      grupo_nombre: grupo ? grupo.nombre : 'Grupo de Conexión',
      sede_nombre: grupo ? grupo.sede_nombre : 'Sede',
      nombre_completo: nombre_completo.trim(),
      telefono: telefono.trim(),
      email: email.trim().toLowerCase(),
      mensaje: mensaje || '',
      estado: 'pendiente',
      created_at: new Date().toISOString()
    };

    memoryDB.solicitudes.unshift(newSolicitud);

    res.status(201).json({
      message: '¡Tu solicitud ha sido recibida con éxito! Un líder del grupo se pondrá en contacto contigo pronto.',
      solicitud: newSolicitud
    });
  } catch (err: any) {
    console.error('Error al registrar solicitud:', err);
    res.status(500).json({ error: 'No fue posible registrar la solicitud en este momento.' });
  }
}

export async function getSolicitudes(req: AuthenticatedRequest, res: Response): Promise<void> {
  const { grupo_id, estado } = req.query;

  try {
    if (!isUsingMemoryStore() && getPool()) {
      let query = `
        SELECT sg.*, g.nombre AS grupo_nombre, s.nombre AS sede_nombre, g.nombre_lider, g.lider_id
        FROM solicitudes_grupo sg
        JOIN grupos_conexion g ON sg.grupo_id = g.id
        JOIN sedes s ON g.sede_id = s.id
        WHERE 1=1
      `;
      const params: any[] = [];

      if (req.user?.rol === 'lider') {
        query += ' AND g.lider_id = ?';
        params.push(req.user.id);
      }

      if (grupo_id) {
        query += ' AND sg.grupo_id = ?';
        params.push(parseInt(grupo_id as string, 10));
      }

      if (estado) {
        query += ' AND sg.estado = ?';
        params.push(estado);
      }

      query += ' ORDER BY sg.created_at DESC';

      const [rows] = await getPool()!.query(query, params);
      res.json(rows);
      return;
    }

    const memoryDB = getMemoryDB();
    let solicitudes = [...memoryDB.solicitudes];

    if (req.user?.rol === 'lider') {
      const userGroupIds = memoryDB.grupos.filter(g => g.lider_id === req.user?.id).map(g => g.id);
      solicitudes = solicitudes.filter(s => userGroupIds.includes(s.grupo_id));
    }

    if (grupo_id) {
      const gId = parseInt(grupo_id as string, 10);
      solicitudes = solicitudes.filter(s => s.grupo_id === gId);
    }

    if (estado) {
      solicitudes = solicitudes.filter(s => s.estado === estado);
    }

    res.json(solicitudes);
  } catch (err: any) {
    console.error('Error al listar solicitudes:', err);
    res.status(500).json({ error: 'Error al obtener solicitudes.' });
  }
}

export async function updateSolicitudEstado(req: AuthenticatedRequest, res: Response): Promise<void> {
  const { id } = req.params;
  const { estado, notas_internas } = req.body;
  const solicitudId = parseInt(id, 10);

  try {
    if (!isUsingMemoryStore() && getPool()) {
      await getPool()!.query(
        'UPDATE solicitudes_grupo SET estado = COALESCE(?, estado), notas_internas = COALESCE(?, notas_internas) WHERE id = ?',
        [estado, notas_internas, solicitudId]
      );
      res.json({ message: 'Estado de la solicitud actualizado.' });
      return;
    }

    const memoryDB = getMemoryDB();
    const solicitud = memoryDB.solicitudes.find(s => s.id === solicitudId);
    if (!solicitud) {
      res.status(404).json({ error: 'Solicitud no encontrada.' });
      return;
    }

    if (estado) solicitud.estado = estado;
    if (notas_internas !== undefined) solicitud.notas_internas = notas_internas;

    res.json(solicitud);
  } catch (err: any) {
    console.error('Error al actualizar estado:', err);
    res.status(500).json({ error: 'Error al actualizar la solicitud.' });
  }
}

export async function exportSolicitudesCSV(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    let items: any[] = [];

    if (!isUsingMemoryStore() && getPool()) {
      const [rows] = await getPool()!.query<any[]>(`
        SELECT sg.id, sg.created_at, sg.nombre_completo, sg.telefono, sg.email, sg.estado, sg.mensaje, sg.notas_internas,
               g.nombre AS grupo_nombre, s.nombre AS sede_nombre
        FROM solicitudes_grupo sg
        JOIN grupos_conexion g ON sg.grupo_id = g.id
        JOIN sedes s ON g.sede_id = s.id
        ORDER BY sg.created_at DESC
      `);
      items = rows;
    } else {
      items = getMemoryDB().solicitudes;
    }

    // CSV header
    const headers = ['ID', 'Fecha', 'Nombre Completo', 'Teléfono', 'Email', 'Grupo', 'Sede', 'Estado', 'Mensaje', 'Notas Internas'];
    const rows = items.map(i => [
      i.id,
      i.created_at || '',
      `"${(i.nombre_completo || '').replace(/"/g, '""')}"`,
      `"${(i.telefono || '').replace(/"/g, '""')}"`,
      `"${(i.email || '').replace(/"/g, '""')}"`,
      `"${(i.grupo_nombre || '').replace(/"/g, '""')}"`,
      `"${(i.sede_nombre || '').replace(/"/g, '""')}"`,
      i.estado || '',
      `"${(i.mensaje || '').replace(/"/g, '""')}"`,
      `"${(i.notas_internas || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="solicitudes_grupos_tu_palabra.csv"');
    res.status(200).send('\uFEFF' + csvContent); // Add UTF-8 BOM for Excel
  } catch (err: any) {
    console.error('Error al exportar CSV de solicitudes:', err);
    res.status(500).json({ error: 'Error al generar archivo CSV.' });
  }
}
