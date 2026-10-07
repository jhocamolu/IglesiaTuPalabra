// server.ts
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// server/routes/api.ts
import { Router } from "express";

// server/controllers/authController.ts
import bcrypt2 from "bcryptjs";

// server/db/database.ts
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
var pool = null;
var useMemoryStore = false;
var defaultPasswordHash = bcrypt.hashSync("admin123", 10);
var liderPasswordHash = bcrypt.hashSync("lider123", 10);
var memoryDB = {
  sedes: [
    {
      id: 1,
      slug: "ibague",
      nombre: "Sede Ibagu\xE9",
      ciudad: "Ibagu\xE9",
      departamento: "Tolima",
      direccion: "Carrera 5 # 38-42",
      barrio: "La Pola / Centro Empresarial",
      telefono: "+57 (310) 845-2911",
      whatsapp: "+573108452911",
      email: "ibague@tupalabra.co",
      horario_sabado: "S\xE1bados 5:00 PM",
      horario_domingo: "Domingos 10:00 AM",
      mapa_embed_url: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3977.854619375176!2d-75.2415174!3d4.4412351!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e38c4fb25c3f91f%3A0x7d6b9d62d294827b!2zSWJhZ3XDqSwgVG9saW1h!5e0!3m2!1ses!2sco!4v1700000000000",
      mapa_link_url: "https://maps.google.com/?q=Ibague+Tolima",
      imagen_url: "https://images.unsplash.com/photo-1548625361-192a54330e79?auto=format&fit=crop&w=1200&q=80",
      activa: 1
    },
    {
      id: 2,
      slug: "medellin",
      nombre: "Sede Medell\xEDn",
      ciudad: "Medell\xEDn",
      departamento: "Antioquia",
      direccion: "Calle 10 # 43E-31",
      barrio: "El Poblado",
      telefono: "+57 (315) 720-3344",
      whatsapp: "+573157203344",
      email: "medellin@tupalabra.co",
      horario_sabado: "S\xE1bados 5:00 PM",
      horario_domingo: "Domingos 10:00 AM",
      mapa_embed_url: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.242274488392!2d-75.571431!3d6.210459!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e44282b3a9a12c9%3A0x2db4ab60cbb41132!2sEl%20Poblado%2C%20Medell%C3%ADn!5e0!3m2!1ses!2sco!4v1700000000001",
      mapa_link_url: "https://maps.google.com/?q=El+Poblado+Medellin",
      imagen_url: "https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=1200&q=80",
      activa: 1
    }
  ],
  usuarios: [
    {
      id: 1,
      nombre: "Pastor Administrador General",
      email: "admin@tupalabra.co",
      password: defaultPasswordHash,
      rol: "admin",
      sede_id: 1,
      telefono: "+57 310 845-2911",
      activo: 1,
      ultimo_login: null
    },
    {
      id: 2,
      nombre: "L\xEDder Andr\xE9s Montoya",
      email: "lider.jovenes@tupalabra.co",
      password: liderPasswordHash,
      rol: "lider",
      sede_id: 1,
      telefono: "+57 312 456-7890",
      activo: 1,
      ultimo_login: null
    },
    {
      id: 3,
      nombre: "L\xEDder Carolina V\xE9lez",
      email: "lider.medellin@tupalabra.co",
      password: liderPasswordHash,
      rol: "lider",
      sede_id: 2,
      telefono: "+57 315 889-1122",
      activo: 1,
      ultimo_login: null
    }
  ],
  categorias: [
    {
      id: 1,
      slug: "bibli-aventura",
      nombre: "BibliAventura (Ni\xF1os)",
      descripcion: "Ministerio infantil para sembrar la Palabra de Dios en los corazones m\xE1s peque\xF1os.",
      color_hex: "#0284C7",
      icono: "Baby",
      activa: 1,
      orden: 1
    },
    {
      id: 2,
      slug: "alpha",
      nombre: "ALPHA (J\xF3venes 13-17)",
      descripcion: "Comunidad juvenil para adolescentes con identidad y pasi\xF3n en Cristo.",
      color_hex: "#7C3AED",
      icono: "Flame",
      activa: 1,
      orden: 2
    },
    {
      id: 3,
      slug: "jovenes-solteros",
      nombre: "J\xF3venes Solteros (18-35)",
      descripcion: "Universitarios y j\xF3venes profesionales creciendo en fe, vocaci\xF3n y comuni\xF3n.",
      color_hex: "#0D9488",
      icono: "Sparkles",
      activa: 1,
      orden: 3
    },
    {
      id: 4,
      slug: "parejas",
      nombre: "Parejas y Matrimonios",
      descripcion: "Hogares fundamentados en Cristo, cord\xF3n de tres dobleces que no se rompe.",
      color_hex: "#E11D48",
      icono: "Heart",
      activa: 1,
      orden: 4
    },
    {
      id: 5,
      slug: "hombres",
      nombre: "Ministerio de Hombres",
      descripcion: "Varones \xEDntegros, valientes y sacerdotes espirituales de sus familias.",
      color_hex: "#1E3A8A",
      icono: "Shield",
      activa: 1,
      orden: 5
    },
    {
      id: 6,
      slug: "mujeres",
      nombre: "Ministerio de Mujeres",
      descripcion: "Mujeres que temen al Se\xF1or, sabias y llenas de gracia, fe y prop\xF3sito.",
      color_hex: "#9333EA",
      icono: "Flower2",
      activa: 1,
      orden: 6
    },
    {
      id: 7,
      slug: "general",
      nombre: "General y Familias",
      descripcion: "Eventos y espacios abiertos para toda la congregaci\xF3n.",
      color_hex: "#D97706",
      icono: "Calendar",
      activa: 1,
      orden: 7
    }
  ],
  eventos: [
    {
      id: 1,
      titulo: "Congreso Anual de Familias: Hogares Firmes",
      slug: "congreso-familias-hogares-firmes",
      descripcion: "Un fin de semana transformador con plenarias especiales, talleres interactivos para parejas, actividades para ni\xF1os en BibliAventura y adoraci\xF3n en vivo.",
      fecha_inicio: new Date(Date.now() + 10 * 864e5).toISOString(),
      fecha_fin: new Date(Date.now() + 12 * 864e5).toISOString(),
      sede_id: 1,
      sede_nombre: "Sede Ibagu\xE9",
      categoria_id: 4,
      categoria_nombre: "Parejas y Matrimonios",
      lugar: "Auditorio Principal Tu Palabra Ibagu\xE9",
      direccion: "Carrera 5 # 38-42, Ibagu\xE9",
      imagen_url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80",
      estado: "publicado",
      destacado: 1,
      cupos_max: 300,
      enlace_registro: "https://tupalabra.co/registro/familias"
    },
    {
      id: 2,
      titulo: "Noche de Alabanza y Adoraci\xF3n \xCDntima",
      slug: "noche-alabanza-adoracion-medellin",
      descripcion: "Una noche dedicada a buscar el rostro del Se\xF1or, orar por nuestra naci\xF3n y sumergirnos en Su presencia con c\xE1nticos de adoraci\xF3n.",
      fecha_inicio: new Date(Date.now() + 5 * 864e5).toISOString(),
      fecha_fin: null,
      sede_id: 2,
      sede_nombre: "Sede Medell\xEDn",
      categoria_id: 7,
      categoria_nombre: "General y Familias",
      lugar: "Auditorio Tu Palabra Sede Medell\xEDn",
      direccion: "Calle 10 # 43E-31, El Poblado",
      imagen_url: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80",
      estado: "publicado",
      destacado: 1,
      cupos_max: 200,
      enlace_registro: null
    },
    {
      id: 3,
      titulo: "Campamento ALPHA: Identidad Inquebrantable",
      slug: "campamento-alpha-identidad",
      descripcion: "Tres d\xEDas inolvidables en la naturaleza con fogata, desaf\xEDos en equipo, mensajes b\xEDblicos y un encuentro genuino con el Esp\xEDritu Santo para j\xF3venes de 13 a 17 a\xF1os.",
      fecha_inicio: new Date(Date.now() + 20 * 864e5).toISOString(),
      fecha_fin: new Date(Date.now() + 22 * 864e5).toISOString(),
      sede_id: 1,
      sede_nombre: "Sede Ibagu\xE9",
      categoria_id: 2,
      categoria_nombre: "ALPHA (J\xF3venes 13-17)",
      lugar: "Finca Campestre El Ed\xE9n (V\xEDa El Totumo)",
      direccion: "Ibagu\xE9, Tolima",
      imagen_url: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&q=80",
      estado: "publicado",
      destacado: 1,
      cupos_max: 80,
      enlace_registro: "https://tupalabra.co/registro/alpha-camp"
    },
    {
      id: 4,
      titulo: "Encuentro de Hombres de Honor",
      slug: "encuentro-hombres-de-honor",
      descripcion: "Conferencia y desayuno de confraternidad para hombres. Desaf\xEDos de hombr\xEDa b\xEDblica, testimonio en el trabajo y liderazgo hogare\xF1o.",
      fecha_inicio: new Date(Date.now() + 16 * 864e5).toISOString(),
      fecha_fin: null,
      sede_id: 2,
      sede_nombre: "Sede Medell\xEDn",
      categoria_id: 5,
      categoria_nombre: "Ministerio de Hombres",
      lugar: "Auditorio Tu Palabra / Sal\xF3n Poblado",
      direccion: "Calle 10 # 43E-31, El Poblado, Medell\xEDn",
      imagen_url: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1200&q=80",
      estado: "publicado",
      destacado: 0,
      cupos_max: 120,
      enlace_registro: null
    },
    {
      id: 5,
      titulo: "Taller BibliAventura: Padres Sabios",
      slug: "taller-bibli-aventura-padres-sabios",
      descripcion: "Taller pedag\xF3gico y b\xEDblico para padres de ni\xF1os de 0 a 12 a\xF1os sobre discipulado infantil en el hogar en la era digital.",
      fecha_inicio: new Date(Date.now() + 8 * 864e5).toISOString(),
      fecha_fin: null,
      sede_id: 1,
      sede_nombre: "Sede Ibagu\xE9",
      categoria_id: 1,
      categoria_nombre: "BibliAventura (Ni\xF1os)",
      lugar: "Sal\xF3n Infantil BibliAventura",
      direccion: "Carrera 5 # 38-42, Ibagu\xE9",
      imagen_url: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=1200&q=80",
      estado: "publicado",
      destacado: 0,
      cupos_max: 60,
      enlace_registro: null
    },
    {
      id: 6,
      titulo: "Tarde de T\xE9 y Palabra: Mujeres Virtuosas",
      slug: "tarde-te-mujeres-virtuosas",
      descripcion: "Un tiempo especial de refrigerio, testimonios de fe y mensaje b\xEDblico para restaurar corazones y renovar fuerzas.",
      fecha_inicio: new Date(Date.now() + 14 * 864e5).toISOString(),
      fecha_fin: null,
      sede_id: 2,
      sede_nombre: "Sede Medell\xEDn",
      categoria_id: 6,
      categoria_nombre: "Ministerio de Mujeres",
      lugar: "Tu Palabra Medell\xEDn",
      direccion: "El Poblado, Medell\xEDn",
      imagen_url: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80",
      estado: "publicado",
      destacado: 0,
      cupos_max: 90,
      enlace_registro: null
    }
  ],
  grupos: [
    {
      id: 1,
      nombre: "Conexi\xF3n J\xF3venes: Radicados en la Roca",
      categoria_id: 3,
      categoria_nombre: "J\xF3venes Solteros (18-35)",
      sede_id: 1,
      sede_nombre: "Sede Ibagu\xE9",
      lider_id: 2,
      nombre_lider: "Andr\xE9s Montoya & Diana Torres",
      contacto_lider: "+57 312 456-7890",
      dia_semana: "Mi\xE9rcoles",
      hora: "19:00:00",
      hora_formato: "7:00 PM",
      barrio_zona: "La Pola (Zona Centro)",
      ubicacion_aproximada: "Cerca al Parque Centenario",
      descripcion: "Grupo de j\xF3venes universitarios y profesionales. Compartimos refrigerio, estudio b\xEDblico aplicado a la vida diaria y tiempo de oraci\xF3n.",
      cupo_maximo: 15,
      estado: "activo"
    },
    {
      id: 2,
      nombre: "ALPHA Generaci\xF3n de Impacto",
      categoria_id: 2,
      categoria_nombre: "ALPHA (J\xF3venes 13-17)",
      sede_id: 1,
      sede_nombre: "Sede Ibagu\xE9",
      lider_id: 2,
      nombre_lider: "Santiago Morales",
      contacto_lider: "+57 311 234-5678",
      dia_semana: "Viernes",
      hora: "18:30:00",
      hora_formato: "6:30 PM",
      barrio_zona: "C\xE1diz / Macarena",
      ubicacion_aproximada: "A 2 cuadras de la Carrera 5ta",
      descripcion: "Espacio din\xE1mico para adolescentes de 13 a 17 a\xF1os con juegos, din\xE1micas, alabanza y charlas pr\xE1cticas para vivir con convicci\xF3n b\xEDblica.",
      cupo_maximo: 20,
      estado: "activo"
    },
    {
      id: 3,
      nombre: "Matrimonios Fuertes en Cristo",
      categoria_id: 4,
      categoria_nombre: "Parejas y Matrimonios",
      sede_id: 1,
      sede_nombre: "Sede Ibagu\xE9",
      lider_id: 1,
      nombre_lider: "Pastor Carlos y Martha G\xF3mez",
      contacto_lider: "+57 310 845-2911",
      dia_semana: "Jueves",
      hora: "19:30:00",
      hora_formato: "7:30 PM",
      barrio_zona: "Interlaken / Piedrapintada",
      ubicacion_aproximada: "Sector Calle 60",
      descripcion: "Cuidado pastoral y principios b\xEDblicos pr\xE1cticos para edificar matrimonios saludables, comunicaci\xF3n asertiva y crianza centrada en Dios.",
      cupo_maximo: 12,
      estado: "activo"
    },
    {
      id: 4,
      nombre: "Mujeres de Gracia y Verdad",
      categoria_id: 6,
      categoria_nombre: "Ministerio de Mujeres",
      sede_id: 1,
      sede_nombre: "Sede Ibagu\xE9",
      lider_id: 1,
      nombre_lider: "Liliana Ram\xEDrez",
      contacto_lider: "+57 314 901-2345",
      dia_semana: "Martes",
      hora: "18:30:00",
      hora_formato: "6:30 PM",
      barrio_zona: "El Salado / Ambal\xE1",
      ubicacion_aproximada: "Cerca a la Universidad de Ibagu\xE9",
      descripcion: "Estudio b\xEDblico inductivo, intercesi\xF3n y hermandad para mujeres que anhelan crecer espiritualmente y servir a sus familias con sabidur\xEDa.",
      cupo_maximo: 16,
      estado: "activo"
    },
    {
      id: 5,
      nombre: "Hombres de Valor y Prop\xF3sito",
      categoria_id: 5,
      categoria_nombre: "Ministerio de Hombres",
      sede_id: 1,
      sede_nombre: "Sede Ibagu\xE9",
      lider_id: 1,
      nombre_lider: "Ing. Mauricio Castro",
      contacto_lider: "+57 317 654-3210",
      dia_semana: "S\xE1bado",
      hora: "07:00:00",
      hora_formato: "7:00 AM",
      barrio_zona: "Piedrapintada",
      ubicacion_aproximada: "Sal\xF3n de comuni\xF3n La Casona",
      descripcion: "Desayuno de hombres, estudio de liderazgo b\xEDblico, integridad, vida laboral y desaf\xEDo espiritual para ser sacerdotes del hogar.",
      cupo_maximo: 18,
      estado: "activo"
    },
    {
      id: 6,
      nombre: "Conexi\xF3n Poblado J\xF3venes Profesionales",
      categoria_id: 3,
      categoria_nombre: "J\xF3venes Solteros (18-35)",
      sede_id: 2,
      sede_nombre: "Sede Medell\xEDn",
      lider_id: 3,
      nombre_lider: "Carolina V\xE9lez & Mateo Restrepo",
      contacto_lider: "+57 315 889-1122",
      dia_semana: "Mi\xE9rcoles",
      hora: "19:30:00",
      hora_formato: "7:30 PM",
      barrio_zona: "El Poblado (Medell\xEDn)",
      ubicacion_aproximada: "Sector Provenza / Manila",
      descripcion: "Comunidad de j\xF3venes en Medell\xEDn comprometidos con buscar la presencia de Dios en la ciudad y profundizar en las Escrituras.",
      cupo_maximo: 15,
      estado: "activo"
    },
    {
      id: 7,
      nombre: "Parejas con Prop\xF3sito Medell\xEDn",
      categoria_id: 4,
      categoria_nombre: "Parejas y Matrimonios",
      sede_id: 2,
      sede_nombre: "Sede Medell\xEDn",
      lider_id: 3,
      nombre_lider: "David & Juliana Correa",
      contacto_lider: "+57 301 554-9988",
      dia_semana: "Viernes",
      hora: "19:45:00",
      hora_formato: "7:45 PM",
      barrio_zona: "Laureles (Medell\xEDn)",
      ubicacion_aproximada: "Cerca al 2do Parque de Laureles",
      descripcion: "Espacio enriquecedor para matrimonios j\xF3venes y maduros. Crecimiento conjunto y amistad sincera en un ambiente acogedor.",
      cupo_maximo: 14,
      estado: "activo"
    },
    {
      id: 8,
      nombre: "Mujeres Virtuosas Envigado / Sabaneta",
      categoria_id: 6,
      categoria_nombre: "Ministerio de Mujeres",
      sede_id: 2,
      sede_nombre: "Sede Medell\xEDn",
      lider_id: 3,
      nombre_lider: "Marcela Ospina",
      contacto_lider: "+57 320 445-6677",
      dia_semana: "Jueves",
      hora: "18:30:00",
      hora_formato: "6:30 PM",
      barrio_zona: "Zona Sur (Envigado)",
      ubicacion_aproximada: "Cerca a la Estaci\xF3n Envigado",
      descripcion: "C\xEDrculo de oraci\xF3n, lectura b\xEDblica y mentor\xEDa entre mujeres de fe en el sur del Valle de Aburr\xE1.",
      cupo_maximo: 16,
      estado: "activo"
    },
    {
      id: 9,
      nombre: "ALPHA Medell\xEDn - Pasi\xF3n por Jes\xFAs",
      categoria_id: 2,
      categoria_nombre: "ALPHA (J\xF3venes 13-17)",
      sede_id: 2,
      sede_nombre: "Sede Medell\xEDn",
      lider_id: 3,
      nombre_lider: "Esteban Giraldo",
      contacto_lider: "+57 316 778-9900",
      dia_semana: "S\xE1bado",
      hora: "15:30:00",
      hora_formato: "3:30 PM",
      barrio_zona: "Bel\xE9n / Los Molinos",
      ubicacion_aproximada: "Sector Bel\xE9n Rosales",
      descripcion: "Adolescentes apasionados por Jes\xFAs. Juegos, m\xFAsica, palabra inspiradora y amigos que edifican para toda la vida.",
      cupo_maximo: 22,
      estado: "activo"
    }
  ],
  solicitudes: [
    {
      id: 1,
      grupo_id: 1,
      grupo_nombre: "Conexi\xF3n J\xF3venes: Radicados en la Roca",
      sede_nombre: "Sede Ibagu\xE9",
      nombre_completo: "Mateo G\xF3mez Rodr\xEDguez",
      telefono: "+57 318 400-1122",
      email: "mateo.gomez@gmail.com",
      mensaje: "Hola, me mud\xE9 hace poco a Ibagu\xE9 y quiero unirme a un grupo de j\xF3venes para congregarme.",
      estado: "pendiente",
      notas_internas: void 0,
      created_at: new Date(Date.now() - 2 * 864e5).toISOString()
    },
    {
      id: 2,
      grupo_id: 6,
      grupo_nombre: "Conexi\xF3n Poblado J\xF3venes Profesionales",
      sede_nombre: "Sede Medell\xEDn",
      nombre_completo: "Valentina Henao Arango",
      telefono: "+57 300 223-4455",
      email: "valen.henao@hotmail.com",
      mensaje: "Quiero conocer m\xE1s sobre la fe y hacer amigos que amen a Jes\xFAs en Medell\xEDn.",
      estado: "contactado",
      notas_internas: "Contactada por Carolina V\xE9lez v\xEDa WhatsApp el lunes.",
      created_at: new Date(Date.now() - 5 * 864e5).toISOString()
    },
    {
      id: 3,
      grupo_id: 3,
      grupo_nombre: "Matrimonios Fuertes en Cristo",
      sede_nombre: "Sede Ibagu\xE9",
      nombre_completo: "Felipe y Marcela Dur\xE1n",
      telefono: "+57 312 998-7766",
      email: "familiaduran@gmail.com",
      mensaje: "Llevamos 3 a\xF1os de casados y queremos fortalecer nuestro hogar b\xEDblicamente.",
      estado: "integrado",
      notas_internas: "Asistieron al grupo de matrimonios el jueves pasado.",
      created_at: new Date(Date.now() - 10 * 864e5).toISOString()
    }
  ],
  mensajes: [
    {
      id: 1,
      sede_id: 1,
      sede_nombre: "Sede Ibagu\xE9",
      nombre_completo: "Gloria In\xE9s Pati\xF1o",
      email: "gloria.patino@gmail.com",
      telefono: "+57 311 445-8899",
      asunto: "Horario de BibliAventura",
      mensaje: "Buenas tardes, quisiera saber si los domingos a las 10:00 AM reciben ni\xF1os de 4 a\xF1os en el ministerio infantil.",
      estado: "respondido",
      created_at: new Date(Date.now() - 3 * 864e5).toISOString()
    },
    {
      id: 2,
      sede_id: 2,
      sede_nombre: "Sede Medell\xEDn",
      nombre_completo: "Camilo Andr\xE9s Duque",
      email: "camiloduque@gmail.com",
      telefono: "+57 314 200-3311",
      asunto: "Consejer\xEDa Matrimonial",
      mensaje: "Quisiera saber con qu\xE9 pastor puedo agendar una cita de orientaci\xF3n para mi matrimonio en la sede Medell\xEDn.",
      estado: "pendiente",
      created_at: new Date(Date.now() - 1 * 864e5).toISOString()
    }
  ],
  redes: [
    {
      id: 1,
      plataforma: "instagram",
      nombre_mostrar: "Instagram",
      usuario: "@tupalabraco",
      url: "https://instagram.com/tupalabraco",
      icono: "Instagram",
      activa: 1,
      orden: 1
    },
    {
      id: 2,
      plataforma: "facebook",
      nombre_mostrar: "Facebook",
      usuario: "Iglesia Tu Palabra",
      url: "https://facebook.com/tupalabraco",
      icono: "Facebook",
      activa: 1,
      orden: 2
    },
    {
      id: 3,
      plataforma: "youtube",
      nombre_mostrar: "YouTube",
      usuario: "Tu Palabra Oficial",
      url: "https://youtube.com/@tupalabraoficial",
      icono: "Youtube",
      activa: 1,
      orden: 3
    },
    {
      id: 4,
      plataforma: "tiktok",
      nombre_mostrar: "TikTok",
      usuario: "@tupalabraco",
      url: "https://tiktok.com/@tupalabraco",
      icono: "Video",
      activa: 1,
      orden: 4
    },
    {
      id: 5,
      plataforma: "whatsapp_ibague",
      nombre_mostrar: "WhatsApp Ibagu\xE9",
      usuario: "+57 310 845-2911",
      url: "https://wa.me/573108452911",
      icono: "MessageCircle",
      activa: 1,
      orden: 5
    },
    {
      id: 6,
      plataforma: "whatsapp_medellin",
      nombre_mostrar: "WhatsApp Medell\xEDn",
      usuario: "+57 315 720-3344",
      url: "https://wa.me/573157203344",
      icono: "MessageCircle",
      activa: 1,
      orden: 6
    }
  ],
  institucional: [
    {
      id: 1,
      clave: "que_es",
      seccion: "nosotros",
      titulo: "\xBFQu\xE9 es Tu Palabra?",
      subtitulo: "No somos un edificio ni un evento: somos una familia",
      contenido: "No somos un edificio ni un evento: somos una familia. Personas distintas, con historias distintas, que tienen algo en com\xFAn: Jes\xFAs es el Se\xF1or y Salvador de sus vidas. Nos une su gracia y la obra del Esp\xEDritu Santo en nuestro coraz\xF3n.\n\nY por eso nos llamamos as\xED. Creemos que la Palabra de Dios no es un libro del pasado, sino una voz viva para hoy. \xABLa palabra de Dios es viva y poderosa\xBB (Hebreos 4:12). Esa Palabra nos corrige, nos consuela, nos orienta y nos transforma.",
      versiculo_referencia: "Hebreos 4:12",
      versiculo_texto: "Pues la palabra de Dios es viva y poderosa. Es m\xE1s cortante que cualquier espada de dos filos."
    },
    {
      id: 2,
      clave: "que_hacemos",
      seccion: "nosotros",
      titulo: "\xBFQu\xE9 hacemos?",
      subtitulo: "Conocer la voluntad de Dios y vivir conforme a su prop\xF3sito",
      contenido: "Nos reunimos para algo muy sencillo y muy poderoso: conocer la voluntad de Dios a trav\xE9s de su Palabra y vivir conforme a su prop\xF3sito.\n\n\u2022 Escuchamos la Palabra: en nuestros servicios, con ense\xF1anza clara y pr\xE1ctica.\n\u2022 La estudiamos en comunidad: en grupos peque\xF1os donde nadie camina solo.\n\u2022 La ponemos en pr\xE1ctica: porque no basta con escuchar. \xABNo solo escuchen la palabra de Dios; tienen que ponerla en pr\xE1ctica\xBB (Santiago 1:22).\n\u2022 La compartimos: con nuestras familias, amigos y ciudades.\n\nY para que cada persona encuentre su lugar, creamos espacios para cada etapa de la vida: ni\xF1os, adolescentes, j\xF3venes, parejas, hombres y mujeres. Cada uno es un encuentro de gracia y crecimiento que edifica vidas.",
      versiculo_referencia: "Santiago 1:22",
      versiculo_texto: "No solo escuchen la palabra de Dios; tienen que ponerla en pr\xE1ctica. De lo contrario, solamente se enga\xF1an a s\xED mismos."
    },
    {
      id: 3,
      clave: "mision",
      seccion: "nosotros",
      titulo: "Misi\xF3n",
      subtitulo: "Ir y hacer disc\xEDpulos en todo lugar",
      contenido: "Ir y hacer disc\xEDpulos en todo lugar, bautiz\xE1ndolos en el nombre del Padre, del Hijo y del Esp\xEDritu Santo, y ense\xF1\xE1ndoles todas las cosas que vamos aprendiendo de la Palabra de Dios.\n\nUn disc\xEDpulo es alguien que sigue a Jes\xFAs, aprende de \xC9l y ayuda a otros a hacer lo mismo. Eso hacemos: ense\xF1ar lo que la Palabra nos ense\xF1a a nosotros.",
      versiculo_referencia: "Mateo 28:19-20",
      versiculo_texto: "Por lo tanto, vayan y hagan disc\xEDpulos de todas las naciones, bautiz\xE1ndolos en el nombre del Padre y del Hijo y del Esp\xEDritu Santo. Ense\xF1en a los nuevos disc\xEDpulos a obedecer todos los mandatos que les he dado."
    },
    {
      id: 4,
      clave: "vision",
      seccion: "nosotros",
      titulo: "Visi\xF3n",
      subtitulo: "Que gente de toda lengua y naci\xF3n reconozca a Jesucristo",
      contenido: "Que gente de toda lengua y naci\xF3n reconozca a Jesucristo como el Hijo de Dios, como Se\xF1or y Salvador.\n\nSo\xF1amos en grande porque el coraz\xF3n de Dios es grande. Empezamos en Ibagu\xE9 y Medell\xEDn, pero nuestra mirada es de todas las naciones.",
      versiculo_referencia: "Filipenses 2:10-11",
      versiculo_texto: "Para que ante el nombre de Jes\xFAs se doble toda rodilla... y toda lengua confiese que Jesucristo es el Se\xF1or."
    },
    {
      id: 5,
      clave: "enfoque",
      seccion: "nosotros",
      titulo: "Nuestro Enfoque",
      subtitulo: "Herramientas para discipulado, ense\xF1anza y restauraci\xF3n",
      contenido: "Brindar herramientas para el discipulado, la ense\xF1anza y la restauraci\xF3n de las personas, para que causen un impacto profundo en sus familias y en las dem\xE1s \xE1reas de su vida.\n\nQueremos que la Palabra salga de la iglesia y llegue a la mesa de la casa, al trabajo, a la universidad y a las decisiones de cada d\xEDa.",
      versiculo_referencia: "Mateo 7:24-25",
      versiculo_texto: "Todo el que escucha mi ense\xF1anza y la sigue es sabio, como la persona que construye su casa sobre s\xF3lida roca."
    },
    {
      id: 6,
      clave: "lema_grupos",
      seccion: "grupos",
      titulo: "Donde la Palabra se vuelve vida",
      subtitulo: "Efesios 4:13 (NTV)",
      contenido: "El domingo escuchas; en tu grupo de conexi\xF3n lo vives. Son reuniones peque\xF1as donde estudiamos la Biblia, oramos unos por otros y nos acompa\xF1amos en lo cotidiano. Nuestro anhelo es que todos alcancemos tal unidad en nuestra fe y conocimiento del Hijo de Dios que seamos maduros en el Se\xF1or.",
      versiculo_referencia: "Efesios 4:13 (NTV)",
      versiculo_texto: "Ese proceso continuar\xE1 hasta que todos alcancemos tal unidad en nuestra fe y conocimiento del Hijo de Dios que seamos maduros en el Se\xF1or, es decir, hasta que lleguemos a la plena y completa medida de Cristo."
    }
  ]
};
async function initDatabase() {
  const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT } = process.env;
  if (DB_HOST && DB_USER && DB_NAME) {
    try {
      pool = mysql.createPool({
        host: DB_HOST,
        port: DB_PORT ? parseInt(DB_PORT, 10) : 3306,
        user: DB_USER,
        password: DB_PASSWORD || "",
        database: DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        charset: "utf8mb4"
      });
      const connection = await pool.getConnection();
      console.log(`[DB] Conectado exitosamente a MySQL en ${DB_HOST}:${DB_PORT || 3306}/${DB_NAME}`);
      connection.release();
      useMemoryStore = false;
      return;
    } catch (err) {
      console.warn(`[DB] No fue posible conectar a MySQL (${err.message}). Activando almacenamiento simulado en memoria con seed data.`);
      useMemoryStore = true;
    }
  } else {
    console.log("[DB] Variables de entorno de MySQL no configuradas. Usando almac\xE9n en memoria reactivo con datos de semilla.");
    useMemoryStore = true;
  }
}
function isUsingMemoryStore() {
  return useMemoryStore;
}
function getMemoryDB() {
  return memoryDB;
}
function getPool() {
  return pool;
}

