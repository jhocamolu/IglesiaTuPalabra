import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, MessageSquare } from 'lucide-react';
import { api } from '../services/api.ts';
import { useLocation } from '../context/LocationContext.tsx';

export const ContactForm: React.FC = () => {
  const { selectedSede } = useLocation();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [sedeId, setSedeId] = useState<string>(
    selectedSede === 'ibague' ? '1' : selectedSede === 'medellin' ? '2' : ''
  );
  const [asunto, setAsunto] = useState('Información general');
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!nombre.trim() || !email.trim() || !mensaje.trim()) {
      setError('Por favor completa todos los campos obligatorios: nombre, correo y mensaje.');
      return;
    }

    setLoading(true);

    try {
      const res = await api.enviarContacto({
        nombre_completo: nombre.trim(),
        email: email.trim(),
        telefono: telefono.trim() || undefined,
        sede_id: sedeId ? parseInt(sedeId, 10) : null,
        asunto: asunto.trim(),
        mensaje: mensaje.trim()
      });

      setSuccess(res.message || '¡Tu mensaje ha sido enviado con éxito!');
      setNombre('');
      setEmail('');
      setTelefono('');
      setMensaje('');
    } catch (err: any) {
      setError(err.message || 'No fue posible enviar el mensaje. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#0E5A6A]/15 shadow-lg shadow-[#0E5A6A]/5">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-[#E8F4F6] text-[#0E5A6A] flex items-center justify-center border border-[#0E5A6A]/20">
          <MessageSquare className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-heading text-xl font-bold text-[#08323B]">
            Escríbenos un Mensaje
          </h3>
          <p className="text-slate-500 text-xs font-light">
            Responderemos a tu solicitud en menos de 24 horas.
          </p>
        </div>
      </div>

      {success && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block text-sm">¡Mensaje Enviado!</span>
            <span>{success}</span>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Nombre completo <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej. Sofía Martínez"
            className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0E5A6A]/30 focus:border-[#0E5A6A] transition-all"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Correo electrónico <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="sofia@ejemplo.com"
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0E5A6A]/30 focus:border-[#0E5A6A] transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Teléfono o WhatsApp (opcional)
            </label>
            <input
              type="tel"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="+57 312 000 0000"
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0E5A6A]/30 focus:border-[#0E5A6A] transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Sede de interés
            </label>
            <select
              value={sedeId}
              onChange={(e) => setSedeId(e.target.value)}
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0E5A6A]/30 focus:border-[#0E5A6A] transition-all"
            >
              <option value="">Cualquiera / General</option>
              <option value="1">Sede Ibagué (Tolima)</option>
              <option value="2">Sede Medellín (Antioquia)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Asunto
            </label>
            <select
              value={asunto}
              onChange={(e) => setAsunto(e.target.value)}
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0E5A6A]/30 focus:border-[#0E5A6A] transition-all"
            >
              <option value="Información general">Información general</option>
              <option value="Petición de Oración">Petición de oración</option>
              <option value="Consejería Pastoral">Consejería pastoral</option>
              <option value="Pregunta sobre Grupos">Pregunta sobre grupos</option>
              <option value="Ministerio Infantil">Ministerio infantil (BibliAventura)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Mensaje <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            rows={4}
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            placeholder="¿En qué te podemos servir o cómo podemos orar por ti hoy?"
            className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0E5A6A]/30 focus:border-[#0E5A6A] transition-all resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#0E5A6A] hover:bg-[#08323B] text-white font-semibold text-sm shadow-md shadow-[#0E5A6A]/20 transition-all disabled:opacity-50 hover:shadow-lg"
        >
          {loading ? (
            <span>Enviando mensaje...</span>
          ) : (
            <>
              <Send className="w-4 h-4 text-[#D4AF37]" />
              <span>Enviar mensaje</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
