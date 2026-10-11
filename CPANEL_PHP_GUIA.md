# 🐘 GUÍA DEFINITIVA DE DESPLIEGUE EN CPANEL CON PHP 8.1
### Iglesia Cristiana "Tu Palabra" — Sedes Ibagué y Medellín

> **¿Por qué PHP 8.1 en lugar de Node.js en cPanel?**  
> En la mayoría de hostings compartidos con cPanel, Node.js requiere permisos especiales de terminal, módulos de CloudLinux / Phusion Passenger que suelen fallar o bloquear puertos.  
> **PHP 8.1 con Apache/LiteSpeed y MySQL es el entorno nativo de cPanel**: no requiere comandos SSH, no requiere `npm install` en el servidor, no consume procesos en segundo plano y funciona al instante sin fallas.

---

## 📁 Estructura del Proyecto Listo para cPanel

Al compilar el proyecto (`npm run build`), se genera la carpeta **`dist/`** con todo lo necesario para subir directamente a tu carpeta **`public_html`** de cPanel:

```text
public_html/
│
├── .htaccess             <- Configura URLs amigables de React Router y enruta /api/* a PHP
├── index.html            <- Frontend de la Iglesia Tu Palabra
├── assets/               <- Archivos compilados JS y CSS
├── images/               <- Logos oficiales (logo-azul.svg, logo-blanco.svg, etc.)
│
└── api/                  <- BACKEND REST COMPLETO EN PHP 8.1
    ├── .htaccess         <- Control de rutas y seguridad del API
    ├── index.php         <- Enrutador REST principal (Auth, Sedes, Eventos, Grupos, Contacto)
    ├── config.php        <- Credenciales de MySQL y JWT
    ├── db.php            <- Conexión PDO con tolerancia a fallos y fallback inteligente
    ├── jwt.php           <- Motor de autenticación JWT (HS256 nativo sin Composer)
    └── data/
        └── store.json    <- Base de datos local precargada con datos oficiales
```

---

## 🚀 PASO A PASO: Despliegue en 3 Minutos

### PASO 1: Subir los Archivos a cPanel
1. En tu computadora, ejecuta:
   ```bash
   npm run build
   ```
2. Entra a la carpeta **`dist/`**.
3. Selecciona todos los archivos y carpetas dentro de `dist/` (asegúrate de incluir los archivos ocultos `.htaccess` tanto en la raíz como dentro de `dist/api/`).
4. Comprímelos en un archivo `.zip` (ejemplo: `tupalabra_web.zip`).
5. Entra a tu **cPanel** > **Administrador de Archivos** (*File Manager*).
6. Entra a la carpeta **`public_html`**.
7. Haz clic en **Cargar** (*Upload*) y sube tu archivo `.zip`.
8. Haz clic derecho sobre el `.zip` y selecciona **Extraer** (*Extract*).
9. ¡Listo! Los archivos ya están en el servidor web.

---

### PASO 2: Crear la Base de Datos en cPanel
1. En cPanel, busca y abre **"Bases de datos MySQL"** (o *"Asistente de bases de datos MySQL"*).
2. Crea una nueva base de datos, por ejemplo: `usuario_tupalabra`.
3. En la misma pantalla, crea un usuario MySQL:
   - Nombre de usuario: ej. `usuario_db`
   - Contraseña: una clave segura (guárdala).
4. En la sección **"Añadir usuario a la base de datos"**, selecciona tu usuario y base de datos, y pulsa **Añadir**.
5. Marca la casilla **"TODOS LOS PRIVILEGIOS"** (*ALL PRIVILEGES*) y guarda los cambios.
6. Ahora ve al menú principal de cPanel y abre **phpMyAdmin**.
7. Selecciona tu base de datos recién creada en la columna izquierda.
8. Haz clic en la pestaña superior **Importar** (*Import*).
9. Selecciona el archivo **`schema.sql`** que se encuentra en la raíz de este proyecto y haz clic en **Continuar** (*Import*).
   *Esto creará automáticamente las tablas con las sedes oficiales (Ibagué y Medellín), ministerios, grupos de conexión y pastores.*

---

### PASO 3: Conectar PHP con tu Base de Datos MySQL
En el **Administrador de Archivos** de cPanel:
1. Abre la carpeta `public_html/api/`.
2. Edita el archivo **`config.php`** (o crea un archivo `.env` en `public_html/api/`):
3. Coloca tus datos creados en el Paso 2:

```php
return [
    'db' => [
        'host'     => 'localhost',
        'port'     => 3306,
        'database' => 'usuario_tupalabra', // El nombre de tu base de datos
        'username' => 'usuario_db',        // Tu usuario de MySQL
        'password' => 'TuClaveSegura2026', // Tu contraseña de MySQL
        'charset'  => 'utf8mb4',
    ],
    'jwt' => [
        'secret'  => 'tu_clave_secreta_jwt_personalizada_2026',
        'algo'    => 'HS256',
        'expires' => 60 * 60 * 24 * 7, // 7 días
    ],
];
```

4. Guarda el archivo. ¡Todo está listo y operativo!

---

## 🔍 Comprobación en Vivo

Abre en tu navegador la URL de diagnóstico:
```text
https://tudominio.co/api/health
```

Deberás ver una respuesta JSON similar a:
```json
{
  "status": "ok",
  "server": "PHP 8.1",
  "iglesia": "Tu Palabra (Ibagué y Medellín)",
  "database": "MySQL (Conectado)",
  "timestamp": "2026-10-11T..."
}
```

> **🛡️ Tolerancia a Fallos Garantizada:**  
> Si aún no has creado la base de datos en MySQL o pusiste mal la contraseña temporalmente, el backend en PHP **no mostrará un error 500**. Automáticamente usará el almacén JSON local precargado con todas las sedes, cultos, horarios y grupos, permitiendo que tu sitio web continúe 100% operativo ante cualquier visitante.

---

## 🔑 Credenciales del Panel Administrativo (`/admin`)

Una vez desplegado el sitio, puedes acceder al panel de administración en:
```text
https://tudominio.co/admin
```

| Rol | Correo Electrónico | Contraseña | Responsable |
| :--- | :--- | :--- | :--- |
| **Administrador General** | `admin@tupalabra.co` | `admin123` | Pastor Robert Castillo |
| **Líder Jóvenes (Ibagué)** | `lider.jovenes@tupalabra.co` | `lider123` | Pastor Ricardo Castillo |
| **Líder Sede Medellín** | `lider.medellin@tupalabra.co` | `lider123` | Pastor Luis Castillo |

*(Recuerda cambiar las contraseñas desde el panel o phpMyAdmin una vez en producción).*

---

## ⚙️ Configuración de PHP 8.1 en cPanel

Si tu cPanel tiene por defecto una versión anterior de PHP:
1. En el buscador de cPanel escribe **"MultiPHP Manager"** (o *"Administrador MultiPHP"*).
2. Selecciona tu dominio en la lista.
3. En el selector superior, elige **PHP 8.1** o **PHP 8.2** o superior.
4. Haz clic en **Aplicar**.