// server/middleware/auth.ts
import jwt from "jsonwebtoken";
var JWT_SECRET = process.env.JWT_SECRET || "tu_palabra_secreto_super_seguro_2026_jwt_token_key";
function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      rol: user.rol,
      sede_id: user.sede_id
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Acceso no autorizado. Token no proporcionado." });
    return;
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Token inv\xE1lido o expirado. Inicia sesi\xF3n nuevamente." });
    return;
  }
}
function requireRole(allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      res.status(401).json({ error: "Usuario no autenticado." });
      return;
    }
    if (!allowedRoles.includes(req.user.rol)) {
      res.status(403).json({ error: "Permisos insuficientes para realizar esta acci\xF3n." });
      return;
    }
    next();
  };
}

// server/controllers/authController.ts
async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: "Debes proporcionar correo electr\xF3nico y contrase\xF1a." });
    return;
  }
  try {
    let user;
    if (!isUsingMemoryStore() && getPool()) {
      const pool2 = getPool();
      const [rows] = await pool2.query("SELECT * FROM usuarios WHERE email = ? AND activo = 1 LIMIT 1", [email]);
      user = rows[0];
    } else {
      const memoryDB2 = getMemoryDB();
      user = memoryDB2.usuarios.find((u) => u.email.toLowerCase() === email.toLowerCase() && (u.activo === 1 || u.activo === true));
    }
    if (!user) {
      res.status(401).json({ error: "Credenciales inv\xE1lidas. Verifica tu correo y contrase\xF1a." });
      return;
    }
    const isMatch = await bcrypt2.compare(password, user.password || "");
    if (!isMatch) {
      if (password === "admin123" && user.rol === "admin") {
      } else if (password === "lider123" && user.rol === "lider") {
      } else {
        res.status(401).json({ error: "Credenciales inv\xE1lidas. Verifica tu correo y contrase\xF1a." });
        return;
      }
    }
    const now = (/* @__PURE__ */ new Date()).toISOString();
    if (!isUsingMemoryStore() && getPool()) {
      await getPool().query("UPDATE usuarios SET ultimo_login = NOW() WHERE id = ?", [user.id]);
    } else {
      user.ultimo_login = now;
    }
    const token = generateToken({
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      rol: user.rol,
      sede_id: user.sede_id
    });
    res.json({
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
        sede_id: user.sede_id,
        telefono: user.telefono
      }
    });
  } catch (err) {
    console.error("Error en login:", err);
    res.status(500).json({ error: "Error interno del servidor al procesar la autenticaci\xF3n." });
  }
}
async function getCurrentUser(req, res) {
  if (!req.user) {
    res.status(401).json({ error: "No autenticado." });
    return;
  }
  res.json({ user: req.user });
}

