<?php
declare(strict_types=1);
$id = $_GET['id'] ?? null;
$_GET['route'] = 'grupos' . ($id ? '/' . $id : '');
require __DIR__ . '/index.php';
