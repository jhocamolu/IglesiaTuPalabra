import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  MapPin,
  Clock,
  Calendar,
  UserPlus,
  BookOpen,
  HeartHandshake,
  Sparkles,
  Smile,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { useLocation } from '../context/LocationContext.tsx';
import { api } from '../services/api.ts';
import type { GrupoConexion, Categoria } from '../types/index.ts';
import { JoinGroupModal } from './JoinGroupModal.tsx';

export const GroupsSection: React.FC = () => {
  const { selectedSede } = useLocation();
  const [grupos, setGrupos] = useState<GrupoConexion[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('todas');
  const [selectedDay, setSelectedDay] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedGroupToJoin, setSelectedGroupToJoin] = useState<GrupoConexion | null>(null);

  const daysOfWeek = ['todos', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.getGrupos({
        sede: selectedSede === 'all' ? undefined : (selectedSede === 'ibague' ? '1' : '2'),
        categoria: selectedCategory === 'todas' ? undefined : selectedCategory,
        dia: selectedDay === 'todos' ? undefined : selectedDay,
        q: searchQuery.trim() || undefined
      }),
      api.getCategorias()
    ]).then(([gruposData, categoriasData]) => {
      setGrupos(gruposData);
      setCategorias(categoriasData);
      setLoading(false);
    });
  }, [selectedSede, selectedCategory, selectedDay, searchQuery]);

  return (
    <section id="grupos" className="py-20 lg:py-28 bg-[#FAF8F5] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Prominent Scriptural Banner - Efesios 4:13 (NTV) */}
        <div className="bg-gradient-to-r from-[#0B1B3D] via-[#1a2d54] to-[#4A1525] rounded-3xl p-8 sm:p-12 text-white shadow-xl shadow-navy-950/15 mb-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-semibold backdrop-blur-xs border border-white/10">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Donde la Palabra se Vuelve Vida</span>
            </div>

            <blockquote className="font-heading italic text-lg sm:text-2xl text-amber-100 font-light leading-relaxed">
              «Ese proceso continuará hasta que todos alcancemos tal unidad en nuestra fe y conocimiento del Hijo de Dios que seamos maduros en el Señor, es decir, hasta que lleguemos a la plena y completa medida de Cristo.»
            </blockquote>

            <div className="pt-2">
              <span className="font-cinzel text-xs uppercase tracking-widest text-[#D4AF37] font-bold">
                Efesios 4:13 (NTV)
              </span>
            </div>
          </div>
        </div>

        {/* Section Header con Frase de Enganche Oficial */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest text-[#B38728] font-bold">
            Comunidad en los Hogares
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0B1B3D] mt-2 tracking-tight">
            Grupos de Conexión
          </h2>
          <p className="font-heading italic text-lg sm:text-xl text-[#B38728] font-semibold mt-2">
            «Donde la Palabra se vuelve vida.»
          </p>
          <div className="w-16 h-1 bg-[#D4AF37] mx-auto mt-4 rounded-full" />
          <p className="text-slate-700 mt-4 text-base sm:text-lg font-light leading-relaxed">
            El domingo escuchas; en tu grupo de conexión lo vives. Son reuniones pequeñas donde estudiamos la Biblia, oramos unos por otros y nos acompañamos en lo cotidiano.
          </p>
        </div>

        {/* 4 Elementos que encontrarás en un grupo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto mb-12">
          <div className="bg-white p-5 rounded-2xl border border-amber-900/10 shadow-2xs flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-[#B38728] flex items-center justify-center shrink-0">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-xs text-[#0B1B3D] block">Estudio de la Palabra</span>
              <p className="text-[11px] text-slate-600 font-light mt-0.5">Práctico y aplicable para la vida real.</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-amber-900/10 shadow-2xs flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center shrink-0">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-xs text-[#0B1B3D] block">Oración y apoyo mutuo</span>
              <p className="text-[11px] text-slate-600 font-light mt-0.5">Nos cuidamos y sostenemos juntos.</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-amber-900/10 shadow-2xs flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
              <Smile className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-xs text-[#0B1B3D] block">Amistades verdaderas</span>
              <p className="text-[11px] text-slate-600 font-light mt-0.5">Vínculos profundos y sanos en Cristo.</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-amber-900/10 shadow-2xs flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-xs text-[#0B1B3D] block">Espacio para servir</span>
              <p className="text-[11px] text-slate-600 font-light mt-0.5">Desarrolla y pon en práctica tus dones.</p>
            </div>
          </div>
        </div>

        {/* Search and Filters Bar */}
        <div className="bg-white rounded-3xl p-6 border border-amber-900/10 shadow-md shadow-amber-950/5 mb-10 space-y-5">
          
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-[#B38728]">
              Encuentra el grupo más cercano a ti
            </span>
            <span className="text-xs text-slate-500">
              Filtrado por sede, día y zona
            </span>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por barrio, sector (ej. La Pola, Poblado, Cádiz, Laureles) o nombre de líder..."
              className="w-full pl-11 pr-4 py-3 text-sm rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#B38728]/40 focus:border-[#B38728] transition-all"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-1">
            
            {/* Category Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 shrink-0">
                Categoría:
              </span>
              <button
                onClick={() => setSelectedCategory('todas')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === 'todas'
                    ? 'bg-[#0B1B3D] text-[#F3E5AB]'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                Todas
              </button>
              {categorias.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id.toString())}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat.id.toString()
                      ? 'bg-[#0B1B3D] text-[#F3E5AB]'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {cat.nombre.split('(')[0].trim()}
                </button>
              ))}
            </div>

            {/* Day Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 shrink-0">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 shrink-0">
                Día:
              </span>
              {daysOfWeek.map((day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize transition-all ${
                    selectedDay === day
                      ? 'bg-[#B38728] text-white font-bold'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>

          </div>

        </div>

        {/* Groups Grid */}
        {loading ? (
          <div className="text-center py-16">
            <div className="w-10 h-10 border-3 border-[#B38728] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-500 text-sm">Cargando grupos de conexión...</p>
          </div>
        ) : grupos.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 max-w-lg mx-auto">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="font-heading text-lg font-bold text-slate-700">No se encontraron grupos con estos filtros</h4>
            <p className="text-slate-500 text-xs mt-1">Prueba seleccionando otra sede, día o limpiando la búsqueda.</p>
            <button
              onClick={() => {
                setSelectedCategory('todas');
                setSelectedDay('todos');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-200 transition-colors"
            >
              Restablecer filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {grupos.map((grupo) => (
              <div
                key={grupo.id}
                className="flex flex-col justify-between bg-white rounded-3xl p-7 border border-amber-900/10 shadow-xs hover:shadow-xl hover:shadow-amber-950/5 transition-all duration-300 group hover:-translate-y-1"
              >
                <div>
                  
                  {/* Top badges: Campus & Category */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-amber-50 text-[#B38728] border border-amber-200/60">
                      {grupo.sede_nombre || (grupo.sede_id === 1 ? 'Sede Ibagué' : 'Sede Medellín')}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                      {grupo.categoria_nombre || 'General'}
                    </span>
                  </div>

                  {/* Group Name */}
                  <h3 className="font-heading text-xl font-bold text-[#0B1B3D] group-hover:text-[#4A1525] transition-colors leading-snug">
                    {grupo.nombre}
                  </h3>

                  {/* Leader and schedule specs */}
                  <div className="mt-4 space-y-2 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-[#B38728]" />
                      <span className="font-medium text-slate-800">{grupo.dia_semana} — {grupo.hora_formato}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#B38728]" />
                      <span>{grupo.barrio_zona}</span>
                      <span className="text-slate-400">({grupo.ubicacion_aproximada})</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-[#B38728]" />
                      <span>Líder(es): <strong className="text-slate-800">{grupo.nombre_lider}</strong></span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-slate-600 text-xs sm:text-sm font-light mt-4 leading-relaxed line-clamp-3">
                    {grupo.descripcion}
                  </p>

                </div>

                {/* Bottom CTA Button */}
                <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    Cupos: <span className="font-semibold text-slate-800">{grupo.cupo_maximo} personas</span>
                  </span>

                  <button
                    onClick={() => setSelectedGroupToJoin(grupo)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0B1B3D] hover:bg-[#152e64] text-[#F3E5AB] hover:text-white text-xs font-semibold shadow-sm transition-all group-hover:scale-105"
                  >
                    <UserPlus className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Quiero unirme</span>
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>

      {/* Modal Form to Join Group */}
      {selectedGroupToJoin && (
        <JoinGroupModal
          grupo={selectedGroupToJoin}
          onClose={() => setSelectedGroupToJoin(null)}
          onSuccess={() => {
            api.getGrupos().then(setGrupos);
          }}
        />
      )}
    </section>
  );
};
