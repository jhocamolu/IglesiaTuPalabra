import React, { useState } from 'react';
import { MessageCircle, X, MapPin } from 'lucide-react';
import { useLocation } from '../context/LocationContext.tsx';

export const WhatsAppFloating: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { sedes } = useLocation();

  const handleOpenChat = (phone: string, campus: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    const text = encodeURIComponent(`¡Hola Iglesia Tu Palabra (${campus})! Me gustaría recibir información.`);
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
    setOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Popover Selection */}
      {open && (
        <div className="mb-3 w-72 bg-white rounded-3xl shadow-2xl border border-emerald-100 p-5 animate-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                <MessageCircle className="w-4 h-4" />
              </div>
              <span className="font-heading font-bold text-sm text-[#0B1B3D]">
                Chatea con nosotros
              </span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-slate-500 mb-3">
            Elige la sede con la que deseas comunicarte por WhatsApp:
          </p>

          <div className="space-y-2">
            {sedes.map((s) => (
              <button
                key={s.id}
                onClick={() => handleOpenChat(s.whatsapp, s.ciudad)}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100/80 text-emerald-950 text-xs font-semibold transition-all border border-emerald-200/50"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{s.nombre}</span>
                </div>
                <span className="text-[10px] text-emerald-700 bg-white px-2 py-0.5 rounded-full font-bold">
                  {s.ciudad}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Floating Main Button */}
      <button
        onClick={() => setOpen(!open)}
        className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-xl shadow-emerald-950/20 flex items-center justify-center hover:scale-110 active:scale-95 transition-all group"
        aria-label="Abrir chat de WhatsApp"
      >
        <MessageCircle className="w-7 h-7" />
        <span className="sr-only">Contactar por WhatsApp</span>
      </button>
    </div>
  );
};
