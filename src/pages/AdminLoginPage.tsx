import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BookOpen, Lock, Mail, ArrowLeft, AlertCircle, ShieldCheck, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email.trim(), password);
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión. Verifica tu usuario y contraseña.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (quickEmail: string, quickPass: string) => {
    setEmail(quickEmail);
    setPassword(quickPass);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAF8F5] via-[#F4EFE6] to-[#FAF8F5] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      
      {/* Back to Home Button */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-[#0B1B3D] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a la página principal</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        
        {/* Header Icon & Title */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[#0B1B3D] text-[#D4AF37] flex items-center justify-center mx-auto shadow-xl shadow-navy-950/20 mb-3">
            <BookOpen className="w-8 h-8" />
          </div>
          <h2 className="font-heading text-3xl font-bold tracking-tight text-[#0B1B3D]">
            Portal Administrativo
          </h2>
          <p className="text-xs text-[#B38728] uppercase tracking-widest font-bold mt-1">
            Iglesia Cristiana Tu Palabra
          </p>
          <p className="text-slate-600 text-xs mt-2">
            Acceso seguro para Administradores Generales y Líderes de Grupos de Conexión.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white py-8 px-6 sm:px-10 shadow-2xl shadow-amber-950/10 rounded-3xl border border-amber-900/10">
          
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@tupalabra.co"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#B38728]/40 focus:border-[#B38728] transition-all bg-slate-50/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#B38728]/40 focus:border-[#B38728] transition-all bg-slate-50/50"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#0B1B3D] hover:bg-[#152e64] text-[#F3E5AB] font-semibold text-sm shadow-md shadow-navy-950/20 transition-all disabled:opacity-50"
            >
              {loading ? (
                <span>Verificando credenciales...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                  <span>Ingresar al Panel</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials for Evaluation */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <span className="block text-[11px] uppercase tracking-wider text-slate-400 font-bold text-center mb-3">
              Cuentas predeterminadas para prueba:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin@tupalabra.co', 'admin123')}
                className="p-2.5 text-left rounded-xl bg-amber-50/80 hover:bg-amber-100 border border-amber-200/60 transition-all"
              >
                <div className="font-bold text-[#0B1B3D] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#B38728]" />
                  <span>Admin General</span>
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">admin@tupalabra.co</div>
                <div className="text-[10px] text-slate-400 font-mono">Clave: admin123</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('lider.jovenes@tupalabra.co', 'lider123')}
                className="p-2.5 text-left rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all"
              >
                <div className="font-bold text-[#0B1B3D] flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5 text-slate-600" />
                  <span>Líder de Grupo</span>
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">lider.jovenes@tupalabra.co</div>
                <div className="text-[10px] text-slate-400 font-mono">Clave: lider123</div>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
