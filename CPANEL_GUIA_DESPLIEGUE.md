# 🚀 GUÍA DE DESPLIEGUE EN CPANEL: PHP 8.1 (RECOMENDADO) Y NODE.JS
### Iglesia Cristiana "Tu Palabra" — Sedes Ibagué y Medellín

Esta guía explica paso a paso cómo dejar el sitio web y la base de datos 100% operativos en cualquier servidor con **cPanel**.

---

## 🏆 MÉTODO 1: Despliegue Nativo con PHP 8.1 (El más fácil y 100% confiable)

Debido a que Node.js en cPanel compartido a menudo presenta limitaciones con Phusion Passenger, puertos ocupados o dependencias bloqueadas, **se ha creado la versión completa del backend en PHP 8.1**.  
Este método **no requiere terminal SSH, no requiere Node.js y no requiere npm install en cPanel**.

### Paso 1: Subir archivos a `public_html`
1. En tu máquina local, compila el proyecto:
   ```bash
   npm run build
   ```
2. Entra a la carpeta generada **`dist/`**.
   *Dentro de `dist/` ya vienen incluidos el frontend compilado, las imágenes/logos y la carpeta **`api/`** con todo el backend PHP 8.1.*
3. Comprime el contenido de `dist/` en un archivo `.zip`.
4. En cPanel, abre el **Administrador de Archivos** (*File Manager*) y entra a **`public_html`**.
5. Sube y extrae el `.zip` en `public_html`. Asegúrate de que los archivos `.htaccess` (en la raíz y en `api/.htaccess`) estén presentes.

### Paso 2: Crear la Base de Datos MySQL
1. En cPanel, abre **"Bases de datos MySQL"**.
2. Crea la base de datos (ej. `usuario_tupalabra`).
3. Crea un usuario con contraseña (ej. `usuario_dbuser`).
4. Asocia el usuario a la base de datos marcando la casilla **"Todos los privilegios"**.
5. Ve a **phpMyAdmin**, selecciona la base de datos y en la pestaña **Importar** sube el archivo **`schema.sql`**.

### Paso 3: Configurar credenciales en PHP
1. En el Administrador de Archivos de cPanel, entra a `public_html/api/`.
2. Edita **`config.php`** con tus credenciales de MySQL creadas en el Paso 2:
   ```php
   'db' => [
       'host'     => 'localhost',
       'port'     => 3306,
       'database' => 'usuario_tupalabra',
       'username' => 'usuario_dbuser',
       'password' => 'TuPasswordAqui',
       'charset'  => 'utf8mb4',
   ],
   ```
3. Guarda el archivo.
4. Prueba en tu navegador: `https://tudominio.co/api/health`. Verás `"status": "ok"` y `"database": "MySQL (Conectado)"`.

---

## ⚙️ MÉTODO 2: Si tienes acceso a "Setup Node.js App" en cPanel

Si tu plan VPS o Cloud hosting cuenta con **"Setup Node.js App"** sin restricciones:
1. En cPanel, crea la aplicación en "Setup Node.js App" con versión Node 18+ o 20+.
2. Especifica `server.js` como *Application startup file*.
3. Sube `server.js`, `package.json` y la carpeta `dist/`.
4. Ejecuta "Run NPM Install" y reinicia la aplicación.

---

## 🔑 Credenciales Iniciales de Administrador y Líderes (`/admin`)

| Rol | Usuario | Clave | Persona a Cargo |
| :--- | :--- | :--- | :--- |
| **Administrador General** | `admin@tupalabra.co` | `admin123` | Pastor Robert Castillo |
| **Líder Jóvenes (RESET)** | `lider.jovenes@tupalabra.co` | `lider123` | Pastor Ricardo Castillo |
| **Líder Sede Medellín** | `lider.medellin@tupalabra.co` | `lider123` | Pastor Luis Castillo |
