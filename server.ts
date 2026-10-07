import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRouter from './server/routes/api.js';
import { initDatabase } from './server/db/database.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const isProd = process.env.NODE_ENV === 'production';

  // Middlewares
  app.use(cors());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Initialize DB Connection (MySQL with fallback)
  await initDatabase();

  // API Routes
  app.use('/api', apiRouter);

  // Status check endpoint
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      iglesia: 'Tu Palabra',
      sedes: ['Ibagué', 'Medellín'],
      timestamp: new Date().toISOString()
    });
  });

  // Client integration: Vite middleware in dev, static files in prod
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Servidor] Iglesia Tu Palabra ejecutándose en http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('[Servidor] Error crítico al iniciar servidor:', err);
});
