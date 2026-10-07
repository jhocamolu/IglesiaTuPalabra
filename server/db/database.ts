import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import type {
  Sede,
  Usuario,
  Categoria,
  Evento,
  GrupoConexion,
  SolicitudGrupo,
  MensajeContacto,
  RedSocial,
  ContenidoInstitucional
} from '../types/index.js';

let pool: mysql.Pool | null = null;
let useMemoryStore = false;

// ---------------------------------------------------------------------
// In-Memory Fallback Store (Matches schema.sql Seeds)
// ---------------------------------------------------------------------
interface MemoryDB {
  sedes: Sede[];
  usuarios: Usuario[];
  categorias: Categoria[];
  eventos: Evento[];
  grupos: GrupoConexion[];
  solicitudes: SolicitudGrupo[];
  mensajes: MensajeContacto[];
  redes: RedSocial[];
  institucional: ContenidoInstitucional[];
}

const defaultPasswordHash = bcrypt.hashSync('admin123', 10);
const liderPasswordHash = bcrypt.hashSync('lider123', 10);

const memoryDB: MemoryDB = {
  sedes: [
    {
      id: 1,
      slug: 'ibague',
      nombre: 'Sede Ibagué',
      ciudad: 'Ibagué',
      departamento: 'Tolima',
      direccion: 'Carrera 5 # 38-42',
      barrio: 'La Pola / Centro Empresarial',
      telefono: '+57 (310) 845-2911',
      whatsapp: '+573108452911',
      email: 'ibague@tupalabra.co',
      horario_sabado: 'Sábados 5:00 PM',
      horario_domingo: 'Domingos 10:00 AM',
      mapa_embed_url: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3977.854619375176!2d-75.2415174!3d4.4412351!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e38c4fb25c3f91f%3A0x7d6b9d62d294827b!2zSWJhZ3XDqSwgVG9saW1h!5e0!3m2!1ses!2sco!4v1700000000000',
      mapa_link_url: 'https://maps.google.com/?q=Ibague+Tolima',
      imagen_url: 'https://images.unsplash.com/photo-1548625361-192a54330e79?auto=format&fit=crop&w=1200&q=80',
      activa: 1
    },
    {
      id: 2,
      slug: 'medellin',
      nombre: 'Sede Medellín',
      ciudad: 'Medellín',
      departamento: 'Antioquia',
      direccion: 'Calle 10 # 43E-31',
      barrio: 'El Poblado',
      telefono: '+57 (315) 720-3344',
      whatsapp: '+573157203344',
      email: 'medellin@tupalabra.co',
      horario_sabado: 'Sábados 5:00 PM',
      horario_domingo: 'Domingos 10:00 AM',
      mapa_embed_url: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.242274488392!2d-75.571431!3d6.210459!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e44282b3a9a12c9%3A0x2db4ab60cbb41132!2sEl%20Poblado%2C%20Medell%C3%ADn!5e0!3m2!1ses!2sco!4v1700000000001',
      mapa_link_url: 'https://maps.google.com/?q=El+Poblado+Medellin',
      imagen_url: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=1200&q=80',
      activa: 1
    }
  ],
  usuarios: [
    {
      id: 1,
      nombre: 'Pastor Administrador General',
      email: 'admin@tupalabra.co',
      password: defaultPasswordHash,
      rol: 'admin',
      sede_id: 1,
      telefono: '+57 310 845-2911',
      activo: 1,
      ultimo_login: null
    },
    {
      id: 2,
      nombre: 'Líder Andrés Montoya',
      email: 'lider.jovenes@tupalabra.co',
      password: liderPasswordHash,
      rol: 'lider',
      sede_id: 1,
      telefono: '+57 312 456-7890',
      activo: 1,
      ultimo_login: null
    },
    {
      id: 3,
      nombre: 'Líder Carolina Vélez',
      email: 'lider.medellin@tupalabra.co',
      password: liderPasswordHash,
      rol: 'lider',
      sede_id: 2,
      telefono: '+57 315 889-1122',
      activo: 1,
      ultimo_login: null
    }
  ],
  categorias: [
    {
      id: 1,
      slug: 'bibli-aventura',
      nombre: 'BibliAventura (Niños)',
      descripcion: 'Ministerio infantil para sembrar la Palabra de Dios en los corazones más pequeños.',
      color_hex: '#0284C7',
      icono: 'Baby',
      activa: 1,
      orden: 1
    },
    {
      id: 2,
      slug: 'alpha',
      nombre: 'ALPHA (Jóvenes 13-17)',
      descripcion: 'Comunidad juvenil para adolescentes con identidad y pasión en Cristo.',
      color_hex: '#7C3AED',
      icono: 'Flame',
      activa: 1,
      orden: 2
    },
    {
      id: 3,
      slug: 'jovenes-solteros',
      nombre: 'Jóvenes Solteros (18-35)',
      descripcion: 'Universitarios y jóvenes profesionales creciendo en fe, vocación y comunión.',
      color_hex: '#0D9488',
      icono: 'Sparkles',
      activa: 1,
      orden: 3
    },
    {
      id: 4,
      slug: 'parejas',
      nombre: 'Parejas y Matrimonios',
      descripcion: 'Hogares fundamentados en Cristo, cordón de tres dobleces que no se rompe.',
      color_hex: '#E11D48',
      icono: 'Heart',
      activa: 1,
      orden: 4
    },
    {
      id: 5,
      slug: 'hombres',
      nombre: 'Ministerio de Hombres',
      descripcion: 'Varones íntegros, valientes y sacerdotes espirituales de sus familias.',
      color_hex: '#1E3A8A',
      icono: 'Shield',
      activa: 1,
      orden: 5
    },
    {
      id: 6,
      slug: 'mujeres',
      nombre: 'Ministerio de Mujeres',
      descripcion: 'Mujeres que temen al Señor, sabias y llenas de gracia, fe y propósito.',
      color_hex: '#9333EA',
      icono: 'Flower2',
      activa: 1,
      orden: 6
    },
    {
      id: 7,
      slug: 'general',
      nombre: 'General y Familias',
      descripcion: 'Eventos y espacios abiertos para toda la congregación.',
      color_hex: '#D97706',
      icono: 'Calendar',
      activa: 1,
      orden: 7
    }
  ],
  eventos: [
    {
      id: 1,
      titulo: 'Congreso Anual de Familias: Hogares Firmes',
      slug: 'congreso-familias-hogares-firmes',
      descripcion: 'Un fin de semana transformador con plenarias especiales, talleres interactivos para parejas, actividades para niños en BibliAventura y adoración en vivo.',
      fecha_inicio: new Date(Date.now() + 10 * 86400000).toISOString(),
      fecha_fin: new Date(Date.now() + 12 * 86400000).toISOString(),
      sede_id: 1,
      sede_nombre: 'Sede Ibagué',
      categoria_id: 4,
      categoria_nombre: 'Parejas y Matrimonios',
      lugar: 'Auditorio Principal Tu Palabra Ibagué',
      direccion: 'Carrera 5 # 38-42, Ibagué',
      imagen_url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
      estado: 'publicado',
      destacado: 1,
      cupos_max: 300,
      enlace_registro: 'https://tupalabra.co/registro/familias'
    },
    {
      id: 2,
      titulo: 'Noche de Alabanza y Adoración Íntima',
      slug: 'noche-alabanza-adoracion-medellin',
      descripcion: 'Una noche dedicada a buscar el rostro del Señor, orar por nuestra nación y sumergirnos en Su presencia con cánticos de adoración.',
      fecha_inicio: new Date(Date.now() + 5 * 86400000).toISOString(),
      fecha_fin: null,
      sede_id: 2,
      sede_nombre: 'Sede Medellín',
      categoria_id: 7,
      categoria_nombre: 'General y Familias',
      lugar: 'Auditorio Tu Palabra Sede Medellín',
      direccion: 'Calle 10 # 43E-31, El Poblado',
      imagen_url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
      estado: 'publicado',
      destacado: 1,
      cupos_max: 200,
      enlace_registro: null
    },
    {
      id: 3,
      titulo: 'Campamento ALPHA: Identidad Inquebrantable',
      slug: 'campamento-alpha-identidad',
      descripcion: 'Tres días inolvidables en la naturaleza con fogata, desafíos en equipo, mensajes bíblicos y un encuentro genuino con el Espíritu Santo para jóvenes de 13 a 17 años.',
      fecha_inicio: new Date(Date.now() + 20 * 86400000).toISOString(),
      fecha_fin: new Date(Date.now() + 22 * 86400000).toISOString(),
      sede_id: 1,
      sede_nombre: 'Sede Ibagué',
      categoria_id: 2,
      categoria_nombre: 'ALPHA (Jóvenes 13-17)',
      lugar: 'Finca Campestre El Edén (Vía El Totumo)',
      direccion: 'Ibagué, Tolima',
      imagen_url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&q=80',
      estado: 'publicado',
      destacado: 1,
      cupos_max: 80,
      enlace_registro: 'https://tupalabra.co/registro/alpha-camp'
    },
    {
      id: 4,
      titulo: 'Encuentro de Hombres de Honor',
      slug: 'encuentro-hombres-de-honor',
      descripcion: 'Conferencia y desayuno de confraternidad para hombres. Desafíos de hombría bíblica, testimonio en el trabajo y liderazgo hogareño.',
      fecha_inicio: new Date(Date.now() + 16 * 86400000).toISOString(),
      fecha_fin: null,
      sede_id: 2,
      sede_nombre: 'Sede Medellín',
      categoria_id: 5,
      categoria_nombre: 'Ministerio de Hombres',
      lugar: 'Auditorio Tu Palabra / Salón Poblado',
      direccion: 'Calle 10 # 43E-31, El Poblado, Medellín',
      imagen_url: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1200&q=80',
      estado: 'publicado',
      destacado: 0,
      cupos_max: 120,
      enlace_registro: null
    },
    {
      id: 5,
      titulo: 'Taller BibliAventura: Padres Sabios',
      slug: 'taller-bibli-aventura-padres-sabios',
      descripcion: 'Taller pedagógico y bíblico para padres de niños de 0 a 12 años sobre discipulado infantil en el hogar en la era digital.',
      fecha_inicio: new Date(Date.now() + 8 * 86400000).toISOString(),
      fecha_fin: null,
      sede_id: 1,
      sede_nombre: 'Sede Ibagué',
      categoria_id: 1,
      categoria_nombre: 'BibliAventura (Niños)',
      lugar: 'Salón Infantil BibliAventura',
      direccion: 'Carrera 5 # 38-42, Ibagué',
      imagen_url: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=1200&q=80',
      estado: 'publicado',
      destacado: 0,
      cupos_max: 60,
      enlace_registro: null
    },
    {
      id: 6,
      titulo: 'Tarde de Té y Palabra: Mujeres Virtuosas',
      slug: 'tarde-te-mujeres-virtuosas',
      descripcion: 'Un tiempo especial de refrigerio, testimonios de fe y mensaje bíblico para restaurar corazones y renovar fuerzas.',
      fecha_inicio: new Date(Date.now() + 14 * 86400000).toISOString(),
      fecha_fin: null,
      sede_id: 2,
      sede_nombre: 'Sede Medellín',
      categoria_id: 6,
      categoria_nombre: 'Ministerio de Mujeres',
      lugar: 'Tu Palabra Medellín',
      direccion: 'El Poblado, Medellín',
      imagen_url: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80',
      estado: 'publicado',
      destacado: 0,
      cupos_max: 90,
      enlace_registro: null
    }
  ],
  grupos: [
    {
      id: 1,
      nombre: 'Conexión Jóvenes: Radicados en la Roca',
      categoria_id: 3,
      categoria_nombre: 'Jóvenes Solteros (18-35)',
      sede_id: 1,
      sede_nombre: 'Sede Ibagué',
      lider_id: 2,
      nombre_lider: 'Andrés Montoya & Diana Torres',
      contacto_lider: '+57 312 456-7890',
      dia_semana: 'Miércoles',
      hora: '19:00:00',
      hora_formato: '7:00 PM',
      barrio_zona: 'La Pola (Zona Centro)',
      ubicacion_aproximada: 'Cerca al Parque Centenario',
      descripcion: 'Grupo de jóvenes universitarios y profesionales. Compartimos refrigerio, estudio bíblico aplicado a la vida diaria y tiempo de oración.',
      cupo_maximo: 15,
      estado: 'activo'
    },
    {
      id: 2,
      nombre: 'ALPHA Generación de Impacto',
      categoria_id: 2,
      categoria_nombre: 'ALPHA (Jóvenes 13-17)',
      sede_id: 1,
      sede_nombre: 'Sede Ibagué',
      lider_id: 2,
      nombre_lider: 'Santiago Morales',
      contacto_lider: '+57 311 234-5678',
      dia_semana: 'Viernes',
      hora: '18:30:00',
      hora_formato: '6:30 PM',
      barrio_zona: 'Cádiz / Macarena',
      ubicacion_aproximada: 'A 2 cuadras de la Carrera 5ta',
      descripcion: 'Espacio dinámico para adolescentes de 13 a 17 años con juegos, dinámicas, alabanza y charlas prácticas para vivir con convicción bíblica.',
      cupo_maximo: 20,
      estado: 'activo'
    },
    {
      id: 3,
      nombre: 'Matrimonios Fuertes en Cristo',
      categoria_id: 4,
      categoria_nombre: 'Parejas y Matrimonios',
      sede_id: 1,
      sede_nombre: 'Sede Ibagué',
      lider_id: 1,
      nombre_lider: 'Pastor Carlos y Martha Gómez',
      contacto_lider: '+57 310 845-2911',
      dia_semana: 'Jueves',
      hora: '19:30:00',
      hora_formato: '7:30 PM',
      barrio_zona: 'Interlaken / Piedrapintada',
      ubicacion_aproximada: 'Sector Calle 60',
      descripcion: 'Cuidado pastoral y principios bíblicos prácticos para edificar matrimonios saludables, comunicación asertiva y crianza centrada en Dios.',
      cupo_maximo: 12,
      estado: 'activo'
    },
    {
      id: 4,
      nombre: 'Mujeres de Gracia y Verdad',
      categoria_id: 6,
      categoria_nombre: 'Ministerio de Mujeres',
      sede_id: 1,
      sede_nombre: 'Sede Ibagué',
      lider_id: 1,
      nombre_lider: 'Liliana Ramírez',
      contacto_lider: '+57 314 901-2345',
      dia_semana: 'Martes',
      hora: '18:30:00',
      hora_formato: '6:30 PM',
      barrio_zona: 'El Salado / Ambalá',
      ubicacion_aproximada: 'Cerca a la Universidad de Ibagué',
      descripcion: 'Estudio bíblico inductivo, intercesión y hermandad para mujeres que anhelan crecer espiritualmente y servir a sus familias con sabiduría.',
      cupo_maximo: 16,
      estado: 'activo'
    },
    {
      id: 5,
      nombre: 'Hombres de Valor y Propósito',
      categoria_id: 5,
      categoria_nombre: 'Ministerio de Hombres',
      sede_id: 1,
      sede_nombre: 'Sede Ibagué',
      lider_id: 1,
      nombre_lider: 'Ing. Mauricio Castro',
      contacto_lider: '+57 317 654-3210',
      dia_semana: 'Sábado',
      hora: '07:00:00',
      hora_formato: '7:00 AM',
      barrio_zona: 'Piedrapintada',
      ubicacion_aproximada: 'Salón de comunión La Casona',
      descripcion: 'Desayuno de hombres, estudio de liderazgo bíblico, integridad, vida laboral y desafío espiritual para ser sacerdotes del hogar.',
      cupo_maximo: 18,
      estado: 'activo'
    },
    {
      id: 6,
      nombre: 'Conexión Poblado Jóvenes Profesionales',
      categoria_id: 3,
      categoria_nombre: 'Jóvenes Solteros (18-35)',
      sede_id: 2,
      sede_nombre: 'Sede Medellín',
      lider_id: 3,
      nombre_lider: 'Carolina Vélez & Mateo Restrepo',
      contacto_lider: '+57 315 889-1122',
      dia_semana: 'Miércoles',
      hora: '19:30:00',
      hora_formato: '7:30 PM',
      barrio_zona: 'El Poblado (Medellín)',
      ubicacion_aproximada: 'Sector Provenza / Manila',
      descripcion: 'Comunidad de jóvenes en Medellín comprometidos con buscar la presencia de Dios en la ciudad y profundizar en las Escrituras.',
      cupo_maximo: 15,
      estado: 'activo'
    },
    {
      id: 7,
      nombre: 'Parejas con Propósito Medellín',
      categoria_id: 4,
      categoria_nombre: 'Parejas y Matrimonios',
      sede_id: 2,
      sede_nombre: 'Sede Medellín',
      lider_id: 3,
      nombre_lider: 'David & Juliana Correa',
      contacto_lider: '+57 301 554-9988',
      dia_semana: 'Viernes',
      hora: '19:45:00',
      hora_formato: '7:45 PM',
      barrio_zona: 'Laureles (Medellín)',
      ubicacion_aproximada: 'Cerca al 2do Parque de Laureles',
      descripcion: 'Espacio enriquecedor para matrimonios jóvenes y maduros. Crecimiento conjunto y amistad sincera en un ambiente acogedor.',
      cupo_maximo: 14,
      estado: 'activo'
    },
    {
      id: 8,
      nombre: 'Mujeres Virtuosas Envigado / Sabaneta',
      categoria_id: 6,
      categoria_nombre: 'Ministerio de Mujeres',
      sede_id: 2,
      sede_nombre: 'Sede Medellín',
      lider_id: 3,
      nombre_lider: 'Marcela Ospina',
      contacto_lider: '+57 320 445-6677',
      dia_semana: 'Jueves',
      hora: '18:30:00',
      hora_formato: '6:30 PM',
      barrio_zona: 'Zona Sur (Envigado)',
      ubicacion_aproximada: 'Cerca a la Estación Envigado',
      descripcion: 'Círculo de oración, lectura bíblica y mentoría entre mujeres de fe en el sur del Valle de Aburrá.',
      cupo_maximo: 16,
      estado: 'activo'
    },
    {
      id: 9,
      nombre: 'ALPHA Medellín - Pasión por Jesús',
      categoria_id: 2,
      categoria_nombre: 'ALPHA (Jóvenes 13-17)',
      sede_id: 2,
      sede_nombre: 'Sede Medellín',
      lider_id: 3,
      nombre_lider: 'Esteban Giraldo',
      contacto_lider: '+57 316 778-9900',
      dia_semana: 'Sábado',
      hora: '15:30:00',
      hora_formato: '3:30 PM',
      barrio_zona: 'Belén / Los Molinos',
      ubicacion_aproximada: 'Sector Belén Rosales',
      descripcion: 'Adolescentes apasionados por Jesús. Juegos, música, palabra inspiradora y amigos que edifican para toda la vida.',
      cupo_maximo: 22,
      estado: 'activo'
    }
  ],
  solicitudes: [
    {
      id: 1,
      grupo_id: 1,
      grupo_nombre: 'Conexión Jóvenes: Radicados en la Roca',
      sede_nombre: 'Sede Ibagué',
      nombre_completo: 'Mateo Gómez Rodríguez',
      telefono: '+57 318 400-1122',
      email: 'mateo.gomez@gmail.com',
      mensaje: 'Hola, me mudé hace poco a Ibagué y quiero unirme a un grupo de jóvenes para congregarme.',
      estado: 'pendiente',
      notas_internas: undefined,
      created_at: new Date(Date.now() - 2 * 86400000).toISOString()
    },
    {
      id: 2,
      grupo_id: 6,
      grupo_nombre: 'Conexión Poblado Jóvenes Profesionales',
      sede_nombre: 'Sede Medellín',
      nombre_completo: 'Valentina Henao Arango',
      telefono: '+57 300 223-4455',
      email: 'valen.henao@hotmail.com',
      mensaje: 'Quiero conocer más sobre la fe y hacer amigos que amen a Jesús en Medellín.',
      estado: 'contactado',
      notas_internas: 'Contactada por Carolina Vélez vía WhatsApp el lunes.',
      created_at: new Date(Date.now() - 5 * 86400000).toISOString()
    },
    {
      id: 3,
      grupo_id: 3,
      grupo_nombre: 'Matrimonios Fuertes en Cristo',
      sede_nombre: 'Sede Ibagué',
      nombre_completo: 'Felipe y Marcela Durán',
      telefono: '+57 312 998-7766',
      email: 'familiaduran@gmail.com',
      mensaje: 'Llevamos 3 años de casados y queremos fortalecer nuestro hogar bíblicamente.',
      estado: 'integrado',
      notas_internas: 'Asistieron al grupo de matrimonios el jueves pasado.',
      created_at: new Date(Date.now() - 10 * 86400000).toISOString()
    }
  ],
  mensajes: [
    {
      id: 1,
      sede_id: 1,
      sede_nombre: 'Sede Ibagué',
      nombre_completo: 'Gloria Inés Patiño',
      email: 'gloria.patino@gmail.com',
      telefono: '+57 311 445-8899',
      asunto: 'Horario de BibliAventura',
      mensaje: 'Buenas tardes, quisiera saber si los domingos a las 10:00 AM reciben niños de 4 años en el ministerio infantil.',
      estado: 'respondido',
      created_at: new Date(Date.now() - 3 * 86400000).toISOString()
    },
    {
      id: 2,
      sede_id: 2,
      sede_nombre: 'Sede Medellín',
      nombre_completo: 'Camilo Andrés Duque',
      email: 'camiloduque@gmail.com',
      telefono: '+57 314 200-3311',
      asunto: 'Consejería Matrimonial',
      mensaje: 'Quisiera saber con qué pastor puedo agendar una cita de orientación para mi matrimonio en la sede Medellín.',
      estado: 'pendiente',
      created_at: new Date(Date.now() - 1 * 86400000).toISOString()
    }
  ],
  redes: [
    {
      id: 1,
      plataforma: 'instagram',
      nombre_mostrar: 'Instagram',
      usuario: '@tupalabraco',
      url: 'https://instagram.com/tupalabraco',
      icono: 'Instagram',
      activa: 1,
      orden: 1
    },
    {
      id: 2,
      plataforma: 'facebook',
      nombre_mostrar: 'Facebook',
      usuario: 'Iglesia Tu Palabra',
      url: 'https://facebook.com/tupalabraco',
      icono: 'Facebook',
      activa: 1,
      orden: 2
    },
    {
      id: 3,
      plataforma: 'youtube',
      nombre_mostrar: 'YouTube',
      usuario: 'Tu Palabra Oficial',
      url: 'https://youtube.com/@tupalabraoficial',
      icono: 'Youtube',
      activa: 1,
      orden: 3
    },
    {
      id: 4,
      plataforma: 'tiktok',
      nombre_mostrar: 'TikTok',
      usuario: '@tupalabraco',
      url: 'https://tiktok.com/@tupalabraco',
      icono: 'Video',
      activa: 1,
      orden: 4
    },
    {
      id: 5,
      plataforma: 'whatsapp_ibague',
      nombre_mostrar: 'WhatsApp Ibagué',
      usuario: '+57 310 845-2911',
      url: 'https://wa.me/573108452911',
      icono: 'MessageCircle',
      activa: 1,
      orden: 5
    },
    {
      id: 6,
      plataforma: 'whatsapp_medellin',
      nombre_mostrar: 'WhatsApp Medellín',
      usuario: '+57 315 720-3344',
      url: 'https://wa.me/573157203344',
      icono: 'MessageCircle',
      activa: 1,
      orden: 6
    }
  ],
  institucional: [
    {
      id: 1,
      clave: 'que_es',
      seccion: 'nosotros',
      titulo: '¿Qué es Tu Palabra?',
      subtitulo: 'No somos un edificio ni un evento: somos una familia',
      contenido: 'No somos un edificio ni un evento: somos una familia. Personas distintas, con historias distintas, que tienen algo en común: Jesús es el Señor y Salvador de sus vidas. Nos une su gracia y la obra del Espíritu Santo en nuestro corazón.\n\nY por eso nos llamamos así. Creemos que la Palabra de Dios no es un libro del pasado, sino una voz viva para hoy. «La palabra de Dios es viva y poderosa» (Hebreos 4:12). Esa Palabra nos corrige, nos consuela, nos orienta y nos transforma.',
      versiculo_referencia: 'Hebreos 4:12',
      versiculo_texto: 'Pues la palabra de Dios es viva y poderosa. Es más cortante que cualquier espada de dos filos.'
    },
    {
      id: 2,
      clave: 'que_hacemos',
      seccion: 'nosotros',
      titulo: '¿Qué hacemos?',
      subtitulo: 'Conocer la voluntad de Dios y vivir conforme a su propósito',
      contenido: 'Nos reunimos para algo muy sencillo y muy poderoso: conocer la voluntad de Dios a través de su Palabra y vivir conforme a su propósito.\n\n• Escuchamos la Palabra: en nuestros servicios, con enseñanza clara y práctica.\n• La estudiamos en comunidad: en grupos pequeños donde nadie camina solo.\n• La ponemos en práctica: porque no basta con escuchar. «No solo escuchen la palabra de Dios; tienen que ponerla en práctica» (Santiago 1:22).\n• La compartimos: con nuestras familias, amigos y ciudades.\n\nY para que cada persona encuentre su lugar, creamos espacios para cada etapa de la vida: niños, adolescentes, jóvenes, parejas, hombres y mujeres. Cada uno es un encuentro de gracia y crecimiento que edifica vidas.',
      versiculo_referencia: 'Santiago 1:22',
      versiculo_texto: 'No solo escuchen la palabra de Dios; tienen que ponerla en práctica. De lo contrario, solamente se engañan a sí mismos.'
    },
    {
      id: 3,
      clave: 'mision',
      seccion: 'nosotros',
      titulo: 'Misión',
      subtitulo: 'Ir y hacer discípulos en todo lugar',
      contenido: 'Ir y hacer discípulos en todo lugar, bautizándolos en el nombre del Padre, del Hijo y del Espíritu Santo, y enseñándoles todas las cosas que vamos aprendiendo de la Palabra de Dios.\n\nUn discípulo es alguien que sigue a Jesús, aprende de Él y ayuda a otros a hacer lo mismo. Eso hacemos: enseñar lo que la Palabra nos enseña a nosotros.',
      versiculo_referencia: 'Mateo 28:19-20',
      versiculo_texto: 'Por lo tanto, vayan y hagan discípulos de todas las naciones, bautizándolos en el nombre del Padre y del Hijo y del Espíritu Santo. Enseñen a los nuevos discípulos a obedecer todos los mandatos que les he dado.'
    },
    {
      id: 4,
      clave: 'vision',
      seccion: 'nosotros',
      titulo: 'Visión',
      subtitulo: 'Que gente de toda lengua y nación reconozca a Jesucristo',
      contenido: 'Que gente de toda lengua y nación reconozca a Jesucristo como el Hijo de Dios, como Señor y Salvador.\n\nSoñamos en grande porque el corazón de Dios es grande. Empezamos en Ibagué y Medellín, pero nuestra mirada es de todas las naciones.',
      versiculo_referencia: 'Filipenses 2:10-11',
      versiculo_texto: 'Para que ante el nombre de Jesús se doble toda rodilla... y toda lengua confiese que Jesucristo es el Señor.'
    },
    {
      id: 5,
      clave: 'enfoque',
      seccion: 'nosotros',
      titulo: 'Nuestro Enfoque',
      subtitulo: 'Herramientas para discipulado, enseñanza y restauración',
      contenido: 'Brindar herramientas para el discipulado, la enseñanza y la restauración de las personas, para que causen un impacto profundo en sus familias y en las demás áreas de su vida.\n\nQueremos que la Palabra salga de la iglesia y llegue a la mesa de la casa, al trabajo, a la universidad y a las decisiones de cada día.',
      versiculo_referencia: 'Mateo 7:24-25',
      versiculo_texto: 'Todo el que escucha mi enseñanza y la sigue es sabio, como la persona que construye su casa sobre sólida roca.'
    },
    {
      id: 6,
      clave: 'lema_grupos',
      seccion: 'grupos',
      titulo: 'Donde la Palabra se vuelve vida',
      subtitulo: 'Efesios 4:13 (NTV)',
      contenido: 'El domingo escuchas; en tu grupo de conexión lo vives. Son reuniones pequeñas donde estudiamos la Biblia, oramos unos por otros y nos acompañamos en lo cotidiano. Nuestro anhelo es que todos alcancemos tal unidad en nuestra fe y conocimiento del Hijo de Dios que seamos maduros en el Señor.',
      versiculo_referencia: 'Efesios 4:13 (NTV)',
      versiculo_texto: 'Ese proceso continuará hasta que todos alcancemos tal unidad en nuestra fe y conocimiento del Hijo de Dios que seamos maduros en el Señor, es decir, hasta que lleguemos a la plena y completa medida de Cristo.'
    }
  ]
};

