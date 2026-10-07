import { Router } from 'express';
import { login, getCurrentUser } from '../controllers/authController.js';
import { getSedes, updateSede } from '../controllers/sedesController.js';
import { getEventos, getEventoById, createEvento, updateEvento, deleteEvento } from '../controllers/eventosController.js';
import { getGrupos, getGrupoById, createGrupo, updateGrupo, deleteGrupo } from '../controllers/gruposController.js';
import { createSolicitud, getSolicitudes, updateSolicitudEstado, exportSolicitudesCSV } from '../controllers/solicitudesController.js';
import { createContacto, getMensajes, updateMensajeEstado, exportMensajesCSV } from '../controllers/contactoController.js';
import { getRedes, updateRed } from '../controllers/redesController.js';
import { getContenido, updateContenido } from '../controllers/institucionalController.js';
import { getCategorias } from '../controllers/categoriasController.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { createRateLimiter } from '../middleware/rateLimit.js';

const router = Router();

// Rate limiters for public submissions
const publicFormLimiter = createRateLimiter(60 * 1000, 10);

// --- Rutas Públicas ---
router.post('/auth/login', login);
router.get('/sedes', getSedes);
router.get('/categorias', getCategorias);
router.get('/eventos', getEventos);
router.get('/eventos/:id', getEventoById);
router.get('/grupos', getGrupos);
router.get('/grupos/:id', getGrupoById);
router.post('/grupos/unirse', publicFormLimiter, createSolicitud);
router.post('/contacto', publicFormLimiter, createContacto);
router.get('/redes', getRedes);
router.get('/institucional', getContenido);

// --- Rutas Protegidas ---
router.get('/auth/me', authenticate, getCurrentUser);

// Sedes (Admin)
router.put('/sedes/:id', authenticate, requireRole(['admin']), updateSede);

// Eventos (Admin)
router.post('/eventos', authenticate, requireRole(['admin']), createEvento);
router.put('/eventos/:id', authenticate, requireRole(['admin']), updateEvento);
router.delete('/eventos/:id', authenticate, requireRole(['admin']), deleteEvento);

// Grupos (Admin o Líder)
router.post('/grupos', authenticate, requireRole(['admin', 'lider']), createGrupo);
router.put('/grupos/:id', authenticate, requireRole(['admin', 'lider']), updateGrupo);
router.delete('/grupos/:id', authenticate, requireRole(['admin']), deleteGrupo);

// Solicitudes a grupos (Admin y Líder)
router.get('/solicitudes/export/csv', authenticate, requireRole(['admin', 'lider']), exportSolicitudesCSV);
router.get('/solicitudes', authenticate, requireRole(['admin', 'lider']), getSolicitudes);
router.put('/solicitudes/:id', authenticate, requireRole(['admin', 'lider']), updateSolicitudEstado);

// Mensajes de contacto (Admin)
router.get('/contacto/export/csv', authenticate, requireRole(['admin']), exportMensajesCSV);
router.get('/contacto', authenticate, requireRole(['admin']), getMensajes);
router.put('/contacto/:id', authenticate, requireRole(['admin']), updateMensajeEstado);

// Redes sociales (Admin)
router.put('/redes/:id', authenticate, requireRole(['admin']), updateRed);

// Contenido institucional (Admin)
router.put('/institucional/:id', authenticate, requireRole(['admin']), updateContenido);

export default router;