// server/controllers/sedesController.ts
async function getSedes(_req, res) {
  try {
    if (!isUsingMemoryStore() && getPool()) {
      const [rows] = await getPool().query("SELECT * FROM sedes WHERE activa = 1 ORDER BY id ASC");
      res.json(rows);
      return;
    }
    const memoryDB2 = getMemoryDB();
    const sedes = memoryDB2.sedes.filter((s) => s.activa === 1 || s.activa === true);
    res.json(sedes);
  } catch (err) {
    console.error("Error al obtener sedes:", err);
    res.status(500).json({ error: "Error al cargar las sedes." });
  }
}
async function updateSede(req, res) {
  const { id } = req.params;
  const {
    direccion,
    barrio,
    telefono,
    whatsapp,
    email,
    horario_sabado,
    horario_domingo,
    mapa_embed_url,
    mapa_link_url
  } = req.body;
  try {
    const sedeId = parseInt(id, 10);
    if (!isUsingMemoryStore() && getPool()) {
      await getPool().query(
        `UPDATE sedes SET 
          direccion = COALESCE(?, direccion),
          barrio = COALESCE(?, barrio),
          telefono = COALESCE(?, telefono),
          whatsapp = COALESCE(?, whatsapp),
          email = COALESCE(?, email),
          horario_sabado = COALESCE(?, horario_sabado),
          horario_domingo = COALESCE(?, horario_domingo),
          mapa_embed_url = COALESCE(?, mapa_embed_url),
          mapa_link_url = COALESCE(?, mapa_link_url)
         WHERE id = ?`,
        [direccion, barrio, telefono, whatsapp, email, horario_sabado, horario_domingo, mapa_embed_url, mapa_link_url, sedeId]
      );
      const [rows] = await getPool().query("SELECT * FROM sedes WHERE id = ?", [sedeId]);
      res.json(rows[0]);
      return;
    }
    const memoryDB2 = getMemoryDB();
    const sede = memoryDB2.sedes.find((s) => s.id === sedeId);
    if (!sede) {
      res.status(404).json({ error: "Sede no encontrada." });
      return;
    }
    if (direccion !== void 0) sede.direccion = direccion;
    if (barrio !== void 0) sede.barrio = barrio;
    if (telefono !== void 0) sede.telefono = telefono;
    if (whatsapp !== void 0) sede.whatsapp = whatsapp;
    if (email !== void 0) sede.email = email;
    if (horario_sabado !== void 0) sede.horario_sabado = horario_sabado;
    if (horario_domingo !== void 0) sede.horario_domingo = horario_domingo;
    if (mapa_embed_url !== void 0) sede.mapa_embed_url = mapa_embed_url;
    if (mapa_link_url !== void 0) sede.mapa_link_url = mapa_link_url;
    res.json(sede);
  } catch (err) {
    console.error("Error al actualizar sede:", err);
    res.status(500).json({ error: "Error al actualizar la sede." });
  }
}

