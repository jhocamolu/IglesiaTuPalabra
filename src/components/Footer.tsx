import React from 'react';
import { MapPin, Phone, Mail, Instagram, Facebook, Youtube, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo.tsx';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#08323B] text-white pt-16 pb-12 border-t border-[#0E5A6A]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          
          {/* Col 1: Identity & Motto */}
          <div className="space-y-4">
            <div className="flex flex-col items-start">
              <Logo
                variant="white"
                size="md"
                withSlogan={true}
                className="items-start origin-left mb-2 drop-shadow-xs"
              />
            </div>

            <p className="text-slate-200 text-xs sm:text-sm font-light leading-relaxed">
              Arraigados en las Sagradas Escrituras, viviendo el amor de Jesús en comunidad y transformando a Colombia generación tras generación.
            </p>

            <div className="pt-2 text-xs text-amber-200 font-heading italic">
              «Lámpara es a mis pies tu palabra, y lumbrera a mi camino.» — Salmo 119:105
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-[#D4AF37] mb-4">
              Enlaces Rápidos
            </h4>
            <ul className="space-y-2 text-xs text-slate-200">
              <li><a href="#inicio" className="hover:text-white transition-colors">Inicio</a></li>
              <li><a href="#nosotros" className="hover:text-white transition-colors">¿Quiénes Somos? (Misión & Visión)</a></li>
              <li><a href="#ministerios" className="hover:text-white transition-colors">Ministerios por Edades</a></li>
              <li><a href="#grupos" className="hover:text-white transition-colors">Grupos de Conexión en Hogares</a></li>
              <li><a href="#eventos" className="hover:text-white transition-colors">Próximos Eventos & Congresos</a></li>
              <li><a href="#visitanos" className="hover:text-white transition-colors">Direcciones & Horarios</a></li>
              <li><a href="#contacto" className="hover:text-white transition-colors">Formulario de Contacto</a></li>
              <li>
                <Link to="/admin/login" className="hover:text-white text-[#D4AF37] font-semibold transition-colors">
                  Acceso a Líderes y Pastores
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Campuses info */}
          <div>
            <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-[#D4AF37] mb-4">
              Nuestras Sedes
            </h4>
            <div className="space-y-4 text-xs text-slate-200">
              <div>
                <strong className="text-white block text-sm">Sede Ibagué</strong>
                <p>Carrera 5 # 38-42 (La Pola / Centro)</p>
                <p className="text-[#D4AF37]">Sáb: 5:00 PM • Dom: 10:00 AM</p>
                <p>Tel: +57 (310) 845-2911</p>
              </div>

              <div>
                <strong className="text-white block text-sm">Sede Medellín</strong>
                <p>Calle 10 # 43E-31 (El Poblado)</p>
                <p className="text-[#D4AF37]">Sáb: 5:00 PM • Dom: 10:00 AM</p>
                <p>Tel: +57 (315) 720-3344</p>
              </div>
            </div>
          </div>

          {/* Col 4: Social and Fellowship */}
          <div>
            <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-[#D4AF37] mb-4">
              Comunidad Digital
            </h4>
            <p className="text-xs text-slate-200 mb-4 leading-relaxed font-light">
              Síguenos en nuestras plataformas oficiales para transmisiones dominicales en vivo y devocionales diarios.
            </p>

            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com/tupalabraco"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-[#0E5A6A] hover:text-[#D4AF37] flex items-center justify-center transition-all"
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com/tupalabraco"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-[#0E5A6A] hover:text-[#D4AF37] flex items-center justify-center transition-all"
                title="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com/@tupalabraoficial"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-[#0E5A6A] hover:text-[#D4AF37] flex items-center justify-center transition-all"
                title="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>

            <div className="mt-6 p-3 rounded-2xl bg-white/5 border border-white/10 text-[11px] text-amber-200">
              <span className="block font-bold">Horarios Unificados:</span>
              <span>Sábados 5:00 PM y Domingos 10:00 AM</span>
            </div>
          </div>

        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-300 gap-4">
          <p>© {new Date().getFullYear()} Iglesia Cristiana Tu Palabra. Ibagué & Medellín, Colombia. Todos los derechos reservados.</p>
          <p className="flex items-center gap-1">
            <span>Para la gloria de Dios</span>
            <Heart className="w-3.5 h-3.5 text-amber-400 fill-amber-400 inline" />
          </p>
        </div>

      </div>
    </footer>
  );
};