// ---------------------------------------------------------------------
// Initialize Database connection or fallback
// ---------------------------------------------------------------------
export async function initDatabase(): Promise<void> {
  const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT } = process.env;

  if (DB_HOST && DB_USER && DB_NAME) {
    try {
      pool = mysql.createPool({
        host: DB_HOST,
        port: DB_PORT ? parseInt(DB_PORT, 10) : 3306,
        user: DB_USER,
        password: DB_PASSWORD || '',
        database: DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        charset: 'utf8mb4'
      });

      // Test connection
      const connection = await pool.getConnection();
      console.log(`[DB] Conectado exitosamente a MySQL en ${DB_HOST}:${DB_PORT || 3306}/${DB_NAME}`);
      connection.release();
      useMemoryStore = false;
      return;
    } catch (err: any) {
      console.warn(`[DB] No fue posible conectar a MySQL (${err.message}). Activando almacenamiento simulado en memoria con seed data.`);
      useMemoryStore = true;
    }
  } else {
    console.log('[DB] Variables de entorno de MySQL no configuradas. Usando almacén en memoria reactivo con datos de semilla.');
    useMemoryStore = true;
  }
}

export function isUsingMemoryStore(): boolean {
  return useMemoryStore;
}

export function getMemoryDB(): MemoryDB {
  return memoryDB;
}

export function getPool(): mysql.Pool | null {
  return pool;
}