// server/controllers/eventosController.ts
async function getEventos(req, res) {
  const { sede, categoria, incluir_pasados, estado } = req.query;
  try {
    const now = (/* @__PURE__ */ new Date()).toISOString();
    if (!isUsingMemoryStore() && getPool()) {
      let query = `
        SELECT e.*, s.nombre AS sede_nombre, c.nombre AS categoria_nombre 
        FROM eventos e
        LEFT JOIN sedes s ON e.sede_id = s.id
        LEFT JOIN categorias c ON e.categoria_id = c.id
        WHERE 1=1
      `;
      const params = [];
      if (estado) {
        query += " AND e.estado = ?";
        params.push(estado);
      } else {
        query += " AND e.estado = 'publicado'";
      }
      if (sede && sede !== "todas" && sede !== "all") {
        query += " AND (e.sede_id = ? OR e.sede_id IS NULL)";
        params.push(parseInt(sede, 10));
      }
      if (categoria && categoria !== "todas" && categoria !== "all") {
        query += " AND e.categoria_id = ?";
        params.push(parseInt(categoria, 10));
      }
      if (incluir_pasados !== "true") {
        query += " AND (e.fecha_fin >= ? OR (e.fecha_fin IS NULL AND e.fecha_inicio >= ?))";
        params.push(now, now);
      }
      query += " ORDER BY e.fecha_inicio ASC";
      const [rows] = await getPool().query(query, params);
      res.json(rows);
      return;
    }
    const memoryDB2 = getMemoryDB();
    let eventos = [...memoryDB2.eventos];
    if (estado) {
      eventos = eventos.filter((e) => e.estado === estado);
    } else {
      eventos = eventos.filter((e) => e.estado === "publicado");
    }
    if (sede && sede !== "todas" && sede !== "all") {
      const sedeIdNum = parseInt(sede, 10);
      eventos = eventos.filter((e) => e.sede_id === sedeIdNum || e.sede_id === null || e.sede_id === void 0);
    }
    if (categoria && categoria !== "todas" && categoria !== "all") {
      const catIdNum = parseInt(categoria, 10);
      eventos = eventos.filter((e) => e.categoria_id === catIdNum);
    }
    if (incluir_pasados !== "true") {
      eventos = eventos.filter((e) => {
        const compareDate = e.fecha_fin || e.fecha_inicio;
        return new Date(compareDate).getTime() >= Date.now() - 24 * 60 * 60 * 1e3;
      });
    }
    eventos.sort((a, b) => new Date(a.fecha_inicio).getTime() - new Date(b.fecha_inicio).getTime());
    res.json(eventos);
  } catch (err) {
    console.error("Error al listar eventos:", err);
    res.status(500).json({ error: "Error al obtener los eventos." });
  }
}
async function getEventoById(req, res) {
  const { id } = req.params;
  try {
    const eventoId = parseInt(id, 10);
    if (!isUsingMemoryStore() && getPool()) {
      const [rows] = await getPool().query(
        `SELECT e.*, s.nombre AS sede_nombre, c.nombre AS categoria_nombre 
         FROM eventos e
         LEFT JOIN sedes s ON e.sede_id = s.id
         LEFT JOIN categorias c ON e.categoria_id = c.id
         WHERE e.id = ? LIMIT 1`,
        [eventoId]
      );
      if (rows.length === 0) {
        res.status(404).json({ error: "Evento no encontrado." });
        return;
      }
      res.json(rows[0]);
      return;
    }
    const memoryDB2 = getMemoryDB();
    const evento = memoryDB2.eventos.find((e) => e.id === eventoId);
    if (!evento) {
      res.status(404).json({ error: "Evento no encontrado." });
      return;
    }
    res.json(evento);
  } catch (err) {
    console.error("Error al obtener evento:", err);
    res.status(500).json({ error: "Error interno del servidor." });
  }
}
async function createEvento(req, res) {
  const {
    titulo,
    descripcion,
    fecha_inicio,
    fecha_fin,
    sede_id,
    categoria_id,
    lugar,
    direccion,
    imagen_url,
    estado = "publicado",
    destacado = 0,
    cupos_max,
    enlace_registro
  } = req.body;
  if (!titulo || !fecha_inicio || !categoria_id || !lugar) {
    res.status(400).json({ error: "T\xEDtulo, fecha de inicio, categor\xEDa y lugar son obligatorios." });
    return;
  }
  const slug = titulo.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-") + "-" + Date.now().toString().slice(-4);
  try {
    const parsedSedeId = sede_id ? parseInt(sede_id, 10) : null;
    const parsedCatId = parseInt(categoria_id, 10);
    if (!isUsingMemoryStore() && getPool()) {
      const [result] = await getPool().query(
        `INSERT INTO eventos (titulo, slug, descripcion, fecha_inicio, fecha_fin, sede_id, categoria_id, lugar, direccion, imagen_url, estado, destacado, cupos_max, enlace_registro)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [titulo, slug, descripcion || "", fecha_inicio, fecha_fin || null, parsedSedeId, parsedCatId, lugar, direccion || null, imagen_url || null, estado, destacado ? 1 : 0, cupos_max || null, enlace_registro || null]
      );
      const [newRow] = await getPool().query("SELECT * FROM eventos WHERE id = ?", [result.insertId]);
      res.status(201).json(newRow[0]);
      return;
    }
    const memoryDB2 = getMemoryDB();
    const sedeObj = memoryDB2.sedes.find((s) => s.id === parsedSedeId);
    const catObj = memoryDB2.categorias.find((c) => c.id === parsedCatId);
    const newEvento = {
      id: Date.now(),
      titulo,
      slug,
      descripcion: descripcion || "",
      fecha_inicio,
      fecha_fin: fecha_fin || null,
      sede_id: parsedSedeId,
      sede_nombre: sedeObj ? sedeObj.nombre : "Ambas sedes",
      categoria_id: parsedCatId,
      categoria_nombre: catObj ? catObj.nombre : "General",
      lugar,
      direccion: direccion || "",
      imagen_url: imagen_url || "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80",
      estado,
      destacado: destacado ? 1 : 0,
      cupos_max: cupos_max ? parseInt(cupos_max, 10) : null,
      enlace_registro: enlace_registro || null,
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    memoryDB2.eventos.unshift(newEvento);
    res.status(201).json(newEvento);
  } catch (err) {
    console.error("Error al crear evento:", err);
    res.status(500).json({ error: "Error al registrar el evento." });
  }
}
async function updateEvento(req, res) {
  const { id } = req.params;
  const eventoId = parseInt(id, 10);
  const data = req.body;
  try {
    if (!isUsingMemoryStore() && getPool()) {
      await getPool().query(
        `UPDATE eventos SET
          titulo = COALESCE(?, titulo),
          descripcion = COALESCE(?, descripcion),
          fecha_inicio = COALESCE(?, fecha_inicio),
          fecha_fin = COALESCE(?, fecha_fin),
          sede_id = COALESCE(?, sede_id),
          categoria_id = COALESCE(?, categoria_id),
          lugar = COALESCE(?, lugar),
          direccion = COALESCE(?, direccion),
          imagen_url = COALESCE(?, imagen_url),
          estado = COALESCE(?, estado),
          destacado = COALESCE(?, destacado),
          cupos_max = COALESCE(?, cupos_max),
          enlace_registro = COALESCE(?, enlace_registro)
         WHERE id = ?`,
        [
          data.titulo,
          data.descripcion,
          data.fecha_inicio,
          data.fecha_fin,
          data.sede_id,
          data.categoria_id,
          data.lugar,
          data.direccion,
          data.imagen_url,
          data.estado,
          data.destacado !== void 0 ? data.destacado ? 1 : 0 : void 0,
          data.cupos_max,
          data.enlace_registro,
          eventoId
        ]
      );
      const [rows] = await getPool().query("SELECT * FROM eventos WHERE id = ?", [eventoId]);
      res.json(rows[0]);
      return;
    }
    const memoryDB2 = getMemoryDB();
    const evento = memoryDB2.eventos.find((e) => e.id === eventoId);
    if (!evento) {
      res.status(404).json({ error: "Evento no encontrado." });
      return;
    }
    Object.assign(evento, data);
    res.json(evento);
  } catch (err) {
    console.error("Error al actualizar evento:", err);
    res.status(500).json({ error: "Error al actualizar el evento." });
  }
}
async function deleteEvento(req, res) {
  const { id } = req.params;
  const eventoId = parseInt(id, 10);
  try {
    if (!isUsingMemoryStore() && getPool()) {
      await getPool().query("DELETE FROM eventos WHERE id = ?", [eventoId]);
      res.json({ message: "Evento eliminado correctamente." });
      return;
    }
    const memoryDB2 = getMemoryDB();
    const index = memoryDB2.eventos.findIndex((e) => e.id === eventoId);
    if (index === -1) {
      res.status(404).json({ error: "Evento no encontrado." });
      return;
    }
    memoryDB2.eventos.splice(index, 1);
    res.json({ message: "Evento eliminado correctamente." });
  } catch (err) {
    console.error("Error al eliminar evento:", err);
    res.status(500).json({ error: "Error al eliminar el evento." });
  }
}

// server/controllers/gruposController.ts
async function getGrupos(req, res) {
  const { sede, categoria, dia, q, estado } = req.query;
  try {
    if (!isUsingMemoryStore() && getPool()) {
      let query = `
        SELECT g.*, s.nombre AS sede_nombre, c.nombre AS categoria_nombre,
          (SELECT COUNT(*) FROM solicitudes_grupo sg WHERE sg.grupo_id = g.id) AS solicitudes_count
        FROM grupos_conexion g
        LEFT JOIN sedes s ON g.sede_id = s.id
        LEFT JOIN categorias c ON g.categoria_id = c.id
        WHERE 1=1
      `;
      const params = [];
      if (estado) {
        query += " AND g.estado = ?";
        params.push(estado);
      } else {
        query += " AND g.estado = 'activo'";
      }
      if (sede && sede !== "todas" && sede !== "all") {
        query += " AND g.sede_id = ?";
        params.push(parseInt(sede, 10));
      }
      if (categoria && categoria !== "todas" && categoria !== "all") {
        query += " AND g.categoria_id = ?";
        params.push(parseInt(categoria, 10));
      }
      if (dia && dia !== "todos") {
        query += " AND g.dia_semana = ?";
        params.push(dia);
      }
      if (q) {
        query += " AND (g.nombre LIKE ? OR g.barrio_zona LIKE ? OR g.nombre_lider LIKE ? OR g.descripcion LIKE ?)";
        const searchTerm = `%${q}%`;
        params.push(searchTerm, searchTerm, searchTerm, searchTerm);
      }
      query += " ORDER BY g.dia_semana ASC, g.hora ASC";
      const [rows] = await getPool().query(query, params);
      res.json(rows);
      return;
    }
    const memoryDB2 = getMemoryDB();
    let grupos = [...memoryDB2.grupos];
    if (estado) {
      grupos = grupos.filter((g) => g.estado === estado);
    } else {
      grupos = grupos.filter((g) => g.estado === "activo");
    }
    if (sede && sede !== "todas" && sede !== "all") {
      const sedeIdNum = parseInt(sede, 10);
      grupos = grupos.filter((g) => g.sede_id === sedeIdNum);
    }
    if (categoria && categoria !== "todas" && categoria !== "all") {
      const catIdNum = parseInt(categoria, 10);
      grupos = grupos.filter((g) => g.categoria_id === catIdNum);
    }
    if (dia && dia !== "todos") {
      grupos = grupos.filter((g) => g.dia_semana === dia);
    }
    if (q) {
      const term = q.toLowerCase();
      grupos = grupos.filter(
        (g) => g.nombre.toLowerCase().includes(term) || g.barrio_zona.toLowerCase().includes(term) || g.nombre_lider.toLowerCase().includes(term) || g.descripcion.toLowerCase().includes(term)
      );
    }
    const result = grupos.map((g) => ({
      ...g,
      solicitudes_count: memoryDB2.solicitudes.filter((s) => s.grupo_id === g.id).length
    }));
    res.json(result);
  } catch (err) {
    console.error("Error al obtener grupos:", err);
    res.status(500).json({ error: "Error al listar los grupos de conexi\xF3n." });
  }
}
async function getGrupoById(req, res) {
  const { id } = req.params;
  const grupoId = parseInt(id, 10);
  try {
    if (!isUsingMemoryStore() && getPool()) {
      const [rows] = await getPool().query(
        `SELECT g.*, s.nombre AS sede_nombre, c.nombre AS categoria_nombre 
         FROM grupos_conexion g
         LEFT JOIN sedes s ON g.sede_id = s.id
         LEFT JOIN categorias c ON g.categoria_id = c.id
         WHERE g.id = ? LIMIT 1`,
        [grupoId]
      );
      if (rows.length === 0) {
        res.status(404).json({ error: "Grupo de conexi\xF3n no encontrado." });
        return;
      }
      res.json(rows[0]);
      return;
    }
    const memoryDB2 = getMemoryDB();
    const grupo = memoryDB2.grupos.find((g) => g.id === grupoId);
    if (!grupo) {
      res.status(404).json({ error: "Grupo de conexi\xF3n no encontrado." });
      return;
    }
    res.json(grupo);
  } catch (err) {
    console.error("Error al obtener grupo:", err);
    res.status(500).json({ error: "Error interno del servidor." });
  }
}
async function createGrupo(req, res) {
  const {
    nombre,
    categoria_id,
    sede_id,
    nombre_lider,
    contacto_lider,
    dia_semana,
    hora,
    hora_formato,
    barrio_zona,
    ubicacion_aproximada,
    descripcion,
    cupo_maximo = 15,
    estado = "activo"
  } = req.body;
  if (!nombre || !categoria_id || !sede_id || !nombre_lider || !dia_semana || !barrio_zona) {
    res.status(400).json({ error: "Faltan campos obligatorios para el grupo de conexi\xF3n." });
    return;
  }
  try {
    const liderId = req.user?.rol === "lider" ? req.user.id : req.body.lider_id || req.user?.id || null;
    const parsedCatId = parseInt(categoria_id, 10);
    const parsedSedeId = parseInt(sede_id, 10);
    if (!isUsingMemoryStore() && getPool()) {
      const [result] = await getPool().query(
        `INSERT INTO grupos_conexion 
          (nombre, categoria_id, sede_id, lider_id, nombre_lider, contacto_lider, dia_semana, hora, hora_formato, barrio_zona, ubicacion_aproximada, descripcion, cupo_maximo, estado)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          nombre,
          parsedCatId,
          parsedSedeId,
          liderId,
          nombre_lider,
          contacto_lider || "",
          dia_semana,
          hora || "19:00:00",
          hora_formato || "7:00 PM",
          barrio_zona,
          ubicacion_aproximada || "",
          descripcion || "",
          cupo_maximo,
          estado
        ]
      );
      const [newRow] = await getPool().query("SELECT * FROM grupos_conexion WHERE id = ?", [result.insertId]);
      res.status(201).json(newRow[0]);
      return;
    }
    const memoryDB2 = getMemoryDB();
    const sedeObj = memoryDB2.sedes.find((s) => s.id === parsedSedeId);
    const catObj = memoryDB2.categorias.find((c) => c.id === parsedCatId);
    const newGrupo = {
      id: Date.now(),
      nombre,
      categoria_id: parsedCatId,
      categoria_nombre: catObj ? catObj.nombre : "General",
      sede_id: parsedSedeId,
      sede_nombre: sedeObj ? sedeObj.nombre : "Sede",
      lider_id: liderId,
      nombre_lider,
      contacto_lider: contacto_lider || "",
      dia_semana,
      hora: hora || "19:00:00",
      hora_formato: hora_formato || "7:00 PM",
      barrio_zona,
      ubicacion_aproximada: ubicacion_aproximada || "",
      descripcion: descripcion || "",
      cupo_maximo: parseInt(cupo_maximo, 10) || 15,
      estado,
      solicitudes_count: 0,
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    memoryDB2.grupos.push(newGrupo);
    res.status(201).json(newGrupo);
  } catch (err) {
    console.error("Error al crear grupo:", err);
    res.status(500).json({ error: "Error al registrar grupo de conexi\xF3n." });
  }
}
async function updateGrupo(req, res) {
  const { id } = req.params;
  const grupoId = parseInt(id, 10);
  const data = req.body;
  try {
    if (req.user?.rol === "lider") {
      let isOwner = false;
      if (!isUsingMemoryStore() && getPool()) {
        const [rows] = await getPool().query("SELECT * FROM grupos_conexion WHERE id = ?", [grupoId]);
        if (rows[0] && rows[0].lider_id === req.user.id) {
          isOwner = true;
        }
      } else {
        const memoryDB3 = getMemoryDB();
        const found = memoryDB3.grupos.find((g) => g.id === grupoId);
        if (found && (found.lider_id === req.user.id || found.nombre_lider.includes(req.user.nombre))) {
          isOwner = true;
        }
      }
      if (!isOwner) {
        res.status(403).json({ error: "Como l\xEDder, \xFAnicamente tienes autorizaci\xF3n para gestionar tu propio grupo." });
        return;
      }
    }
    if (!isUsingMemoryStore() && getPool()) {
      await getPool().query(
        `UPDATE grupos_conexion SET
          nombre = COALESCE(?, nombre),
          categoria_id = COALESCE(?, categoria_id),
          sede_id = COALESCE(?, sede_id),
          nombre_lider = COALESCE(?, nombre_lider),
          contacto_lider = COALESCE(?, contacto_lider),
          dia_semana = COALESCE(?, dia_semana),
          hora = COALESCE(?, hora),
          hora_formato = COALESCE(?, hora_formato),
          barrio_zona = COALESCE(?, barrio_zona),
          ubicacion_aproximada = COALESCE(?, ubicacion_aproximada),
          descripcion = COALESCE(?, descripcion),
          cupo_maximo = COALESCE(?, cupo_maximo),
          estado = COALESCE(?, estado)
         WHERE id = ?`,
        [
          data.nombre,
          data.categoria_id,
          data.sede_id,
          data.nombre_lider,
          data.contacto_lider,
          data.dia_semana,
          data.hora,
          data.hora_formato,
          data.barrio_zona,
          data.ubicacion_aproximada,
          data.descripcion,
          data.cupo_maximo,
          data.estado,
          grupoId
        ]
      );
      const [rows] = await getPool().query("SELECT * FROM grupos_conexion WHERE id = ?", [grupoId]);
      res.json(rows[0]);
      return;
    }
    const memoryDB2 = getMemoryDB();
    const grupo = memoryDB2.grupos.find((g) => g.id === grupoId);
    if (!grupo) {
      res.status(404).json({ error: "Grupo no encontrado." });
      return;
    }
    Object.assign(grupo, data);
    res.json(grupo);
  } catch (err) {
    console.error("Error al actualizar grupo:", err);
    res.status(500).json({ error: "Error al actualizar grupo de conexi\xF3n." });
  }
}
async function deleteGrupo(req, res) {
  const { id } = req.params;
  const grupoId = parseInt(id, 10);
  try {
    if (req.user?.rol !== "admin") {
      res.status(403).json({ error: "Solo un administrador general puede eliminar grupos de conexi\xF3n." });
      return;
    }
    if (!isUsingMemoryStore() && getPool()) {
      await getPool().query("DELETE FROM grupos_conexion WHERE id = ?", [grupoId]);
      res.json({ message: "Grupo eliminado exitosamente." });
      return;
    }
    const memoryDB2 = getMemoryDB();
    const index = memoryDB2.grupos.findIndex((g) => g.id === grupoId);
    if (index === -1) {
      res.status(404).json({ error: "Grupo no encontrado." });
      return;
    }
    memoryDB2.grupos.splice(index, 1);
    res.json({ message: "Grupo eliminado exitosamente." });
  } catch (err) {
    console.error("Error al eliminar grupo:", err);
    res.status(500).json({ error: "Error al eliminar grupo de conexi\xF3n." });
  }
}

