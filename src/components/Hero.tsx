import React, { useState } from 'react';
import { ArrowRight, Calendar, Clock, MapPin, Users, BookOpen, SunMedium, Sparkles } from 'lucide-react';
import { useLocation } from '../context/LocationContext.tsx';

export const Hero: React.FC = () => {
  const { selectedSede } = useLocation();

  // Frases oficiales provistas para el hero
  const heroTaglines = [
    'Una familia que camina a la luz de su Palabra.',
    'Su Palabra, tu camino.',
    'Aquí la Biblia no se queda en la página: se vive.'
  ];

  const [activeTaglineIndex, setActiveTaglineIndex] = useState(0);

  const getSedeNotice = () => {
    if (selectedSede === 'ibague') return 'Sede Ibagué • Carrera 5 # 38-42 (La Pola)';
    if (selectedSede === 'medellin') return 'Sede Medellín • Calle 10 # 43E-31 (El Poblado)';
    return 'Dos Sedes en Colombia • Ibagué & Medellín';
  };

  return (
    <section id="inicio" className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32 bg-gradient-to-b from-[#FAF8F5] via-[#F5EFE4] to-[#FAF8F5]">
      
      {/* Motivo visual de la luz: Degradados cálidos y líneas de luz que guían el camino */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none overflow-hidden">
        {/* Rayo de luz celestial central */}
        <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[650px] h-[650px] bg-gradient-to-b from-amber-200/45 via-amber-100/20 to-transparent rounded-full blur-3xl opacity-80" />
        {/* Destellos suaves */}
        <div className="absolute top-1/4 left-10 w-80 h-80 bg-amber-200/30 rounded-full blur-2xl" />
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-amber-100/40 rounded-full blur-2xl" />
        {/* Línea dorada sutil que simboliza la senda alumbrada */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Campus Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-amber-800/15 text-[#0B1B3D] text-xs font-semibold shadow-xs backdrop-blur-xs">
            <span className="w-2 h-2 rounded-full bg-[#B38728] animate-pulse" />
            <MapPin className="w-3.5 h-3.5 text-[#B38728]" />
            <span>{getSedeNotice()}</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          
          {/* Lema central iluminado del Salmo 119:105 */}
          <div className="inline-flex items-center gap-1.5 text-xs text-[#B38728] font-bold tracking-widest uppercase bg-amber-100/70 border border-amber-300/40 px-3.5 py-1 rounded-full">
            <SunMedium className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Salmo 119:105 • Luz para nuestro camino</span>
          </div>

          {/* Heading Principal */}
          <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#0B1B3D] leading-[1.12]">
            Iglesia Cristiana <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0B1B3D] via-[#4A1525] to-[#B38728] font-cinzel">
              Tu Palabra
            </span>
          </h1>

          {/* Tagline rotativo interactivo con las 3 frases oficiales */}
          <div className="flex flex-col items-center">
            <p className="font-heading italic text-xl sm:text-2xl lg:text-3xl text-slate-800 font-semibold max-w-2xl mx-auto transition-all duration-300">
              «{heroTaglines[activeTaglineIndex]}»
            </p>

            <div className="flex items-center gap-2 mt-2">
              {heroTaglines.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTaglineIndex(idx)}
                  className={`h-1.5 rounded-full transition-all ${
                    activeTaglineIndex === idx ? 'w-6 bg-[#B38728]' : 'w-2 bg-slate-300 hover:bg-slate-400'
                  }`}
                  aria-label={`Ver frase ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Subtítulo Oficial Exacto */}
          <p className="text-base sm:text-lg lg:text-xl text-slate-700 max-w-3xl mx-auto font-light leading-relaxed">
            Somos una familia unida por la gracia de Jesús. Aprendemos de su Palabra, la ponemos en práctica y la compartimos en Ibagué, Medellín y donde Dios nos lleve.
          </p>

          {/* Franja de Horarios Oficiales */}
          <div className="inline-flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 bg-white/95 border border-amber-900/15 rounded-2xl p-4 sm:px-8 sm:py-5 shadow-lg shadow-amber-950/5 backdrop-blur-md max-w-2xl mx-auto my-4">
            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#B38728] flex items-center justify-center border border-amber-200">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-slate-400 font-bold">Servicio Sabatino</span>
                <span className="text-sm sm:text-base font-semibold text-[#0B1B3D]">Sábados 5:00 PM</span>
              </div>
            </div>

            <div className="hidden sm:block w-px h-10 bg-amber-900/10" />

            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-xl bg-[#0B1B3D] text-[#D4AF37] flex items-center justify-center shadow-xs">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-slate-400 font-bold">Servicio Dominical</span>
                <span className="text-sm sm:text-base font-semibold text-[#0B1B3D]">Domingos 10:00 AM</span>
              </div>
            </div>
          </div>

          {/* Botones de Acción Oficiales: Conócenos · Próximos eventos · Encuentra tu grupo */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
            
            {/* Botón 1: Conócenos */}
            <a
              href="#nosotros"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#0B1B3D] hover:bg-[#152e64] text-white font-medium text-sm transition-all shadow-md shadow-navy-950/15 group hover:shadow-lg"
            >
              <BookOpen className="w-4 h-4 text-[#D4AF37]" />
              <span>Conócenos</span>
              <ArrowRight className="w-4 h-4 text-amber-200/80 group-hover:translate-x-0.5 transition-transform" />
            </a>

            {/* Botón 2: Próximos eventos */}
            <a
              href="#eventos"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-amber-50/80 text-slate-800 border border-slate-300/80 font-medium text-sm transition-all shadow-xs hover:border-amber-300"
            >
              <Calendar className="w-4 h-4 text-[#B38728]" />
              <span>Próximos eventos</span>
            </a>

            {/* Botón 3: Encuentra tu grupo */}
            <a
              href="#grupos"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#B38728] hover:bg-[#996f1d] text-white font-medium text-sm transition-all shadow-md shadow-amber-900/15 hover:shadow-lg"
            >
              <Users className="w-4 h-4 text-amber-100" />
              <span>Encuentra tu grupo</span>
            </a>

          </div>

        </div>

        {/* Motivo de Salmo 119:105 en la base */}
        <div className="mt-14 text-center max-w-xl mx-auto">
          <p className="font-heading italic text-sm text-slate-600">
            «Tu palabra es una lámpara que guía mis pies y una luz para mi camino.»
          </p>
          <span className="text-xs uppercase tracking-widest text-[#B38728] font-bold mt-1 inline-block">
            Salmo 119:105 (NTV)
          </span>
        </div>

      </div>
    </section>
  );
};
