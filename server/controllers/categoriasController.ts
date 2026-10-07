import type { Request, Response } from 'express';
import { getMemoryDB, isUsingMemoryStore, getPool } from '../db/database.js';

export async function getCategorias(_req: Request, res: Response): Promise<void> {
  try {
    if (!isUsingMemoryStore() && getPool()) {
      const [rows] = await getPool()!.query('SELECT * FROM categorias WHERE activa = 1 ORDER BY orden ASC');
      res.json(rows);
      return;
    }

    const memoryDB = getMemoryDB();
    const categorias = memoryDB.categorias.filter(c => c.activa === 1 || c.activa === true);
    res.json(categorias);
  } catch (err: any) {
    console.error('Error al obtener categorías:', err);
    res.status(500).json({ error: 'Error al listar categorías.' });
  }
}
