import React, { useState } from 'react';
import { X, Users, MapPin, Clock, Calendar, CheckCircle2, AlertCircle, Send } from 'lucide-react';
import type { GrupoConexion } from '../types/index.ts';
import { api } from '../services/api.ts';

interface JoinGroupModalProps {
  grupo: GrupoConexion | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export const JoinGroupModal: React.FC<JoinGroupModalProps> = ({ grupo, onClose, onSuccess }) => {
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!grupo) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!nombre.trim() || !telefono.trim() || !email.trim()) {
      setError('Por favor completa los campos obligatorios: nombre, teléfono y correo.');
      return;
    }

    setLoading(true);

    try {
      const res = await api.unirseAGrupo({
        grupo_id: grupo.id,
        nombre_completo: nombre.trim(),
        telefono: telefono.trim(),
        email: email.trim(),
        mensaje: mensaje.trim()
      });

      setSuccessMessage(res.message || '¡Tu solicitud ha sido enviada con éxito!');
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || 'No se pudo enviar la solicitud. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {successMessage ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center border border-emerald-200">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-heading text-2xl font-bold text-[#08323B]">
              ¡Solicitud Recibida!
            </h3>
            <p className="text-slate-600 text-sm max-w-sm mx-auto leading-relaxed">
              {successMessage}
            </p>
            <div className="p-4 bg-[#E8F4F6] rounded-2xl text-xs text-[#08323B] border border-[#0E5A6A]/20 text-left">
              <span className="font-bold block mb-1">Grupo: {grupo.nombre}</span>
              <span>Líder asignado: {grupo.nombre_lider}</span>
            </div>
            <button
              onClick={onClose}
              className="mt-4 px-6 py-2.5 bg-[#0E5A6A] text-white rounded-xl font-semibold text-sm hover:bg-[#08323B] transition-all shadow-md shadow-[#0E5A6A]/20"
            >
              Cerrar ventana
            </button>
          </div>
        ) : (
          <div>
            
            {/* Header info about the group */}
            <div className="mb-6">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#0E5A6A]">
                Quiero unirme a un grupo
              </span>
              <h3 className="font-heading text-2xl font-bold text-[#08323B] mt-1">
                {grupo.nombre}
              </h3>

              <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
                <span className="inline-flex items-center gap-1 bg-[#E8F4F6] px-2.5 py-1 rounded-lg border border-[#0E5A6A]/20 text-[#0E5A6A] font-medium">
                  <Calendar className="w-3.5 h-3.5 text-[#0E5A6A]" />
                  <span>{grupo.dia_semana} {grupo.hora_formato}</span>
                </span>
                <span className="inline-flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-lg text-slate-700">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span>{grupo.barrio_zona}</span>
                </span>
                <span className="inline-flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-lg text-slate-700">
                  <Users className="w-3.5 h-3.5 text-slate-500" />
                  <span>Líder: {grupo.nombre_lider}</span>
                </span>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
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
                  placeholder="Ej. Andrés Ramírez"
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#0E5A6A]/30 focus:border-[#0E5A6A] transition-all bg-slate-50/50"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Teléfono / WhatsApp <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    placeholder="Ej. +57 310 123 4567"
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#0E5A6A]/30 focus:border-[#0E5A6A] transition-all bg-slate-50/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Correo electrónico <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Ej. andres@ejemplo.com"
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#0E5A6A]/30 focus:border-[#0E5A6A] transition-all bg-slate-50/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mensaje o petición personal (opcional)
                </label>
                <textarea
                  rows={3}
                  value={mensaje}
                  onChange={(e) => setMensaje(e.target.value)}
                  placeholder="Cuéntanos un poco sobre ti o si tienes alguna pregunta para el líder..."
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#0E5A6A]/30 focus:border-[#0E5A6A] transition-all bg-slate-50/50 resize-none"
                />
              </div>

              <p className="text-[11px] text-slate-500 leading-tight">
                Tus datos serán tratados de manera confidencial y únicamente para contactarte e invitarte a la reunión semanal del grupo.
              </p>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0E5A6A] hover:bg-[#08323B] text-white text-xs font-semibold shadow-md shadow-[#0E5A6A]/20 transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <span>Enviando...</span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Enviar solicitud</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
