import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Menu,
  X,
  BookOpen,
  Calendar,
  Users,
  Heart,
  ChevronDown,
  UserCheck
} from 'lucide-react';
import { useLocation, type SedeSlug } from '../context/LocationContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';

export const Navbar: React.FC = () => {
  const { selectedSede, setSelectedSede } = useLocation();
  const { isAuthenticated, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sedeDropdownOpen, setSedeDropdownOpen] = useState(false);

  const navLinks = [
    { name: 'Inicio', href: '#inicio' },
    { name: 'Nosotros', href: '#nosotros' },
    { name: 'Servicios', href: '#servicios' },
    { name: 'Ministerios', href: '#ministerios' },
    { name: 'Grupos de Conexión', href: '#grupos' },
    { name: 'Eventos', href: '#eventos' },
    { name: 'Redes', href: '#redes' },
    { name: 'Visítanos', href: '#visitanos' }
  ];

  const sedeNames: Record<SedeSlug, string> = {
    all: 'Todas las Sedes',
    ibague: 'Sede Ibagué',
    medellin: 'Sede Medellín'
  };

  const handleSedeChange = (slug: SedeSlug) => {
    setSelectedSede(slug);
    setSedeDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-amber-900/10 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Church Identity */}
          <a href="#inicio" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-[#0B1B3D] text-[#D4AF37] flex items-center justify-center shadow-md shadow-navy-950/20 group-hover:scale-105 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-2xl font-bold tracking-tight text-[#0B1B3D]">
                Tu Palabra
              </span>
              <span className="text-[11px] uppercase tracking-widest text-[#B38728] font-semibold">
                Iglesia Cristiana
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-slate-700 hover:text-[#0B1B3D] transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#D4AF37] hover:after:w-full after:transition-all"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Sede Selector & Actions */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Sede Dropdown Switcher */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setSedeDropdownOpen(!sedeDropdownOpen)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-full border border-amber-800/20 bg-amber-50/70 hover:bg-amber-100/70 text-slate-800 text-xs font-semibold tracking-wide transition-all shadow-2xs"
              >
                <MapPin className="w-3.5 h-3.5 text-[#B38728]" />
                <span>{sedeNames[selectedSede]}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${sedeDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {sedeDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-50">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Filtrar por sede
                  </div>
                  <button
                    onClick={() => handleSedeChange('all')}
                    className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-amber-50 transition-colors ${selectedSede === 'all' ? 'text-[#0B1B3D] font-bold bg-amber-50/60' : 'text-slate-600'}`}
                  >
                    <span>Todas las sedes</span>
                    {selectedSede === 'all' && <div className="w-1.5 h-1.5 rounded-full bg-[#B38728]" />}
                  </button>
                  <button
                    onClick={() => handleSedeChange('ibague')}
                    className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-amber-50 transition-colors ${selectedSede === 'ibague' ? 'text-[#0B1B3D] font-bold bg-amber-50/60' : 'text-slate-600'}`}
                  >
                    <span>Sede Ibagué</span>
                    {selectedSede === 'ibague' && <div className="w-1.5 h-1.5 rounded-full bg-[#B38728]" />}
                  </button>
                  <button
                    onClick={() => handleSedeChange('medellin')}
                    className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-amber-50 transition-colors ${selectedSede === 'medellin' ? 'text-[#0B1B3D] font-bold bg-amber-50/60' : 'text-slate-600'}`}
                  >
                    <span>Sede Medellín</span>
                    {selectedSede === 'medellin' && <div className="w-1.5 h-1.5 rounded-full bg-[#B38728]" />}
                  </button>
                </div>
              )}
            </div>

            {/* Admin or Portal Button */}
            <Link
              to={isAuthenticated ? "/admin" : "/admin/login"}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#0B1B3D] hover:bg-[#142852] text-[#F3E5AB] hover:text-white text-xs font-semibold tracking-wide transition-all shadow-xs"
              title="Panel Administrativo y Gestión de Líderes"
            >
              <UserCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{isAuthenticated ? (user?.rol === 'admin' ? 'Admin' : 'Mi Grupo') : 'Líderes'}</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link
              to={isAuthenticated ? "/admin" : "/admin/login"}
              className="p-2 text-[#0B1B3D] hover:bg-amber-100/50 rounded-lg"
              title="Panel"
            >
              <UserCheck className="w-5 h-5" />
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-[#0B1B3D] hover:bg-amber-100/40 rounded-lg transition-colors"
              aria-label="Abrir menú de navegación"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FAF8F5] border-b border-amber-900/10 px-4 pt-2 pb-6 space-y-4 animate-in slide-in-from-top duration-200">
          
          {/* Mobile Sede Switcher */}
          <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-900/10">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
              Sede activa:
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                onClick={() => handleSedeChange('all')}
                className={`py-1.5 text-xs rounded-lg font-medium transition-all ${selectedSede === 'all' ? 'bg-[#0B1B3D] text-amber-200 font-bold' : 'bg-white text-slate-700 border border-slate-200'}`}
              >
                Todas
              </button>
              <button
                onClick={() => handleSedeChange('ibague')}
                className={`py-1.5 text-xs rounded-lg font-medium transition-all ${selectedSede === 'ibague' ? 'bg-[#0B1B3D] text-amber-200 font-bold' : 'bg-white text-slate-700 border border-slate-200'}`}
              >
                Ibagué
              </button>
              <button
                onClick={() => handleSedeChange('medellin')}
                className={`py-1.5 text-xs rounded-lg font-medium transition-all ${selectedSede === 'medellin' ? 'bg-[#0B1B3D] text-amber-200 font-bold' : 'bg-white text-slate-700 border border-slate-200'}`}
              >
                Medellín
              </button>
            </div>
          </div>

          <div className="space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-base font-medium text-slate-800 hover:bg-amber-100/60 hover:text-[#0B1B3D] transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="pt-2 border-t border-amber-900/10">
            <Link
              to={isAuthenticated ? "/admin" : "/admin/login"}
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#0B1B3D] text-[#F3E5AB] font-semibold text-sm shadow-md"
            >
              <UserCheck className="w-4 h-4 text-[#D4AF37]" />
              <span>{isAuthenticated ? 'Ingresar al Panel Administrativo' : 'Portal de Líderes y Pastores'}</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
