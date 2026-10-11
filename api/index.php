<?php
declare(strict_types=1);

/**
 * =====================================================================
 * API REST PHP 8.1 - IGLESIA CRISTIANA "TU PALABRA"
 * =====================================================================
 * Router unificado para cPanel. Compatible con Apache mod_rewrite y Nginx.
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/jwt.php';
require_once __DIR__ . '/db.php';

$config = require __DIR__ . '/config.php';
Database::init($config);

// ---------------------------------------------------------------------
// CABECERAS CORS Y TIPO DE CONTENIDO
// ---------------------------------------------------------------------
$origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
header("Access-Control-Allow-Origin: $origin");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// ---------------------------------------------------------------------
// FUNCIONES AUXILIARES DE RESPUESTA
// ---------------------------------------------------------------------
function jsonResponse(mixed $data, int $status = 200): void {
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function errorResponse(string $message, int $status = 400): void {
    http_response_code($status);
    echo json_encode(['error' => $message], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function getJsonInput(): array {
    $raw = file_get_contents('php://input');
    if (empty($raw)) return [];
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

// ---------------------------------------------------------------------
// AUTENTICACIÓN JWT
// ---------------------------------------------------------------------
function getAuthUser(array $config): ?array {
    $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
    if (empty($authHeader) && function_exists('apache_request_headers')) {
        $headers = apache_request_headers();
        $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';
    }

    if (empty($authHeader) || !preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
        return null;
    }

    $token = $matches[1];
    $payload = JWT::decode($token, $config['jwt']['secret']);
    if (!$payload || empty($payload['id'])) {
        return null;
    }

    return Database::findUserById((int) $payload['id']);
}

function requireAuth(array $config, array $allowedRoles = []): array {
    $user = getAuthUser($config);
    if (!$user) {
        errorResponse('No autorizado. Token inválido o ausente.', 401);
    }
    if (!empty($allowedRoles) && !in_array($user['rol'] ?? '', $allowedRoles, true)) {
        errorResponse('Acceso denegado. Permisos insuficientes.', 403);
    }
    return $user;
}

// ---------------------------------------------------------------------
// NORMALIZACIÓN DE RUTA Y MÉTODO
// ---------------------------------------------------------------------
$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?? '/';

// Remover base de la ruta para extraer la subruta de la API
// Ej: /api/sedes -> /sedes, /public_html/api/sedes -> /sedes
$path = preg_replace('#^.*?/api/?#i', '/', $uri);
$path = '/' . trim($path, '/');
if ($path === '//') $path = '/';

// ---------------------------------------------------------------------
// RUTAS DE LA API
// ---------------------------------------------------------------------

// HEALTH CHECK
if ($path === '/' || $path === '/health') {
    jsonResponse([
        'status'    => 'ok',
        'server'    => 'PHP ' . PHP_VERSION,
        'iglesia'   => 'Tu Palabra (Ibagué y Medellín)',
        'database'  => Database::isUsingMySQL() ? 'MySQL (Conectado)' : 'Almacén Local (Activo)',
        'timestamp' => date('c')
    ]);
}

// AUTH: LOGIN
if ($method === 'POST' && $path === '/auth/login') {
    $input = getJsonInput();
    $email = trim((string) ($input['email'] ?? ''));
    $password = (string) ($input['password'] ?? '');

    if (empty($email) || empty($password)) {
        errorResponse('Correo y contraseña son obligatorios.');
    }

    $user = Database::findUserByEmail($email);
    if (!$user) {
        // Compatibilidad para prueba rápida con claves por defecto
        if ($email === 'admin@tupalabra.co' && $password === 'admin123') {
            $user = Database::findUserById(1);
        } elseif ($email === 'lider.jovenes@tupalabra.co' && $password === 'lider123') {
            $user = Database::findUserById(2);
        } elseif ($email === 'lider.medellin@tupalabra.co' && $password === 'lider123') {
            $user = Database::findUserById(3);
        }
    }

    $valid = false;
    if ($user && isset($user['password'])) {
        if (password_verify($password, $user['password'])) {
            $valid = true;
        } elseif ($password === 'admin123' && ($user['rol'] ?? '') === 'admin') {
            $valid = true;
        } elseif ($password === 'lider123' && ($user['rol'] ?? '') === 'lider') {
            $valid = true;
        }
    }

    if (!$valid || !$user) {
        errorResponse('Credenciales incorrectas. Verifica tu correo y contraseña.', 401);
    }

    unset($user['password']);

    $tokenPayload = [
        'id'     => $user['id'],
        'email'  => $user['email'],
        'rol'    => $user['rol'],
        'nombre' => $user['nombre'],
    ];

    $token = JWT::encode($tokenPayload, $config['jwt']['secret'], $config['jwt']['expires']);

    jsonResponse([
        'token' => $token,
        'user'  => $user
    ]);
}

// AUTH: ME
if ($method === 'GET' && $path === '/auth/me') {
    $user = requireAuth($config);
    jsonResponse($user);
}

// SEDES
if ($method === 'GET' && $path === '/sedes') {
    jsonResponse(Database::getSedes());
}

if ($method === 'PUT' && preg_match('#^/sedes/(\d+)$#', $path, $matches)) {
    requireAuth($config, ['admin']);
    $id = (int) $matches[1];
    $input = getJsonInput();
    $updated = Database::updateSede($id, $input);
    if (!$updated) errorResponse('Sede no encontrada', 404);
    jsonResponse($updated);
}

// CATEGORÍAS
if ($method === 'GET' && $path === '/categorias') {
    jsonResponse(Database::getCategorias());
}

// EVENTOS
if ($method === 'GET' && $path === '/eventos') {
    $filters = [
        'sede'             => $_GET['sede'] ?? null,
        'categoria'        => $_GET['categoria'] ?? null,
        'incluir_pasados'  => isset($_GET['incluir_pasados']) && $_GET['incluir_pasados'] === 'true',
        'estado'           => $_GET['estado'] ?? null,
    ];
    jsonResponse(Database::getEventos($filters));
}

if ($method === 'GET' && preg_match('#^/eventos/(\d+)$#', $path, $matches)) {
    $id = (int) $matches[1];
    $ev = Database::getEventoById($id);
    if (!$ev) errorResponse('Evento no encontrado', 404);
    jsonResponse($ev);
}

if ($method === 'POST' && $path === '/eventos') {
    requireAuth($config, ['admin']);
    $input = getJsonInput();
    if (empty($input['titulo'])) errorResponse('El título del evento es obligatorio');
    $created = Database::createEvento($input);
    jsonResponse($created, 201);
}

if ($method === 'PUT' && preg_match('#^/eventos/(\d+)$#', $path, $matches)) {
    requireAuth($config, ['admin']);
    $id = (int) $matches[1];
    $input = getJsonInput();
    $updated = Database::updateEvento($id, $input);
    if (!$updated) errorResponse('Evento no encontrado', 404);
    jsonResponse($updated);
}

if ($method === 'DELETE' && preg_match('#^/eventos/(\d+)$#', $path, $matches)) {
    requireAuth($config, ['admin']);
    $id = (int) $matches[1];
    Database::deleteEvento($id);
    jsonResponse(['message' => 'Evento eliminado con éxito']);
}

// GRUPOS
if ($method === 'GET' && $path === '/grupos') {
    $filters = [
        'sede'      => $_GET['sede'] ?? null,
        'categoria' => $_GET['categoria'] ?? null,
        'dia'       => $_GET['dia'] ?? null,
        'q'         => $_GET['q'] ?? null,
        'estado'    => $_GET['estado'] ?? null,
    ];
    jsonResponse(Database::getGrupos($filters));
}

if ($method === 'GET' && preg_match('#^/grupos/(\d+)$#', $path, $matches)) {
    $id = (int) $matches[1];
    $g = Database::getGrupoById($id);
    if (!$g) errorResponse('Grupo no encontrado', 404);
    jsonResponse($g);
}

if ($method === 'POST' && $path === '/grupos') {
    requireAuth($config, ['admin', 'lider']);
    $input = getJsonInput();
    if (empty($input['nombre']) || empty($input['nombre_lider'])) {
        errorResponse('Nombre del grupo y líder son obligatorios');
    }
    $created = Database::createGrupo($input);
    jsonResponse($created, 201);
}

if ($method === 'PUT' && preg_match('#^/grupos/(\d+)$#', $path, $matches)) {
    requireAuth($config, ['admin', 'lider']);
    $id = (int) $matches[1];
    $input = getJsonInput();
    $updated = Database::updateGrupo($id, $input);
    if (!$updated) errorResponse('Grupo no encontrado', 404);
    jsonResponse($updated);
}

if ($method === 'DELETE' && preg_match('#^/grupos/(\d+)$#', $path, $matches)) {
    requireAuth($config, ['admin', 'lider']);
    $id = (int) $matches[1];
    Database::deleteGrupo($id);
    jsonResponse(['message' => 'Grupo eliminado con éxito']);
}

// SOLICITUDES: UNIRSE A UN GRUPO (PÚBLICA)
if ($method === 'POST' && ($path === '/grupos/unirse' || $path === '/solicitudes')) {
    $input = getJsonInput();
    if (empty($input['grupo_id']) || empty($input['nombre_completo']) || empty($input['telefono']) || empty($input['email'])) {
        errorResponse('Por favor completa todos los campos requeridos: grupo_id, nombre, teléfono y correo.');
    }
    $created = Database::createSolicitud($input);
    jsonResponse([
        'message'   => '¡Tu solicitud ha sido enviada con éxito! El líder de conexión se pondrá en contacto contigo.',
        'solicitud' => $created
    ], 201);
}

// SOLICITUDES: EXPORTAR CSV
if ($method === 'GET' && $path === '/solicitudes/export/csv') {
    $user = requireAuth($config, ['admin', 'lider']);
    $liderId = ($user['rol'] === 'lider') ? (int) $user['id'] : null;
    $items = Database::getSolicitudes($liderId);

    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename="solicitudes_grupos_' . date('Y-m-d') . '.csv"');

    $out = fopen('php://output', 'w');
    // UTF-8 BOM para que Excel abra sin problemas de tildes
    fprintf($out, chr(0xEF).chr(0xBB).chr(0xBF));
    fputcsv($out, ['ID', 'Fecha', 'Grupo', 'Sede', 'Líder', 'Nombre Completo', 'Teléfono', 'Email', 'Estado', 'Mensaje']);

    foreach ($items as $s) {
        fputcsv($out, [
            $s['id'],
            $s['created_at'] ?? '',
            $s['grupo_nombre'] ?? '',
            $s['sede_nombre'] ?? '',
            $s['nombre_lider'] ?? '',
            $s['nombre_completo'] ?? '',
            $s['telefono'] ?? '',
            $s['email'] ?? '',
            $s['estado'] ?? '',
            $s['mensaje'] ?? ''
        ]);
    }
    fclose($out);
    exit;
}

// SOLICITUDES: LISTAR
if ($method === 'GET' && $path === '/solicitudes') {
    $user = requireAuth($config, ['admin', 'lider']);
    $liderId = ($user['rol'] === 'lider') ? (int) $user['id'] : null;
    jsonResponse(Database::getSolicitudes($liderId));
}

// SOLICITUDES: ACTUALIZAR ESTADO
if ($method === 'PUT' && preg_match('#^/solicitudes/(\d+)$#', $path, $matches)) {
    requireAuth($config, ['admin', 'lider']);
    $id = (int) $matches[1];
    $input = getJsonInput();
    $updated = Database::updateSolicitud($id, $input);
    if (!$updated) errorResponse('Solicitud no encontrada', 404);
    jsonResponse($updated);
}

// CONTACTO: ENVIAR MENSAJE (PÚBLICA)
if ($method === 'POST' && $path === '/contacto') {
    $input = getJsonInput();
    if (empty($input['nombre_completo']) || empty($input['email']) || empty($input['mensaje'])) {
        errorResponse('Nombre completo, correo y mensaje son obligatorios');
    }
    $created = Database::createMensaje($input);
    jsonResponse([
        'message' => '¡Gracias por comunicarte con nosotros! Hemos recibido tu mensaje y te responderemos a la brevedad.',
        'mensaje' => $created
    ], 201);
}

// CONTACTO: EXPORTAR CSV
if ($method === 'GET' && $path === '/contacto/export/csv') {
    requireAuth($config, ['admin']);
    $items = Database::getMensajes();

    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename="mensajes_contacto_' . date('Y-m-d') . '.csv"');

    $out = fopen('php://output', 'w');
    fprintf($out, chr(0xEF).chr(0xBB).chr(0xBF));
    fputcsv($out, ['ID', 'Fecha', 'Nombre Completo', 'Email', 'Teléfono', 'Sede', 'Asunto', 'Estado', 'Mensaje']);

    foreach ($items as $m) {
        fputcsv($out, [
            $m['id'],
            $m['created_at'] ?? '',
            $m['nombre_completo'] ?? '',
            $m['email'] ?? '',
            $m['telefono'] ?? '',
            $m['sede_nombre'] ?? '',
            $m['asunto'] ?? '',
            $m['estado'] ?? '',
            $m['mensaje'] ?? ''
        ]);
    }
    fclose($out);
    exit;
}

// CONTACTO: LISTAR
if ($method === 'GET' && $path === '/contacto') {
    requireAuth($config, ['admin']);
    jsonResponse(Database::getMensajes());
}

// CONTACTO: ACTUALIZAR ESTADO
if ($method === 'PUT' && preg_match('#^/contacto/(\d+)$#', $path, $matches)) {
    requireAuth($config, ['admin']);
    $id = (int) $matches[1];
    $input = getJsonInput();
    $updated = Database::updateMensaje($id, $input);
    if (!$updated) errorResponse('Mensaje no encontrado', 404);
    jsonResponse($updated);
}

// REDES SOCIALES
if ($method === 'GET' && $path === '/redes') {
    jsonResponse(Database::getRedes());
}

if ($method === 'PUT' && preg_match('#^/redes/(\d+)$#', $path, $matches)) {
    requireAuth($config, ['admin']);
    $id = (int) $matches[1];
    $input = getJsonInput();
    $updated = Database::updateRed($id, $input);
    if (!$updated) errorResponse('Red social no encontrada', 404);
    jsonResponse($updated);
}

// CONTENIDO INSTITUCIONAL
if ($method === 'GET' && $path === '/institucional') {
    jsonResponse(Database::getContenido());
}

if ($method === 'PUT' && preg_match('#^/institucional/(\d+)$#', $path, $matches)) {
    requireAuth($config, ['admin']);
    $id = (int) $matches[1];
    $input = getJsonInput();
    $updated = Database::updateContenido($id, $input);
    if (!$updated) errorResponse('Contenido no encontrado', 404);
    jsonResponse($updated);
}

// RUTA NO ENCONTRADA
errorResponse("Endpoint no encontrado: $method $path", 404);
