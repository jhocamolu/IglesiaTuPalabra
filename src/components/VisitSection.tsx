import React from 'react';
import { MapPin, Phone, MessageCircle, Mail, Clock, ExternalLink, Building2, BookOpen, ArrowRight } from 'lucide-react';
import { useLocation } from '../context/LocationContext.tsx';
import { ContactForm } from './ContactForm.tsx';

export const VisitSection: React.FC = () => {
  const { sedes } = useLocation();

  return (
    <section id="visitanos" className="py-20 lg:py-28 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Llamado Final Oficial: Isaías 55:11 (NTV) */}
        <div className="bg-gradient-to-r from-[#0B1B3D] via-[#1a2d54] to-[#4A1525] rounded-3xl p-8 sm:p-12 text-white shadow-xl shadow-navy-950/15 mb-20 text-center relative overflow-hidden">
          <div className="relative z-10 max-w-3xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-semibold backdrop-blur-xs border border-white/10">
              <BookOpen className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Promesa Fiel • Isaías 55:11 (NTV)</span>
            </span>

            <blockquote className="font-heading italic text-xl sm:text-2xl text-amber-100 font-light leading-relaxed">
              «Así es también mi palabra. La envío y siempre produce fruto; logrará todo lo que yo quiero, y prosperará en todos los lugares donde yo la envíe.»
            </blockquote>

            <p className="text-base sm:text-lg text-slate-200 font-light max-w-xl mx-auto pt-2">
              Su Palabra no regresa vacía, y tampoco tu visita. <strong>Hay un lugar para ti en esta familia.</strong>
            </p>

            {/* Botones de Cierre Oficiales */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <a
                href="#servicios"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#D4AF37] hover:bg-[#c49e29] text-[#0B1B3D] font-bold text-xs shadow-md transition-all"
              >
                <span>Visítanos este fin de semana</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="https://wa.me/573108452911?text=Hola%2C%20quisiera%20recibir%20informaci%C3%B3n%20sobre%20la%20iglesia%20Tu%20Palabra"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-all"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Escríbenos por WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest text-[#B38728] font-bold">
            Nuestras Puertas Están Abiertas
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0B1B3D] mt-2 tracking-tight">
            Visítanos en Ibagué y Medellín
          </h2>
          <div className="w-16 h-1 bg-[#D4AF37] mx-auto mt-4 rounded-full" />
          <p className="text-slate-600 mt-4 text-base sm:text-lg font-light leading-relaxed">
            Te esperamos con los brazos abiertos en cada uno de nuestros auditorios. Trae a tu familia y amigos.
          </p>
        </div>

        {/* Campuses & Contact Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Campuses Cards (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            {sedes.map((sede) => (
              <div
                key={sede.id}
                className="bg-[#FAF8F5] rounded-3xl p-7 sm:p-8 border border-amber-900/10 shadow-xs hover:shadow-lg transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-[#0B1B3D] text-[#D4AF37] flex items-center justify-center shadow-md">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-heading text-2xl font-bold text-[#0B1B3D]">
                        {sede.nombre}
                      </h3>
                      <span className="text-xs text-slate-500 font-medium">
                        {sede.ciudad}, {sede.departamento} • {sede.barrio}
                      </span>
                    </div>
                  </div>

                  {/* Campus Map Link */}
                  <a
                    href={sede.mapa_link_url || `https://maps.google.com/?q=${encodeURIComponent(sede.direccion + ', ' + sede.ciudad)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:text-[#0B1B3D] hover:border-amber-300 transition-all self-start sm:self-auto"
                  >
                    <MapPin className="w-3.5 h-3.5 text-[#B38728]" />
                    <span>Abrir en Google Maps</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                </div>

                {/* Schedules box */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 p-4 rounded-2xl bg-white border border-amber-900/10 mb-6">
                  <div className="flex items-start gap-2.5">
                    <Clock className="w-4 h-4 text-[#B38728] shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-[11px] uppercase tracking-wider text-slate-400 font-bold">Sábados</span>
                      <span className="text-xs font-bold text-[#0B1B3D]">{sede.horario_sabado}</span>
                      <span className="block text-[10px] text-slate-500">Servicio de Adoración</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Clock className="w-4 h-4 text-[#B38728] shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-[11px] uppercase tracking-wider text-slate-400 font-bold">Domingos</span>
                      <span className="text-xs font-bold text-[#0B1B3D]">{sede.horario_domingo}</span>
                      <span className="block text-[10px] text-slate-500">Servicio General & BibliAventura</span>
                    </div>
                  </div>
                </div>

                {/* Contact information list */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#B38728] shrink-0" />
                    <span className="font-medium text-slate-800">{sede.direccion}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#B38728] shrink-0" />
                    <span>{sede.telefono}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <a
                      href={`https://wa.me/${sede.whatsapp.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-700 hover:underline font-semibold"
                    >
                      WhatsApp: {sede.whatsapp}
                    </a>
                  </div>

                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#B38728] shrink-0" />
                    <span>{sede.email}</span>
                  </div>
                </div>

              </div>
            ))}
          </div>

          {/* Right Column: Contact Form (5 cols) */}
          <div id="contacto" className="lg:col-span-5">
            <ContactForm />
          </div>

        </div>

      </div>
    </section>
  );
};