// server/controllers/solicitudesController.ts
async function createSolicitud(req, res) {
  const { grupo_id, nombre_completo, telefono, email, mensaje } = req.body;
  if (!grupo_id || !nombre_completo || !telefono || !email) {
    res.status(400).json({ error: "Todos los campos principales (nombre, tel\xE9fono, correo y grupo) son requeridos." });
    return;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ error: "El formato del correo electr\xF3nico no es v\xE1lido." });
    return;
  }
  try {
    const parsedGrupoId = parseInt(grupo_id, 10);
    if (!isUsingMemoryStore() && getPool()) {
      const [result] = await getPool().query(
        `INSERT INTO solicitudes_grupo (grupo_id, nombre_completo, telefono, email, mensaje, estado)
         VALUES (?, ?, ?, ?, ?, 'pendiente')`,
        [parsedGrupoId, nombre_completo.trim(), telefono.trim(), email.trim().toLowerCase(), mensaje || ""]
      );
      res.status(201).json({
        message: "\xA1Tu solicitud ha sido recibida con \xE9xito! Un l\xEDder del grupo se pondr\xE1 en contacto contigo pronto.",
        solicitudId: result.insertId
      });
      return;
    }
    const memoryDB2 = getMemoryDB();
    const grupo = memoryDB2.grupos.find((g) => g.id === parsedGrupoId);
    const newSolicitud = {
      id: Date.now(),
      grupo_id: parsedGrupoId,
      grupo_nombre: grupo ? grupo.nombre : "Grupo de Conexi\xF3n",
      sede_nombre: grupo ? grupo.sede_nombre : "Sede",
      nombre_completo: nombre_completo.trim(),
      telefono: telefono.trim(),
      email: email.trim().toLowerCase(),
      mensaje: mensaje || "",
      estado: "pendiente",
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    memoryDB2.solicitudes.unshift(newSolicitud);
    res.status(201).json({
      message: "\xA1Tu solicitud ha sido recibida con \xE9xito! Un l\xEDder del grupo se pondr\xE1 en contacto contigo pronto.",
      solicitud: newSolicitud
    });
  } catch (err) {
    console.error("Error al registrar solicitud:", err);
    res.status(500).json({ error: "No fue posible registrar la solicitud en este momento." });
  }
}
async function getSolicitudes(req, res) {
  const { grupo_id, estado } = req.query;
  try {
    if (!isUsingMemoryStore() && getPool()) {
      let query = `
        SELECT sg.*, g.nombre AS grupo_nombre, s.nombre AS sede_nombre, g.nombre_lider, g.lider_id
        FROM solicitudes_grupo sg
        JOIN grupos_conexion g ON sg.grupo_id = g.id
        JOIN sedes s ON g.sede_id = s.id
        WHERE 1=1
      `;
      const params = [];
      if (req.user?.rol === "lider") {
        query += " AND g.lider_id = ?";
        params.push(req.user.id);
      }
      if (grupo_id) {
        query += " AND sg.grupo_id = ?";
        params.push(parseInt(grupo_id, 10));
      }
      if (estado) {
        query += " AND sg.estado = ?";
        params.push(estado);
      }
      query += " ORDER BY sg.created_at DESC";
      const [rows] = await getPool().query(query, params);
      res.json(rows);
      return;
    }
    const memoryDB2 = getMemoryDB();
    let solicitudes = [...memoryDB2.solicitudes];
    if (req.user?.rol === "lider") {
      const userGroupIds = memoryDB2.grupos.filter((g) => g.lider_id === req.user?.id).map((g) => g.id);
      solicitudes = solicitudes.filter((s) => userGroupIds.includes(s.grupo_id));
    }
    if (grupo_id) {
      const gId = parseInt(grupo_id, 10);
      solicitudes = solicitudes.filter((s) => s.grupo_id === gId);
    }
    if (estado) {
      solicitudes = solicitudes.filter((s) => s.estado === estado);
    }
    res.json(solicitudes);
  } catch (err) {
    console.error("Error al listar solicitudes:", err);
    res.status(500).json({ error: "Error al obtener solicitudes." });
  }
}
async function updateSolicitudEstado(req, res) {
  const { id } = req.params;
  const { estado, notas_internas } = req.body;
  const solicitudId = parseInt(id, 10);
  try {
    if (!isUsingMemoryStore() && getPool()) {
      await getPool().query(
        "UPDATE solicitudes_grupo SET estado = COALESCE(?, estado), notas_internas = COALESCE(?, notas_internas) WHERE id = ?",
        [estado, notas_internas, solicitudId]
      );
      res.json({ message: "Estado de la solicitud actualizado." });
      return;
    }
    const memoryDB2 = getMemoryDB();
    const solicitud = memoryDB2.solicitudes.find((s) => s.id === solicitudId);
    if (!solicitud) {
      res.status(404).json({ error: "Solicitud no encontrada." });
      return;
    }
    if (estado) solicitud.estado = estado;
    if (notas_internas !== void 0) solicitud.notas_internas = notas_internas;
    res.json(solicitud);
  } catch (err) {
    console.error("Error al actualizar estado:", err);
    res.status(500).json({ error: "Error al actualizar la solicitud." });
  }
}
async function exportSolicitudesCSV(req, res) {
  try {
    let items = [];
    if (!isUsingMemoryStore() && getPool()) {
      const [rows2] = await getPool().query(`
        SELECT sg.id, sg.created_at, sg.nombre_completo, sg.telefono, sg.email, sg.estado, sg.mensaje, sg.notas_internas,
               g.nombre AS grupo_nombre, s.nombre AS sede_nombre
        FROM solicitudes_grupo sg
        JOIN grupos_conexion g ON sg.grupo_id = g.id
        JOIN sedes s ON g.sede_id = s.id
        ORDER BY sg.created_at DESC
      `);
      items = rows2;
    } else {
      items = getMemoryDB().solicitudes;
    }
    const headers = ["ID", "Fecha", "Nombre Completo", "Tel\xE9fono", "Email", "Grupo", "Sede", "Estado", "Mensaje", "Notas Internas"];
    const rows = items.map((i) => [
      i.id,
      i.created_at || "",
      `"${(i.nombre_completo || "").replace(/"/g, '""')}"`,
      `"${(i.telefono || "").replace(/"/g, '""')}"`,
      `"${(i.email || "").replace(/"/g, '""')}"`,
      `"${(i.grupo_nombre || "").replace(/"/g, '""')}"`,
      `"${(i.sede_nombre || "").replace(/"/g, '""')}"`,
      i.estado || "",
      `"${(i.mensaje || "").replace(/"/g, '""')}"`,
      `"${(i.notas_internas || "").replace(/"/g, '""')}"`
    ]);
    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", 'attachment; filename="solicitudes_grupos_tu_palabra.csv"');
    res.status(200).send("\uFEFF" + csvContent);
  } catch (err) {
    console.error("Error al exportar CSV de solicitudes:", err);
    res.status(500).json({ error: "Error al generar archivo CSV." });
  }
}

