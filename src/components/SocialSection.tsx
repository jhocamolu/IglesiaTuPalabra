import React, { useState, useEffect } from 'react';
import {
  Instagram,
  Facebook,
  Youtube,
  Video,
  MessageCircle,
  ExternalLink,
  Play,
  Heart,
  Users
} from 'lucide-react';
import { api } from '../services/api.ts';
import type { RedSocial } from '../types/index.ts';

export const SocialSection: React.FC = () => {
  const [redes, setRedes] = useState<RedSocial[]>([]);

  useEffect(() => {
    api.getRedes().then(data => {
      setRedes(data.filter(r => r.activa === 1 || r.activa === true));
    });
  }, []);

  const getIcon = (plataforma: string) => {
    switch (plataforma.toLowerCase()) {
      case 'instagram':
        return Instagram;
      case 'facebook':
        return Facebook;
      case 'youtube':
        return Youtube;
      case 'tiktok':
        return Video;
      default:
        return MessageCircle;
    }
  };

  const socialHighlights = [
    {
      title: 'Predicaciones & Enseñanzas',
      subtitle: 'Canal Oficial de YouTube',
      description: 'Cada domingo transmitimos la prédica bíblica para que puedas repasarla y compartirla con quienes más amas.',
      cta: 'Ver en YouTube',
      url: 'https://youtube.com/@tupalabraoficial',
      badge: 'Mensajes en Video',
      icon: Youtube,
      color: 'bg-red-50 text-red-600 border-red-200'
    },
    {
      title: 'Vida de Comunidad & Devocionales',
      subtitle: '@tupalabraco en Instagram',
      description: 'Versículos diarios, avisos de congresos, fotos de BibliAventura y momentos de los grupos de conexión.',
      cta: 'Seguir en Instagram',
      url: 'https://instagram.com/tupalabraco',
      badge: 'Fotos & Historias',
      icon: Instagram,
      color: 'bg-fuchsia-50 text-fuchsia-600 border-fuchsia-200'
    },
    {
      title: 'Clips & Reflexiones Cortas',
      subtitle: '@tupalabraco en TikTok',
      description: 'Videos cortos con respuestas bíblicas prácticas a dudas de fe, juventud, familia y vida cristiana contemporánea.',
      cta: 'Ver en TikTok',
      url: 'https://tiktok.com/@tupalabraco',
      badge: 'Reels & TikTok',
      icon: Video,
      color: 'bg-slate-100 text-slate-800 border-slate-300'
    }
  ];

  return (
    <section id="redes" className="py-20 lg:py-28 bg-[#F8FAFA] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest text-[#0E5A6A] font-bold">
            Conéctate Donde Estés
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-[#08323B] mt-2 tracking-tight">
            Nuestra Iglesia en Redes Sociales
          </h2>
          <div className="w-16 h-1 bg-[#0E5A6A] mx-auto mt-4 rounded-full" />
          <p className="text-slate-600 mt-4 text-base sm:text-lg font-light leading-relaxed">
            Lleva la Palabra de Dios contigo durante la semana. Síguenos y comparte el mensaje de Jesús con tus amigos.
          </p>
        </div>

        {/* Quick Social Buttons Bar */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-14">
          {redes.map((red) => {
            const Icon = getIcon(red.plataforma);
            return (
              <a
                key={red.id}
                href={red.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-white hover:bg-[#E8F4F6] text-slate-800 border border-[#0E5A6A]/15 shadow-2xs hover:shadow-md transition-all font-semibold text-xs group"
              >
                <div className="w-6 h-6 rounded-lg bg-[#0E5A6A] text-[#D4AF37] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span>{red.nombre_mostrar}</span>
                <span className="text-slate-400 font-normal">({red.usuario})</span>
                <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-[#0E5A6A] ml-0.5" />
              </a>
            );
          })}
        </div>

        {/* Highlight Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {socialHighlights.map((hl, i) => {
            const Icon = hl.icon;
            return (
              <div
                key={i}
                className="bg-white rounded-3xl p-8 border border-[#0E5A6A]/15 shadow-xs hover:shadow-xl hover:shadow-[#0E5A6A]/10 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-[#0E5A6A] text-[#D4AF37] flex items-center justify-center shadow-md shadow-[#0E5A6A]/20">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-[11px] font-semibold px-3 py-1 rounded-full border ${hl.color}`}>
                      {hl.badge}
                    </span>
                  </div>

                  <span className="text-xs font-bold uppercase tracking-wider text-[#0E5A6A]">
                    {hl.subtitle}
                  </span>
                  
                  <h3 className="font-heading text-xl font-bold text-[#08323B] mt-1 mb-3">
                    {hl.title}
                  </h3>

                  <p className="text-slate-600 text-sm font-light leading-relaxed">
                    {hl.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100">
                  <a
                    href={hl.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-bold text-[#0E5A6A] hover:text-[#08323B] transition-colors group"
                  >
                    <span>{hl.cta}</span>
                    <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
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
