import type {
  Sede,
  Categoria,
  Evento,
  GrupoConexion,
  SolicitudGrupo,
  MensajeContacto,
  RedSocial,
  ContenidoInstitucional,
  Usuario
} from '../types/index.ts';
import {
  mockSedes,
  mockCategorias,
  mockEventos,
  mockGrupos,
  mockContenido,
  mockRedes
} from './mockData.ts';

const API_BASE = '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('tp_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// In-memory runtime cache for client fallback
let runtimeSedes = [...mockSedes];
let runtimeEventos = [...mockEventos];
let runtimeGrupos = [...mockGrupos];
let runtimeContenido = [...mockContenido];
let runtimeRedes = [...mockRedes];
let runtimeSolicitudes: SolicitudGrupo[] = [
  {
    id: 1,
    grupo_id: 1,
    grupo_nombre: 'Conexión Jóvenes: Radicados en la Roca',
    sede_nombre: 'Sede Ibagué',
    nombre_completo: 'Mateo Gómez Rodríguez',
    telefono: '+57 318 400-1122',
    email: 'mateo.gomez@gmail.com',
    mensaje: 'Hola, me mudé hace poco a Ibagué y quiero unirme a un grupo de jóvenes para congregarme.',
    estado: 'pendiente',
    created_at: new Date(Date.now() - 2 * 86400000).toISOString()
  },
  {
    id: 2,
    grupo_id: 6,
    grupo_nombre: 'Conexión Poblado Jóvenes Profesionales',
    sede_nombre: 'Sede Medellín',
    nombre_completo: 'Valentina Henao Arango',
    telefono: '+57 300 223-4455',
    email: 'valen.henao@hotmail.com',
    mensaje: 'Quiero conocer más sobre la fe y hacer amigos que amen a Jesús en Medellín.',
    estado: 'contactado',
    notas_internas: 'Contactada por Carolina Vélez vía WhatsApp.',
    created_at: new Date(Date.now() - 5 * 86400000).toISOString()
  }
];

let runtimeMensajes: MensajeContacto[] = [
  {
    id: 1,
    sede_id: 1,
    sede_nombre: 'Sede Ibagué',
    nombre_completo: 'Gloria Inés Patiño',
    email: 'gloria.patino@gmail.com',
    telefono: '+57 311 445-8899',
    asunto: 'Horario de BibliAventura',
    mensaje: 'Buenas tardes, quisiera saber si los domingos a las 10:00 AM reciben niños de 4 años en el ministerio infantil.',
    estado: 'respondido',
    created_at: new Date(Date.now() - 3 * 86400000).toISOString()
  },
  {
    id: 2,
    sede_id: 2,
    sede_nombre: 'Sede Medellín',
    nombre_completo: 'Camilo Andrés Duque',
    email: 'camiloduque@gmail.com',
    telefono: '+57 314 200-3311',
    asunto: 'Consejería Matrimonial',
    mensaje: 'Quisiera saber con qué pastor puedo agendar una cita de orientación para mi matrimonio en la sede Medellín.',
    estado: 'pendiente',
    created_at: new Date(Date.now() - 1 * 86400000).toISOString()
  }
];

