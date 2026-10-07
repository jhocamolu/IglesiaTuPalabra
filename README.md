# Iglesia Cristiana "Tu Palabra" — Ibagué y Medellín (Colombia)

Plataforma web full-stack, landing page interactiva y panel administrativo integral para la iglesia cristiana **"Tu Palabra"**, con presencia en las ciudades de Ibagué (Tolima) y Medellín (Antioquia), Colombia.

---

## 📁 Árbol de Carpetas del Proyecto

```text
├── .env.example                 # Plantilla de variables de entorno (MySQL, JWT, puerto)
├── .gitignore                   # Exclusiones de Git
├── index.html                   # Entry point HTML con SEO, OpenGraph y fuentes Google Fonts
├── metadata.json                # Metadatos del applet en Google AI Studio
├── package.json                 # Dependencias y scripts de ejecución
├── README.md                    # Documentación paso a paso y arquitectura
├── schema.sql                   # Esquema completo de MySQL con tablas, índices, FK y datos seed
├── server.ts                    # Entry point del servidor Node.js + Express con Vite middleware
├── tsconfig.json                # Configuración de TypeScript
├── vite.config.ts               # Configuración de Vite con Tailwind CSS
│
├── server/                      # ARQUITECTURA DEL BACK-END
│   ├── controllers/             # Controladores desacoplados por entidad
│   │   ├── authController.ts          # Autenticación JWT y hash bcrypt
│   │   ├── categoriasController.ts    # Listado de categorías/ministerios
│   │   ├── contactoController.ts      # Mensajes públicos y exportación CSV
│   │   ├── eventosController.ts       # CRUD de eventos y filtros por sede/fecha
│   │   ├── gruposController.ts        # CRUD de grupos de conexión y permisos por rol
│   │   ├── institucionalController.ts # Edición de Misión, Visión y Enfoque
│   │   ├── redesController.ts         # Enlaces a redes sociales y visibilidad
│   │   ├── sedesController.ts         # Gestión de horarios, direcciones y mapas
│   │   └── solicitudesController.ts   # Solicitudes de unión a grupos y exportación CSV
│   ├── db/
│   │   └── database.ts          # Conexión MySQL con mysql2 y fallback resiliente en memoria
│   ├── middleware/
│   │   ├── auth.ts              # Verificación de JWT y roles ('admin' y 'lider')
│   │   └── rateLimit.ts         # Rate limiter en formularios públicos contra spam
│   ├── routes/
│   │   └── api.ts               # Router REST centralizado (/api/*)
│   └── types/
│       └── index.ts             # Tipos e interfaces de TypeScript del servidor
│
└── src/                         # ARQUITECTURA DEL FRONT-END
    ├── components/              # Componentes de UI modulares y accesibles
    │   ├── AboutSection.tsx     # ¿Qué es?, ¿Qué hacemos?, Misión, Visión y Enfoque (pestañas)
    │   ├── ContactForm.tsx      # Formulario de contacto y peticiones con validación
    │   ├── EventDetailModal.tsx # Modal de detalle de evento con compartir en WhatsApp
    │   ├── EventsSection.tsx    # Listado y cronograma de eventos (oculta pasados automáticamente)
    │   ├── Footer.tsx           # Pie de página con enlaces rápidos, sedes y horarios
    │   ├── GroupsSection.tsx    # Catálogo de grupos con filtros y lema Efesios 4:13
    │   ├── Hero.tsx             # Encabezado principal con horarios (Sáb 5 PM / Dom 10 AM)
    │   ├── JoinGroupModal.tsx   # Modal de solicitud para unirse a un grupo de conexión
    │   ├── MinistriesSection.tsx# 6 ministerios por etapas con versículos bíblicos oficiales
    │   ├── Navbar.tsx           # Menú sticky con selector de sede (Todas / Ibagué / Medellín)
    │   ├── SocialSection.tsx    # Redes sociales oficiales (YouTube, IG, TikTok, FB, WA)
    │   ├── VisitSection.tsx     # Direcciones, horarios y mapas de Ibagué y Medellín
    │   └── WhatsAppFloating.tsx # Botón flotante interactivo para chatear por sede
    ├── context/
    │   ├── AuthContext.tsx      # Estado de autenticación JWT del usuario
    │   └── LocationContext.tsx  # Estado global de sede seleccionada (Ibagué / Medellín / Todas)
    ├── pages/
    │   ├── AdminDashboard.tsx   # Panel administrativo completo con roles y exportación CSV
    │   ├── AdminLoginPage.tsx   # Pantalla de login para administradores y líderes
    │   └── HomePage.tsx         # Landing page pública unificada
    ├── services/
    │   ├── api.ts               # Cliente API HTTP con tolerancia a fallos y fallback
    │   └── mockData.ts          # Datos mock enriquecidos con textos doctrinales oficiales
    ├── types/
    │   └── index.ts             # Modelos de datos del cliente
    ├── index.css                # Estilos globales con Tailwind CSS y tipografía elegante
    └── main.tsx                 # Montaje de React 19
```

