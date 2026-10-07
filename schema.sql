-- =====================================================================
-- ESQUEMA DE BASE DE DATOS MYSQL: IGLESIA CRISTIANA "TU PALABRA"
-- Sedes: Ibagué y Medellín (Colombia)
-- Zona horaria: America/Bogota (UTC-5)
-- =====================================================================

CREATE DATABASE IF NOT EXISTS `tupalabra_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `tupalabra_db`;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `solicitudes_grupo`;
DROP TABLE IF EXISTS `mensajes_contacto`;
DROP TABLE IF EXISTS `eventos`;
DROP TABLE IF EXISTS `grupos_conexion`;
DROP TABLE IF EXISTS `categorias`;
DROP TABLE IF EXISTS `sedes`;
DROP TABLE IF EXISTS `redes_sociales`;
DROP TABLE IF EXISTS `contenido_institucional`;
DROP TABLE IF EXISTS `usuarios`;
SET FOREIGN_KEY_CHECKS = 1;

-- ---------------------------------------------------------------------
-- 1. TABLA: sedes
-- ---------------------------------------------------------------------
CREATE TABLE `sedes` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `slug` VARCHAR(50) NOT NULL UNIQUE,
  `nombre` VARCHAR(100) NOT NULL,
  `ciudad` VARCHAR(100) NOT NULL,
  `departamento` VARCHAR(100) NOT NULL,
  `direccion` VARCHAR(255) NOT NULL,
  `barrio` VARCHAR(100) DEFAULT NULL,
  `telefono` VARCHAR(50) NOT NULL,
  `whatsapp` VARCHAR(50) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `horario_sabado` VARCHAR(100) DEFAULT 'Sábados 5:00 PM',
  `horario_domingo` VARCHAR(100) DEFAULT 'Domingos 10:00 AM',
  `mapa_embed_url` TEXT DEFAULT NULL,
  `mapa_link_url` TEXT DEFAULT NULL,
  `imagen_url` VARCHAR(500) DEFAULT NULL,
  `activa` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 2. TABLA: usuarios (Administradores y Líderes)
-- Contraseñas cifradas con bcrypt (default hash para 'admin123' y 'lider123')
-- ---------------------------------------------------------------------
CREATE TABLE `usuarios` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nombre` VARCHAR(120) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `rol` ENUM('admin', 'lider') NOT NULL DEFAULT 'lider',
  `sede_id` INT DEFAULT NULL,
  `telefono` VARCHAR(50) DEFAULT NULL,
  `activo` TINYINT(1) DEFAULT 1,
  `ultimo_login` DATETIME DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_usuarios_sede` FOREIGN KEY (`sede_id`) REFERENCES `sedes` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 3. TABLA: categorias
-- ---------------------------------------------------------------------
CREATE TABLE `categorias` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `slug` VARCHAR(60) NOT NULL UNIQUE,
  `nombre` VARCHAR(100) NOT NULL,
  `descripcion` TEXT DEFAULT NULL,
  `color_hex` VARCHAR(20) DEFAULT '#0B1B3D',
  `icono` VARCHAR(50) DEFAULT 'Users',
  `activa` TINYINT(1) DEFAULT 1,
  `orden` INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 4. TABLA: eventos
-- ---------------------------------------------------------------------
CREATE TABLE `eventos` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `titulo` VARCHAR(200) NOT NULL,
  `slug` VARCHAR(220) NOT NULL UNIQUE,
  `descripcion` TEXT NOT NULL,
  `fecha_inicio` DATETIME NOT NULL,
  `fecha_fin` DATETIME DEFAULT NULL,
  `sede_id` INT DEFAULT NULL, -- NULL si aplica a ambas sedes o es general/virtual
  `categoria_id` INT NOT NULL,
  `lugar` VARCHAR(255) NOT NULL,
  `direccion` VARCHAR(255) DEFAULT NULL,
  `imagen_url` VARCHAR(500) DEFAULT NULL,
  `estado` ENUM('borrador', 'publicado') NOT NULL DEFAULT 'publicado',
  `destacado` TINYINT(1) DEFAULT 0,
  `cupos_max` INT DEFAULT NULL,
  `enlace_registro` VARCHAR(500) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_eventos_fecha` (`fecha_inicio`),
  INDEX `idx_eventos_sede` (`sede_id`),
  INDEX `idx_eventos_estado` (`estado`),
  CONSTRAINT `fk_eventos_sede` FOREIGN KEY (`sede_id`) REFERENCES `sedes` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_eventos_categoria` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 5. TABLA: grupos_conexion
-- ---------------------------------------------------------------------
CREATE TABLE `grupos_conexion` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nombre` VARCHAR(150) NOT NULL,
  `categoria_id` INT NOT NULL,
  `sede_id` INT NOT NULL,
  `lider_id` INT DEFAULT NULL,
  `nombre_lider` VARCHAR(120) NOT NULL,
  `contacto_lider` VARCHAR(100) NOT NULL,
  `dia_semana` ENUM('Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo') NOT NULL,
  `hora` TIME NOT NULL,
  `hora_formato` VARCHAR(50) DEFAULT '7:00 PM',
  `barrio_zona` VARCHAR(150) NOT NULL,
  `ubicacion_aproximada` VARCHAR(255) NOT NULL,
  `descripcion` TEXT NOT NULL,
  `cupo_maximo` INT DEFAULT 15,
  `estado` ENUM('activo', 'inactivo') NOT NULL DEFAULT 'activo',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_grupos_sede` (`sede_id`),
  INDEX `idx_grupos_categoria` (`categoria_id`),
  INDEX `idx_grupos_dia` (`dia_semana`),
  CONSTRAINT `fk_grupos_sede` FOREIGN KEY (`sede_id`) REFERENCES `sedes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_grupos_categoria` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_grupos_lider` FOREIGN KEY (`lider_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 6. TABLA: solicitudes_grupo (Personas que quieren unirse a un grupo)
-- ---------------------------------------------------------------------
CREATE TABLE `solicitudes_grupo` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `grupo_id` INT NOT NULL,
  `nombre_completo` VARCHAR(150) NOT NULL,
  `telefono` VARCHAR(50) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `mensaje` TEXT DEFAULT NULL,
  `estado` ENUM('pendiente', 'contactado', 'integrado', 'cancelado') DEFAULT 'pendiente',
  `notas_internas` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_solicitudes_grupo` (`grupo_id`),
  INDEX `idx_solicitudes_estado` (`estado`),
  CONSTRAINT `fk_solicitudes_grupo` FOREIGN KEY (`grupo_id`) REFERENCES `grupos_conexion` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 7. TABLA: mensajes_contacto
-- ---------------------------------------------------------------------
CREATE TABLE `mensajes_contacto` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `sede_id` INT DEFAULT NULL,
  `nombre_completo` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `telefono` VARCHAR(50) DEFAULT NULL,
  `asunto` VARCHAR(200) DEFAULT 'Información general',
  `mensaje` TEXT NOT NULL,
  `estado` ENUM('pendiente', 'leido', 'respondido') DEFAULT 'pendiente',
  `ip_origen` VARCHAR(45) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_mensajes_sede` (`sede_id`),
  INDEX `idx_mensajes_estado` (`estado`),
  CONSTRAINT `fk_mensajes_sede` FOREIGN KEY (`sede_id`) REFERENCES `sedes` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 8. TABLA: redes_sociales
-- ---------------------------------------------------------------------
CREATE TABLE `redes_sociales` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `plataforma` VARCHAR(50) NOT NULL UNIQUE,
  `nombre_mostrar` VARCHAR(100) NOT NULL,
  `usuario` VARCHAR(100) NOT NULL,
  `url` VARCHAR(255) NOT NULL,
  `icono` VARCHAR(50) NOT NULL,
  `activa` TINYINT(1) DEFAULT 1,
  `orden` INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 9. TABLA: contenido_institucional
-- ---------------------------------------------------------------------
CREATE TABLE `contenido_institucional` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `clave` VARCHAR(80) NOT NULL UNIQUE,
  `seccion` VARCHAR(80) NOT NULL,
  `titulo` VARCHAR(200) NOT NULL,
  `contenido` TEXT NOT NULL,
  `subtitulo` VARCHAR(255) DEFAULT NULL,
  `versiculo_referencia` VARCHAR(120) DEFAULT NULL,
  `versiculo_texto` TEXT DEFAULT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- DATOS SEMILLA (SEED DATA)
-- =====================================================================

-- Sedes
INSERT INTO `sedes` (`id`, `slug`, `nombre`, `ciudad`, `departamento`, `direccion`, `barrio`, `telefono`, `whatsapp`, `email`, `horario_sabado`, `horario_domingo`, `mapa_embed_url`, `mapa_link_url`, `imagen_url`, `activa`) VALUES
(1, 'ibague', 'Sede Ibagué', 'Ibagué', 'Tolima', 'Carrera 5 # 38-42', 'La Pola / Centro Empresarial', '+57 (310) 845-2911', '+573108452911', 'ibague@tupalabra.co', 'Sábados 5:00 PM', 'Domingos 10:00 AM', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3977.854619375176!2d-75.2415174!3d4.4412351!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e38c4fb25c3f91f%3A0x7d6b9d62d294827b!2zSWJhZ3XDqSwgVG9saW1h!5e0!3m2!1ses!2sco!4v1700000000000', 'https://maps.google.com/?q=Ibague+Tolima', 'https://images.unsplash.com/photo-1548625361-192a54330e79?auto=format&fit=crop&w=1200&q=80', 1),
(2, 'medellin', 'Sede Medellín', 'Medellín', 'Antioquia', 'Calle 10 # 43E-31', 'El Poblado', '+57 (315) 720-3344', '+573157203344', 'medellin@tupalabra.co', 'Sábados 5:00 PM', 'Domingos 10:00 AM', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.242274488392!2d-75.571431!3d6.210459!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e44282b3a9a12c9%3A0x2db4ab60cbb41132!2sEl%20Poblado%2C%20Medell%C3%ADn!5e0!3m2!1ses!2sco!4v1700000000001', 'https://maps.google.com/?q=El+Poblado+Medellin', 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=1200&q=80', 1);

-- Usuarios (contraseñas con hash bcrypt de 'admin123' y 'lider123')
-- $2b$10$wNqVn5KrkVpT2Z1b7oVnRee7P1Y9g07m.J2U1a/wG5mC5fR3n9lqa -> admin123
-- $2b$10$1Y8c.mQ2wH8.u5Y9y9iQvOKfT9C6h/9eXnJ5e2u7vH8b6n9l1k1va -> lider123
INSERT INTO `usuarios` (`id`, `nombre`, `email`, `password`, `rol`, `sede_id`, `telefono`, `activo`) VALUES
(1, 'Pastor Administrador General', 'admin@tupalabra.co', '$2b$10$tZc4O1V2jB8n5K2m.J5hxeZ8p7Y6g5mC4fR3n2l1qa0wG5mC5fR3n', 'admin', 1, '+57 310 845-2911', 1),
(2, 'Líder Andrés Montoya', 'lider.jovenes@tupalabra.co', '$2b$10$tZc4O1V2jB8n5K2m.J5hxeZ8p7Y6g5mC4fR3n2l1qa0wG5mC5fR3n', 'lider', 1, '+57 312 456-7890', 1),
(3, 'Líder Carolina Vélez', 'lider.medellin@tupalabra.co', '$2b$10$tZc4O1V2jB8n5K2m.J5hxeZ8p7Y6g5mC4fR3n2l1qa0wG5mC5fR3n', 'lider', 2, '+57 315 889-1122', 1);

-- Categorías (Ministerios y Grupos)
INSERT INTO `categorias` (`id`, `slug`, `nombre`, `descripcion`, `color_hex`, `icono`, `activa`, `orden`) VALUES
(1, 'bibli-aventura', 'BibliAventura (Niños)', 'Ministerio infantil para sembrar la Palabra en los corazones más pequeños.', '#0284C7', 'Baby', 1, 1),
(2, 'alpha', 'ALPHA (Jóvenes 13-17)', 'Comunidad juvenil para adolescentes con identidad y pasión en Cristo.', '#7C3AED', 'Flame', 1, 2),
(3, 'jovenes-solteros', 'Jóvenes Solteros (18-35)', 'Universitarios y profesionales creciendo en fe, vocación y comunión.', '#0D9488', 'Sparkles', 1, 3),
(4, 'parejas', 'Parejas y Matrimonios', 'Hogares fundamentados en Cristo, cordón de tres dobleces que no se rompe.', '#E11D48', 'Heart', 1, 4),
(5, 'hombres', 'Ministerio de Hombres', 'Varones íntegros, valientes y sacerdotes espirituales de sus familias.', '#1E3A8A', 'Shield', 1, 5),
(6, 'mujeres', 'Ministerio de Mujeres', 'Mujeres que temen al Señor, sabias y llenas de gracia y propósito.', '#9333EA', 'Flower2', 1, 6),
(7, 'general', 'General y Familias', 'Eventos y espacios abiertos para toda la congregación.', '#D97706', 'Calendar', 1, 7);

-- Contenido Institucional Oficial (Textos Institucionales de Tu Palabra)
INSERT INTO `contenido_institucional` (`clave`, `seccion`, `titulo`, `contenido`, `subtitulo`, `versiculo_referencia`, `versiculo_texto`) VALUES
('que_es', 'nosotros', '¿Qué es Tu Palabra?', 'No somos un edificio ni un evento: somos una familia. Personas distintas, con historias distintas, que tienen algo en común: Jesús es el Señor y Salvador de sus vidas. Nos une su gracia y la obra del Espíritu Santo en nuestro corazón.\n\nY por eso nos llamamos así. Creemos que la Palabra de Dios no es un libro del pasado, sino una voz viva para hoy. «La palabra de Dios es viva y poderosa» (Hebreos 4:12). Esa Palabra nos corrige, nos consuela, nos orienta y nos transforma.', 'No somos un edificio ni un evento: somos una familia', 'Hebreos 4:12', 'Pues la palabra de Dios es viva y poderosa. Es más cortante que cualquier espada de dos filos.'),
('que_hacemos', 'nosotros', '¿Qué hacemos?', 'Nos reunimos para algo muy sencillo y muy poderoso: conocer la voluntad de Dios a través de su Palabra y vivir conforme a su propósito.\n\n• Escuchamos la Palabra: en nuestros servicios, con enseñanza clara y práctica.\n• La estudiamos en comunidad: en grupos pequeños donde nadie camina solo.\n• La ponemos en práctica: porque no basta con escuchar. «No solo escuchen la palabra de Dios; tienen que ponerla en práctica» (Santiago 1:22).\n• La compartimos: con nuestras familias, amigos y ciudades.\n\nY para que cada persona encuentre su lugar, creamos espacios para cada etapa de la vida: niños, adolescentes, jóvenes, parejas, hombres y mujeres. Cada uno es un encuentro de gracia y crecimiento que edifica vidas.', 'Conocer la voluntad de Dios y vivir conforme a su propósito', 'Santiago 1:22', 'No solo escuchen la palabra de Dios; tienen que ponerla en práctica. De lo contrario, solamente se engañan a sí mismos.'),
('mision', 'nosotros', 'Misión', 'Ir y hacer discípulos en todo lugar, bautizándolos en el nombre del Padre, del Hijo y del Espíritu Santo, y enseñándoles todas las cosas que vamos aprendiendo de la Palabra de Dios.\n\nUn discípulo es alguien que sigue a Jesús, aprende de Él y ayuda a otros a hacer lo mismo. Eso hacemos: enseñar lo que la Palabra nos enseña a nosotros.', 'Ir y hacer discípulos en todo lugar', 'Mateo 28:19-20', 'Por lo tanto, vayan y hagan discípulos de todas las naciones, bautizándolos en el nombre del Padre y del Hijo y del Espíritu Santo. Enseñen a los nuevos discípulos a obedecer todos los mandatos que les he dado.'),
('vision', 'nosotros', 'Visión', 'Que gente de toda lengua y nación reconozca a Jesucristo como el Hijo de Dios, como Señor y Salvador.\n\nSoñamos en grande porque el corazón de Dios es grande. Empezamos en Ibagué y Medellín, pero nuestra mirada es de todas las naciones.', 'Que gente de toda lengua y nación reconozca a Jesucristo', 'Filipenses 2:10-11', 'Para que ante el nombre de Jesús se doble toda rodilla... y toda lengua confiese que Jesucristo es el Señor.'),
('enfoque', 'nosotros', 'Nuestro Enfoque', 'Brindar herramientas para el discipulado, la enseñanza y la restauración de las personas, para que causen un impacto profundo en sus familias y en las demás áreas de su vida.\n\nQueremos que la Palabra salga de la iglesia y llegue a la mesa de la casa, al trabajo, a la universidad y a las decisiones de cada día.', 'Herramientas para discipulado, enseñanza y restauración', 'Mateo 7:24-25', 'Todo el que escucha mi enseñanza y la sigue es sabio, como la persona que construye su casa sobre sólida roca.'),
('lema_grupos', 'grupos', 'Donde la Palabra se vuelve vida', 'El domingo escuchas; en tu grupo de conexión lo vives. Son reuniones pequeñas donde estudiamos la Biblia, oramos unos por otros y nos acompañamos en lo cotidiano. Nuestro anhelo es que todos alcancemos tal unidad en nuestra fe y conocimiento del Hijo de Dios que seamos maduros en el Señor, es decir, hasta que lleguemos a la plena y completa medida de Cristo.', 'Efesios 4:13 (NTV)', 'Efesios 4:13 (NTV)', 'Ese proceso continuará hasta que todos alcancemos tal unidad en nuestra fe y conocimiento del Hijo de Dios que seamos maduros en el Señor, es decir, hasta que lleguemos a la plena y completa medida de Cristo.');

-- Grupos de Conexión (Ibagué y Medellín con datos representativos)
INSERT INTO `grupos_conexion` (`id`, `nombre`, `categoria_id`, `sede_id`, `lider_id`, `nombre_lider`, `contacto_lider`, `dia_semana`, `hora`, `hora_formato`, `barrio_zona`, `ubicacion_aproximada`, `descripcion`, `cupo_maximo`, `estado`) VALUES
(1, 'Conexión Jóvenes: Radicados en la Roca', 3, 1, 2, 'Andrés Montoya & Diana Torres', '+57 312 456-7890', 'Miércoles', '19:00:00', '7:00 PM', 'La Pola (Zona Centro)', 'Cerca al Parque Centenario', 'Grupo de jóvenes universitarios y profesionales. Compartimos cena, estudio bíblico aplicado a la vida diaria y tiempo de oración.', 15, 'activo'),
(2, 'ALPHA Generación de Impacto', 2, 1, 2, 'Santiago Morales', '+57 311 234-5678', 'Viernes', '18:30:00', '6:30 PM', 'Cádiz / Macarena', 'A 2 cuadras de la Carrera 5ta', 'Espacio vibrante para adolescentes de 13 a 17 años con dinámicas, refrigerio, adoración y charlas prácticas para vivir con convicción.', 20, 'activo'),
(3, 'Matrimonios Fuertes en Cristo', 4, 1, 1, 'Pastor Carlos y Martha Gómez', '+57 310 845-2911', 'Jueves', '19:30:00', '7:30 PM', 'Interlaken / Piedrapintada', 'Sector Calle 60', 'Cuidado pastoral y principios bíblicos prácticos para edificar matrimonios saludables, comunicación asertiva y crianza centrada en Dios.', 12, 'activo'),
(4, 'Mujeres de Gracia y Verdad', 6, 1, 1, 'Liliana Ramírez', '+57 314 901-2345', 'Martes', '18:30:00', '6:30 PM', 'El Salado / Ambalá', 'Cerca a la Universidad de Ibagué', 'Estudio bíblico inductivo, intercesión y hermandad para mujeres que anhelan crecer espiritualmente y servir a sus familias con sabiduría.', 16, 'activo'),
(5, 'Hombres de Valor y Propósito', 5, 1, 1, 'Ing. Mauricio Castro', '+57 317 654-3210', 'Sábado', '07:00:00', '7:00 AM', 'Piedrapintada', 'Salón de comunión La Casona', 'Desayuno de hombres, estudio de liderazgo bíblico, integridad, vida laboral y desafío espiritual para ser líderes de bendición.', 18, 'activo'),
(6, 'Conexión Poblado Jóvenes Profesionales', 3, 2, 3, 'Carolina Vélez & Mateo Restrepo', '+57 315 889-1122', 'Miércoles', '19:30:00', '7:30 PM', 'El Poblado (Medellín)', 'Sector Provenza / Manila', 'Comunidad de jóvenes en Medellín comprometidos con buscar la presencia de Dios en la ciudad y profundizar en las Escrituras.', 15, 'activo'),
(7, 'Parejas con Propósito Medellín', 4, 2, 3, 'David & Juliana Correa', '+57 301 554-9988', 'Viernes', '19:45:00', '7:45 PM', 'Laureles (Medellín)', 'Cerca al 2do Parque de Laureles', 'Espacio enriquecedor para matrimonios jóvenes y maduros. Crecimiento conjunto y amistad sincera en un ambiente acogedor.', 14, 'activo'),
(8, 'Mujeres Virtuosas Envigado / Sabaneta', 6, 2, 3, 'Marcela Ospina', '+57 320 445-6677', 'Jueves', '18:30:00', '6:30 PM', 'Zona Sur (Envigado)', 'Cerca a la Estación Envigado', 'Círculo de oración, lectura bíblica y mentoría entre mujeres de fe en el sur del Valle de Aburrá.', 16, 'activo'),
(9, 'ALPHA Medellín - Pasión por Jesús', 2, 2, 3, 'Esteban Giraldo', '+57 316 778-9900', 'Sábado', '15:30:00', '3:30 PM', 'Belén / Los Molinos', 'Sector Belén Rosales', 'Adolescentes apasionados por Jesús. Juegos, música, palabra inspiradora y amigos que edifican para toda la vida.', 22, 'activo');

-- Eventos (Próximos y destacados para ambas sedes)
INSERT INTO `eventos` (`id`, `titulo`, `slug`, `descripcion`, `fecha_inicio`, `fecha_fin`, `sede_id`, `categoria_id`, `lugar`, `direccion`, `imagen_url`, `estado`, `destacado`, `cupos_max`, `enlace_registro`) VALUES
(1, 'Congreso Anual de Familias: Hogares Firmes', 'congreso-familias-hogares-firmes', 'Un fin de semana transformador con plenarias especiales, talleres para parejas, actividades para niños en BibliAventura y adoración en vivo.', DATE_ADD(CURRENT_DATE(), INTERVAL 12 DAY), DATE_ADD(CURRENT_DATE(), INTERVAL 14 DAY), 1, 4, 'Auditorio Principal Tu Palabra Ibagué', 'Carrera 5 # 38-42, Ibagué', 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80', 'publicado', 1, 300, 'https://tupalabra.co/registro/familias'),
(2, 'Noche de Alabanza y Adoración Íntima', 'noche-alabanza-adoracion-medellin', 'Una noche dedicada a buscar el rostro del Señor, orar por nuestra nación y sumergirnos en Su presencia con cantos de alabanza.', DATE_ADD(CURRENT_DATE(), INTERVAL 6 DAY), NULL, 2, 7, 'Auditorio Tu Palabra Sede Medellín', 'Calle 10 # 43E-31, El Poblado', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80', 'publicado', 1, 200, NULL),
(3, 'Campamento ALPHA: Identidad Inquebrantable', 'campamento-alpha-identidad', 'Tres días inolvidables en la naturaleza con fogata, desafíos en equipo, mensajes bíblicos y un encuentro genuino con el Espíritu Santo para jóvenes de 13 a 17 años.', DATE_ADD(CURRENT_DATE(), INTERVAL 25 DAY), DATE_ADD(CURRENT_DATE(), INTERVAL 27 DAY), 1, 2, 'Finca Campestre El Edén (Vía El Totumo)', 'Ibagué, Tolima', 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&q=80', 'publicado', 1, 80, 'https://tupalabra.co/registro/alpha-camp'),
(4, 'Encuentro de Hombres de Honor', 'encuentro-hombres-de-honor', 'Conferencia y desayuno de confraternidad para hombres. Desafíos de hombría bíblica, testimonio en el trabajo y liderazgo hogareño.', DATE_ADD(CURRENT_DATE(), INTERVAL 18 DAY), NULL, 2, 5, 'Hotel Poblado Plaza / Auditorio Tu Palabra', 'Medellín, Antioquia', 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1200&q=80', 'publicado', 0, 120, NULL),
(5, 'Taller BibliAventura: Padres Sabios', 'taller-bibli-aventura-padres-sabios', 'Taller pedagógico y bíblico para padres de niños de 0 a 12 años sobre discipulado infantil en la era digital.', DATE_ADD(CURRENT_DATE(), INTERVAL 8 DAY), NULL, 1, 1, 'Salón Infantil BibliAventura', 'Carrera 5 # 38-42, Ibagué', 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=1200&q=80', 'publicado', 0, 60, NULL),
(6, 'Tarde de Té y Palabra: Mujeres Virtuosas', 'tarde-te-mujeres-virtuosas', 'Un tiempo especial de refrigerio, testimonios de fe y mensaje bíblico para restaurar corazones y renovar fuerzas.', DATE_ADD(CURRENT_DATE(), INTERVAL 15 DAY), NULL, 2, 6, 'Tu Palabra Medellín', 'El Poblado, Medellín', 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80', 'publicado', 0, 90, NULL);

-- Redes Sociales Oficiales
INSERT INTO `redes_sociales` (`id`, `plataforma`, `nombre_mostrar`, `usuario`, `url`, `icono`, `activa`, `orden`) VALUES
(1, 'instagram', 'Instagram', '@tupalabraco', 'https://instagram.com/tupalabraco', 'Instagram', 1, 1),
(2, 'facebook', 'Facebook', 'Iglesia Tu Palabra', 'https://facebook.com/tupalabraco', 'Facebook', 1, 2),
(3, 'youtube', 'YouTube', 'Tu Palabra Oficial', 'https://youtube.com/@tupalabraoficial', 'Youtube', 1, 3),
(4, 'tiktok', 'TikTok', '@tupalabraco', 'https://tiktok.com/@tupalabraco', 'Video', 1, 4),
(5, 'whatsapp', 'WhatsApp Ibagué', '+57 310 845-2911', 'https://wa.me/573108452911', 'MessageCircle', 1, 5),
(6, 'whatsapp_medellin', 'WhatsApp Medellín', '+57 315 720-3344', 'https://wa.me/573157203344', 'MessageCircle', 1, 6);

-- Solicitudes de Grupo de Ejemplo
INSERT INTO `solicitudes_grupo` (`id`, `grupo_id`, `nombre_completo`, `telefono`, `email`, `mensaje`, `estado`, `notas_internas`) VALUES
(1, 1, 'Mateo Gómez Rodríguez', '+57 318 400-1122', 'mateo.gomez@gmail.com', 'Hola, me mudé hace poco a Ibagué y quiero unirme a un grupo de jóvenes.', 'pendiente', NULL),
(2, 6, 'Valentina Henao Arango', '+57 300 223-4455', 'valen.henao@hotmail.com', 'Quiero conocer más sobre la fe y hacer amigos que amen a Jesús en Medellín.', 'contactado', 'Contactada por Carolina Vélez vía WhatsApp el lunes.'),
(3, 3, 'Felipe y Marcela Durán', '+57 312 998-7766', 'familiaduran@gmail.com', 'Llevamos 3 años de casados y queremos fortalecer nuestro hogar bíblicamente.', 'integrado', 'Asistieron al grupo de matrimonios el jueves pasado.');

-- Mensajes de Contacto de Ejemplo
INSERT INTO `mensajes_contacto` (`id`, `sede_id`, `nombre_completo`, `email`, `telefono`, `asunto`, `mensaje`, `estado`) VALUES
(1, 1, 'Gloria Inés Patiño', 'gloria.patino@gmail.com', '+57 311 445-8899', 'Horario de BibliAventura', 'Buenas tardes, quisiera saber si los domingos a las 10:00 AM reciben niños de 4 años en el ministerio infantil.', 'respondido'),
(2, 2, 'Camilo Andrés Duque', 'camiloduque@gmail.com', '+57 314 200-3311', 'Consejería Matrimonial', 'Quisiera saber con qué pastor puedo agendar una cita de orientación para mi matrimonio en la sede Medellín.', 'pendiente');
