import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, ArrowLeft, AlertCircle, ShieldCheck, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { Logo } from '../components/Logo.tsx';

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
    <div className="min-h-screen bg-gradient-to-b from-[#F0F8F9] via-white to-[#F0F8F9] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      
      {/* Back to Home Button */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-[#0E5A6A] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a la página principal</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        
        {/* Header Icon & Title */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo variant="petrol" size="lg" withSlogan={true} />
          </div>
          <h2 className="font-heading text-3xl font-bold tracking-tight text-[#08323B]">
            Portal Administrativo
          </h2>
          <p className="text-xs text-[#0E5A6A] uppercase tracking-widest font-bold mt-1">
            Gestión Congregacional & Liderazgo
          </p>
          <p className="text-slate-600 text-xs mt-2">
            Acceso seguro para Administradores Generales y Líderes de Grupos de Conexión.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white py-8 px-6 sm:px-10 shadow-2xl shadow-[#08323B]/10 rounded-3xl border border-[#0E5A6A]/15">
          
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
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#0E5A6A]/40 focus:border-[#0E5A6A] transition-all bg-slate-50/50"
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
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#0E5A6A]/40 focus:border-[#0E5A6A] transition-all bg-slate-50/50"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#0E5A6A] hover:bg-[#08323B] text-white font-semibold text-sm shadow-md shadow-[#08323B]/20 transition-all disabled:opacity-50 cursor-pointer"
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
                className="p-2.5 text-left rounded-xl bg-[#E8F4F6] hover:bg-[#d8eef1] border border-[#0E5A6A]/20 transition-all cursor-pointer"
              >
                <div className="font-bold text-[#08323B] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#0E5A6A]" />
                  <span>Admin General</span>
                </div>
                <div className="text-[10px] text-slate-600 font-mono mt-0.5">admin@tupalabra.co</div>
                <div className="text-[10px] text-slate-500 font-mono">Clave: admin123</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('lider.jovenes@tupalabra.co', 'lider123')}
                className="p-2.5 text-left rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all cursor-pointer"
              >
                <div className="font-bold text-[#08323B] flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5 text-slate-600" />
                  <span>Líder de Grupo</span>
                </div>
                <div className="text-[10px] text-slate-600 font-mono mt-0.5">lider.jovenes@tupalabra.co</div>
                <div className="text-[10px] text-slate-500 font-mono">Clave: lider123</div>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