---

## 🗄️ Esquema de Base de Datos MySQL (`schema.sql`)

El archivo `schema.sql` incluye las 9 tablas mínimas requeridas, relaciones con claves foráneas, índices de optimización en fechas y sedes, y un juego completo de datos semilla (seed):

1. **`sedes`**: Sedes de Ibagué y Medellín con direcciones, teléfonos, horarios (Sábados 5:00 PM y Domingos 10:00 AM) y enlaces a mapas.
2. **`usuarios`**: Administradores (`admin`) y líderes (`lider`) con contraseñas cifradas en **bcrypt**.
3. **`categorias`**: Los ministerios (BibliAventura, ALPHA, Jóvenes Solteros, Parejas, Hombres, Mujeres, General).
4. **`eventos`**: Calendario de eventos con filtros por sede, categoría, imagen, estado (borrador/publicado) y destacado. Índice en `fecha_inicio`.
5. **`grupos_conexion`**: Grupos semanales en hogares de Ibagué y Medellín con líder, contacto, día, hora, barrio/zona, ubicación y cupo.
6. **`solicitudes_grupo`**: Registros de personas que llenaron el formulario "Quiero unirme" con estados (*pendiente*, *contactado*, *integrado*, *cancelado*).
7. **`mensajes_contacto`**: Mensajes y peticiones de oración enviados desde la landing page con estados (*pendiente*, *leido*, *respondido*).
8. **`redes_sociales`**: Plataformas oficiales (Instagram, Facebook, YouTube, TikTok, WhatsApp) con visibilidad editable desde el panel.
9. **`contenido_institucional`**: Textos oficiales de ¿Qué es Tu Palabra?, ¿Qué hacemos?, Misión, Visión y Enfoque, editables sin tocar código.

---

## 🚀 Instrucciones de Instalación y Ejecución

### 1. Clonar el repositorio e instalar dependencias
```bash
git clone <url-del-repositorio>
cd tupalabra-app
npm install
```

### 2. Configurar variables de entorno
Copia el archivo `.env.example` a `.env`:
```bash
cp .env.example .env
```
Edita `.env` con tus credenciales de MySQL (opcional, si no configuras MySQL, el sistema activará automáticamente su motor de almacenamiento en memoria con todos los datos precargados):
```env
PORT=3000
NODE_ENV=development
JWT_SECRET=tu_palabra_secreto_super_seguro_2026_jwt_token_key

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=tupalabra_db
```

### 3. Importar la Base de Datos en MySQL (si usas servidor MySQL)
```bash
mysql -u root -p < schema.sql
```

### 4. Iniciar en Modo Desarrollo
```bash
npm run dev
```
La aplicación se ejecutará en **`http://localhost:3000`** con Express y Vite conectados.

### 5. Compilar para Producción
```bash
npm run build
npm start
```

---

## 🔐 Credenciales del Panel Administrativo (`/admin`)

El panel cuenta con dos niveles de acceso basados en roles:

| Rol | Correo | Contraseña | Permisos |
|---|---|---|---|
| **Administrador General** | `admin@tupalabra.co` | `admin123` | Control total: CRUD eventos, grupos, sedes, redes, textos y exportar CSV. |
| **Líder de Jóvenes** | `lider.jovenes@tupalabra.co` | `lider123` | Gestiona su propio grupo de conexión y ve sus solicitudes de aspirantes. |
| **Líder Medellín** | `lider.medellin@tupalabra.co` | `lider123` | Gestiona su propio grupo en Medellín y sus solicitudes correspondientes. |

*(En la pantalla de inicio de sesión `/admin/login` hay botones de acceso rápido con 1 solo clic para pruebas inmediatas).*

---

## ✨ Características Destacadas

- **Selector de Sede Dinámico**: Filtra de manera reactiva en el menú principal entre *Todas las Sedes*, *Sede Ibagué* y *Sede Medellín*, sincronizando eventos, grupos, direcciones y horarios.
- **Textos Oficiales Respetados**: Misión, Visión, Enfoque y versículos lema (incluyendo Efesios 4:13 NTV y Proverbios 22:6) tomados directamente de la doctrina institucional.
- **Exportación a CSV**: Descarga en un clic con codificación UTF-8 compatible con Microsoft Excel y Google Sheets de solicitudes a grupos y mensajes de contacto.
- **Filtro Automático de Eventos Pasados**: Los eventos cuya fecha ya transcurrió se ocultan automáticamente del catálogo público.
- **Botón Flotante de WhatsApp**: Permite a cualquier visitante elegir chatear directamente con el WhatsApp oficial de Ibagué o Medellín.
- **Resiliencia 100%**: Si el servidor MySQL no está iniciado o configurado, la aplicación funciona de forma transparente utilizando un motor en memoria con los mismos datos semilla de `schema.sql`.
