import type { Request, Response } from 'express';
import { getMemoryDB, isUsingMemoryStore, getPool } from '../db/database.js';

export async function getContenido(_req: Request, res: Response): Promise<void> {
  try {
    if (!isUsingMemoryStore() && getPool()) {
      const [rows] = await getPool()!.query('SELECT * FROM contenido_institucional ORDER BY id ASC');
      res.json(rows);
      return;
    }

    const memoryDB = getMemoryDB();
    res.json(memoryDB.institucional);
  } catch (err: any) {
    console.error('Error al listar contenido institucional:', err);
    res.status(500).json({ error: 'Error al obtener contenido institucional.' });
  }
}

export async function updateContenido(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const { titulo, subtitulo, contenido, versiculo_referencia, versiculo_texto } = req.body;
  const contenidoId = parseInt(id, 10);

  try {
    if (!isUsingMemoryStore() && getPool()) {
      await getPool()!.query(
        `UPDATE contenido_institucional SET
          titulo = COALESCE(?, titulo),
          subtitulo = COALESCE(?, subtitulo),
          contenido = COALESCE(?, contenido),
          versiculo_referencia = COALESCE(?, versiculo_referencia),
          versiculo_texto = COALESCE(?, versiculo_texto)
         WHERE id = ?`,
        [titulo, subtitulo, contenido, versiculo_referencia, versiculo_texto, contenidoId]
      );
      const [rows] = await getPool()!.query<any[]>('SELECT * FROM contenido_institucional WHERE id = ?', [contenidoId]);
      res.json(rows[0]);
      return;
    }

    const memoryDB = getMemoryDB();
    const item = memoryDB.institucional.find(c => c.id === contenidoId);
    if (!item) {
      res.status(404).json({ error: 'Contenido no encontrado.' });
      return;
    }

    if (titulo !== undefined) item.titulo = titulo;
    if (subtitulo !== undefined) item.subtitulo = subtitulo;
    if (contenido !== undefined) item.contenido = contenido;
    if (versiculo_referencia !== undefined) item.versiculo_referencia = versiculo_referencia;
    if (versiculo_texto !== undefined) item.versiculo_texto = versiculo_texto;

    res.json(item);
  } catch (err: any) {
    console.error('Error al actualizar contenido institucional:', err);
    res.status(500).json({ error: 'Error al actualizar contenido institucional.' });
  }
}
