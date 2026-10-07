# 🚀 GUÍA DE DESPLIEGUE Y CONFIGURACIÓN EN CPANEL
### Iglesia Cristiana "Tu Palabra" — Ibagué y Medellín

Esta guía resuelve los errores de consola (`Failed to load resource: 404 Not Found` en `/api/*` y mensajes de extensiones) y explica paso a paso cómo dejar el sitio y la base de datos 100% operativos en cualquier servidor con **cPanel**.

---

## 🔍 1. ¿Por qué ocurrían esos errores en la consola?

1. **Error `/api/sedes: Failed to load resource: 404 (Not Found)`**:
   - **Causa**: Ocurre cuando en cPanel se sube únicamente la carpeta `dist/` a `public_html` (o el servidor Node.js no está corriendo). En ese escenario, el servidor web Apache busca una carpeta física llamada `/api/sedes` en `public_html`, la cual no existe físicamente en el disco y por eso devuelve `404 Not Found`.
   - **Solución**: Seguir el **Método 1** a continuación para activar la aplicación Node.js en cPanel con `server.js`, o configurar el archivo `.htaccess` provisto.
2. **Errores `inlineForm.html... extensionAdapter.sendMessageToTab` / `Unchecked runtime.lastError`**:
   - **Causa**: Son generados por extensiones del navegador del usuario (por ejemplo, administradores de contraseñas de Chrome/Edge como LastPass, Dashlane, 1Password, o traductores automáticos) que intentan inyectar scripts en los campos de formulario.
   - **Impacto**: No son errores del código del sitio web ni afectan a los visitantes comunes.

---

## 🛠️ MÉTODO 1: Despliegue Completo con "Setup Node.js App" de cPanel (Recomendado)

La mayoría de planes de hosting con cPanel cuentan con la herramienta **"Setup Node.js App"** (Phusion Passenger / CloudLinux). Este método corre el frontend y el backend Express juntos sin complicaciones.

### Paso 1: Crear la Base de Datos en cPanel
1. Entra a tu **cPanel** y busca **"Bases de datos MySQL"** (o *"Asistente de bases de datos MySQL"*).
2. Crea una nueva base de datos, por ejemplo: `usuario_tupalabra`.
3. Crea un usuario MySQL (ej. `usuario_dbuser`) y genera una contraseña segura.
4. Asocia el usuario a la base de datos marcando **"Todos los privilegios"**.
5. Ve a **phpMyAdmin** en cPanel, selecciona la base de datos creada, pulsa la pestaña **Importar** y selecciona el archivo **`schema.sql`** de este proyecto. Pulsa **Continuar**.

---

### Paso 2: Crear la Aplicación Node.js en cPanel
1. En cPanel, busca y abre **"Setup Node.js App"** (o *"Administrador de Node.js"*).
2. Haz clic en el botón azul **"Create Application"**.
3. Configura los siguientes campos:
   - **Node.js version**: Selecciona `18.x`, `20.x` o superior.
   - **Application mode**: `Production`.
   - **Application root**: Escribe `tupalabra` (esto creará una carpeta en `/home/usuario/tupalabra`).
   - **Application URL**: Selecciona tu dominio principal (ej. `tupalabra.co` o tu subdominio).
   - **Application startup file**: Escribe exactamente `server.js`.
4. Haz clic en **Create** (arriba a la derecha).
5. La aplicación se creará y se detendrá temporalmente.

---

### Paso 3: Subir los Archivos a cPanel
Compila el proyecto localmente con:
```bash
npm run build
```
Esto genera la carpeta **`dist/`** y el archivo **`server.js`**.

En el **Administrador de Archivos** de cPanel, entra a la carpeta que definiste como *Application root* (ej. `/home/usuario/tupalabra/`) y sube:
- 📁 La carpeta **`dist/`** completa.
- 📄 El archivo **`server.js`** compilado.
- 📄 El archivo **`package.json`**.
- 📄 El archivo **`.env`** (configurado en el siguiente paso).

---

### Paso 4: Configurar el archivo `.env`
Crea o sube el archivo `.env` dentro de la carpeta de la aplicación en cPanel con tus datos de base de datos creados en el Paso 1:

```env
NODE_ENV=production
PORT=3000

# Tu secreto JWT para administradores y líderes
JWT_SECRET=tu_clave_secreta_super_segura_jwt_2026

# Credenciales de MySQL creadas en cPanel
DB_HOST=localhost
DB_PORT=3306
DB_USER=usuario_dbuser
DB_PASSWORD=tu_password_creado
DB_NAME=usuario_tupalabra

# URL de tu sitio
APP_URL=https://tupalabra.co
```

---

### Paso 5: Instalar Dependencias y Arrancar
1. En cPanel, vuelve a **"Setup Node.js App"** y entra a tu aplicación.
2. En la sección de dependencias, haz clic en el botón **"Run NPM Install"** (esto instalará automáticamente `express`, `cors`, `mysql2`, `bcryptjs`, `jsonwebtoken`).
3. Haz clic en **"Restart Application"** (Reiniciar aplicación).
4. Abre tu navegador y visita tu dominio: ¡la página estará en vivo y las llamadas a `/api/*` responderán con estado `200 OK`!

---

## 🌐 MÉTODO 2: Frontend Estático en `public_html` + Backend Separado

Si prefieres servir el frontend como archivos estáticos directamente desde `public_html`:

1. Sube todo el contenido de la carpeta **`dist/`** (incluyendo el archivo oculto `.htaccess`) a la carpeta `public_html` de tu cPanel.
2. Si tienes el backend Node.js corriendo en un puerto (ej. `3000`) o en un subdominio (ej. `api.tupalabra.co`), edita el `.htaccess` en `public_html` descomentando las líneas de Proxy:
   ```apache
   RewriteEngine On
   RewriteRule ^api/(.*)$ http://127.0.0.1:3000/api/$1 [P,L]
   ```
3. O compila el frontend especificando la URL remota del backend en `.env` antes del build:
   ```env
   VITE_API_URL=https://api.tupalabra.co/api
   ```
   y ejecuta `npm run build`.

---

## 🛡️ MÉTODO 3: Modo Autónomo (Si tu Hosting no tiene soporte Node.js)

Si tu hosting cPanel es un plan básico compartido que **no incluye "Setup Node.js App"**:
- Puedes subir la carpeta **`dist/`** completa con su archivo `.htaccess` a `public_html`.
- La aplicación web cuenta con un motor inteligente de tolerancia a fallos (`src/services/api.ts` + `mockData.ts`): si la API `/api/*` no responde, el frontend activa de forma instantánea y automática sus datos precargados oficiales (todos los textos doctrinales, cultos, horarios, ministerios y grupos de Ibagué y Medellín).
- El visitante podrá navegar, ver los horarios de Sábados 5:00 PM y Domingos 10:00 AM, buscar grupos, compartir eventos por WhatsApp y chatear por el botón flotante sin interrupciones.

---

## 🔑 Credenciales Iniciales para el Panel Administrativo (`/admin`)

Una vez que tengas la aplicación corriendo con la base de datos importada:

| Usuario | Correo | Contraseña | Rol |
|---|---|---|---|
| **Pastor Administrador General** | `admin@tupalabra.co` | `admin123` | **admin** (acceso total) |
| **Líder de Jóvenes** | `lider.jovenes@tupalabra.co` | `lider123` | **lider** (gestiona su grupo) |
| **Líder Medellín** | `lider.medellin@tupalabra.co` | `lider123` | **lider** (gestiona su grupo) |

*(Puedes cambiar las contraseñas en cualquier momento desde la base de datos o desde el panel).*
