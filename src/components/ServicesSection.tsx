import React from 'react';
import { Clock, BookOpen, Heart, Sparkles, Car, Shirt, Baby, Shield, Users, ArrowRight } from 'lucide-react';
import { useLocation } from '../context/LocationContext.tsx';

export const ServicesSection: React.FC = () => {
  const { selectedSede } = useLocation();

  const firstTimeGuides = [
    {
      title: 'Duración del servicio',
      desc: 'Aproximadamente 90 minutos con alabanza viva, tiempo de oración y enseñanza bíblica práctica.',
      icon: Clock,
      tag: '~90 min'
    },
    {
      title: 'Ven como eres',
      desc: 'No tenemos código de vestimenta formal. Ven con ropa cómoda, como te sientas mejor.',
      icon: Shirt,
      tag: 'Casual'
    },
    {
      title: 'Espacio para niños',
      desc: 'Tus hijos disfrutarán en BibliAventura con maestros capacitados mientras tú vives el servicio.',
      icon: Baby,
      tag: 'BibliAventura'
    },
    {
      title: 'Parqueadero y acceso',
      desc: 'Zonas de estacionamiento cercanas y equipo de protocolo listo para orientarte en la entrada.',
      icon: Car,
      tag: 'Acceso fácil'
    }
  ];

  return (
    <section id="servicios" className="py-20 lg:py-28 bg-[#FAF8F5] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest text-[#B38728] font-bold">
            Adoración & Enseñanza Semanal
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0B1B3D] mt-2 tracking-tight">
            Nuestros Servicios
          </h2>
          <div className="w-16 h-1 bg-[#D4AF37] mx-auto mt-4 rounded-full" />
          <p className="text-slate-700 mt-4 text-base sm:text-lg font-light leading-relaxed">
            Cada semana nos reunimos como familia para adorar a Dios, orar y escuchar su Palabra. Aprender lo que Dios quiere para nuestra vida es la razón de cada servicio.
          </p>
        </div>

        {/* Highlight Banner with Schedules and 2 Timoteo 3:16-17 */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-amber-900/10 shadow-xl shadow-amber-950/5 max-w-5xl mx-auto mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            
            {/* Service times card */}
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#B38728]">
                Horarios Unificados en Ambas Sedes
              </span>
              <h3 className="font-heading text-2xl sm:text-3xl font-bold text-[#0B1B3D]">
                Te Esperamos Cada Fin de Semana
              </h3>

              <div className="space-y-3 pt-2">
                <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/60 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#0B1B3D] text-[#D4AF37] flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs uppercase font-bold text-slate-400">Servicio de Adoración</span>
                    <span className="text-base font-bold text-[#0B1B3D]">Sábados 5:00 PM</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/60 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#0B1B3D] text-[#D4AF37] flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs uppercase font-bold text-slate-400">Servicio General & BibliAventura</span>
                    <span className="text-base font-bold text-[#0B1B3D]">Domingos 10:00 AM</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Scripture Box */}
            <div className="bg-gradient-to-br from-[#0B1B3D] to-[#142852] text-white p-7 sm:p-8 rounded-3xl shadow-lg space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-[#D4AF37]">
                <BookOpen className="w-4 h-4" />
                <span>2 Timoteo 3:16-17 (NTV)</span>
              </div>

              <blockquote className="font-heading italic text-base sm:text-lg text-slate-100 font-light leading-relaxed">
                «Toda la Escritura es inspirada por Dios y es útil para enseñarnos lo que es verdad y para hacernos ver lo que está mal en nuestra vida. Nos corrige cuando estamos equivocados y nos enseña a hacer lo correcto. Dios la usa para preparar y capacitar a su pueblo para que haga toda buena obra.»
              </blockquote>

              <span className="text-xs text-amber-200/80 block">
                La Biblia viva y práctica en cada prédica dominical.
              </span>
            </div>

          </div>
        </div>

        {/* SECCIÓN: ¿Primera vez? */}
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs uppercase tracking-widest text-[#B38728] font-bold">
              Bienvenida Cálida
            </span>
            <h3 className="font-heading text-2xl sm:text-3xl font-bold text-[#0B1B3D] mt-1">
              ¿Es Tu Primera Vez?
            </h3>
            <p className="text-sm text-slate-600 font-light mt-2 leading-relaxed">
              Ven como estás. Alguien del equipo de bienvenida te recibirá, te acompañará y te ayudará a conocer los espacios para ti y tu familia. No tienes que saber nada de la Biblia para venir: aquí todos estamos aprendiendo.
            </p>
          </div>

          {/* 4 Cards de Guía de Visita */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {firstTimeGuides.map((guide, idx) => {
              const Icon = guide.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-3xl p-6 border border-amber-900/10 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#B38728] flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {guide.tag}
                      </span>
                    </div>

                    <h4 className="font-heading font-bold text-base text-[#0B1B3D] mb-1.5">
                      {guide.title}
                    </h4>

                    <p className="text-xs text-slate-600 font-light leading-relaxed">
                      {guide.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA Banner */}
          <div className="mt-10 text-center">
            <a
              href="#visitanos"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#0B1B3D] hover:bg-[#152e64] text-[#F3E5AB] font-semibold text-xs shadow-md shadow-navy-950/15 transition-all"
            >
              <span>Visítanos este fin de semana</span>
              <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