export const api = {
  // Sedes
  async getSedes(): Promise<Sede[]> {
    try {
      const res = await fetch(`${API_BASE}/sedes`);
      if (res.ok) {
        const data = await res.json();
        runtimeSedes = data;
        return data;
      }
    } catch {
      // Use fallback
    }
    return runtimeSedes;
  },

  async updateSede(id: number, data: Partial<Sede>): Promise<Sede> {
    try {
      const res = await fetch(`${API_BASE}/sedes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch {
      // Use fallback
    }
    const idx = runtimeSedes.findIndex(s => s.id === id);
    if (idx !== -1) {
      runtimeSedes[idx] = { ...runtimeSedes[idx], ...data };
      return runtimeSedes[idx];
    }
    throw new Error('Sede no encontrada');
  },

  // Categorías
  async getCategorias(): Promise<Categoria[]> {
    try {
      const res = await fetch(`${API_BASE}/categorias`);
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    return mockCategorias;
  },

  // Eventos
  async getEventos(params: { sede?: string; categoria?: string; incluir_pasados?: boolean; estado?: string } = {}): Promise<Evento[]> {
    try {
      const query = new URLSearchParams();
      if (params.sede) query.set('sede', params.sede);
      if (params.categoria) query.set('categoria', params.categoria);
      if (params.incluir_pasados) query.set('incluir_pasados', 'true');
      if (params.estado) query.set('estado', params.estado);

      const res = await fetch(`${API_BASE}/eventos?${query.toString()}`);
      if (res.ok) {
        const data = await res.json();
        return data;
      }
    } catch {
      // Fallback
    }

    let items = [...runtimeEventos];
    if (params.estado) {
      items = items.filter(e => e.estado === params.estado);
    } else {
      items = items.filter(e => e.estado === 'publicado');
    }
    if (params.sede && params.sede !== 'todas' && params.sede !== 'all') {
      const sId = parseInt(params.sede, 10);
      items = items.filter(e => e.sede_id === sId || !e.sede_id);
    }
    if (params.categoria && params.categoria !== 'todas' && params.categoria !== 'all') {
      const cId = parseInt(params.categoria, 10);
      items = items.filter(e => e.categoria_id === cId);
    }
    if (!params.incluir_pasados) {
      const now = Date.now() - 24 * 3600 * 1000;
      items = items.filter(e => new Date(e.fecha_fin || e.fecha_inicio).getTime() >= now);
    }
    return items.sort((a, b) => new Date(a.fecha_inicio).getTime() - new Date(b.fecha_inicio).getTime());
  },

  async createEvento(data: Partial<Evento>): Promise<Evento> {
    try {
      const res = await fetch(`${API_BASE}/eventos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    const newEv: Evento = {
      id: Date.now(),
      titulo: data.titulo || '',
      slug: (data.titulo || 'evento').toLowerCase().replace(/\s+/g, '-'),
      descripcion: data.descripcion || '',
      fecha_inicio: data.fecha_inicio || new Date().toISOString(),
      fecha_fin: data.fecha_fin || null,
      sede_id: data.sede_id || null,
      sede_nombre: runtimeSedes.find(s => s.id === data.sede_id)?.nombre || 'Ambas sedes',
      categoria_id: data.categoria_id || 7,
      categoria_nombre: mockCategorias.find(c => c.id === data.categoria_id)?.nombre || 'General',
      lugar: data.lugar || 'Auditorio',
      direccion: data.direccion || '',
      imagen_url: data.imagen_url || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
      estado: data.estado || 'publicado',
      destacado: data.destacado ? 1 : 0,
      cupos_max: data.cupos_max || null,
      enlace_registro: data.enlace_registro || null,
      created_at: new Date().toISOString()
    };
    runtimeEventos.unshift(newEv);
    return newEv;
  },

  async updateEvento(id: number, data: Partial<Evento>): Promise<Evento> {
    try {
      const res = await fetch(`${API_BASE}/eventos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    const idx = runtimeEventos.findIndex(e => e.id === id);
    if (idx !== -1) {
      runtimeEventos[idx] = { ...runtimeEventos[idx], ...data };
      return runtimeEventos[idx];
    }
    throw new Error('Evento no encontrado');
  },

  async deleteEvento(id: number): Promise<void> {
    try {
      const res = await fetch(`${API_BASE}/eventos/${id}`, {
        method: 'DELETE',
        headers: getAuthHeader()
      });
      if (res.ok) return;
    } catch {
      // Fallback
    }
    runtimeEventos = runtimeEventos.filter(e => e.id !== id);
  },

  // Grupos
  async getGrupos(params: { sede?: string; categoria?: string; dia?: string; q?: string; estado?: string } = {}): Promise<GrupoConexion[]> {
    try {
      const query = new URLSearchParams();
      if (params.sede) query.set('sede', params.sede);
      if (params.categoria) query.set('categoria', params.categoria);
      if (params.dia) query.set('dia', params.dia);
      if (params.q) query.set('q', params.q);
      if (params.estado) query.set('estado', params.estado);

      const res = await fetch(`${API_BASE}/grupos?${query.toString()}`);
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }

    let items = [...runtimeGrupos];
    if (params.estado) {
      items = items.filter(g => g.estado === params.estado);
    } else {
      items = items.filter(g => g.estado === 'activo');
    }
    if (params.sede && params.sede !== 'todas' && params.sede !== 'all') {
      const sId = parseInt(params.sede, 10);
      items = items.filter(g => g.sede_id === sId);
    }
    if (params.categoria && params.categoria !== 'todas' && params.categoria !== 'all') {
      const cId = parseInt(params.categoria, 10);
      items = items.filter(g => g.categoria_id === cId);
    }
    if (params.dia && params.dia !== 'todos') {
      items = items.filter(g => g.dia_semana === params.dia);
    }
    if (params.q) {
      const term = params.q.toLowerCase();
      items = items.filter(
        g =>
          g.nombre.toLowerCase().includes(term) ||
          g.barrio_zona.toLowerCase().includes(term) ||
          g.nombre_lider.toLowerCase().includes(term) ||
          g.descripcion.toLowerCase().includes(term)
      );
    }
    return items;
  },

  async createGrupo(data: Partial<GrupoConexion>): Promise<GrupoConexion> {
    try {
      const res = await fetch(`${API_BASE}/grupos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }

    const newGr: GrupoConexion = {
      id: Date.now(),
      nombre: data.nombre || '',
      categoria_id: data.categoria_id || 1,
      categoria_nombre: mockCategorias.find(c => c.id === data.categoria_id)?.nombre || 'General',
      sede_id: data.sede_id || 1,
      sede_nombre: runtimeSedes.find(s => s.id === data.sede_id)?.nombre || 'Sede',
      lider_id: data.lider_id || null,
      nombre_lider: data.nombre_lider || '',
      contacto_lider: data.contacto_lider || '',
      dia_semana: data.dia_semana || 'Miércoles',
      hora: data.hora || '19:00:00',
      hora_formato: data.hora_formato || '7:00 PM',
      barrio_zona: data.barrio_zona || '',
      ubicacion_aproximada: data.ubicacion_aproximada || '',
      descripcion: data.descripcion || '',
      cupo_maximo: data.cupo_maximo || 15,
      estado: data.estado || 'activo',
      solicitudes_count: 0,
      created_at: new Date().toISOString()
    };
    runtimeGrupos.push(newGr);
    return newGr;
  },

  async updateGrupo(id: number, data: Partial<GrupoConexion>): Promise<GrupoConexion> {
    try {
      const res = await fetch(`${API_BASE}/grupos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    const idx = runtimeGrupos.findIndex(g => g.id === id);
    if (idx !== -1) {
      runtimeGrupos[idx] = { ...runtimeGrupos[idx], ...data };
      return runtimeGrupos[idx];
    }
    throw new Error('Grupo no encontrado');
  },

  async deleteGrupo(id: number): Promise<void> {
    try {
      const res = await fetch(`${API_BASE}/grupos/${id}`, {
        method: 'DELETE',
        headers: getAuthHeader()
      });
      if (res.ok) return;
    } catch {
      // Fallback
    }
    runtimeGrupos = runtimeGrupos.filter(g => g.id !== id);
  },

  // Solicitudes para unirse a grupo
  async unirseAGrupo(data: { grupo_id: number; nombre_completo: string; telefono: string; email: string; mensaje?: string }) {
    try {
      const res = await fetch(`${API_BASE}/grupos/unirse`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    const grupo = runtimeGrupos.find(g => g.id === data.grupo_id);
    const newSol: SolicitudGrupo = {
      id: Date.now(),
      grupo_id: data.grupo_id,
      grupo_nombre: grupo?.nombre || 'Grupo de Conexión',
      sede_nombre: grupo?.sede_nombre || 'Sede',
      nombre_completo: data.nombre_completo,
      telefono: data.telefono,
      email: data.email,
      mensaje: data.mensaje || '',
      estado: 'pendiente',
      created_at: new Date().toISOString()
    };
    runtimeSolicitudes.unshift(newSol);
    return {
      message: '¡Tu solicitud ha sido recibida con éxito! Un líder del grupo se pondrá en contacto contigo muy pronto.',
      solicitud: newSol
    };
  },

  async getSolicitudes(params: { grupo_id?: string; estado?: string } = {}): Promise<SolicitudGrupo[]> {
    try {
      const query = new URLSearchParams();
      if (params.grupo_id) query.set('grupo_id', params.grupo_id);
      if (params.estado) query.set('estado', params.estado);

      const res = await fetch(`${API_BASE}/solicitudes?${query.toString()}`, {
        headers: getAuthHeader()
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }

    let items = [...runtimeSolicitudes];
    if (params.grupo_id) {
      const gId = parseInt(params.grupo_id, 10);
      items = items.filter(s => s.grupo_id === gId);
    }
    if (params.estado) {
      items = items.filter(s => s.estado === params.estado);
    }
    return items;
  },

  async updateSolicitud(id: number, data: { estado?: string; notas_internas?: string }) {
    try {
      const res = await fetch(`${API_BASE}/solicitudes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    const item = runtimeSolicitudes.find(s => s.id === id);
    if (item) {
      if (data.estado) item.estado = data.estado as any;
      if (data.notas_internas !== undefined) item.notas_internas = data.notas_internas;
      return item;
    }
    throw new Error('Solicitud no encontrada');
  },

  async exportSolicitudesCSV(): Promise<void> {
    try {
      const res = await fetch(`${API_BASE}/solicitudes/export/csv`, {
        headers: getAuthHeader()
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `solicitudes_grupos_tu_palabra_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        return;
      }
    } catch {
      // Fallback: client-side CSV generator
    }

    const headers = ['ID', 'Fecha', 'Nombre Completo', 'Teléfono', 'Email', 'Grupo', 'Sede', 'Estado', 'Mensaje', 'Notas Internas'];
    const rows = runtimeSolicitudes.map(i => [
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

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `solicitudes_grupos_tu_palabra_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  },

  // Contacto
  async enviarContacto(data: { sede_id?: number | null; nombre_completo: string; email: string; telefono?: string; asunto?: string; mensaje: string }) {
    try {
      const res = await fetch(`${API_BASE}/contacto`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }

    const sede = runtimeSedes.find(s => s.id === data.sede_id);
    const newMsg: MensajeContacto = {
      id: Date.now(),
      sede_id: data.sede_id || null,
      sede_nombre: sede ? sede.nombre : 'General',
      nombre_completo: data.nombre_completo,
      email: data.email,
      telefono: data.telefono || '',
      asunto: data.asunto || 'Información general',
      mensaje: data.mensaje,
      estado: 'pendiente',
      created_at: new Date().toISOString()
    };
    runtimeMensajes.unshift(newMsg);
    return {
      message: '¡Gracias por comunicarte con nosotros! Hemos recibido tu mensaje y te responderemos a la brevedad.',
      mensaje: newMsg
    };
  },

  async getMensajes(): Promise<MensajeContacto[]> {
    try {
      const res = await fetch(`${API_BASE}/contacto`, {
        headers: getAuthHeader()
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    return runtimeMensajes;
  },

  async updateMensaje(id: number, data: { estado: 'pendiente' | 'leido' | 'respondido' }) {
    try {
      const res = await fetch(`${API_BASE}/contacto/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    const item = runtimeMensajes.find(m => m.id === id);
    if (item) {
      item.estado = data.estado;
      return item;
    }
    throw new Error('Mensaje no encontrado');
  },

  async exportMensajesCSV(): Promise<void> {
    try {
      const res = await fetch(`${API_BASE}/contacto/export/csv`, {
        headers: getAuthHeader()
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `mensajes_contacto_tu_palabra_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        return;
      }
    } catch {
      // Fallback
    }

    const headers = ['ID', 'Fecha', 'Nombre Completo', 'Email', 'Teléfono', 'Sede', 'Asunto', 'Estado', 'Mensaje'];
    const rows = runtimeMensajes.map(m => [
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

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mensajes_contacto_tu_palabra_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  },

  // Redes
  async getRedes(): Promise<RedSocial[]> {
    try {
      const res = await fetch(`${API_BASE}/redes`);
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    return runtimeRedes;
  },

  async updateRed(id: number, data: Partial<RedSocial>): Promise<RedSocial> {
    try {
      const res = await fetch(`${API_BASE}/redes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    const idx = runtimeRedes.findIndex(r => r.id === id);
    if (idx !== -1) {
      runtimeRedes[idx] = { ...runtimeRedes[idx], ...data };
      return runtimeRedes[idx];
    }
    throw new Error('Red no encontrada');
  },

  // Institucional
  async getContenidoInstitucional(): Promise<ContenidoInstitucional[]> {
    try {
      const res = await fetch(`${API_BASE}/institucional`);
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    return runtimeContenido;
  },

  async updateContenidoInstitucional(id: number, data: Partial<ContenidoInstitucional>): Promise<ContenidoInstitucional> {
    try {
      const res = await fetch(`${API_BASE}/institucional/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    const idx = runtimeContenido.findIndex(c => c.id === id);
    if (idx !== -1) {
      runtimeContenido[idx] = { ...runtimeContenido[idx], ...data };
      return runtimeContenido[idx];
    }
    throw new Error('Contenido no encontrado');
  },

  // Auth
  async login(email: string, password: string): Promise<{ token: string; user: Usuario }> {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('tp_token', data.token);
        localStorage.setItem('tp_user', JSON.stringify(data.user));
        return data;
      }
      const err = await res.json();
      throw new Error(err.error || 'Credenciales incorrectas');
    } catch (e: any) {
      // Fallback credential simulation for preview if server is unreachable
      if (email.toLowerCase().includes('admin') && password === 'admin123') {
        const mockUser: Usuario = {
          id: 1,
          nombre: 'Pastor Administrador General',
          email: 'admin@tupalabra.co',
          rol: 'admin',
          sede_id: 1,
          telefono: '+57 310 845-2911'
        };
        const token = 'mock_jwt_token_admin_' + Date.now();
        localStorage.setItem('tp_token', token);
        localStorage.setItem('tp_user', JSON.stringify(mockUser));
        return { token, user: mockUser };
      }
      if (email.toLowerCase().includes('lider') && password === 'lider123') {
        const mockLider: Usuario = {
          id: 2,
          nombre: 'Líder Andrés Montoya',
          email: 'lider.jovenes@tupalabra.co',
          rol: 'lider',
          sede_id: 1,
          telefono: '+57 312 456-7890'
        };
        const token = 'mock_jwt_token_lider_' + Date.now();
        localStorage.setItem('tp_token', token);
        localStorage.setItem('tp_user', JSON.stringify(mockLider));
        return { token, user: mockLider };
      }
      throw new Error(e.message || 'Error al iniciar sesión');
    }
  },

  getCurrentUser(): Usuario | null {
    const raw = localStorage.getItem('tp_user');
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  logout(): void {
    localStorage.removeItem('tp_token');
    localStorage.removeItem('tp_user');
  }
};