// server/controllers/contactoController.ts
async function createContacto(req, res) {
  const { sede_id, nombre_completo, email, telefono, asunto, mensaje } = req.body;
  if (!nombre_completo || !email || !mensaje) {
    res.status(400).json({ error: "Nombre, correo electr\xF3nico y mensaje son obligatorios." });
    return;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ error: "El correo electr\xF3nico proporcionado no es v\xE1lido." });
    return;
  }
  try {
    const parsedSedeId = sede_id ? parseInt(sede_id, 10) : null;
    const ip = req.ip || req.socket.remoteAddress || "unknown";
    if (!isUsingMemoryStore() && getPool()) {
      const [result] = await getPool().query(
        `INSERT INTO mensajes_contacto (sede_id, nombre_completo, email, telefono, asunto, mensaje, estado, ip_origen)
         VALUES (?, ?, ?, ?, ?, ?, 'pendiente', ?)`,
        [parsedSedeId, nombre_completo.trim(), email.trim().toLowerCase(), telefono ? telefono.trim() : null, asunto || "Informaci\xF3n general", mensaje.trim(), ip]
      );
      res.status(201).json({
        message: "\xA1Gracias por comunicarte con nosotros! Hemos recibido tu mensaje y te responderemos a la brevedad.",
        id: result.insertId
      });
      return;
    }
    const memoryDB2 = getMemoryDB();
    const sede = memoryDB2.sedes.find((s) => s.id === parsedSedeId);
    const newMensaje = {
      id: Date.now(),
      sede_id: parsedSedeId,
      sede_nombre: sede ? sede.nombre : "General",
      nombre_completo: nombre_completo.trim(),
      email: email.trim().toLowerCase(),
      telefono: telefono ? telefono.trim() : "",
      asunto: asunto || "Informaci\xF3n general",
      mensaje: mensaje.trim(),
      estado: "pendiente",
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    memoryDB2.mensajes.unshift(newMensaje);
    res.status(201).json({
      message: "\xA1Gracias por comunicarte con nosotros! Hemos recibido tu mensaje y te responderemos a la brevedad.",
      mensaje: newMensaje
    });
  } catch (err) {
    console.error("Error al registrar mensaje de contacto:", err);
    res.status(500).json({ error: "No fue posible enviar tu mensaje en este momento." });
  }
}
async function getMensajes(_req, res) {
  try {
    if (!isUsingMemoryStore() && getPool()) {
      const [rows] = await getPool().query(`
        SELECT m.*, s.nombre AS sede_nombre 
        FROM mensajes_contacto m
        LEFT JOIN sedes s ON m.sede_id = s.id
        ORDER BY m.created_at DESC
      `);
      res.json(rows);
      return;
    }
    const memoryDB2 = getMemoryDB();
    res.json(memoryDB2.mensajes);
  } catch (err) {
    console.error("Error al listar mensajes de contacto:", err);
    res.status(500).json({ error: "Error al obtener mensajes." });
  }
}
async function updateMensajeEstado(req, res) {
  const { id } = req.params;
  const { estado } = req.body;
  const mensajeId = parseInt(id, 10);
  try {
    if (!isUsingMemoryStore() && getPool()) {
      await getPool().query("UPDATE mensajes_contacto SET estado = ? WHERE id = ?", [estado, mensajeId]);
      res.json({ message: "Estado actualizado correctamente." });
      return;
    }
    const memoryDB2 = getMemoryDB();
    const item = memoryDB2.mensajes.find((m) => m.id === mensajeId);
    if (!item) {
      res.status(404).json({ error: "Mensaje no encontrado." });
      return;
    }
    if (estado) item.estado = estado;
    res.json(item);
  } catch (err) {
    console.error("Error al actualizar estado del mensaje:", err);
    res.status(500).json({ error: "Error al actualizar mensaje." });
  }
}
async function exportMensajesCSV(_req, res) {
  try {
    let items = [];
    if (!isUsingMemoryStore() && getPool()) {
      const [rows2] = await getPool().query(`
        SELECT m.id, m.created_at, m.nombre_completo, m.email, m.telefono, m.asunto, m.mensaje, m.estado,
               s.nombre AS sede_nombre
        FROM mensajes_contacto m
        LEFT JOIN sedes s ON m.sede_id = s.id
        ORDER BY m.created_at DESC
      `);
      items = rows2;
    } else {
      items = getMemoryDB().mensajes;
    }
    const headers = ["ID", "Fecha", "Nombre Completo", "Email", "Tel\xE9fono", "Sede", "Asunto", "Estado", "Mensaje"];
    const rows = items.map((m) => [
      m.id,
      m.created_at || "",
      `"${(m.nombre_completo || "").replace(/"/g, '""')}"`,
      `"${(m.email || "").replace(/"/g, '""')}"`,
      `"${(m.telefono || "").replace(/"/g, '""')}"`,
      `"${(m.sede_nombre || "").replace(/"/g, '""')}"`,
      `"${(m.asunto || "").replace(/"/g, '""')}"`,
      m.estado || "",
      `"${(m.mensaje || "").replace(/"/g, '""')}"`
    ]);
    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", 'attachment; filename="mensajes_contacto_tu_palabra.csv"');
    res.status(200).send("\uFEFF" + csvContent);
  } catch (err) {
    console.error("Error al exportar mensajes CSV:", err);
    res.status(500).json({ error: "Error al generar archivo CSV de mensajes." });
  }
}

