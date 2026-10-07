export type UserRole = 'admin' | 'lider';

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  password?: string;
  rol: UserRole;
  sede_id?: number | null;
  telefono?: string;
  activo: boolean | number;
  ultimo_login?: string | null;
  created_at?: string;
}

export interface Sede {
  id: number;
  slug: string;
  nombre: string;
  ciudad: string;
  departamento: string;
  direccion: string;
  barrio: string;
  telefono: string;
  whatsapp: string;
  email: string;
  horario_sabado: string;
  horario_domingo: string;
  mapa_embed_url: string;
  mapa_link_url: string;
  imagen_url: string;
  activa: boolean | number;
}

export interface Categoria {
  id: number;
  slug: string;
  nombre: string;
  descripcion: string;
  color_hex: string;
  icono: string;
  activa: boolean | number;
  orden: number;
}

export interface Evento {
  id: number;
  titulo: string;
  slug: string;
  descripcion: string;
  fecha_inicio: string;
  fecha_fin?: string | null;
  sede_id?: number | null;
  sede_nombre?: string;
  categoria_id: number;
  categoria_nombre?: string;
  lugar: string;
  direccion?: string;
  imagen_url: string;
  estado: 'borrador' | 'publicado';
  destacado: boolean | number;
  cupos_max?: number | null;
  enlace_registro?: string | null;
  created_at?: string;
}

export interface GrupoConexion {
  id: number;
  nombre: string;
  categoria_id: number;
  categoria_nombre?: string;
  sede_id: number;
  sede_nombre?: string;
  lider_id?: number | null;
  nombre_lider: string;
  contacto_lider: string;
  dia_semana: string;
  hora: string;
  hora_formato: string;
  barrio_zona: string;
  ubicacion_aproximada: string;
  descripcion: string;
  cupo_maximo: number;
  estado: 'activo' | 'inactivo';
  solicitudes_count?: number;
  created_at?: string;
}

export interface SolicitudGrupo {
  id: number;
  grupo_id: number;
  grupo_nombre?: string;
  sede_nombre?: string;
  nombre_completo: string;
  telefono: string;
  email: string;
  mensaje?: string;
  estado: 'pendiente' | 'contactado' | 'integrado' | 'cancelado';
  notas_internas?: string;
  created_at?: string;
}

export interface MensajeContacto {
  id: number;
  sede_id?: number | null;
  sede_nombre?: string;
  nombre_completo: string;
  email: string;
  telefono?: string;
  asunto: string;
  mensaje: string;
  estado: 'pendiente' | 'leido' | 'respondido';
  created_at?: string;
}

export interface RedSocial {
  id: number;
  plataforma: string;
  nombre_mostrar: string;
  usuario: string;
  url: string;
  icono: string;
  activa: boolean | number;
  orden: number;
}

export interface ContenidoInstitucional {
  id: number;
  clave: string;
  seccion: string;
  titulo: string;
  contenido: string;
  subtitulo?: string;
  versiculo_referencia?: string;
  versiculo_texto?: string;
  updated_at?: string;
}
