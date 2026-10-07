import React from 'react';
import { X, Calendar, Clock, MapPin, Share2, ExternalLink, Users, MessageSquare } from 'lucide-react';
import type { Evento } from '../types/index.ts';

interface EventDetailModalProps {
  evento: Evento | null;
  onClose: () => void;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({ evento, onClose }) => {
  if (!evento) return null;

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('es-CO', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return isoString;
    }
  };

  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString('es-CO', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return '';
    }
  };

  const handleShareWhatsApp = () => {
    const text = `¡Hola! Te invito a este evento en la Iglesia Tu Palabra: *${evento.titulo}*%0A📅 Fecha: ${formatDate(evento.fecha_inicio)} a las ${formatTime(evento.fecha_inicio)}%0A📍 Lugar: ${evento.lugar} (${evento.direccion || ''})%0A%0A¡No faltes! Conoce más en: ${window.location.origin}`;
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-colors"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Event Banner */}
        <div className="relative h-64 sm:h-72 w-full bg-slate-900">
          <img
            src={evento.imagen_url || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80'}
            alt={evento.titulo}
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          
          <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-md bg-[#D4AF37] text-[#0B1B3D] text-[11px] font-bold uppercase tracking-wider">
                {evento.categoria_nombre || 'Evento'}
              </span>
              <span className="px-3 py-1 rounded-md bg-white/20 text-white text-[11px] font-semibold backdrop-blur-xs">
                {evento.sede_nombre || (evento.sede_id === 1 ? 'Sede Ibagué' : evento.sede_id === 2 ? 'Sede Medellín' : 'Ambas Sedes')}
              </span>
            </div>

            <h3 className="font-heading text-2xl sm:text-3xl font-bold leading-tight">
              {evento.titulo}
            </h3>
          </div>
        </div>

        {/* Event Content */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Key metadata grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-amber-50/70 border border-amber-900/10 text-xs text-slate-800">
            <div className="flex items-start gap-3">
              <Calendar className="w-4 h-4 text-[#B38728] shrink-0 mt-0.5" />
              <div>
                <span className="block font-bold text-slate-500 uppercase text-[10px]">Fecha</span>
                <span className="capitalize font-semibold">{formatDate(evento.fecha_inicio)}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 text-[#B38728] shrink-0 mt-0.5" />
              <div>
                <span className="block font-bold text-slate-500 uppercase text-[10px]">Hora</span>
                <span className="font-semibold">{formatTime(evento.fecha_inicio)}</span>
              </div>
            </div>

            <div className="flex items-start gap-3 sm:col-span-2">
              <MapPin className="w-4 h-4 text-[#B38728] shrink-0 mt-0.5" />
              <div>
                <span className="block font-bold text-slate-500 uppercase text-[10px]">Lugar & Dirección</span>
                <span className="font-semibold">{evento.lugar}</span>
                {evento.direccion && <span className="block text-slate-600 font-normal">{evento.direccion}</span>}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="font-heading text-lg font-bold text-[#0B1B3D] mb-2">
              Detalles del evento
            </h4>
            <p className="text-slate-600 text-sm font-light leading-relaxed whitespace-pre-line">
              {evento.descripcion}
            </p>
          </div>

          {evento.cupos_max && (
            <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl">
              <Users className="w-4 h-4 text-slate-500" />
              <span>Cupos limitados: <strong>{evento.cupos_max} personas</strong></span>
            </div>
          )}

          {/* Action buttons */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={handleShareWhatsApp}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-md shadow-emerald-900/10 transition-all"
            >
              <Share2 className="w-4 h-4" />
              <span>Compartir por WhatsApp</span>
            </button>

            {evento.enlace_registro ? (
              <a
                href={evento.enlace_registro}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#0B1B3D] hover:bg-[#152e64] text-[#F3E5AB] text-xs font-semibold shadow-md transition-all"
              >
                <span>Inscribirme ahora</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            ) : (
              <a
                href="#contacto"
                onClick={onClose}
                className="w-full sm:w-auto text-center text-xs font-medium text-slate-500 hover:text-[#0B1B3D] underline"
              >
                ¿Preguntas sobre este evento? Contáctanos
              </a>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
