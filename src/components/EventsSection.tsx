import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Share2,
  ArrowRight,
  Filter,
  List,
  Sparkles
} from 'lucide-react';
import { useLocation } from '../context/LocationContext.tsx';
import { api } from '../services/api.ts';
import type { Evento, Categoria } from '../types/index.ts';
import { EventDetailModal } from './EventDetailModal.tsx';

export const EventsSection: React.FC = () => {
  const { selectedSede } = useLocation();
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('todas');
  const [selectedEventForModal, setSelectedEventForModal] = useState<Evento | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'calendar'>('grid');

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.getEventos({
        sede: selectedSede === 'all' ? undefined : (selectedSede === 'ibague' ? '1' : '2'),
        categoria: selectedCategory === 'todas' ? undefined : selectedCategory,
        incluir_pasados: false // Automatically hide past events as required!
      }),
      api.getCategorias()
    ]).then(([eventsData, catData]) => {
      setEventos(eventsData);
      setCategorias(catData);
      setLoading(false);
    });
  }, [selectedSede, selectedCategory]);

  const formatDateDay = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('es-CO', { day: '2-digit' });
    } catch {
      return '';
    }
  };

  const formatDateMonth = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('es-CO', { month: 'short' }).toUpperCase();
    } catch {
      return '';
    }
  };

  const formatTime = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString('es-CO', { hour: 'numeric', minute: '2-digit', hour12: true });
    } catch {
      return '';
    }
  };

  const handleShareWhatsApp = (e: React.MouseEvent, ev: Evento) => {
    e.stopPropagation();
    const dateFormatted = new Date(ev.fecha_inicio).toLocaleDateString('es-CO', {
      day: 'numeric',
      month: 'long'
    });
    const text = `¡Hola! Te invito a: *${ev.titulo}* en la Iglesia Tu Palabra.%0A📅 ${dateFormatted} - ${formatTime(ev.fecha_inicio)}%0A📍 ${ev.lugar}%0A%0AMás detalles: ${window.location.origin}`;
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <section id="eventos" className="py-20 lg:py-28 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-widest text-[#B38728] font-bold">
            Calendario Congregacional
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0B1B3D] mt-2 tracking-tight">
            Próximos Eventos
          </h2>
          <div className="w-16 h-1 bg-[#D4AF37] mx-auto mt-4 rounded-full" />
          <p className="text-slate-600 mt-4 text-base sm:text-lg font-light leading-relaxed">
            Congresos, retiros, noches de adoración y talleres para toda la congregación en nuestras sedes de Ibagué y Medellín.
          </p>
        </div>

        {/* Filter and View Mode Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 bg-[#FAF8F5] p-3 rounded-2xl border border-amber-900/10">
          
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            <button
              onClick={() => setSelectedCategory('todas')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === 'todas'
                  ? 'bg-[#0B1B3D] text-[#F3E5AB]'
                  : 'bg-white text-slate-700 hover:bg-amber-100/40 border border-slate-200'
              }`}
            >
              Todos los eventos
            </button>
            {categorias.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id.toString())}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === c.id.toString()
                    ? 'bg-[#0B1B3D] text-[#F3E5AB]'
                    : 'bg-white text-slate-700 hover:bg-amber-100/40 border border-slate-200'
                }`}
              >
                {c.nombre.split('(')[0].trim()}
              </button>
            ))}
          </div>

          {/* Toggle View Mode (Grid / Calendar) */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shrink-0 self-end sm:self-auto">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'grid' ? 'bg-[#0B1B3D] text-[#F3E5AB]' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Tarjetas</span>
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'calendar' ? 'bg-[#0B1B3D] text-[#F3E5AB]' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Cronograma</span>
            </button>
          </div>

        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-16">
            <div className="w-10 h-10 border-3 border-[#B38728] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-500 text-sm">Cargando próximos eventos...</p>
          </div>
        ) : eventos.length === 0 ? (
          <div className="text-center py-16 bg-[#FAF8F5] rounded-3xl border border-slate-200 p-8 max-w-lg mx-auto">
            <CalendarIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="font-heading text-lg font-bold text-slate-700">No hay eventos próximos registrados</h4>
            <p className="text-slate-500 text-xs mt-1">Los eventos anteriores se archivan automáticamente. Vuelve a consultar pronto.</p>
          </div>
        ) : viewMode === 'grid' ? (
          /* Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {eventos.map((ev) => (
              <div
                key={ev.id}
                onClick={() => setSelectedEventForModal(ev)}
                className="group cursor-pointer flex flex-col justify-between bg-[#FAF8F5] rounded-3xl overflow-hidden border border-amber-900/10 shadow-xs hover:shadow-xl hover:shadow-amber-950/5 transition-all duration-300 hover:-translate-y-1"
              >
                <div>
                  
                  {/* Banner Image with Date Badge */}
                  <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-900">
                    <img
                      src={ev.imagen_url || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80'}
                      alt={ev.titulo}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                    {/* Date Badge Overlay */}
                    <div className="absolute top-4 left-4 bg-white/95 rounded-2xl p-2.5 text-center min-w-[50px] shadow-md border border-amber-800/10">
                      <span className="block text-lg font-bold font-heading text-[#0B1B3D] leading-none">
                        {formatDateDay(ev.fecha_inicio)}
                      </span>
                      <span className="block text-[10px] font-bold text-[#B38728] tracking-wider leading-none mt-1">
                        {formatDateMonth(ev.fecha_inicio)}
                      </span>
                    </div>

                    {/* Campus tag */}
                    <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs">
                      <span className="px-2.5 py-1 rounded-md bg-[#0B1B3D]/80 backdrop-blur-xs font-semibold text-[11px]">
                        {ev.sede_nombre || (ev.sede_id === 1 ? 'Sede Ibagué' : ev.sede_id === 2 ? 'Sede Medellín' : 'Ambas sedes')}
                      </span>

                      {ev.destacado ? (
                        <span className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#D4AF37] text-[#0B1B3D] font-bold text-[10px] uppercase">
                          <Sparkles className="w-3 h-3" />
                          <span>Destacado</span>
                        </span>
                      ) : null}
                    </div>

                  </div>

                  {/* Body */}
                  <div className="p-6">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#B38728]">
                      {ev.categoria_nombre || 'General'}
                    </span>
                    
                    <h3 className="font-heading text-xl font-bold text-[#0B1B3D] group-hover:text-[#4A1525] transition-colors mt-1 line-clamp-2">
                      {ev.titulo}
                    </h3>

                    <div className="mt-4 space-y-1.5 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-[#B38728]" />
                        <span>{formatTime(ev.fecha_inicio)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-[#B38728]" />
                        <span className="line-clamp-1">{ev.lugar}</span>
                      </div>
                    </div>

                    <p className="text-slate-600 text-xs sm:text-sm font-light mt-3 line-clamp-2 leading-relaxed">
                      {ev.descripcion}
                    </p>
                  </div>

                </div>

                {/* Footer Buttons */}
                <div className="p-6 pt-0 flex items-center justify-between border-t border-amber-900/10 mt-2">
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-[#0B1B3D] group-hover:text-[#B38728] transition-colors">
                    <span>Ver detalles</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>

                  <button
                    onClick={(e) => handleShareWhatsApp(e, ev)}
                    title="Compartir por WhatsApp"
                    className="p-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white transition-all shadow-2xs"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            ))}
          </div>
        ) : (
          /* Timeline / Calendar List View */
          <div className="space-y-4 max-w-4xl mx-auto">
            {eventos.map((ev) => (
              <div
                key={ev.id}
                onClick={() => setSelectedEventForModal(ev)}
                className="cursor-pointer bg-[#FAF8F5] p-5 sm:p-6 rounded-3xl border border-amber-900/10 hover:shadow-lg hover:border-amber-400 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-start sm:items-center gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-[#0B1B3D] text-white flex flex-col items-center justify-center shrink-0 shadow-md">
                    <span className="text-xl font-bold font-heading text-[#D4AF37] leading-none">
                      {formatDateDay(ev.fecha_inicio)}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-200 mt-1">
                      {formatDateMonth(ev.fecha_inicio)}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] uppercase font-bold text-[#B38728] bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/50">
                        {ev.sede_nombre}
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium">
                        {ev.categoria_nombre}
                      </span>
                    </div>
                    <h3 className="font-heading text-lg font-bold text-[#0B1B3D]">
                      {ev.titulo}
                    </h3>
                    <div className="flex items-center gap-4 text-xs text-slate-600 mt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#B38728]" />
                        {formatTime(ev.fecha_inicio)}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#B38728]" />
                        {ev.lugar}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0">
                  <button
                    onClick={(e) => handleShareWhatsApp(e, ev)}
                    className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white transition-colors"
                    title="Compartir por WhatsApp"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button className="px-4 py-2 rounded-xl bg-[#0B1B3D] text-[#F3E5AB] text-xs font-semibold hover:bg-[#152e64] transition-colors">
                    Detalles
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Detail Modal */}
      {selectedEventForModal && (
        <EventDetailModal
          evento={selectedEventForModal}
          onClose={() => setSelectedEventForModal(null)}
        />
      )}
    </section>
  );
};