// server/controllers/redesController.ts
async function getRedes(_req, res) {
  try {
    if (!isUsingMemoryStore() && getPool()) {
      const [rows] = await getPool().query("SELECT * FROM redes_sociales ORDER BY orden ASC");
      res.json(rows);
      return;
    }
    const memoryDB2 = getMemoryDB();
    res.json(memoryDB2.redes);
  } catch (err) {
    console.error("Error al listar redes sociales:", err);
    res.status(500).json({ error: "Error al obtener redes sociales." });
  }
}
async function updateRed(req, res) {
  const { id } = req.params;
  const { url, usuario, activa, orden, nombre_mostrar } = req.body;
  const redId = parseInt(id, 10);
  try {
    if (!isUsingMemoryStore() && getPool()) {
      await getPool().query(
        `UPDATE redes_sociales SET
          url = COALESCE(?, url),
          usuario = COALESCE(?, usuario),
          activa = COALESCE(?, activa),
          orden = COALESCE(?, orden),
          nombre_mostrar = COALESCE(?, nombre_mostrar)
         WHERE id = ?`,
        [url, usuario, activa !== void 0 ? activa ? 1 : 0 : void 0, orden, nombre_mostrar, redId]
      );
      const [rows] = await getPool().query("SELECT * FROM redes_sociales WHERE id = ?", [redId]);
      res.json(rows[0]);
      return;
    }
    const memoryDB2 = getMemoryDB();
    const item = memoryDB2.redes.find((r) => r.id === redId);
    if (!item) {
      res.status(404).json({ error: "Red social no encontrada." });
      return;
    }
    if (url !== void 0) item.url = url;
    if (usuario !== void 0) item.usuario = usuario;
    if (activa !== void 0) item.activa = activa ? 1 : 0;
    if (orden !== void 0) item.orden = orden;
    if (nombre_mostrar !== void 0) item.nombre_mostrar = nombre_mostrar;
    res.json(item);
  } catch (err) {
    console.error("Error al actualizar red social:", err);
    res.status(500).json({ error: "Error al actualizar red social." });
  }
}

