import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Calendar,
  Users,
  MessageSquare,
  Share2,
  Building2,
  FileText,
  LogOut,
  Plus,
  Download,
  Trash2,
  Edit2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Home,
  Shield,
  UserCheck,
  Search,
  Check,
  Eye,
  Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../services/api.ts';
import type {
  Evento,
  GrupoConexion,
  SolicitudGrupo,
  MensajeContacto,
  RedSocial,
  Sede,
  ContenidoInstitucional,
  Categoria
} from '../types/index.ts';

export const AdminDashboard: React.FC = () => {
  const { user, isAuthenticated, isAdmin, isLider, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Active Tab
  const [activeTab, setActiveTab] = useState<
    'resumen' | 'eventos' | 'grupos' | 'solicitudes' | 'mensajes' | 'sedes' | 'redes' | 'textos'
  >('resumen');

  // Datasets
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [grupos, setGrupos] = useState<GrupoConexion[]>([]);
  const [solicitudes, setSolicitudes] = useState<SolicitudGrupo[]>([]);
  const [mensajes, setMensajes] = useState<MensajeContacto[]>([]);
  const [sedes, setSedes] = useState<Sede[]>([]);
  const [redes, setRedes] = useState<RedSocial[]>([]);
  const [contenidos, setContenidos] = useState<ContenidoInstitucional[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals & Edit States
  const [editingEvento, setEditingEvento] = useState<Partial<Evento> | null>(null);
  const [editingGrupo, setEditingGrupo] = useState<Partial<GrupoConexion> | null>(null);
  const [editingSede, setEditingSede] = useState<Sede | null>(null);
  const [editingContenido, setEditingContenido] = useState<ContenidoInstitucional | null>(null);
  const [editingRed, setEditingRed] = useState<RedSocial | null>(null);

  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/admin/login');
    }
  }, [authLoading, isAuthenticated, navigate]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [
        evs,
        grs,
        sols,
        msgs,
        seds,
        redsList,
        contList,
        cats
      ] = await Promise.all([
        api.getEventos({ incluir_pasados: true, estado: undefined }),
        api.getGrupos({ estado: undefined }),
        api.getSolicitudes(),
        isAdmin ? api.getMensajes() : Promise.resolve([]),
        api.getSedes(),
        api.getRedes(),
        api.getContenidoInstitucional(),
        api.getCategorias()
      ]);

      setEventos(evs);
      setGrupos(grs);
      setSolicitudes(sols);
      setMensajes(msgs);
      setSedes(seds);
      setRedes(redsList);
      setContenidos(contList);
      setCategorias(cats);
    } catch (err: any) {
      console.error('Error al cargar datos de administración:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadAllData();
    }
  }, [isAuthenticated, isAdmin]);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // --- Handlers: Eventos ---
  const handleSaveEvento = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvento?.titulo || !editingEvento?.fecha_inicio || !editingEvento?.categoria_id || !editingEvento?.lugar) {
      showNotification('Completa los campos obligatorios del evento', 'error');
      return;
    }

    try {
      if (editingEvento.id) {
        await api.updateEvento(editingEvento.id, editingEvento);
        showNotification('Evento actualizado correctamente');
      } else {
        await api.createEvento(editingEvento);
        showNotification('Evento creado exitosamente');
      }
      setEditingEvento(null);
      loadAllData();
    } catch (err: any) {
      showNotification(err.message || 'Error al guardar evento', 'error');
    }
  };

  const handleDeleteEvento = async (id: number) => {
    if (!window.confirm('¿Seguro que deseas eliminar este evento?')) return;
    try {
      await api.deleteEvento(id);
      showNotification('Evento eliminado');
      loadAllData();
    } catch (err: any) {
      showNotification(err.message || 'Error al eliminar', 'error');
    }
  };

  // --- Handlers: Grupos ---
  const handleSaveGrupo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGrupo?.nombre || !editingGrupo?.sede_id || !editingGrupo?.categoria_id || !editingGrupo?.dia_semana) {
      showNotification('Completa los campos obligatorios del grupo', 'error');
      return;
    }

    try {
      if (editingGrupo.id) {
        await api.updateGrupo(editingGrupo.id, editingGrupo);
        showNotification('Grupo de conexión actualizado');
      } else {
        await api.createGrupo(editingGrupo);
        showNotification('Grupo de conexión registrado exitosamente');
      }
      setEditingGrupo(null);
      loadAllData();
    } catch (err: any) {
      showNotification(err.message || 'Error al guardar grupo', 'error');
    }
  };

  const handleDeleteGrupo = async (id: number) => {
    if (!window.confirm('¿Seguro que deseas eliminar este grupo de conexión?')) return;
    try {
      await api.deleteGrupo(id);
      showNotification('Grupo eliminado');
      loadAllData();
    } catch (err: any) {
      showNotification(err.message || 'Error al eliminar', 'error');
    }
  };

  // --- Handlers: Solicitudes ---
  const handleUpdateSolicitudEstado = async (id: number, estado: string) => {
    try {
      await api.updateSolicitud(id, { estado });
      showNotification(`Estado actualizado a ${estado}`);
      loadAllData();
    } catch (err: any) {
      showNotification(err.message || 'Error al actualizar solicitud', 'error');
    }
  };

  // --- Handlers: Mensajes ---
  const handleUpdateMensajeEstado = async (id: number, estado: 'pendiente' | 'leido' | 'respondido') => {
    try {
      await api.updateMensaje(id, { estado });
      showNotification(`Mensaje marcado como ${estado}`);
      loadAllData();
    } catch (err: any) {
      showNotification(err.message || 'Error al actualizar mensaje', 'error');
    }
  };

  // --- Handlers: Sedes ---
  const handleSaveSede = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSede) return;
    try {
      await api.updateSede(editingSede.id, editingSede);
      showNotification('Datos de la sede actualizados');
      setEditingSede(null);
      loadAllData();
    } catch (err: any) {
      showNotification(err.message || 'Error al actualizar sede', 'error');
    }
  };

  // --- Handlers: Contenido ---
  const handleSaveContenido = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingContenido) return;
    try {
      await api.updateContenidoInstitucional(editingContenido.id, editingContenido);
      showNotification('Contenido institucional actualizado');
      setEditingContenido(null);
      loadAllData();
    } catch (err: any) {
      showNotification(err.message || 'Error al actualizar contenido', 'error');
    }
  };

  // --- Handlers: Redes ---
  const handleSaveRed = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRed) return;
    try {
      await api.updateRed(editingRed.id, editingRed);
      showNotification('Red social actualizada');
      setEditingRed(null);
      loadAllData();
    } catch (err: any) {
      showNotification(err.message || 'Error al actualizar red', 'error');
    }
  };

  if (authLoading || (!isAuthenticated && !user)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5]">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-[#B38728] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-500">Cargando panel...</p>
        </div>
      </div>
    );
  }

  // Filter groups for leader if applicable
  const visibleGrupos = isLider
    ? grupos.filter(g => g.lider_id === user?.id || g.nombre_lider.includes(user?.nombre || ''))
    : grupos;

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col">
      
      {/* Top Navbar Header */}
      <header className="bg-[#0B1B3D] text-white sticky top-0 z-40 border-b border-amber-950/20 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-4">
            <Link to="/" className="text-amber-200 hover:text-white flex items-center gap-1.5 text-xs font-semibold">
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Ver sitio web</span>
            </Link>
            <div className="h-4 w-px bg-white/20" />
            <div>
              <span className="font-heading font-bold text-lg text-white">Tu Palabra</span>
              <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] ml-2 font-semibold">
                Panel de Administración
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <span className="block text-xs font-semibold text-white">{user?.nombre}</span>
              <span className="text-[10px] uppercase tracking-wider text-amber-200 font-bold">
                Rol: {user?.rol === 'admin' ? 'Administrador General' : 'Líder de Grupo'}
              </span>
            </div>

            <button
              onClick={() => {
                logout();
                navigate('/admin/login');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors"
            >
              <LogOut className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">Cerrar sesión</span>
            </button>
          </div>

        </div>
      </header>

      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-20 right-6 z-50 p-4 rounded-2xl shadow-xl flex items-center gap-3 text-xs font-semibold animate-in slide-in-from-right duration-200 ${
          notification.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {notification.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Main Layout Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grow w-full">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-4 mb-6 scrollbar-none">
          <button
            onClick={() => setActiveTab('resumen')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'resumen'
                ? 'bg-[#0B1B3D] text-[#F3E5AB] shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Resumen</span>
          </button>

          {isAdmin && (
            <button
              onClick={() => setActiveTab('eventos')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'eventos'
                  ? 'bg-[#0B1B3D] text-[#F3E5AB] shadow-md'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Eventos ({eventos.length})</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('grupos')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'grupos'
                ? 'bg-[#0B1B3D] text-[#F3E5AB] shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Grupos de Conexión ({visibleGrupos.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('solicitudes')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'solicitudes'
                ? 'bg-[#0B1B3D] text-[#F3E5AB] shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Solicitudes a Grupos ({solicitudes.length})</span>
          </button>

          {isAdmin && (
            <>
              <button
                onClick={() => setActiveTab('mensajes')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'mensajes'
                    ? 'bg-[#0B1B3D] text-[#F3E5AB] shadow-md'
                    : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Mensajes Contacto ({mensajes.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('sedes')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'sedes'
                    ? 'bg-[#0B1B3D] text-[#F3E5AB] shadow-md'
                    : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                <Building2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Sedes ({sedes.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('redes')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'redes'
                    ? 'bg-[#0B1B3D] text-[#F3E5AB] shadow-md'
                    : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                <Share2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Redes Sociales</span>
              </button>

              <button
                onClick={() => setActiveTab('textos')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'textos'
                    ? 'bg-[#0B1B3D] text-[#F3E5AB] shadow-md'
                    : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Textos Institucionales</span>
              </button>
            </>
          )}
        </div>

        {/* =========================================================================
            TAB 1: RESUMEN / ESTADÍSTICAS
        ========================================================================= */}
        {activeTab === 'resumen' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-xs uppercase font-bold text-slate-400">Grupos Activos</span>
                  <div className="text-3xl font-bold font-heading text-[#0B1B3D] mt-1">{visibleGrupos.length}</div>
                  <span className="text-[11px] text-emerald-600 font-semibold">Ibagué & Medellín</span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#B38728] flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-xs uppercase font-bold text-slate-400">Solicitudes Nuevas</span>
                  <div className="text-3xl font-bold font-heading text-[#0B1B3D] mt-1">
                    {solicitudes.filter(s => s.estado === 'pendiente').length}
                  </div>
                  <span className="text-[11px] text-amber-600 font-semibold">Por contactar</span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0B1B3D] flex items-center justify-center">
                  <UserCheck className="w-6 h-6" />
                </div>
              </div>

              {isAdmin && (
                <>
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
                    <div>
                      <span className="text-xs uppercase font-bold text-slate-400">Eventos Activos</span>
                      <div className="text-3xl font-bold font-heading text-[#0B1B3D] mt-1">{eventos.length}</div>
                      <span className="text-[11px] text-slate-500 font-semibold">Programados</span>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center">
                      <Calendar className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
                    <div>
                      <span className="text-xs uppercase font-bold text-slate-400">Mensajes de Contacto</span>
                      <div className="text-3xl font-bold font-heading text-[#0B1B3D] mt-1">
                        {mensajes.filter(m => m.estado === 'pendiente').length}
                      </div>
                      <span className="text-[11px] text-rose-600 font-semibold">Pendientes de respuesta</span>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center">
                      <MessageSquare className="w-6 h-6" />
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Quick Actions & Recent Requests */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Recent Requests */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading font-bold text-lg text-[#0B1B3D]">
                    Últimas Solicitudes a Grupos
                  </h3>
                  <button
                    onClick={() => setActiveTab('solicitudes')}
                    className="text-xs font-semibold text-[#B38728] hover:underline"
                  >
                    Ver todas
                  </button>
                </div>

                <div className="space-y-3">
                  {solicitudes.slice(0, 4).map((s) => (
                    <div key={s.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-xs text-slate-800">{s.nombre_completo}</div>
                        <div className="text-[11px] text-slate-500">{s.grupo_nombre} • {s.telefono}</div>
                      </div>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        s.estado === 'pendiente' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {s.estado}
                      </span>
                    </div>
                  ))}
                  {solicitudes.length === 0 && (
                    <p className="text-xs text-slate-400 py-4 text-center">No hay solicitudes registradas aún.</p>
                  )}
                </div>
              </div>

              {/* Status information */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                <h3 className="font-heading font-bold text-lg text-[#0B1B3D]">
                  Información del Sistema
                </h3>
                <div className="space-y-3 text-xs text-slate-600">
                  <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/50">
                    <span className="font-bold text-[#0B1B3D] block mb-1">Horarios Oficiales de Culto:</span>
                    <p>Sábados 5:00 PM (Adoración) y Domingos 10:00 AM (General & Niños)</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="font-bold text-slate-800 block mb-1">Sedes Activas:</span>
                    <p>1. Ibagué (Tolima) — Carrera 5 # 38-42</p>
                    <p>2. Medellín (Antioquia) — Calle 10 # 43E-31</p>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800">
                    <span className="font-bold block mb-1">Protección y Permisos:</span>
                    <p>Acceso verificado con JWT y contraseñas seguras bajo algoritmo bcrypt.</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: EVENTOS (CRUD)
        ========================================================================= */}
        {activeTab === 'eventos' && isAdmin && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-heading text-2xl font-bold text-[#0B1B3D]">Gestión de Eventos</h3>
                <p className="text-xs text-slate-500">Crea, edita y programa eventos para Ibagué y Medellín.</p>
              </div>

              <button
                onClick={() => setEditingEvento({
                  titulo: '',
                  descripcion: '',
                  fecha_inicio: new Date().toISOString().slice(0, 16),
                  sede_id: null,
                  categoria_id: 7,
                  lugar: 'Auditorio Principal',
                  direccion: '',
                  imagen_url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
                  estado: 'publicado',
                  destacado: 0
                })}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0B1B3D] hover:bg-[#152e64] text-[#F3E5AB] text-xs font-semibold shadow-md transition-all self-start sm:self-auto"
              >
                <Plus className="w-4 h-4 text-[#D4AF37]" />
                <span>Crear Nuevo Evento</span>
              </button>
            </div>

            {/* Event List Table */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200">
                    <tr>
                      <th className="py-3.5 px-4 font-bold">Título</th>
                      <th className="py-3.5 px-4 font-bold">Fecha</th>
                      <th className="py-3.5 px-4 font-bold">Sede</th>
                      <th className="py-3.5 px-4 font-bold">Categoría</th>
                      <th className="py-3.5 px-4 font-bold">Estado</th>
                      <th className="py-3.5 px-4 font-bold text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {eventos.map((ev) => (
                      <tr key={ev.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-slate-800">
                          {ev.titulo}
                          {ev.destacado ? <span className="ml-2 text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-sm">Destacado</span> : null}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">
                          {new Date(ev.fecha_inicio).toLocaleDateString('es-CO')}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">
                          {ev.sede_nombre || 'Ambas sedes'}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">
                          {ev.categoria_nombre || 'General'}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            ev.estado === 'publicado' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {ev.estado}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right space-x-2">
                          <button
                            onClick={() => setEditingEvento(ev)}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-[#0B1B3D] hover:bg-slate-100"
                            title="Editar"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteEvento(ev.id)}
                            className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50"
                            title="Eliminar"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Modal Event Form */}
        {editingEvento && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-heading font-bold text-xl text-[#0B1B3D]">
                  {editingEvento.id ? 'Editar Evento' : 'Crear Nuevo Evento'}
                </h3>
                <button onClick={() => setEditingEvento(null)} className="text-slate-400 hover:text-slate-600">
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEvento} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Título del Evento *</label>
                  <input
                    type="text"
                    required
                    value={editingEvento.titulo || ''}
                    onChange={(e) => setEditingEvento({ ...editingEvento, titulo: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Fecha y Hora de Inicio *</label>
                    <input
                      type="datetime-local"
                      required
                      value={editingEvento.fecha_inicio ? editingEvento.fecha_inicio.slice(0, 16) : ''}
                      onChange={(e) => setEditingEvento({ ...editingEvento, fecha_inicio: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Fecha de Fin (Opcional)</label>
                    <input
                      type="datetime-local"
                      value={editingEvento.fecha_fin ? editingEvento.fecha_fin.slice(0, 16) : ''}
                      onChange={(e) => setEditingEvento({ ...editingEvento, fecha_fin: e.target.value || null })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Sede</label>
                    <select
                      value={editingEvento.sede_id || ''}
                      onChange={(e) => setEditingEvento({ ...editingEvento, sede_id: e.target.value ? parseInt(e.target.value, 10) : null })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
                    >
                      <option value="">Ambas sedes (General / Online)</option>
                      <option value="1">Sede Ibagué</option>
                      <option value="2">Sede Medellín</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Categoría / Ministerio *</label>
                    <select
                      required
                      value={editingEvento.categoria_id || 7}
                      onChange={(e) => setEditingEvento({ ...editingEvento, categoria_id: parseInt(e.target.value, 10) })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
                    >
                      {categorias.map((c) => (
                        <option key={c.id} value={c.id}>{c.nombre}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Lugar del Evento *</label>
                    <input
                      type="text"
                      required
                      value={editingEvento.lugar || ''}
                      onChange={(e) => setEditingEvento({ ...editingEvento, lugar: e.target.value })}
                      placeholder="Ej. Auditorio Principal Tu Palabra"
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Dirección Exacta</label>
                    <input
                      type="text"
                      value={editingEvento.direccion || ''}
                      onChange={(e) => setEditingEvento({ ...editingEvento, direccion: e.target.value })}
                      placeholder="Carrera 5 # 38-42"
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">URL de la Imagen del Evento</label>
                  <input
                    type="url"
                    value={editingEvento.imagen_url || ''}
                    onChange={(e) => setEditingEvento({ ...editingEvento, imagen_url: e.target.value })}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Descripción</label>
                  <textarea
                    rows={3}
                    value={editingEvento.descripcion || ''}
                    onChange={(e) => setEditingEvento({ ...editingEvento, descripcion: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Estado</label>
                    <select
                      value={editingEvento.estado || 'publicado'}
                      onChange={(e) => setEditingEvento({ ...editingEvento, estado: e.target.value as any })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
                    >
                      <option value="publicado">Publicado</option>
                      <option value="borrador">Borrador</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Destacado</label>
                    <select
                      value={editingEvento.destacado ? '1' : '0'}
                      onChange={(e) => setEditingEvento({ ...editingEvento, destacado: e.target.value === '1' ? 1 : 0 })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
                    >
                      <option value="0">Normal</option>
                      <option value="1">Destacado (Badge dorado)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Cupo Máximo</label>
                    <input
                      type="number"
                      value={editingEvento.cupos_max || ''}
                      onChange={(e) => setEditingEvento({ ...editingEvento, cupos_max: e.target.value ? parseInt(e.target.value, 10) : null })}
                      placeholder="Ilimitado"
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setEditingEvento(null)}
                    className="px-4 py-2 text-xs rounded-xl border border-slate-200 text-slate-600"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs rounded-xl bg-[#0B1B3D] text-[#F3E5AB] font-semibold hover:bg-[#152e64]"
                  >
                    Guardar Evento
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: GRUPOS DE CONEXIÓN (CRUD)
        ========================================================================= */}
        {activeTab === 'grupos' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-heading text-2xl font-bold text-[#0B1B3D]">Grupos de Conexión</h3>
                <p className="text-xs text-slate-500">
                  {isAdmin
                    ? 'Gestiona todos los grupos de Ibagué y Medellín.'
                    : 'Como líder, gestionas la información de tu propio grupo de conexión.'}
                </p>
              </div>

              {isAdmin && (
                <button
                  onClick={() => setEditingGrupo({
                    nombre: '',
                    categoria_id: 3,
                    sede_id: 1,
                    nombre_lider: '',
                    contacto_lider: '',
                    dia_semana: 'Miércoles',
                    hora: '19:00:00',
                    hora_formato: '7:00 PM',
                    barrio_zona: '',
                    ubicacion_aproximada: '',
                    descripcion: '',
                    cupo_maximo: 15,
                    estado: 'activo'
                  })}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0B1B3D] hover:bg-[#152e64] text-[#F3E5AB] text-xs font-semibold shadow-md transition-all self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4 text-[#D4AF37]" />
                  <span>Crear Nuevo Grupo</span>
                </button>
              )}
            </div>

            {/* Groups Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleGrupos.map((g) => (
                <div key={g.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-amber-50 text-[#B38728] border border-amber-200/50">
                        {g.sede_nombre}
                      </span>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        g.estado === 'activo' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {g.estado}
                      </span>
                    </div>

                    <h4 className="font-heading font-bold text-lg text-[#0B1B3D]">{g.nombre}</h4>
                    <span className="text-xs font-medium text-slate-500">{g.categoria_nombre}</span>

                    <div className="mt-3 space-y-1 text-xs text-slate-600">
                      <div><strong>Día:</strong> {g.dia_semana} - {g.hora_formato}</div>
                      <div><strong>Zona:</strong> {g.barrio_zona} ({g.ubicacion_aproximada})</div>
                      <div><strong>Líder:</strong> {g.nombre_lider}</div>
                      <div><strong>Contacto:</strong> {g.contacto_lider}</div>
                      <div><strong>Cupo:</strong> {g.cupo_maximo} personas</div>
                    </div>

                    <p className="text-slate-500 text-xs mt-3 line-clamp-2">{g.descripcion}</p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 font-semibold">
                      Solicitudes: {g.solicitudes_count || 0}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingGrupo(g)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-[#0B1B3D] hover:bg-slate-100"
                        title="Editar grupo"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      {isAdmin && (
                        <button
                          onClick={() => handleDeleteGrupo(g.id)}
                          className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50"
                          title="Eliminar grupo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal Grupo Form */}
        {editingGrupo && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-heading font-bold text-xl text-[#0B1B3D]">
                  {editingGrupo.id ? 'Editar Grupo de Conexión' : 'Registrar Nuevo Grupo'}
                </h3>
                <button onClick={() => setEditingGrupo(null)} className="text-slate-400 hover:text-slate-600">
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveGrupo} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre del Grupo *</label>
                  <input
                    type="text"
                    required
                    value={editingGrupo.nombre || ''}
                    onChange={(e) => setEditingGrupo({ ...editingGrupo, nombre: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Sede *</label>
                    <select
                      required
                      value={editingGrupo.sede_id || 1}
                      onChange={(e) => setEditingGrupo({ ...editingGrupo, sede_id: parseInt(e.target.value, 10) })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
                    >
                      <option value="1">Sede Ibagué</option>
                      <option value="2">Sede Medellín</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Categoría / Rango *</label>
                    <select
                      required
                      value={editingGrupo.categoria_id || 3}
                      onChange={(e) => setEditingGrupo({ ...editingGrupo, categoria_id: parseInt(e.target.value, 10) })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
                    >
                      {categorias.map((c) => (
                        <option key={c.id} value={c.id}>{c.nombre}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre del Líder *</label>
                    <input
                      type="text"
                      required
                      value={editingGrupo.nombre_lider || ''}
                      onChange={(e) => setEditingGrupo({ ...editingGrupo, nombre_lider: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Contacto del Líder (Celular / WhatsApp)</label>
                    <input
                      type="text"
                      value={editingGrupo.contacto_lider || ''}
                      onChange={(e) => setEditingGrupo({ ...editingGrupo, contacto_lider: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Día de la Semana *</label>
                    <select
                      required
                      value={editingGrupo.dia_semana || 'Miércoles'}
                      onChange={(e) => setEditingGrupo({ ...editingGrupo, dia_semana: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
                    >
                      {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Hora (Formato legible)</label>
                    <input
                      type="text"
                      value={editingGrupo.hora_formato || '7:00 PM'}
                      onChange={(e) => setEditingGrupo({ ...editingGrupo, hora_formato: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Barrio / Sector *</label>
                    <input
                      type="text"
                      required
                      value={editingGrupo.barrio_zona || ''}
                      onChange={(e) => setEditingGrupo({ ...editingGrupo, barrio_zona: e.target.value })}
                      placeholder="Ej. La Pola, Poblado, Cádiz"
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Ubicación Aproximada</label>
                    <input
                      type="text"
                      value={editingGrupo.ubicacion_aproximada || ''}
                      onChange={(e) => setEditingGrupo({ ...editingGrupo, ubicacion_aproximada: e.target.value })}
                      placeholder="Cerca al Parque Centenario"
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Descripción del Grupo</label>
                  <textarea
                    rows={3}
                    value={editingGrupo.descripcion || ''}
                    onChange={(e) => setEditingGrupo({ ...editingGrupo, descripcion: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Cupo Máximo</label>
                    <input
                      type="number"
                      value={editingGrupo.cupo_maximo || 15}
                      onChange={(e) => setEditingGrupo({ ...editingGrupo, cupo_maximo: parseInt(e.target.value, 10) || 15 })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Estado</label>
                    <select
                      value={editingGrupo.estado || 'activo'}
                      onChange={(e) => setEditingGrupo({ ...editingGrupo, estado: e.target.value as any })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
                    >
                      <option value="activo">Activo</option>
                      <option value="inactivo">Inactivo</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setEditingGrupo(null)}
                    className="px-4 py-2 text-xs rounded-xl border border-slate-200 text-slate-600"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs rounded-xl bg-[#0B1B3D] text-[#F3E5AB] font-semibold hover:bg-[#152e64]"
                  >
                    Guardar Grupo
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 4: SOLICITUDES A GRUPOS (CON EXPORTAR A CSV)
        ========================================================================= */}
        {activeTab === 'solicitudes' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-heading text-2xl font-bold text-[#0B1B3D]">Solicitudes de Integración</h3>
                <p className="text-xs text-slate-500">Personas que han solicitado unirse a un grupo de conexión.</p>
              </div>

              <button
                onClick={() => api.exportSolicitudesCSV()}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-md transition-all self-start sm:self-auto"
              >
                <Download className="w-4 h-4" />
                <span>Exportar Solicitudes a CSV</span>
              </button>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200">
                    <tr>
                      <th className="py-3.5 px-4 font-bold">Solicitante</th>
                      <th className="py-3.5 px-4 font-bold">Contacto</th>
                      <th className="py-3.5 px-4 font-bold">Grupo Deseado</th>
                      <th className="py-3.5 px-4 font-bold">Mensaje</th>
                      <th className="py-3.5 px-4 font-bold">Estado</th>
                      <th className="py-3.5 px-4 font-bold text-right">Cambiar Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {solicitudes.map((sol) => (
                      <tr key={sol.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-slate-800">
                          {sol.nombre_completo}
                          <span className="block text-[10px] text-slate-400 font-normal">
                            {new Date(sol.created_at || '').toLocaleDateString('es-CO')}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">
                          <div>{sol.telefono}</div>
                          <div className="text-[11px] text-slate-400">{sol.email}</div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-700">
                          <strong>{sol.grupo_nombre}</strong>
                          <span className="block text-[10px] text-slate-400">{sol.sede_nombre}</span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-500 max-w-xs truncate" title={sol.mensaje}>
                          {sol.mensaje || 'Sin mensaje adicional'}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            sol.estado === 'pendiente'
                              ? 'bg-amber-100 text-amber-800'
                              : sol.estado === 'contactado'
                              ? 'bg-blue-100 text-blue-800'
                              : sol.estado === 'integrado'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {sol.estado}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <select
                            value={sol.estado}
                            onChange={(e) => handleUpdateSolicitudEstado(sol.id, e.target.value)}
                            className="px-2 py-1 text-[11px] rounded-lg border border-slate-200 bg-white"
                          >
                            <option value="pendiente">Pendiente</option>
                            <option value="contactado">Contactado</option>
                            <option value="integrado">Integrado</option>
                            <option value="cancelado">Cancelado</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                    {solicitudes.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-400">
                          No hay solicitudes registradas aún.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 5: MENSAJES DE CONTACTO (CON EXPORTAR A CSV)
        ========================================================================= */}
        {activeTab === 'mensajes' && isAdmin && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-heading text-2xl font-bold text-[#0B1B3D]">Bandeja de Contacto</h3>
                <p className="text-xs text-slate-500">Mensajes y peticiones de oración recibidos a través de la web.</p>
              </div>

              <button
                onClick={() => api.exportMensajesCSV()}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-md transition-all self-start sm:self-auto"
              >
                <Download className="w-4 h-4" />
                <span>Exportar Mensajes a CSV</span>
              </button>
            </div>

            <div className="space-y-4">
              {mensajes.map((m) => (
                <div key={m.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="font-heading font-bold text-base text-[#0B1B3D]">{m.asunto}</h4>
                      <div className="text-xs text-slate-500">
                        De: <strong className="text-slate-800">{m.nombre_completo}</strong> ({m.email} {m.telefono ? `• ${m.telefono}` : ''})
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-slate-400">
                        {new Date(m.created_at || '').toLocaleString('es-CO')}
                      </span>

                      <select
                        value={m.estado}
                        onChange={(e) => handleUpdateMensajeEstado(m.id, e.target.value as any)}
                        className="px-2.5 py-1 text-xs rounded-xl border border-slate-200 bg-white font-semibold"
                      >
                        <option value="pendiente">Pendiente</option>
                        <option value="leido">Leído</option>
                        <option value="respondido">Respondido</option>
                      </select>
                    </div>
                  </div>

                  <p className="text-slate-700 text-xs sm:text-sm font-light leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100 whitespace-pre-line">
                    {m.mensaje}
                  </p>
                </div>
              ))}

              {mensajes.length === 0 && (
                <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 text-slate-400 text-xs">
                  No hay mensajes de contacto registrados todavía.
                </div>
              )}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 6: SEDES (GESTIÓN DE DIRECCIONES Y HORARIOS)
        ========================================================================= */}
        {activeTab === 'sedes' && isAdmin && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h3 className="font-heading text-2xl font-bold text-[#0B1B3D]">Gestión de Sedes</h3>
              <p className="text-xs text-slate-500">Edita horarios, direcciones, teléfonos y enlaces de Google Maps.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {sedes.map((s) => (
                <div key={s.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h4 className="font-heading font-bold text-xl text-[#0B1B3D]">{s.nombre}</h4>
                    <button
                      onClick={() => setEditingSede(s)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-[#0B1B3D] hover:text-[#F3E5AB] text-slate-700 text-xs font-semibold transition-all"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Editar</span>
                    </button>
                  </div>

                  <div className="space-y-2 text-xs text-slate-600">
                    <div><strong>Dirección:</strong> {s.direccion} ({s.barrio})</div>
                    <div><strong>Teléfono:</strong> {s.telefono}</div>
                    <div><strong>WhatsApp:</strong> {s.whatsapp}</div>
                    <div><strong>Email:</strong> {s.email}</div>
                    <div><strong>Sábado:</strong> {s.horario_sabado}</div>
                    <div><strong>Domingo:</strong> {s.horario_domingo}</div>
                    <div className="truncate"><strong>Google Maps Link:</strong> {s.mapa_link_url}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal Sede Form */}
        {editingSede && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-heading font-bold text-xl text-[#0B1B3D]">Editar {editingSede.nombre}</h3>
                <button onClick={() => setEditingSede(null)} className="text-slate-400 hover:text-slate-600">
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveSede} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Dirección</label>
                  <input
                    type="text"
                    value={editingSede.direccion}
                    onChange={(e) => setEditingSede({ ...editingSede, direccion: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Barrio / Sector</label>
                  <input
                    type="text"
                    value={editingSede.barrio}
                    onChange={(e) => setEditingSede({ ...editingSede, barrio: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Teléfono</label>
                    <input
                      type="text"
                      value={editingSede.telefono}
                      onChange={(e) => setEditingSede({ ...editingSede, telefono: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">WhatsApp</label>
                    <input
                      type="text"
                      value={editingSede.whatsapp}
                      onChange={(e) => setEditingSede({ ...editingSede, whatsapp: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Horario Sábado</label>
                    <input
                      type="text"
                      value={editingSede.horario_sabado}
                      onChange={(e) => setEditingSede({ ...editingSede, horario_sabado: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Horario Domingo</label>
                    <input
                      type="text"
                      value={editingSede.horario_domingo}
                      onChange={(e) => setEditingSede({ ...editingSede, horario_domingo: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Enlace de Google Maps</label>
                  <input
                    type="text"
                    value={editingSede.mapa_link_url}
                    onChange={(e) => setEditingSede({ ...editingSede, mapa_link_url: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3">
                  <button type="button" onClick={() => setEditingSede(null)} className="px-4 py-2 text-xs rounded-xl border">
                    Cancelar
                  </button>
                  <button type="submit" className="px-5 py-2 text-xs rounded-xl bg-[#0B1B3D] text-[#F3E5AB] font-semibold">
                    Guardar Sede
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 7: REDES SOCIALES
        ========================================================================= */}
        {activeTab === 'redes' && isAdmin && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h3 className="font-heading text-2xl font-bold text-[#0B1B3D]">Redes Sociales Oficiales</h3>
              <p className="text-xs text-slate-500">Configura enlaces de Instagram, Facebook, YouTube, TikTok y WhatsApp.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {redes.map((r) => (
                <div key={r.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-bold text-base text-[#0B1B3D]">{r.nombre_mostrar}</span>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      r.activa ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {r.activa ? 'Visible' : 'Oculta'}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 space-y-1">
                    <div><strong>Usuario:</strong> {r.usuario}</div>
                    <div className="truncate"><strong>URL:</strong> {r.url}</div>
                  </div>

                  <button
                    onClick={() => setEditingRed(r)}
                    className="w-full mt-2 py-2 text-xs rounded-xl bg-slate-50 hover:bg-[#0B1B3D] hover:text-[#F3E5AB] text-slate-700 font-semibold border border-slate-200 transition-colors"
                  >
                    Editar Enlace
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal Red Social */}
        {editingRed && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-heading font-bold text-lg text-[#0B1B3D]">Editar {editingRed.nombre_mostrar}</h3>
                <button onClick={() => setEditingRed(null)} className="text-slate-400 hover:text-slate-600">
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveRed} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre para mostrar</label>
                  <input
                    type="text"
                    value={editingRed.nombre_mostrar}
                    onChange={(e) => setEditingRed({ ...editingRed, nombre_mostrar: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Usuario / Handle</label>
                  <input
                    type="text"
                    value={editingRed.usuario}
                    onChange={(e) => setEditingRed({ ...editingRed, usuario: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">URL Enlace</label>
                  <input
                    type="url"
                    value={editingRed.url}
                    onChange={(e) => setEditingRed({ ...editingRed, url: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Visibilidad</label>
                  <select
                    value={editingRed.activa ? '1' : '0'}
                    onChange={(e) => setEditingRed({ ...editingRed, activa: e.target.value === '1' ? 1 : 0 })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                  >
                    <option value="1">Activa (Visible en la web)</option>
                    <option value="0">Oculta</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3">
                  <button type="button" onClick={() => setEditingRed(null)} className="px-4 py-2 text-xs rounded-xl border">
                    Cancelar
                  </button>
                  <button type="submit" className="px-5 py-2 text-xs rounded-xl bg-[#0B1B3D] text-[#F3E5AB] font-semibold">
                    Guardar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 8: TEXTOS INSTITUCIONALES (MISIÓN, VISIÓN, ENFOQUE)
        ========================================================================= */}
        {activeTab === 'textos' && isAdmin && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h3 className="font-heading text-2xl font-bold text-[#0B1B3D]">Textos Institucionales</h3>
              <p className="text-xs text-slate-500">
                Edita los textos de "¿Qué es?", "¿Qué hacemos?", Misión, Visión y Enfoque directamente sin tocar el código fuente.
              </p>
            </div>

            <div className="space-y-4">
              {contenidos.map((c) => (
                <div key={c.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#B38728]">{c.seccion} / {c.clave}</span>
                      <h4 className="font-heading font-bold text-lg text-[#0B1B3D]">{c.titulo}</h4>
                    </div>
                    <button
                      onClick={() => setEditingContenido(c)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-[#0B1B3D] hover:text-[#F3E5AB] text-slate-700 text-xs font-semibold transition-all"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Editar Texto</span>
                    </button>
                  </div>

                  {c.subtitulo && (
                    <p className="text-xs text-slate-500 font-medium italic">{c.subtitulo}</p>
                  )}

                  <p className="text-slate-700 text-xs sm:text-sm font-light leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    {c.contenido}
                  </p>

                  {c.versiculo_texto && (
                    <div className="text-xs text-[#B38728] font-heading italic">
                      «{c.versiculo_texto}» — <strong>{c.versiculo_referencia}</strong>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal Contenido Form */}
        {editingContenido && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-heading font-bold text-xl text-[#0B1B3D]">Editar {editingContenido.titulo}</h3>
                <button onClick={() => setEditingContenido(null)} className="text-slate-400 hover:text-slate-600">
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveContenido} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Título</label>
                  <input
                    type="text"
                    value={editingContenido.titulo}
                    onChange={(e) => setEditingContenido({ ...editingContenido, titulo: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Subtítulo</label>
                  <input
                    type="text"
                    value={editingContenido.subtitulo || ''}
                    onChange={(e) => setEditingContenido({ ...editingContenido, subtitulo: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Contenido Oficial</label>
                  <textarea
                    rows={5}
                    value={editingContenido.contenido}
                    onChange={(e) => setEditingContenido({ ...editingContenido, contenido: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Versículo Referencia</label>
                    <input
                      type="text"
                      value={editingContenido.versiculo_referencia || ''}
                      onChange={(e) => setEditingContenido({ ...editingContenido, versiculo_referencia: e.target.value })}
                      placeholder="Salmo 119:105"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Texto del Versículo</label>
                    <input
                      type="text"
                      value={editingContenido.versiculo_texto || ''}
                      onChange={(e) => setEditingContenido({ ...editingContenido, versiculo_texto: e.target.value })}
                      placeholder="Lámpara es a mis pies..."
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3">
                  <button type="button" onClick={() => setEditingContenido(null)} className="px-4 py-2 text-xs rounded-xl border">
                    Cancelar
                  </button>
                  <button type="submit" className="px-5 py-2 text-xs rounded-xl bg-[#0B1B3D] text-[#F3E5AB] font-semibold">
                    Guardar Cambios
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
