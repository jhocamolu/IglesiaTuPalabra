<?php
declare(strict_types=1);
$action = $_GET['action'] ?? $_GET['route'] ?? 'login';
$_GET['route'] = 'auth/' . ltrim((string) $action, '/');
require __DIR__ . '/index.php';