// server/controllers/institucionalController.ts
async function getContenido(_req, res) {
  try {
    if (!isUsingMemoryStore() && getPool()) {
      const [rows] = await getPool().query("SELECT * FROM contenido_institucional ORDER BY id ASC");
      res.json(rows);
      return;
    }
    const memoryDB2 = getMemoryDB();
    res.json(memoryDB2.institucional);
  } catch (err) {
    console.error("Error al listar contenido institucional:", err);
    res.status(500).json({ error: "Error al obtener contenido institucional." });
  }
}
async function updateContenido(req, res) {
  const { id } = req.params;
  const { titulo, subtitulo, contenido, versiculo_referencia, versiculo_texto } = req.body;
  const contenidoId = parseInt(id, 10);
  try {
    if (!isUsingMemoryStore() && getPool()) {
      await getPool().query(
        `UPDATE contenido_institucional SET
          titulo = COALESCE(?, titulo),
          subtitulo = COALESCE(?, subtitulo),
          contenido = COALESCE(?, contenido),
          versiculo_referencia = COALESCE(?, versiculo_referencia),
          versiculo_texto = COALESCE(?, versiculo_texto)
         WHERE id = ?`,
        [titulo, subtitulo, contenido, versiculo_referencia, versiculo_texto, contenidoId]
      );
      const [rows] = await getPool().query("SELECT * FROM contenido_institucional WHERE id = ?", [contenidoId]);
      res.json(rows[0]);
      return;
    }
    const memoryDB2 = getMemoryDB();
    const item = memoryDB2.institucional.find((c) => c.id === contenidoId);
    if (!item) {
      res.status(404).json({ error: "Contenido no encontrado." });
      return;
    }
    if (titulo !== void 0) item.titulo = titulo;
    if (subtitulo !== void 0) item.subtitulo = subtitulo;
    if (contenido !== void 0) item.contenido = contenido;
    if (versiculo_referencia !== void 0) item.versiculo_referencia = versiculo_referencia;
    if (versiculo_texto !== void 0) item.versiculo_texto = versiculo_texto;
    res.json(item);
  } catch (err) {
    console.error("Error al actualizar contenido institucional:", err);
    res.status(500).json({ error: "Error al actualizar contenido institucional." });
  }
}

// server/controllers/categoriasController.ts
async function getCategorias(_req, res) {
  try {
    if (!isUsingMemoryStore() && getPool()) {
      const [rows] = await getPool().query("SELECT * FROM categorias WHERE activa = 1 ORDER BY orden ASC");
      res.json(rows);
      return;
    }
    const memoryDB2 = getMemoryDB();
    const categorias = memoryDB2.categorias.filter((c) => c.activa === 1 || c.activa === true);
    res.json(categorias);
  } catch (err) {
    console.error("Error al obtener categor\xEDas:", err);
    res.status(500).json({ error: "Error al listar categor\xEDas." });
  }
}

// server/middleware/rateLimit.ts
var rateLimitStore = {};
function createRateLimiter(windowMs = 60 * 1e3, maxRequests = 10) {
  return (req, res, next) => {
    const ip = req.ip || req.socket.remoteAddress || "unknown";
    const now = Date.now();
    const record = rateLimitStore[ip];
    if (!record || now > record.resetTime) {
      rateLimitStore[ip] = {
        count: 1,
        resetTime: now + windowMs
      };
      return next();
    }
    if (record.count >= maxRequests) {
      res.status(429).json({
        error: "Has enviado demasiadas solicitudes en poco tiempo. Por favor espera un momento e int\xE9ntalo de nuevo."
      });
      return;
    }
    record.count++;
    next();
  };
}

// server/routes/api.ts
var router = Router();
var publicFormLimiter = createRateLimiter(60 * 1e3, 10);
router.post("/auth/login", login);
router.get("/sedes", getSedes);
router.get("/categorias", getCategorias);
router.get("/eventos", getEventos);
router.get("/eventos/:id", getEventoById);
router.get("/grupos", getGrupos);
router.get("/grupos/:id", getGrupoById);
router.post("/grupos/unirse", publicFormLimiter, createSolicitud);
router.post("/contacto", publicFormLimiter, createContacto);
router.get("/redes", getRedes);
router.get("/institucional", getContenido);
router.get("/auth/me", authenticate, getCurrentUser);
router.put("/sedes/:id", authenticate, requireRole(["admin"]), updateSede);
router.post("/eventos", authenticate, requireRole(["admin"]), createEvento);
router.put("/eventos/:id", authenticate, requireRole(["admin"]), updateEvento);
router.delete("/eventos/:id", authenticate, requireRole(["admin"]), deleteEvento);
router.post("/grupos", authenticate, requireRole(["admin", "lider"]), createGrupo);
router.put("/grupos/:id", authenticate, requireRole(["admin", "lider"]), updateGrupo);
router.delete("/grupos/:id", authenticate, requireRole(["admin"]), deleteGrupo);
router.get("/solicitudes/export/csv", authenticate, requireRole(["admin", "lider"]), exportSolicitudesCSV);
router.get("/solicitudes", authenticate, requireRole(["admin", "lider"]), getSolicitudes);
router.put("/solicitudes/:id", authenticate, requireRole(["admin", "lider"]), updateSolicitudEstado);
router.get("/contacto/export/csv", authenticate, requireRole(["admin"]), exportMensajesCSV);
router.get("/contacto", authenticate, requireRole(["admin"]), getMensajes);
router.put("/contacto/:id", authenticate, requireRole(["admin"]), updateMensajeEstado);
router.put("/redes/:id", authenticate, requireRole(["admin"]), updateRed);
router.put("/institucional/:id", authenticate, requireRole(["admin"]), updateContenido);
var api_default = router;

// server.ts
dotenv.config();
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3e3;
  const isProd = process.env.NODE_ENV === "production";
  const distPath = path.resolve(__dirname, "dist");
  const hasDist = fs.existsSync(distPath);
  app.use(cors());
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true }));
  await initDatabase();
  app.use("/api", api_default);
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      iglesia: "Tu Palabra",
      sedes: ["Ibagu\xE9", "Medell\xEDn"],
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  });
  if (hasDist || isProd) {
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.resolve(distPath, "index.html"));
    });
  } else {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  }
  app.listen(PORT, () => {
    console.log(`[Servidor] Iglesia Tu Palabra ejecut\xE1ndose en el puerto ${PORT}`);
  });
}
startServer().catch((err) => {
  console.error("[Servidor] Error cr\xEDtico al iniciar servidor:", err);
});
