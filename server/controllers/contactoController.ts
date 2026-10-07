import type { Request, Response } from 'express';
import { getMemoryDB, isUsingMemoryStore, getPool } from '../db/database.js';
import type { AuthenticatedRequest } from '../middleware/auth.js';
import type { MensajeContacto } from '../types/index.js';

export async function createContacto(req: Request, res: Response): Promise<void> {
  const { sede_id, nombre_completo, email, telefono, asunto, mensaje } = req.body;

  if (!nombre_completo || !email || !mensaje) {
    res.status(400).json({ error: 'Nombre, correo electrónico y mensaje son obligatorios.' });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ error: 'El correo electrónico proporcionado no es válido.' });
    return;
  }

  try {
    const parsedSedeId = sede_id ? parseInt(sede_id, 10) : null;
    const ip = req.ip || req.socket.remoteAddress || 'unknown';

    if (!isUsingMemoryStore() && getPool()) {
      const [result] = await getPool()!.query<any>(
        `INSERT INTO mensajes_contacto (sede_id, nombre_completo, email, telefono, asunto, mensaje, estado, ip_origen)
         VALUES (?, ?, ?, ?, ?, ?, 'pendiente', ?)`,
        [parsedSedeId, nombre_completo.trim(), email.trim().toLowerCase(), telefono ? telefono.trim() : null, asunto || 'Información general', mensaje.trim(), ip]
      );
      res.status(201).json({
        message: '¡Gracias por comunicarte con nosotros! Hemos recibido tu mensaje y te responderemos a la brevedad.',
        id: result.insertId
      });
      return;
    }

    const memoryDB = getMemoryDB();
    const sede = memoryDB.sedes.find(s => s.id === parsedSedeId);

    const newMensaje: MensajeContacto = {
      id: Date.now(),
      sede_id: parsedSedeId,
      sede_nombre: sede ? sede.nombre : 'General',
      nombre_completo: nombre_completo.trim(),
      email: email.trim().toLowerCase(),
      telefono: telefono ? telefono.trim() : '',
      asunto: asunto || 'Información general',
      mensaje: mensaje.trim(),
      estado: 'pendiente',
      created_at: new Date().toISOString()
    };

    memoryDB.mensajes.unshift(newMensaje);

    res.status(201).json({
      message: '¡Gracias por comunicarte con nosotros! Hemos recibido tu mensaje y te responderemos a la brevedad.',
      mensaje: newMensaje
    });
  } catch (err: any) {
    console.error('Error al registrar mensaje de contacto:', err);
    res.status(500).json({ error: 'No fue posible enviar tu mensaje en este momento.' });
  }
}

export async function getMensajes(_req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!isUsingMemoryStore() && getPool()) {
      const [rows] = await getPool()!.query(`
        SELECT m.*, s.nombre AS sede_nombre 
        FROM mensajes_contacto m
        LEFT JOIN sedes s ON m.sede_id = s.id
        ORDER BY m.created_at DESC
      `);
      res.json(rows);
      return;
    }

    const memoryDB = getMemoryDB();
    res.json(memoryDB.mensajes);
  } catch (err: any) {
    console.error('Error al listar mensajes de contacto:', err);
    res.status(500).json({ error: 'Error al obtener mensajes.' });
  }
}

export async function updateMensajeEstado(req: AuthenticatedRequest, res: Response): Promise<void> {
  const { id } = req.params;
  const { estado } = req.body;
  const mensajeId = parseInt(id, 10);

  try {
    if (!isUsingMemoryStore() && getPool()) {
      await getPool()!.query('UPDATE mensajes_contacto SET estado = ? WHERE id = ?', [estado, mensajeId]);
      res.json({ message: 'Estado actualizado correctamente.' });
      return;
    }

    const memoryDB = getMemoryDB();
    const item = memoryDB.mensajes.find(m => m.id === mensajeId);
    if (!item) {
      res.status(404).json({ error: 'Mensaje no encontrado.' });
      return;
    }

    if (estado) item.estado = estado;
    res.json(item);
  } catch (err: any) {
    console.error('Error al actualizar estado del mensaje:', err);
    res.status(500).json({ error: 'Error al actualizar mensaje.' });
  }
}

export async function exportMensajesCSV(_req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    let items: any[] = [];

    if (!isUsingMemoryStore() && getPool()) {
      const [rows] = await getPool()!.query<any[]>(`
        SELECT m.id, m.created_at, m.nombre_completo, m.email, m.telefono, m.asunto, m.mensaje, m.estado,
               s.nombre AS sede_nombre
        FROM mensajes_contacto m
        LEFT JOIN sedes s ON m.sede_id = s.id
        ORDER BY m.created_at DESC
      `);
      items = rows;
    } else {
      items = getMemoryDB().mensajes;
    }

    const headers = ['ID', 'Fecha', 'Nombre Completo', 'Email', 'Teléfono', 'Sede', 'Asunto', 'Estado', 'Mensaje'];
    const rows = items.map(m => [
      m.id,
      m.created_at || '',
      `"${(m.nombre_completo || '').replace(/"/g, '""')}"`,
      `"${(m.email || '').replace(/"/g, '""')}"`,
      `"${(m.telefono || '').replace(/"/g, '""')}"`,
      `"${(m.sede_nombre || '').replace(/"/g, '""')}"`,
      `"${(m.asunto || '').replace(/"/g, '""')}"`,
      m.estado || '',
      `"${(m.mensaje || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="mensajes_contacto_tu_palabra.csv"');
    res.status(200).send('\uFEFF' + csvContent);
  } catch (err: any) {
    console.error('Error al exportar mensajes CSV:', err);
    res.status(500).json({ error: 'Error al generar archivo CSV de mensajes.' });
  }
}
