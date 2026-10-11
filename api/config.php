<?php
declare(strict_types=1);

/**
 * =====================================================================
 * CONFIGURACIÓN DEL BACKEND PHP 8.1 - IGLESIA CRISTIANA "TU PALABRA"
 * =====================================================================
 * 
 * Este archivo centraliza la conexión a MySQL en cPanel y la seguridad JWT.
 * Puedes editar directamente los valores en este archivo o crear un .env
 */

// Intentar leer .env si existe en la raíz o en esta carpeta
(function () {
    $envPaths = [__DIR__ . '/.env', __DIR__ . '/../.env', __DIR__ . '/../../.env'];
    foreach ($envPaths as $envFile) {
        if (file_exists($envFile) && is_readable($envFile)) {
            $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
            foreach ($lines as $line) {
                $line = trim($line);
                if ($line === '' || str_starts_with($line, '#')) {
                    continue;
                }
                if (str_contains($line, '=')) {
                    [$key, $val] = explode('=', $line, 2);
                    $key = trim($key);
                    $val = trim($val, " \t\n\r\0\x0B\"'");
                    if (!isset($_ENV[$key]) && !isset($_SERVER[$key])) {
                        $_ENV[$key] = $val;
                        putenv("$key=$val");
                    }
                }
            }
            break;
        }
    }
})();

function env(string $key, mixed $default = null): mixed {
    $val = $_ENV[$key] ?? $_SERVER[$key] ?? getenv($key);
    return ($val !== false && $val !== null) ? $val : $default;
}

return [
    // Base de Datos MySQL de cPanel
    'db' => [
        'host'     => (string) env('DB_HOST', 'localhost'),
        'port'     => (int) env('DB_PORT', 3306),
        'database' => (string) env('DB_NAME', 'tupalabra_db'),
        'username' => (string) env('DB_USER', 'root'),
        'password' => (string) env('DB_PASSWORD', ''),
        'charset'  => 'utf8mb4',
    ],

    // Clave secreta para generación y validación de tokens JWT
    'jwt' => [
        'secret'  => (string) env('JWT_SECRET', 'tu_palabra_secreto_seguro_jwt_2026_ibague_medellin'),
        'algo'    => 'HS256',
        'expires' => 60 * 60 * 24 * 7, // 7 días de duración
    ],

    // Configuración general
    'app' => [
        'name'     => 'Iglesia Tu Palabra',
        'url'      => (string) env('APP_URL', '*'),
        'timezone' => 'America/Bogota',
    ],
];
