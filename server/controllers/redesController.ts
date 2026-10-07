import type { Request, Response } from 'express';
import { getMemoryDB, isUsingMemoryStore, getPool } from '../db/database.js';

export async function getRedes(_req: Request, res: Response): Promise<void> {
  try {
    if (!isUsingMemoryStore() && getPool()) {
      const [rows] = await getPool()!.query('SELECT * FROM redes_sociales ORDER BY orden ASC');
      res.json(rows);
      return;
    }

    const memoryDB = getMemoryDB();
    res.json(memoryDB.redes);
  } catch (err: any) {
    console.error('Error al listar redes sociales:', err);
    res.status(500).json({ error: 'Error al obtener redes sociales.' });
  }
}

export async function updateRed(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const { url, usuario, activa, orden, nombre_mostrar } = req.body;
  const redId = parseInt(id, 10);

  try {
    if (!isUsingMemoryStore() && getPool()) {
      await getPool()!.query(
        `UPDATE redes_sociales SET
          url = COALESCE(?, url),
          usuario = COALESCE(?, usuario),
          activa = COALESCE(?, activa),
          orden = COALESCE(?, orden),
          nombre_mostrar = COALESCE(?, nombre_mostrar)
         WHERE id = ?`,
        [url, usuario, activa !== undefined ? (activa ? 1 : 0) : undefined, orden, nombre_mostrar, redId]
      );
      const [rows] = await getPool()!.query<any[]>('SELECT * FROM redes_sociales WHERE id = ?', [redId]);
      res.json(rows[0]);
      return;
    }

    const memoryDB = getMemoryDB();
    const item = memoryDB.redes.find(r => r.id === redId);
    if (!item) {
      res.status(404).json({ error: 'Red social no encontrada.' });
      return;
    }

    if (url !== undefined) item.url = url;
    if (usuario !== undefined) item.usuario = usuario;
    if (activa !== undefined) item.activa = activa ? 1 : 0;
    if (orden !== undefined) item.orden = orden;
    if (nombre_mostrar !== undefined) item.nombre_mostrar = nombre_mostrar;

    res.json(item);
  } catch (err: any) {
    console.error('Error al actualizar red social:', err);
    res.status(500).json({ error: 'Error al actualizar red social.' });
  }
}
