import React, { useState } from 'react';
import {
  BookOpen,
  Heart,
  Target,
  Eye,
  Compass,
  ShieldCheck,
  Sparkles,
  Users,
  SunMedium,
  CheckCircle2,
  ArrowRight,
  Headphones,
  Link2,
  TrendingUp,
  Globe2
} from 'lucide-react';
import { Logo } from './Logo.tsx';

export const AboutSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'que_es' | 'que_hacemos' | 'mision' | 'vision' | 'enfoque'>('que_es');

  // Valores fundamentales de Tu Palabra
  const valores = [
    {
      valor: 'La Palabra',
      frase: 'Es nuestra lámpara y nuestro fundamento.',
      icono: BookOpen,
      color: 'bg-[#E8F4F6] text-[#0E5A6A] border-[#0E5A6A]/20'
    },
    {
      valor: 'La gracia',
      frase: 'Todo empieza en lo que Jesús hizo por nosotros.',
      icono: Heart,
      color: 'bg-rose-50 text-rose-700 border-rose-200'
    },
    {
      valor: 'El discipulado',
      frase: 'Aprendemos para enseñar, y enseñamos para multiplicar.',
      icono: Target,
      color: 'bg-cyan-50 text-cyan-800 border-cyan-200'
    },
    {
      valor: 'La restauración',
      frase: 'Dios sana, levanta y da nuevos comienzos.',
      icono: Sparkles,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
      valor: 'La familia',
      frase: 'Caminamos juntos, no solos.',
      icono: Users,
      color: 'bg-amber-50 text-amber-800 border-amber-200'
    }
  ];

  // 4 Pasos de la Ruta de Crecimiento
  const rutaCrecimiento = [
    {
      paso: '1. Escucha',
      accion: 'Ven a un servicio',
      descripcion: 'Conoce la Palabra de Dios y escucha su mensaje de gracia cada fin de semana.',
      icono: Headphones,
      cta: 'Ver horarios de culto'
    },
    {
      paso: '2. Conecta',
      accion: 'Únete a un grupo',
      descripcion: 'Crea lazos de amistad sincera, ora con otros y crece en comunidad en hogares.',
      icono: Link2,
      cta: 'Buscar mi grupo'
    },
    {
      paso: '3. Crece',
      accion: 'Desarrolla tus dones',
      descripcion: 'Aprende, sé restaurado y sirve activamente en tu ministerio según tu etapa de vida.',
      icono: TrendingUp,
      cta: 'Conocer ministerios'
    },
    {
      paso: '4. Impacta',
      accion: 'Haz discípulos',
      descripcion: 'Lleva la Palabra a tu familia, a tu trabajo, a tu ciudad y donde Dios te envíe.',
      icono: Globe2,
      cta: 'Vivir la misión'
    }
  ];

  return (
    <section id="nosotros" className="py-20 lg:py-28 bg-[#F8FAFA] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-widest text-[#0E5A6A] font-bold">
            Identidad y Familia
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-[#08323B] mt-2 tracking-tight">
            Nuestra Casa, Tu Familia
          </h2>
          <div className="w-16 h-1 bg-[#0E5A6A] mx-auto mt-4 rounded-full" />
          <p className="text-slate-700 mt-4 text-base sm:text-lg font-light leading-relaxed">
            La Palabra de Dios es el centro de la vida de la familia Tu Palabra. Aprendemos de ella, la vivimos en comunidad y la compartimos con otros.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10 max-w-4xl mx-auto">
          {[
            { key: 'que_es', label: '¿Qué es Tu Palabra?', icon: BookOpen },
            { key: 'que_hacemos', label: '¿Qué hacemos?', icon: Heart },
            { key: 'mision', label: 'Misión', icon: Target },
            { key: 'vision', label: 'Visión', icon: Eye },
            { key: 'enfoque', label: 'Nuestro Enfoque', icon: Compass }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-[#0E5A6A] text-white shadow-md shadow-[#0E5A6A]/20 ring-2 ring-[#0E5A6A]/20'
                    : 'bg-white hover:bg-[#E8F4F6] text-slate-700 border border-slate-200/80 shadow-2xs'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#D4AF37]' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Card Principal del Tab Seleccionado */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#0E5A6A]/15 shadow-xl shadow-[#0E5A6A]/5 relative overflow-hidden transition-all">
            
            {/* Destello de fondo */}
            <div className="absolute right-0 top-0 w-80 h-80 bg-[#E8F4F6]/60 rounded-full blur-3xl pointer-events-none" />

            {/* TAB: ¿Qué es Tu Palabra? */}
            {activeTab === 'que_es' && (
              <div className="space-y-6 relative z-10 animate-in fade-in duration-200">
                <div>
                  <span className="text-xs uppercase tracking-widest text-[#0E5A6A] font-bold">
                    Identidad con Propósito
                  </span>
                  <h3 className="font-heading text-2xl sm:text-3xl font-bold text-[#08323B] mt-1">
                    ¿Qué es Tu Palabra?
                  </h3>
                </div>

                <p className="text-slate-700 text-base sm:text-lg leading-relaxed font-light">
                  No somos un edificio ni un evento: somos una familia. Personas distintas, con historias distintas, que tienen algo en común: Jesús es el Señor y Salvador de sus vidas. Nos une su gracia y la obra del Espíritu Santo en nuestro corazón.
                </p>

                <p className="text-slate-700 text-base sm:text-lg leading-relaxed font-light">
                  Y por eso nos llamamos así. Creemos que la Palabra de Dios no es un libro del pasado, sino una voz viva para hoy. <strong>«La palabra de Dios es viva y poderosa»</strong> (Hebreos 4:12). Esa Palabra nos corrige, nos consuela, nos orienta y nos transforma.
                </p>

                <div className="p-5 sm:p-6 rounded-2xl bg-[#E8F4F6]/90 border border-[#0E5A6A]/20 mt-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#0E5A6A] text-[#D4AF37] flex items-center justify-center shrink-0 mt-0.5">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-heading italic text-slate-800 text-sm sm:text-base leading-snug">
                        «Pues la palabra de Dios es viva y poderosa. Es más cortante que cualquier espada de dos filos.»
                      </p>
                      <span className="block text-xs uppercase tracking-wider text-[#0E5A6A] font-bold mt-2">
                        — Hebreos 4:12 (NTV)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: ¿Qué hacemos? */}
            {activeTab === 'que_hacemos' && (
              <div className="space-y-6 relative z-10 animate-in fade-in duration-200">
                <div>
                  <span className="text-xs uppercase tracking-widest text-[#0E5A6A] font-bold">
                    Acción & Vida en Comunidad
                  </span>
                  <h3 className="font-heading text-2xl sm:text-3xl font-bold text-[#08323B] mt-1">
                    ¿Qué hacemos?
                  </h3>
                </div>

                <p className="text-slate-700 text-base sm:text-lg leading-relaxed font-light">
                  Nos reunimos para algo muy sencillo y muy poderoso: conocer la voluntad de Dios a través de su Palabra y vivir conforme a su propósito.
                </p>

                {/* 4 Pilares Prácticos */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
                  <div className="p-4 rounded-2xl bg-[#F8FAFA] border border-slate-200/80">
                    <span className="font-bold text-sm text-[#08323B] block mb-1">1. Escuchamos la Palabra</span>
                    <p className="text-xs text-slate-600 font-light">En nuestros servicios, con enseñanza bíblica clara, profunda y práctica para la vida diaria.</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#F8FAFA] border border-slate-200/80">
                    <span className="font-bold text-sm text-[#08323B] block mb-1">2. La estudiamos en comunidad</span>
                    <p className="text-xs text-slate-600 font-light">En grupos pequeños donde nadie camina solo y todos nos acompañamos en lo cotidiano.</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#F8FAFA] border border-slate-200/80">
                    <span className="font-bold text-sm text-[#08323B] block mb-1">3. La ponemos en práctica</span>
                    <p className="text-xs text-slate-600 font-light">Porque no basta con escuchar: «No solo escuchen la palabra de Dios; tienen que ponerla en práctica» (Santiago 1:22).</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#F8FAFA] border border-slate-200/80">
                    <span className="font-bold text-sm text-[#08323B] block mb-1">4. La compartimos</span>
                    <p className="text-xs text-slate-600 font-light">Con nuestras familias, amigos, lugares de trabajo y ciudades de Ibagué, Medellín y más allá.</p>
                  </div>
                </div>

                <p className="text-slate-700 text-sm sm:text-base leading-relaxed font-light">
                  Y para que cada persona encuentre su lugar, creamos espacios para cada etapa de la vida: niños, adolescentes, jóvenes, parejas, hombres y mujeres. Cada uno es un encuentro de gracia y crecimiento que edifica vidas.
                </p>
              </div>
            )}

            {/* TAB: Misión */}
            {activeTab === 'mision' && (
              <div className="space-y-6 relative z-10 animate-in fade-in duration-200">
                <div>
                  <span className="text-xs uppercase tracking-widest text-[#0E5A6A] font-bold">
                    El Mandato de Jesús
                  </span>
                  <h3 className="font-heading text-2xl sm:text-3xl font-bold text-[#08323B] mt-1">
                    Nuestra Misión
                  </h3>
                </div>

                <blockquote className="text-xl sm:text-2xl font-heading text-[#08323B] font-semibold leading-relaxed border-l-4 border-[#0E5A6A] pl-5 italic">
                  «Ir y hacer discípulos en todo lugar, bautizándolos en el nombre del Padre, del Hijo y del Espíritu Santo, y enseñándoles todas las cosas que vamos aprendiendo de la Palabra de Dios.»
                </blockquote>

                <div className="p-5 rounded-2xl bg-[#F8FAFA] border border-slate-200/80">
                  <span className="text-xs font-bold text-[#0E5A6A] uppercase tracking-wider block mb-1">Texto de Apoyo:</span>
                  <p className="text-sm text-slate-700 font-light leading-relaxed">
                    Un discípulo es alguien que sigue a Jesús, aprende de Él y ayuda a otros a hacer lo mismo. Eso hacemos: enseñar lo que la Palabra nos enseña a nosotros (Mateo 28:19-20).
                  </p>
                </div>
              </div>
            )}

            {/* TAB: Visión */}
            {activeTab === 'vision' && (
              <div className="space-y-6 relative z-10 animate-in fade-in duration-200">
                <div>
                  <span className="text-xs uppercase tracking-widest text-[#0E5A6A] font-bold">
                    Hacia Dónde Caminamos
                  </span>
                  <h3 className="font-heading text-2xl sm:text-3xl font-bold text-[#08323B] mt-1">
                    Nuestra Visión
                  </h3>
                </div>

                <blockquote className="text-xl sm:text-2xl font-heading text-[#08323B] font-semibold leading-relaxed border-l-4 border-[#0E5A6A] pl-5 italic">
                  «Que gente de toda lengua y nación reconozca a Jesucristo como el Hijo de Dios, como Señor y Salvador.»
                </blockquote>

                <div className="p-5 rounded-2xl bg-[#F8FAFA] border border-slate-200/80">
                  <span className="text-xs font-bold text-[#0E5A6A] uppercase tracking-wider block mb-1">Texto de Apoyo:</span>
                  <p className="text-sm text-slate-700 font-light leading-relaxed">
                    Soñamos en grande porque el corazón de Dios es grande. Empezamos en Ibagué y Medellín, pero nuestra mirada es de todas las naciones.
                  </p>
                </div>
              </div>
            )}

            {/* TAB: Enfoque */}
            {activeTab === 'enfoque' && (
              <div className="space-y-6 relative z-10 animate-in fade-in duration-200">
                <div>
                  <span className="text-xs uppercase tracking-widest text-[#0E5A6A] font-bold">
                    Impacto en la Vida Real
                  </span>
                  <h3 className="font-heading text-2xl sm:text-3xl font-bold text-[#08323B] mt-1">
                    Nuestro Enfoque
                  </h3>
                </div>

                <blockquote className="text-xl sm:text-2xl font-heading text-[#08323B] font-semibold leading-relaxed border-l-4 border-[#0E5A6A] pl-5 italic">
                  «Brindar herramientas para el discipulado, la enseñanza y la restauración de las personas, para que causen un impacto profundo en sus familias y en las demás áreas de su vida.»
                </blockquote>

                <div className="p-5 rounded-2xl bg-[#F8FAFA] border border-slate-200/80">
                  <span className="text-xs font-bold text-[#0E5A6A] uppercase tracking-wider block mb-1">Texto de Apoyo:</span>
                  <p className="text-sm text-slate-700 font-light leading-relaxed">
                    Queremos que la Palabra salga de la iglesia y llegue a la mesa de la casa, al trabajo, a la universidad y a las decisiones de cada día.
                  </p>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* SECCIÓN: Lo que nos mueve (Valores) */}
        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs uppercase tracking-widest text-[#0E5A6A] font-bold">
              Principios no Negociables
            </span>
            <h3 className="font-heading text-2xl sm:text-3xl font-bold text-[#08323B] mt-1">
              Lo Que Nos Mueve
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 font-light mt-2">
              Cinco convicciones que definen el corazón de nuestra congregación:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
            {valores.map((v, i) => {
              const Icon = v.icono;
              return (
                <div
                  key={i}
                  className="bg-white rounded-3xl p-6 border border-[#0E5A6A]/10 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 border ${v.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <h4 className="font-heading font-bold text-base text-[#08323B] mb-2">
                      {v.valor}
                    </h4>
                    <p className="text-xs text-slate-600 font-light leading-relaxed">
                      {v.frase}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECCIÓN: Construir sobre la roca (Mateo 7:24-25) */}
        <div className="bg-gradient-to-r from-[#08323B] via-[#0E5A6A] to-[#147285] rounded-3xl p-8 sm:p-12 text-white shadow-xl shadow-[#08323B]/20 mb-20 relative overflow-hidden max-w-5xl mx-auto">
          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-4">
            
            <div className="flex justify-center mb-2">
              <Logo variant="white" size="md" withSlogan={true} className="opacity-95" />
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-amber-200 text-xs font-semibold backdrop-blur-xs border border-white/15">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              <span>Construir sobre la Roca • Mateo 7:24-25</span>
            </div>

            <p className="text-base sm:text-lg font-light leading-relaxed text-slate-100">
              Jesús dijo que quien escucha sus palabras y las practica es como un hombre sabio que construye su casa sobre la roca (Mateo 7:24-25). Cuando vengan las tormentas, esa casa sigue en pie.
            </p>

            <blockquote className="font-heading italic text-lg sm:text-xl text-amber-200">
              «Eso queremos para cada familia: vidas y hogares firmes porque están edificados sobre su Palabra.»
            </blockquote>
          </div>
        </div>

        {/* SECCIÓN: Ruta de crecimiento (4 Pasos visuales) */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-widest text-[#0E5A6A] font-bold">
              Un Camino de Fe para Ti
            </span>
            <h3 className="font-heading text-2xl sm:text-3xl font-bold text-[#08323B] mt-1">
              Ruta de Crecimiento
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 font-light mt-2">
              Cuatro pasos que conectan tu vida con Dios y con cada ministerio de nuestra iglesia:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {rutaCrecimiento.map((paso, idx) => {
              const Icon = paso.icono;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-3xl p-6 border border-[#0E5A6A]/10 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between group hover:-translate-y-1"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-11 h-11 rounded-2xl bg-[#0E5A6A] text-[#D4AF37] flex items-center justify-center shadow-md shadow-[#0E5A6A]/20">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="font-cinzel text-xs font-bold text-[#0E5A6A] tracking-widest">
                        PASO {idx + 1}
                      </span>
                    </div>

                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      {paso.accion}
                    </span>
                    <h4 className="font-heading font-bold text-lg text-[#08323B] mt-0.5 mb-2">
                      {paso.paso}
                    </h4>

                    <p className="text-xs text-slate-600 font-light leading-relaxed">
                      {paso.descripcion}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100">
                    <a
                      href={idx === 0 ? '#servicios' : idx === 1 ? '#grupos' : idx === 2 ? '#ministerios' : '#visitanos'}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0E5A6A] hover:text-[#08323B] transition-colors"
                    >
                      <span>{paso.cta}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
