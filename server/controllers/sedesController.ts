import type { Request, Response } from 'express';
import { getMemoryDB, isUsingMemoryStore, getPool } from '../db/database.js';
import type { Sede } from '../types/index.js';

export async function getSedes(_req: Request, res: Response): Promise<void> {
  try {
    if (!isUsingMemoryStore() && getPool()) {
      const [rows] = await getPool()!.query('SELECT * FROM sedes WHERE activa = 1 ORDER BY id ASC');
      res.json(rows);
      return;
    }

    const memoryDB = getMemoryDB();
    const sedes = memoryDB.sedes.filter(s => s.activa === 1 || s.activa === true);
    res.json(sedes);
  } catch (err: any) {
    console.error('Error al obtener sedes:', err);
    res.status(500).json({ error: 'Error al cargar las sedes.' });
  }
}

export async function updateSede(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const {
    direccion,
    barrio,
    telefono,
    whatsapp,
    email,
    horario_sabado,
    horario_domingo,
    mapa_embed_url,
    mapa_link_url
  } = req.body;

  try {
    const sedeId = parseInt(id, 10);
    if (!isUsingMemoryStore() && getPool()) {
      await getPool()!.query(
        `UPDATE sedes SET 
          direccion = COALESCE(?, direccion),
          barrio = COALESCE(?, barrio),
          telefono = COALESCE(?, telefono),
          whatsapp = COALESCE(?, whatsapp),
          email = COALESCE(?, email),
          horario_sabado = COALESCE(?, horario_sabado),
          horario_domingo = COALESCE(?, horario_domingo),
          mapa_embed_url = COALESCE(?, mapa_embed_url),
          mapa_link_url = COALESCE(?, mapa_link_url)
         WHERE id = ?`,
        [direccion, barrio, telefono, whatsapp, email, horario_sabado, horario_domingo, mapa_embed_url, mapa_link_url, sedeId]
      );
      const [rows] = await getPool()!.query<any[]>('SELECT * FROM sedes WHERE id = ?', [sedeId]);
      res.json(rows[0]);
      return;
    }

    const memoryDB = getMemoryDB();
    const sede = memoryDB.sedes.find(s => s.id === sedeId);
    if (!sede) {
      res.status(404).json({ error: 'Sede no encontrada.' });
      return;
    }

    if (direccion !== undefined) sede.direccion = direccion;
    if (barrio !== undefined) sede.barrio = barrio;
    if (telefono !== undefined) sede.telefono = telefono;
    if (whatsapp !== undefined) sede.whatsapp = whatsapp;
    if (email !== undefined) sede.email = email;
    if (horario_sabado !== undefined) sede.horario_sabado = horario_sabado;
    if (horario_domingo !== undefined) sede.horario_domingo = horario_domingo;
    if (mapa_embed_url !== undefined) sede.mapa_embed_url = mapa_embed_url;
    if (mapa_link_url !== undefined) sede.mapa_link_url = mapa_link_url;

    res.json(sede);
  } catch (err: any) {
    console.error('Error al actualizar sede:', err);
    res.status(500).json({ error: 'Error al actualizar la sede.' });
  }
}
