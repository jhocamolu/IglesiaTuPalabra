import React from 'react';
import { Baby, Flame, Sparkles, Heart, Shield, Flower2, BookOpen, Clock, Calendar, ArrowRight } from 'lucide-react';

interface MinistryOfficial {
  id: string;
  name: string;
  hook: string;
  description: string;
  verseRef: string;
  verseText: string;
  edades: string;
  horario: string;
  icon: React.ElementType;
  color: string;
}

export const MinistriesSection: React.FC = () => {
  const ministries: MinistryOfficial[] = [
    {
      id: 'bibli-aventura',
      name: 'BibliAventura (Niños)',
      hook: 'La aventura más grande empieza con una historia.',
      description:
        'Sembramos las verdades bíblicas de manera creativa y divertida en el corazón de los niños. Con juegos, historias y manualidades, la Palabra se vuelve algo que los niños entienden, recuerdan y aman. Confiamos en que esta semilla produzca fruto y forme adultos espiritual y emocionalmente sanos para la sociedad.',
      verseRef: 'Proverbios 22:6 (NTV)',
      verseText: 'Dirige a tus hijos por el camino correcto, y cuando sean mayores, no lo abandonarán.',
      edades: '0 a 12 años',
      horario: 'Domingos 10:00 AM (durante el servicio dominical)',
      icon: Baby,
      color: '#0284C7'
    },
    {
      id: 'alpha',
      name: 'ALPHA (Jóvenes 13-17)',
      hook: 'Descubre quién eres y para qué te hizo Dios.',
      description:
        'Acompañamos, apoyamos y descubrimos juntos los talentos que Dios dio a cada joven, aprendiendo a relacionarnos con Él de la manera correcta. Equipamos a los jóvenes con la Palabra y con herramientas estratégicas para que cumplan el propósito del Señor y hagan discípulos de Jesucristo dondequiera que Dios los lleve.',
      verseRef: '1 Timoteo 4:12 (NTV)',
      verseText: 'No permitas que nadie te subestime por ser joven. Sé un ejemplo para todos los creyentes en lo que dices, en la forma en que vives, en tu amor, tu fe y tu pureza.',
      edades: '13 a 17 años',
      horario: 'Sábados 3:30 PM & Viernes 6:30 PM',
      icon: Flame,
      color: '#7C3AED'
    },
    {
      id: 'jovenes-solteros',
      name: 'Jóvenes Solteros (18-35)',
      hook: 'Una etapa para construir con propósito.',
      description:
        'Estudios, trabajo, decisiones, amistades, el futuro: es una etapa llena de preguntas. Aquí las abordamos a la luz de la Palabra, en comunidad y con acompañamiento.',
      verseRef: 'Salmo 119:9 (NTV)',
      verseText: '¿Cómo puede un joven mantenerse puro? Obedeciendo tu palabra.',
      edades: '18 a 35 años (Universitarios & Profesionales)',
      horario: 'Miércoles 7:00 PM y 7:30 PM',
      icon: Sparkles,
      color: '#0D9488'
    },
    {
      id: 'parejas',
      name: 'Parejas y Matrimonios',
      hook: 'Un matrimonio construido sobre el diseño de Dios.',
      description:
        'Dios mismo presentó la primera pareja, y desde entonces «el hombre deja a su padre y a su madre para unirse a su esposa, y los dos llegan a ser como una sola persona» (Génesis 2:24 NTV). Un espacio para fortalecer la comunicación, el compromiso y la unidad del hogar.',
      verseRef: 'Génesis 2:24 (NTV)',
      verseText: 'Por eso el hombre deja a su padre y a su madre para unirse a su esposa, y los dos llegan a ser como una sola persona.',
      edades: 'Novios Comprometidos & Matrimonios',
      horario: 'Jueves y Viernes 7:30 PM (Grupos y Talleres)',
      icon: Heart,
      color: '#E11D48'
    },
    {
      id: 'hombres',
      name: 'Ministerio de Hombres',
      hook: 'Hombres de oración, carácter y propósito.',
      description:
        '«Deseo que en cada lugar de adoración los hombres oren con manos santas, levantadas a Dios, y libres de enojo y controversia» (1 Timoteo 2:8 NTV). Un lugar para crecer como esposos, padres e hijos de Dios, sin máscaras.',
      verseRef: '1 Timoteo 2:8 (NTV)',
      verseText: 'Deseo que en cada lugar de adoración los hombres oren con manos santas, levantadas a Dios, y libres de enojo y controversia.',
      edades: 'Varones de todas las edades',
      horario: 'Sábados quincenales 7:00 AM (Desayuno & Estudio)',
      icon: Shield,
      color: '#1E3A8A'
    },
    {
      id: 'mujeres',
      name: 'Ministerio de Mujeres',
      hook: 'Mujeres virtuosas, valiosas y firmes en Dios.',
      description:
        '«Mujer virtuosa, ¿quién la hallará? Porque su estima sobrepasa largamente a la de las piedras preciosas» (Proverbios 31:10). El corazón de su familia confía en ella. Un espacio para animarnos, crecer en la Palabra y descubrir el valor y propósito que Dios nos dio.',
      verseRef: 'Proverbios 31:10 (NTV)',
      verseText: 'Mujer virtuosa, ¿quién la hallará? Porque su estima sobrepasa largamente a la de las piedras preciosas.',
      edades: 'Mujeres de todas las edades',
      horario: 'Martes y Jueves 6:30 PM',
      icon: Flower2,
      color: '#9333EA'
    }
  ];

  return (
    <section id="ministerios" className="py-20 lg:py-28 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest text-[#B38728] font-bold">
            Espacios para Cada Etapa de la Vida
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0B1B3D] mt-2 tracking-tight">
            Nuestros Ministerios
          </h2>
          <div className="w-16 h-1 bg-[#D4AF37] mx-auto mt-4 rounded-full" />
          <p className="text-slate-700 mt-4 text-base sm:text-lg font-light leading-relaxed">
            Cada ministerio sigue una misma convicción: la Palabra de Dios enseña, restaura y edifica a cada persona en su temporada de vida.
          </p>
        </div>

        {/* Ministries Grid con Estructura Homogénea:
            Frase de enganche → Descripción → Versículo → Horario */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ministries.map((min) => {
            const Icon = min.icon;
            return (
              <div
                key={min.id}
                className="group flex flex-col justify-between bg-[#FAF8F5] rounded-3xl p-7 sm:p-8 border border-amber-900/10 shadow-xs hover:shadow-xl hover:shadow-amber-950/5 transition-all duration-300 hover:-translate-y-1"
              >
                <div>
                  
                  {/* Top Bar with Icon & Name */}
                  <div className="flex items-center gap-3.5 mb-4">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md shrink-0"
                      style={{ backgroundColor: min.color }}
                    >
                      <Icon className="w-6 h-6" />
                    </div>

                    <div>
                      <h3 className="font-heading text-xl font-bold text-[#0B1B3D]">
                        {min.name}
                      </h3>
                      <span className="text-[11px] font-semibold text-[#B38728]">
                        {min.edades}
                      </span>
                    </div>
                  </div>

                  {/* 1. Frase de Enganche */}
                  <div className="mb-3">
                    <p className="font-heading italic font-semibold text-sm sm:text-base text-[#0B1B3D]">
                      «{min.hook}»
                    </p>
                  </div>

                  {/* 2. Descripción */}
                  <p className="text-slate-600 text-xs sm:text-sm font-light leading-relaxed">
                    {min.description}
                  </p>

                </div>

                {/* 3. Versículo Bíblico Oficial + 4. Horario & Botón */}
                <div className="mt-6 pt-5 border-t border-amber-900/10 space-y-4">
                  
                  {/* Versículo NTV */}
                  <div className="bg-white/90 rounded-2xl p-4 border border-amber-800/10 shadow-2xs">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#B38728] mb-1">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{min.verseRef}</span>
                    </div>
                    <p className="font-heading italic text-xs text-slate-700 leading-snug">
                      «{min.verseText}»
                    </p>
                  </div>

                  {/* Horario */}
                  <div className="flex items-start gap-2 text-xs text-slate-600 bg-amber-50/60 p-3 rounded-xl border border-amber-200/50">
                    <Clock className="w-3.5 h-3.5 text-[#B38728] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-700 block">Horario de reunión:</span>
                      <span>{min.horario}</span>
                    </div>
                  </div>

                  {/* CTA de Sección */}
                  <a
                    href="#grupos"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B1B3D] hover:text-[#B38728] transition-colors pt-1 group/link"
                  >
                    <span>Quiero conectarme con este ministerio</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                  </a>

                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
