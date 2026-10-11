<?php
declare(strict_types=1);

/**
 * =====================================================================
 * CAPA DE BASE DE DATOS BLINDADA PARA PHP 8.1 (MYSQL PDO + ALMACÉN SEGURO)
 * =====================================================================
 * - Aislamiento total de errores: NINGUNA excepción de MySQL o lectura de disco
 *   generará un error 500 en cPanel.
 * - Si MySQL está configurado y accesible en cPanel, utiliza MySQL con PDO.
 * - Si MySQL no está configurado, las tablas no existen, o hay un fallo de conexión,
 *   opera de forma autónoma con api/data/store.json o datos internos en memoria.
 */

class Database {
    private static ?PDO $pdo = null;
    private static bool $usingMySQL = false;
    private static string $jsonPath = __DIR__ . '/data/store.json';

    public static function init(array $config): void {
        $db = $config['db'] ?? [];
        $host = (string) ($db['host'] ?? 'localhost');
        $port = (int) ($db['port'] ?? 3306);
        $dbname = (string) ($db['database'] ?? '');
        $user = (string) ($db['username'] ?? '');
        $pass = (string) ($db['password'] ?? '');
        $charset = (string) ($db['charset'] ?? 'utf8mb4');

        // Evitar intentar conectar con credenciales vacías o por defecto si causan cuelgues
        if (!empty($dbname) && !empty($user)) {
            try {
                $dsn = "mysql:host={$host};port={$port};dbname={$dbname};charset={$charset}";
                $pdo = new PDO($dsn, $user, $pass, [
                    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES   => false,
                    PDO::ATTR_TIMEOUT            => 3,
                    PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES {$charset} COLLATE {$charset}_unicode_ci"
                ]);

                // Verificar si existe la tabla sedes
                $check = $pdo->query("SHOW TABLES LIKE 'sedes'");
                if ($check && $check->rowCount() > 0) {
                    self::$pdo = $pdo;
                    self::$usingMySQL = true;
                    return;
                }
            } catch (Throwable $e) {
                // Registrar error silenciosamente sin tumbar el script
                error_log("Database::init fallo MySQL: " . $e->getMessage());
                self::$usingMySQL = false;
            }
        }
    }

    public static function isUsingMySQL(): bool {
        return self::$usingMySQL && (self::$pdo !== null);
    }

    // =================================================================
    // MANEJO SEGURO DE ALMACÉN JSON (FALLBACK TOTAL)
    // =================================================================
    private static function getDefaultStore(): array {
        return [
            'sedes' => [
                [
                    'id' => 1,
                    'slug' => 'ibague',
                    'nombre' => 'Sede Ibagué',
                    'ciudad' => 'Ibagué',
                    'departamento' => 'Tolima',
                    'direccion' => 'Cra. 6 #17-71, Ibagué, Tolima',
                    'barrio' => 'Interlaken',
                    'telefono' => '+57 (310) 845-2911',
                    'whatsapp' => '+573108452911',
                    'email' => 'ibague@tupalabra.co',
                    'horario_sabado' => '6:00 PM (Servicio Jóvenes)',
                    'horario_domingo' => '8:00 AM y 10:30 AM (Servicios Generales)',
                    'mapa_embed_url' => 'https://maps.google.com/maps?q=Cra.+6+%2317-71,+Ibague&t=&z=16&ie=UTF8&iwloc=&output=embed',
                    'mapa_link_url' => 'https://maps.google.com/?q=Cra.+6+%2317-71,+Ibague,+Tolima',
                    'imagen_url' => 'https://images.unsplash.com/photo-1548625361-1959779df344?auto=format&fit=crop&w=1200&q=80',
                    'activa' => 1
                ],
                [
                    'id' => 2,
                    'slug' => 'medellin',
                    'nombre' => 'Sede Medellín',
                    'ciudad' => 'Medellín',
                    'departamento' => 'Antioquia',
                    'direccion' => 'Calle 10 # 43E-31',
                    'barrio' => 'El Poblado',
                    'telefono' => '+57 (315) 889-1122',
                    'whatsapp' => '+573158891122',
                    'email' => 'medellin@tupalabra.co',
                    'horario_sabado' => '6:30 PM (Servicio Juvenil)',
                    'horario_domingo' => '9:00 AM y 11:30 AM (Celebración Dominical)',
                    'mapa_embed_url' => 'https://maps.google.com/maps?q=Calle+10+%23+43E-31+Medellin&t=&z=16&ie=UTF8&iwloc=&output=embed',
                    'mapa_link_url' => 'https://maps.google.com/?q=Calle+10+%23+43E-31,+El+Poblado,+Medellin',
                    'imagen_url' => 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=1200&q=80',
                    'activa' => 1
                ]
            ],
            'categorias' => [
                ['id' => 1, 'slug' => 'ninos', 'nombre' => 'Ministerio Infantil (BibliAventura)', 'descripcion' => 'Formación bíblica y valores para niños de 3 a 12 años.', 'color_hex' => '#F59E0B', 'icono' => 'Smile', 'activa' => 1, 'orden' => 1],
                ['id' => 2, 'slug' => 'adolescentes', 'nombre' => 'Adolescentes (Generación Radical)', 'descripcion' => 'Jóvenes de 13 a 17 años creciendo en identidad y propósito.', 'color_hex' => '#EC4899', 'icono' => 'Flame', 'activa' => 1, 'orden' => 2],
                ['id' => 3, 'slug' => 'jovenes-solteros', 'nombre' => 'Reset (18-35)', 'descripcion' => 'Universitarios y jóvenes profesionales creciendo en fe y vocación.', 'color_hex' => '#0D9488', 'icono' => 'Sparkles', 'activa' => 1, 'orden' => 3],
                ['id' => 4, 'slug' => 'matrimonios-familias', 'nombre' => 'Matrimonios y Familias', 'descripcion' => 'Edificando hogares sólidos sobre el fundamento de la Palabra.', 'color_hex' => '#3B82F6', 'icono' => 'HeartHandshake', 'activa' => 1, 'orden' => 4],
                ['id' => 5, 'slug' => 'hombres', 'nombre' => 'Ministerio de Hombres', 'descripcion' => 'Liderazgo bíblico, integridad y hermandad entre varones.', 'color_hex' => '#1E293B', 'icono' => 'Shield', 'activa' => 1, 'orden' => 5],
                ['id' => 6, 'slug' => 'mujeres', 'nombre' => 'Ministerio de Mujeres', 'descripcion' => 'Mujeres sabias y virtuosas floreciendo en comunidad.', 'color_hex' => '#8B5CF6', 'icono' => 'Flower2', 'activa' => 1, 'orden' => 6],
                ['id' => 7, 'slug' => 'empresas', 'nombre' => 'Empresarial', 'descripcion' => 'Liderazgo empresarial y profesional con valores cristianos.', 'color_hex' => '#D97706', 'icono' => 'Briefcase', 'activa' => 1, 'orden' => 7],
                ['id' => 8, 'slug' => 'general', 'nombre' => 'General y Familias', 'descripcion' => 'Eventos y espacios abiertos para toda la congregación.', 'color_hex' => '#0E5A6A', 'icono' => 'Calendar', 'activa' => 1, 'orden' => 8]
            ],
            'eventos' => [
                [
                    'id' => 1,
                    'titulo' => 'Congreso Anual de Familias: Hogares Firmes',
                    'slug' => 'congreso-familias-hogares-firmes',
                    'descripcion' => 'Un fin de semana diseñado para restaurar matrimonios, capacitar a los padres y consagrar a los hijos bajo la gracia divina.',
                    'fecha_inicio' => date('Y-m-d', strtotime('+7 days')) . ' 18:00:00',
                    'fecha_fin' => date('Y-m-d', strtotime('+9 days')) . ' 13:00:00',
                    'sede_id' => 1,
                    'sede_nombre' => 'Sede Ibagué',
                    'categoria_id' => 4,
                    'categoria_nombre' => 'Matrimonios y Familias',
                    'lugar' => 'Auditorio Principal',
                    'direccion' => 'Cra. 6 #17-71, Interlaken, Ibagué',
                    'imagen_url' => 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
                    'estado' => 'publicado',
                    'destacado' => 1,
                    'cupos_max' => 300,
                    'enlace_registro' => 'https://tupalabra.co/registro/familias'
                ]
            ],
            'grupos' => [
                [
                    'id' => 1,
                    'nombre' => 'Conexión RESET',
                    'categoria_id' => 3,
                    'categoria_nombre' => 'Reset (18-35)',
                    'sede_id' => 1,
                    'sede_nombre' => 'Sede Ibagué',
                    'lider_id' => 2,
                    'nombre_lider' => 'Pastor Ricardo Castillo',
                    'contacto_lider' => '+57 (312) 456-7890',
                    'dia_semana' => 'Miércoles',
                    'hora' => '19:00:00',
                    'hora_formato' => '7:00 PM',
                    'barrio_zona' => 'La Pola / Centro',
                    'ubicacion_aproximada' => 'Sector Parque Centenario',
                    'descripcion' => 'Espacio dinámico para estudiantes y jóvenes trabajadores. Abordamos temas de identidad y fe práctica.',
                    'cupo_maximo' => 15,
                    'estado' => 'activo'
                ],
                [
                    'id' => 2,
                    'nombre' => 'Matrimonios en Alianza',
                    'categoria_id' => 4,
                    'categoria_nombre' => 'Matrimonios y Familias',
                    'sede_id' => 1,
                    'sede_nombre' => 'Sede Ibagué',
                    'lider_id' => 1,
                    'nombre_lider' => 'Pastor Robert Castillo',
                    'contacto_lider' => '+57 (310) 845-2911',
                    'dia_semana' => 'Jueves',
                    'hora' => '19:30:00',
                    'hora_formato' => '7:30 PM',
                    'barrio_zona' => 'Interlaken / Macarena',
                    'ubicacion_aproximada' => 'Cerca a la Cra 6ta',
                    'descripcion' => 'Herramientas bíblicas para comunicación en pareja, crianza con propósito y finanzas familiares bendecidas.',
                    'cupo_maximo' => 12,
                    'estado' => 'activo'
                ],
                [
                    'id' => 3,
                    'nombre' => 'Hombres de Conquista Ibagué',
                    'categoria_id' => 5,
                    'categoria_nombre' => 'Ministerio de Hombres',
                    'sede_id' => 1,
                    'sede_nombre' => 'Sede Ibagué',
                    'lider_id' => 1,
                    'nombre_lider' => 'Pastor Robert Castillo',
                    'contacto_lider' => '+57 (310) 845-2911',
                    'dia_semana' => 'Martes',
                    'hora' => '19:00:00',
                    'hora_formato' => '7:00 PM',
                    'barrio_zona' => 'Jordán 7ma Etapa',
                    'ubicacion_aproximada' => 'Sector Guabinal',
                    'descripcion' => 'Rendición de cuentas, oración y formación de carácter para hombres proveedores y sacerdotes del hogar.',
                    'cupo_maximo' => 16,
                    'estado' => 'activo'
                ],
                [
                    'id' => 4,
                    'nombre' => 'Mujeres de Gracia y Oración',
                    'categoria_id' => 6,
                    'categoria_nombre' => 'Ministerio de Mujeres',
                    'sede_id' => 1,
                    'sede_nombre' => 'Sede Ibagué',
                    'lider_id' => 1,
                    'nombre_lider' => 'Pastora Claudia de Castillo',
                    'contacto_lider' => '+57 (310) 845-2912',
                    'dia_semana' => 'Miércoles',
                    'hora' => '15:30:00',
                    'hora_formato' => '3:30 PM',
                    'barrio_zona' => 'Piedra Pintada',
                    'ubicacion_aproximada' => 'Cerca a Multicentro',
                    'descripcion' => 'Comunión sincera, estudio bíblico inductivo e intercesión por nuestros hijos y familias.',
                    'cupo_maximo' => 14,
                    'estado' => 'activo'
                ],
                [
                    'id' => 5,
                    'nombre' => 'Conexión Poblado Jóvenes Profesionales',
                    'categoria_id' => 3,
                    'categoria_nombre' => 'Reset (18-35)',
                    'sede_id' => 2,
                    'sede_nombre' => 'Sede Medellín',
                    'lider_id' => 3,
                    'nombre_lider' => 'Pastor Luis Castillo',
                    'contacto_lider' => '+57 (315) 889-1122',
                    'dia_semana' => 'Miércoles',
                    'hora' => '19:30:00',
                    'hora_formato' => '7:30 PM',
                    'barrio_zona' => 'El Poblado / Manila',
                    'ubicacion_aproximada' => 'A dos cuadras del metro Poblado',
                    'descripcion' => 'Vocación, liderazgo cristiano en el trabajo y relaciones sanas guiadas por Dios.',
                    'cupo_maximo' => 18,
                    'estado' => 'activo'
                ]
            ],
            'usuarios' => [
                [
                    'id' => 1,
                    'nombre' => 'Pastor Robert Castillo',
                    'email' => 'admin@tupalabra.co',
                    'password' => '$2y$10$wT8m9Z1H9DkJ6.eB9m2P5euT7n2B7R5e2jT1y4e3b1A0r6m8g5wKm',
                    'rol' => 'admin',
                    'sede_id' => 1,
                    'telefono' => '+57 (310) 845-2911',
                    'activo' => 1
                ],
                [
                    'id' => 2,
                    'nombre' => 'Pastor Ricardo Castillo',
                    'email' => 'lider.jovenes@tupalabra.co',
                    'password' => '$2y$10$wT8m9Z1H9DkJ6.eB9m2P5euT7n2B7R5e2jT1y4e3b1A0r6m8g5wKm',
                    'rol' => 'lider',
                    'sede_id' => 1,
                    'telefono' => '+57 (312) 456-7890',
                    'activo' => 1
                ],
                [
                    'id' => 3,
                    'nombre' => 'Pastor Luis Castillo',
                    'email' => 'lider.medellin@tupalabra.co',
                    'password' => '$2y$10$wT8m9Z1H9DkJ6.eB9m2P5euT7n2B7R5e2jT1y4e3b1A0r6m8g5wKm',
                    'rol' => 'lider',
                    'sede_id' => 2,
                    'telefono' => '+57 (315) 889-1122',
                    'activo' => 1
                ]
            ],
            'solicitudes' => [],
            'mensajes' => [],
            'redes' => [
                ['id' => 1, 'nombre_mostrar' => 'YouTube', 'usuario' => '@IglesiaTuPalabraOficial', 'url' => 'https://youtube.com/@IglesiaTuPalabraOficial', 'icono' => 'Youtube', 'activa' => 1, 'orden' => 1],
                ['id' => 2, 'nombre_mostrar' => 'Instagram', 'usuario' => '@tupalabraco', 'url' => 'https://instagram.com/tupalabraco', 'icono' => 'Instagram', 'activa' => 1, 'orden' => 2],
                ['id' => 3, 'nombre_mostrar' => 'Facebook', 'usuario' => 'Iglesia Cristiana Tu Palabra', 'url' => 'https://facebook.com/tupalabraco', 'icono' => 'Facebook', 'activa' => 1, 'orden' => 3],
                ['id' => 4, 'nombre_mostrar' => 'Spotify', 'usuario' => 'Tu Palabra Podcast & Prédicas', 'url' => 'https://spotify.com', 'icono' => 'Headphones', 'activa' => 1, 'orden' => 4]
            ],
            'contenido' => [
                ['id' => 1, 'titulo' => 'Nuestra Visión', 'subtitulo' => 'Edificando vidas sobre el fundamento eterno', 'contenido' => 'Ser una iglesia bíblica, viva y relevante en Colombia que proclama con fidelidad el evangelio de Jesucristo.', 'versiculo_referencia' => 'Salmos 119:105', 'versiculo_texto' => 'Lámpara es a mis pies tu palabra, y lumbrera a mi camino.'],
                ['id' => 2, 'titulo' => 'Nuestra Misión', 'subtitulo' => 'Discipulado y transformación integral', 'contenido' => 'Guiar a cada persona a un encuentro íntimo con Dios mediante la enseñanza de las Escrituras.', 'versiculo_referencia' => 'Mateo 28:19-20', 'versiculo_texto' => 'Por tanto, id, y haced discípulos a todas las naciones.'],
                ['id' => 3, 'titulo' => 'Nuestros Valores', 'subtitulo' => 'Pilares innegociables de nuestra fe', 'contenido' => 'Amor incondicional, santidad práctica, integridad, servicio a la comunidad y pasión evangelística.', 'versiculo_referencia' => 'Miqueas 6:8', 'versiculo_texto' => 'Oh hombre, él te ha declarado lo que es bueno... solamente hacer justicia, amar misericordia, y humillarte ante tu Dios.']
            ]
        ];
    }

    private static function readJsonStore(): array {
        $default = self::getDefaultStore();
        if (!file_exists(self::$jsonPath)) {
            // Intentar crearlo inicialmente
            self::writeJsonStore($default);
            return $default;
        }

        try {
            $raw = @file_get_contents(self::$jsonPath);
            if (empty($raw)) return $default;
            $data = json_decode($raw, true);
            if (!is_array($data)) return $default;

            // Asegurar que cada clave exista y sea arreglo
            foreach (['sedes', 'categorias', 'eventos', 'grupos', 'usuarios', 'solicitudes', 'mensajes', 'redes', 'contenido'] as $k) {
                if (!isset($data[$k]) || !is_array($data[$k])) {
                    $data[$k] = $default[$k] ?? [];
                }
            }
            return $data;
        } catch (Throwable $e) {
            error_log("readJsonStore error: " . $e->getMessage());
            return $default;
        }
    }

    private static function writeJsonStore(array $data): void {
        try {
            $dir = dirname(self::$jsonPath);
            if (!is_dir($dir)) {
                @mkdir($dir, 0755, true);
            }
            $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            if ($json !== false) {
                @file_put_contents(self::$jsonPath, $json, LOCK_EX);
            }
        } catch (Throwable $e) {
            error_log("writeJsonStore error: " . $e->getMessage());
        }
    }

    // =================================================================
    // USUARIOS & AUTENTICACIÓN
    // =================================================================
    public static function findUserByEmail(string $email): ?array {
        $email = strtolower(trim($email));

        if (self::$usingMySQL && self::$pdo) {
            try {
                $stmt = self::$pdo->prepare("SELECT * FROM usuarios WHERE LOWER(email) = ? AND activo = 1 LIMIT 1");
                $stmt->execute([$email]);
                $user = $stmt->fetch();
                if ($user) return $user;
            } catch (Throwable $e) {
                error_log("findUserByEmail MySQL error: " . $e->getMessage());
            }
        }

        $store = self::readJsonStore();
        foreach ($store['usuarios'] ?? [] as $u) {
            if (strtolower($u['email'] ?? '') === $email && ((int) ($u['activo'] ?? 1) === 1)) {
                return $u;
            }
        }
        return null;
    }

    public static function findUserById(int $id): ?array {
        if (self::$usingMySQL && self::$pdo) {
            try {
                $stmt = self::$pdo->prepare("SELECT id, nombre, email, rol, sede_id, telefono FROM usuarios WHERE id = ? LIMIT 1");
                $stmt->execute([$id]);
                $user = $stmt->fetch();
                if ($user) return $user;
            } catch (Throwable $e) {
                error_log("findUserById MySQL error: " . $e->getMessage());
            }
        }

        $store = self::readJsonStore();
        foreach ($store['usuarios'] ?? [] as $u) {
            if ((int) ($u['id'] ?? 0) === $id) {
                unset($u['password']);
                return $u;
            }
        }
        return null;
    }

    // =================================================================
    // SEDES
    // =================================================================
    public static function getSedes(): array {
        if (self::$usingMySQL && self::$pdo) {
            try {
                $rows = self::$pdo->query("SELECT * FROM sedes ORDER BY id ASC")->fetchAll();
                if (!empty($rows)) return $rows;
            } catch (Throwable $e) {
                error_log("getSedes MySQL error: " . $e->getMessage());
            }
        }
        $store = self::readJsonStore();
        return $store['sedes'] ?? [];
    }

    public static function updateSede(int $id, array $data): ?array {
        if (self::$usingMySQL && self::$pdo) {
            try {
                $fields = [];
                $params = [];
                $allowed = ['nombre', 'ciudad', 'departamento', 'direccion', 'barrio', 'telefono', 'whatsapp', 'email', 'horario_sabado', 'horario_domingo', 'mapa_embed_url', 'mapa_link_url', 'imagen_url', 'activa'];
                foreach ($allowed as $f) {
                    if (array_key_exists($f, $data)) {
                        $fields[] = "`$f` = ?";
                        $params[] = $data[$f];
                    }
                }
                if (!empty($fields)) {
                    $params[] = $id;
                    $selfStmt = self::$pdo->prepare("UPDATE sedes SET " . implode(', ', $fields) . " WHERE id = ?");
                    $selfStmt->execute($params);
                }
                $stmt = self::$pdo->prepare("SELECT * FROM sedes WHERE id = ?");
                $stmt->execute([$id]);
                $row = $stmt->fetch();
                if ($row) return $row;
            } catch (Throwable $e) {
                error_log("updateSede MySQL error: " . $e->getMessage());
            }
        }

        $store = self::readJsonStore();
        foreach ($store['sedes'] as &$s) {
            if ((int) ($s['id'] ?? 0) === $id) {
                $s = array_merge($s, $data);
                self::writeJsonStore($store);
                return $s;
            }
        }
        return null;
    }

    // =================================================================
    // CATEGORÍAS
    // =================================================================
    public static function getCategorias(): array {
        if (self::$usingMySQL && self::$pdo) {
            try {
                $rows = self::$pdo->query("SELECT * FROM categorias WHERE activa = 1 ORDER BY orden ASC, id ASC")->fetchAll();
                if (!empty($rows)) return $rows;
            } catch (Throwable $e) {
                error_log("getCategorias MySQL error: " . $e->getMessage());
            }
        }
        $store = self::readJsonStore();
        return $store['categorias'] ?? [];
    }

    // =================================================================
    // EVENTOS
    // =================================================================
    public static function getEventos(array $filters = []): array {
        if (self::$usingMySQL && self::$pdo) {
            try {
                $where = [];
                $params = [];

                if (!empty($filters['estado'])) {
                    $where[] = "e.estado = ?";
                    $params[] = $filters['estado'];
                } else {
                    $where[] = "e.estado = 'publicado'";
                }

                if (!empty($filters['sede']) && !in_array($filters['sede'], ['todas', 'all'])) {
                    $where[] = "(e.sede_id = ? OR e.sede_id IS NULL)";
                    $params[] = (int) $filters['sede'];
                }

                if (!empty($filters['categoria']) && !in_array($filters['categoria'], ['todas', 'all'])) {
                    $where[] = "e.categoria_id = ?";
                    $params[] = (int) $filters['categoria'];
                }

                if (empty($filters['incluir_pasados'])) {
                    $where[] = "COALESCE(e.fecha_fin, e.fecha_inicio) >= DATE_SUB(NOW(), INTERVAL 1 DAY)";
                }

                $sql = "SELECT e.*, s.nombre AS sede_nombre, c.nombre AS categoria_nombre 
                        FROM eventos e 
                        LEFT JOIN sedes s ON e.sede_id = s.id 
                        LEFT JOIN categorias c ON e.categoria_id = c.id";

                if (!empty($where)) {
                    $sql .= " WHERE " . implode(' AND ', $where);
                }
                $sql .= " ORDER BY e.fecha_inicio ASC";

                $stmt = self::$pdo->prepare($sql);
                $stmt->execute($params);
                return $stmt->fetchAll();
            } catch (Throwable $e) {
                error_log("getEventos MySQL error: " . $e->getMessage());
            }
        }

        $store = self::readJsonStore();
        $items = $store['eventos'] ?? [];

        if (!empty($filters['estado'])) {
            $items = array_values(array_filter($items, fn($e) => ($e['estado'] ?? 'publicado') === $filters['estado']));
        } else {
            $items = array_values(array_filter($items, fn($e) => ($e['estado'] ?? 'publicado') === 'publicado'));
        }

        if (!empty($filters['sede']) && !in_array($filters['sede'], ['todas', 'all'])) {
            $sId = (int) $filters['sede'];
            $items = array_values(array_filter($items, fn($e) => empty($e['sede_id']) || (int) $e['sede_id'] === $sId));
        }

        if (!empty($filters['categoria']) && !in_array($filters['categoria'], ['todas', 'all'])) {
            $cId = (int) $filters['categoria'];
            $items = array_values(array_filter($items, fn($e) => (int) ($e['categoria_id'] ?? 0) === $cId));
        }

        return $items;
    }

    public static function getEventoById(int $id): ?array {
        if (self::$usingMySQL && self::$pdo) {
            try {
                $stmt = self::$pdo->prepare("SELECT e.*, s.nombre AS sede_nombre, c.nombre AS categoria_nombre FROM eventos e LEFT JOIN sedes s ON e.sede_id = s.id LEFT JOIN categorias c ON e.categoria_id = c.id WHERE e.id = ?");
                $stmt->execute([$id]);
                $row = $stmt->fetch();
                if ($row) return $row;
            } catch (Throwable $e) {
                error_log("getEventoById MySQL error: " . $e->getMessage());
            }
        }

        $store = self::readJsonStore();
        foreach ($store['eventos'] ?? [] as $e) {
            if ((int) ($e['id'] ?? 0) === $id) return $e;
        }
        return null;
    }

    public static function createEvento(array $data): array {
        if (self::$usingMySQL && self::$pdo) {
            try {
                $sql = "INSERT INTO eventos (titulo, slug, descripcion, fecha_inicio, fecha_fin, sede_id, categoria_id, lugar, direccion, imagen_url, estado, destacado, cupos_max, enlace_registro) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                $stmt = self::$pdo->prepare($sql);
                $stmt->execute([
                    $data['titulo'] ?? '',
                    $data['slug'] ?? strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $data['titulo'] ?? 'evento'))),
                    $data['descripcion'] ?? '',
                    $data['fecha_inicio'] ?? date('Y-m-d H:i:s'),
                    $data['fecha_fin'] ?? null,
                    $data['sede_id'] ?? null,
                    $data['categoria_id'] ?? 8,
                    $data['lugar'] ?? 'Auditorio',
                    $data['direccion'] ?? null,
                    $data['imagen_url'] ?? null,
                    $data['estado'] ?? 'publicado',
                    $data['destacado'] ?? 0,
                    $data['cupos_max'] ?? null,
                    $data['enlace_registro'] ?? null,
                ]);
                $newId = (int) self::$pdo->lastInsertId();
                return self::getEventoById($newId) ?? array_merge(['id' => $newId], $data);
            } catch (Throwable $e) {
                error_log("createEvento MySQL error: " . $e->getMessage());
            }
        }

        $store = self::readJsonStore();
        $id = time();
        $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $data['titulo'] ?? 'evento')));
        $newItem = array_merge([
            'id' => $id,
            'slug' => $slug,
            'estado' => 'publicado',
            'destacado' => 0
        ], $data);

        array_unshift($store['eventos'], $newItem);
        self::writeJsonStore($store);
        return $newItem;
    }

    public static function updateEvento(int $id, array $data): ?array {
        if (self::$usingMySQL && self::$pdo) {
            try {
                $fields = [];
                $params = [];
                $allowed = ['titulo', 'slug', 'descripcion', 'fecha_inicio', 'fecha_fin', 'sede_id', 'categoria_id', 'lugar', 'direccion', 'imagen_url', 'estado', 'destacado', 'cupos_max', 'enlace_registro'];
                foreach ($allowed as $f) {
                    if (array_key_exists($f, $data)) {
                        $fields[] = "`$f` = ?";
                        $params[] = $data[$f];
                    }
                }
                if (!empty($fields)) {
                    $params[] = $id;
                    $stmt = self::$pdo->prepare("UPDATE eventos SET " . implode(', ', $fields) . " WHERE id = ?");
                    $stmt->execute($params);
                }
                return self::getEventoById($id);
            } catch (Throwable $e) {
                error_log("updateEvento MySQL error: " . $e->getMessage());
            }
        }

        $store = self::readJsonStore();
        foreach ($store['eventos'] as &$e) {
            if ((int) ($e['id'] ?? 0) === $id) {
                $e = array_merge($e, $data);
                self::writeJsonStore($store);
                return $e;
            }
        }
        return null;
    }

    public static function deleteEvento(int $id): bool {
        if (self::$usingMySQL && self::$pdo) {
            try {
                $stmt = self::$pdo->prepare("DELETE FROM eventos WHERE id = ?");
                return $stmt->execute([$id]);
            } catch (Throwable $e) {
                error_log("deleteEvento MySQL error: " . $e->getMessage());
            }
        }

        $store = self::readJsonStore();
        $before = count($store['eventos']);
        $store['eventos'] = array_values(array_filter($store['eventos'], fn($e) => (int) ($e['id'] ?? 0) !== $id));
        if (count($store['eventos']) !== $before) {
            self::writeJsonStore($store);
            return true;
        }
        return false;
    }

    // =================================================================
    // GRUPOS DE CONEXIÓN
    // =================================================================
    public static function getGrupos(array $filters = []): array {
        if (self::$usingMySQL && self::$pdo) {
            try {
                $where = [];
                $params = [];

                if (!empty($filters['estado'])) {
                    $where[] = "g.estado = ?";
                    $params[] = $filters['estado'];
                } else {
                    $where[] = "g.estado = 'activo'";
                }

                if (!empty($filters['sede']) && !in_array($filters['sede'], ['todas', 'all'])) {
                    $where[] = "g.sede_id = ?";
                    $params[] = (int) $filters['sede'];
                }

                if (!empty($filters['categoria']) && !in_array($filters['categoria'], ['todas', 'all'])) {
                    $where[] = "g.categoria_id = ?";
                    $params[] = (int) $filters['categoria'];
                }

                if (!empty($filters['dia']) && $filters['dia'] !== 'todos') {
                    $where[] = "g.dia_semana = ?";
                    $params[] = $filters['dia'];
                }

                if (!empty($filters['q'])) {
                    $term = "%{$filters['q']}%";
                    $where[] = "(g.nombre LIKE ? OR g.barrio_zona LIKE ? OR g.nombre_lider LIKE ? OR g.descripcion LIKE ?)";
                    $params[] = $term;
                    $params[] = $term;
                    $params[] = $term;
                    $params[] = $term;
                }

                $sql = "SELECT g.*, s.nombre AS sede_nombre, c.nombre AS categoria_nombre,
                        (SELECT COUNT(*) FROM solicitudes_grupo WHERE grupo_id = g.id) AS solicitudes_count
                        FROM grupos_conexion g 
                        LEFT JOIN sedes s ON g.sede_id = s.id 
                        LEFT JOIN categorias c ON g.categoria_id = c.id";

                if (!empty($where)) {
                    $sql .= " WHERE " . implode(' AND ', $where);
                }
                $sql .= " ORDER BY g.id ASC";

                $stmt = self::$pdo->prepare($sql);
                $stmt->execute($params);
                return $stmt->fetchAll();
            } catch (Throwable $e) {
                error_log("getGrupos MySQL error: " . $e->getMessage());
            }
        }

        $store = self::readJsonStore();
        $items = $store['grupos'] ?? [];

        if (!empty($filters['estado'])) {
            $items = array_values(array_filter($items, fn($g) => ($g['estado'] ?? 'activo') === $filters['estado']));
        } else {
            $items = array_values(array_filter($items, fn($g) => ($g['estado'] ?? 'activo') === 'activo'));
        }

        if (!empty($filters['sede']) && !in_array($filters['sede'], ['todas', 'all'])) {
            $sId = (int) $filters['sede'];
            $items = array_values(array_filter($items, fn($g) => (int) ($g['sede_id'] ?? 0) === $sId));
        }

        if (!empty($filters['categoria']) && !in_array($filters['categoria'], ['todas', 'all'])) {
            $cId = (int) $filters['categoria'];
            $items = array_values(array_filter($items, fn($g) => (int) ($g['categoria_id'] ?? 0) === $cId));
        }

        if (!empty($filters['dia']) && $filters['dia'] !== 'todos') {
            $items = array_values(array_filter($items, fn($g) => ($g['dia_semana'] ?? '') === $filters['dia']));
        }

        if (!empty($filters['q'])) {
            $term = mb_strtolower($filters['q']);
            $items = array_values(array_filter($items, function($g) use ($term) {
                return str_contains(mb_strtolower($g['nombre'] ?? ''), $term) ||
                       str_contains(mb_strtolower($g['barrio_zona'] ?? ''), $term) ||
                       str_contains(mb_strtolower($g['nombre_lider'] ?? ''), $term) ||
                       str_contains(mb_strtolower($g['descripcion'] ?? ''), $term);
            }));
        }

        return $items;
    }

    public static function getGrupoById(int $id): ?array {
        if (self::$usingMySQL && self::$pdo) {
            try {
                $stmt = self::$pdo->prepare("SELECT g.*, s.nombre AS sede_nombre, c.nombre AS categoria_nombre FROM grupos_conexion g LEFT JOIN sedes s ON g.sede_id = s.id LEFT JOIN categorias c ON g.categoria_id = c.id WHERE g.id = ?");
                $stmt->execute([$id]);
                $row = $stmt->fetch();
                if ($row) return $row;
            } catch (Throwable $e) {
                error_log("getGrupoById MySQL error: " . $e->getMessage());
            }
        }

        $store = self::readJsonStore();
        foreach ($store['grupos'] ?? [] as $g) {
            if ((int) ($g['id'] ?? 0) === $id) return $g;
        }
        return null;
    }

    public static function createGrupo(array $data): array {
        if (self::$usingMySQL && self::$pdo) {
            try {
                $sql = "INSERT INTO grupos_conexion (nombre, categoria_id, sede_id, lider_id, nombre_lider, contacto_lider, dia_semana, hora, hora_formato, barrio_zona, ubicacion_aproximada, descripcion, cupo_maximo, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                $stmt = self::$pdo->prepare($sql);
                $stmt->execute([
                    $data['nombre'] ?? '',
                    $data['categoria_id'] ?? 3,
                    $data['sede_id'] ?? 1,
                    $data['lider_id'] ?? null,
                    $data['nombre_lider'] ?? '',
                    $data['contacto_lider'] ?? '',
                    $data['dia_semana'] ?? 'Miércoles',
                    $data['hora'] ?? '19:00:00',
                    $data['hora_formato'] ?? '7:00 PM',
                    $data['barrio_zona'] ?? '',
                    $data['ubicacion_aproximada'] ?? '',
                    $data['descripcion'] ?? '',
                    $data['cupo_maximo'] ?? 15,
                    $data['estado'] ?? 'activo'
                ]);
                $newId = (int) self::$pdo->lastInsertId();
                return self::getGrupoById($newId) ?? array_merge(['id' => $newId], $data);
            } catch (Throwable $e) {
                error_log("createGrupo MySQL error: " . $e->getMessage());
            }
        }

        $store = self::readJsonStore();
        $newId = time();
        $newItem = array_merge([
            'id' => $newId,
            'estado' => 'activo',
            'cupo_maximo' => 15
        ], $data);
        $store['grupos'][] = $newItem;
        self::writeJsonStore($store);
        return $newItem;
    }

    public static function updateGrupo(int $id, array $data): ?array {
        if (self::$usingMySQL && self::$pdo) {
            try {
                $fields = [];
                $params = [];
                $allowed = ['nombre', 'categoria_id', 'sede_id', 'lider_id', 'nombre_lider', 'contacto_lider', 'dia_semana', 'hora', 'hora_formato', 'barrio_zona', 'ubicacion_aproximada', 'descripcion', 'cupo_maximo', 'estado'];
                foreach ($allowed as $f) {
                    if (array_key_exists($f, $data)) {
                        $fields[] = "`$f` = ?";
                        $params[] = $data[$f];
                    }
                }
                if (!empty($fields)) {
                    $params[] = $id;
                    $stmt = self::$pdo->prepare("UPDATE grupos_conexion SET " . implode(', ', $fields) . " WHERE id = ?");
                    $stmt->execute($params);
                }
                return self::getGrupoById($id);
            } catch (Throwable $e) {
                error_log("updateGrupo MySQL error: " . $e->getMessage());
            }
        }

        $store = self::readJsonStore();
        foreach ($store['grupos'] as &$g) {
            if ((int) ($g['id'] ?? 0) === $id) {
                $g = array_merge($g, $data);
                self::writeJsonStore($store);
                return $g;
            }
        }
        return null;
    }

    public static function deleteGrupo(int $id): bool {
        if (self::$usingMySQL && self::$pdo) {
            try {
                $stmt = self::$pdo->prepare("DELETE FROM grupos_conexion WHERE id = ?");
                return $stmt->execute([$id]);
            } catch (Throwable $e) {
                error_log("deleteGrupo MySQL error: " . $e->getMessage());
            }
        }

        $store = self::readJsonStore();
        $before = count($store['grupos']);
        $store['grupos'] = array_values(array_filter($store['grupos'], fn($g) => (int) ($g['id'] ?? 0) !== $id));
        if (count($store['grupos']) !== $before) {
            self::writeJsonStore($store);
            return true;
        }
        return false;
    }

    // =================================================================
    // SOLICITUDES A GRUPOS
    // =================================================================
    public static function createSolicitud(array $data): array {
        if (self::$usingMySQL && self::$pdo) {
            try {
                $sql = "INSERT INTO solicitudes_grupo (grupo_id, nombre_completo, telefono, email, mensaje, estado) VALUES (?, ?, ?, ?, ?, 'pendiente')";
                $stmt = self::$pdo->prepare($sql);
                $stmt->execute([
                    $data['grupo_id'],
                    $data['nombre_completo'],
                    $data['telefono'],
                    $data['email'],
                    $data['mensaje'] ?? null
                ]);
                $newId = (int) self::$pdo->lastInsertId();
                return array_merge(['id' => $newId, 'estado' => 'pendiente', 'created_at' => date('c')], $data);
            } catch (Throwable $e) {
                error_log("createSolicitud MySQL error: " . $e->getMessage());
            }
        }

        $store = self::readJsonStore();
        $newItem = [
            'id' => time(),
            'grupo_id' => $data['grupo_id'],
            'nombre_completo' => $data['nombre_completo'],
            'telefono' => $data['telefono'],
            'email' => $data['email'],
            'mensaje' => $data['mensaje'] ?? '',
            'estado' => 'pendiente',
            'created_at' => date('c')
        ];
        array_unshift($store['solicitudes'], $newItem);
        self::writeJsonStore($store);
        return $newItem;
    }

    public static function getSolicitudes(?int $liderId = null): array {
        if (self::$usingMySQL && self::$pdo) {
            try {
                $sql = "SELECT sg.*, g.nombre AS grupo_nombre, s.nombre AS sede_nombre, g.lider_id, g.nombre_lider 
                        FROM solicitudes_grupo sg 
                        JOIN grupos_conexion g ON sg.grupo_id = g.id 
                        JOIN sedes s ON g.sede_id = s.id";
                $params = [];
                if ($liderId !== null) {
                    $sql .= " WHERE g.lider_id = ?";
                    $params[] = $liderId;
                }
                $sql .= " ORDER BY sg.created_at DESC";
                $stmt = self::$pdo->prepare($sql);
                $stmt->execute($params);
                return $stmt->fetchAll();
            } catch (Throwable $e) {
                error_log("getSolicitudes MySQL error: " . $e->getMessage());
            }
        }

        $store = self::readJsonStore();
        return $store['solicitudes'] ?? [];
    }

    public static function updateSolicitud(int $id, array $data): ?array {
        if (self::$usingMySQL && self::$pdo) {
            try {
                $fields = [];
                $params = [];
                if (isset($data['estado'])) {
                    $fields[] = "`estado` = ?";
                    $params[] = $data['estado'];
                }
                if (isset($data['notas_internas'])) {
                    $fields[] = "`notas_internas` = ?";
                    $params[] = $data['notas_internas'];
                }
                if (!empty($fields)) {
                    $params[] = $id;
                    $stmt = self::$pdo->prepare("UPDATE solicitudes_grupo SET " . implode(', ', $fields) . " WHERE id = ?");
                    $stmt->execute($params);
                }
                $stmt = self::$pdo->prepare("SELECT sg.*, g.nombre AS grupo_nombre FROM solicitudes_grupo sg JOIN grupos_conexion g ON sg.grupo_id = g.id WHERE sg.id = ?");
                $stmt->execute([$id]);
                $row = $stmt->fetch();
                if ($row) return $row;
            } catch (Throwable $e) {
                error_log("updateSolicitud MySQL error: " . $e->getMessage());
            }
        }

        $store = self::readJsonStore();
        foreach ($store['solicitudes'] as &$s) {
            if ((int) ($s['id'] ?? 0) === $id) {
                $s = array_merge($s, $data);
                self::writeJsonStore($store);
                return $s;
            }
        }
        return null;
    }

    // =================================================================
    // MENSAJES DE CONTACTO
    // =================================================================
    public static function createMensaje(array $data): array {
        if (self::$usingMySQL && self::$pdo) {
            try {
                $sql = "INSERT INTO mensajes_contacto (sede_id, nombre_completo, email, telefono, asunto, mensaje, estado) VALUES (?, ?, ?, ?, ?, ?, 'pendiente')";
                $stmt = self::$pdo->prepare($sql);
                $stmt->execute([
                    $data['sede_id'] ?? null,
                    $data['nombre_completo'],
                    $data['email'],
                    $data['telefono'] ?? null,
                    $data['asunto'] ?? 'Información general',
                    $data['mensaje']
                ]);
                $newId = (int) self::$pdo->lastInsertId();
                return array_merge(['id' => $newId, 'estado' => 'pendiente', 'created_at' => date('c')], $data);
            } catch (Throwable $e) {
                error_log("createMensaje MySQL error: " . $e->getMessage());
            }
        }

        $store = self::readJsonStore();
        $newItem = [
            'id' => time(),
            'sede_id' => $data['sede_id'] ?? null,
            'nombre_completo' => $data['nombre_completo'],
            'email' => $data['email'],
            'telefono' => $data['telefono'] ?? null,
            'asunto' => $data['asunto'] ?? 'Información general',
            'mensaje' => $data['mensaje'],
            'estado' => 'pendiente',
            'created_at' => date('c')
        ];
        array_unshift($store['mensajes'], $newItem);
        self::writeJsonStore($store);
        return $newItem;
    }

    public static function getMensajes(): array {
        if (self::$usingMySQL && self::$pdo) {
            try {
                $sql = "SELECT m.*, s.nombre AS sede_nombre FROM mensajes_contacto m LEFT JOIN sedes s ON m.sede_id = s.id ORDER BY m.created_at DESC";
                return self::$pdo->query($sql)->fetchAll();
            } catch (Throwable $e) {
                error_log("getMensajes MySQL error: " . $e->getMessage());
            }
        }
        $store = self::readJsonStore();
        return $store['mensajes'] ?? [];
    }

    public static function updateMensaje(int $id, array $data): ?array {
        if (self::$usingMySQL && self::$pdo) {
            try {
                if (isset($data['estado'])) {
                    $stmt = self::$pdo->prepare("UPDATE mensajes_contacto SET estado = ? WHERE id = ?");
                    $stmt->execute([$data['estado'], $id]);
                }
                $stmt = self::$pdo->prepare("SELECT * FROM mensajes_contacto WHERE id = ?");
                $stmt->execute([$id]);
                $row = $stmt->fetch();
                if ($row) return $row;
            } catch (Throwable $e) {
                error_log("updateMensaje MySQL error: " . $e->getMessage());
            }
        }

        $store = self::readJsonStore();
        foreach ($store['mensajes'] as &$m) {
            if ((int) ($m['id'] ?? 0) === $id) {
                $m = array_merge($m, $data);
                self::writeJsonStore($store);
                return $m;
            }
        }
        return null;
    }

    // =================================================================
    // REDES SOCIALES
    // =================================================================
    public static function getRedes(): array {
        if (self::$usingMySQL && self::$pdo) {
            try {
                return self::$pdo->query("SELECT * FROM redes_sociales WHERE activa = 1 ORDER BY orden ASC")->fetchAll();
            } catch (Throwable $e) {
                error_log("getRedes MySQL error: " . $e->getMessage());
            }
        }
        $store = self::readJsonStore();
        return $store['redes'] ?? [];
    }

    public static function updateRed(int $id, array $data): ?array {
        if (self::$usingMySQL && self::$pdo) {
            try {
                $fields = [];
                $params = [];
                $allowed = ['nombre_mostrar', 'usuario', 'url', 'icono', 'activa', 'orden'];
                foreach ($allowed as $f) {
                    if (array_key_exists($f, $data)) {
                        $fields[] = "`$f` = ?";
                        $params[] = $data[$f];
                    }
                }
                if (!empty($fields)) {
                    $params[] = $id;
                    $stmt = self::$pdo->prepare("UPDATE redes_sociales SET " . implode(', ', $fields) . " WHERE id = ?");
                    $stmt->execute($params);
                }
                $stmt = self::$pdo->prepare("SELECT * FROM redes_sociales WHERE id = ?");
                $stmt->execute([$id]);
                $row = $stmt->fetch();
                if ($row) return $row;
            } catch (Throwable $e) {
                error_log("updateRed MySQL error: " . $e->getMessage());
            }
        }

        $store = self::readJsonStore();
        foreach ($store['redes'] as &$r) {
            if ((int) ($r['id'] ?? 0) === $id) {
                $r = array_merge($r, $data);
                self::writeJsonStore($store);
                return $r;
            }
        }
        return null;
    }

    // =================================================================
    // CONTENIDO INSTITUCIONAL
    // =================================================================
    public static function getContenido(): array {
        if (self::$usingMySQL && self::$pdo) {
            try {
                return self::$pdo->query("SELECT * FROM contenido_institucional ORDER BY id ASC")->fetchAll();
            } catch (Throwable $e) {
                error_log("getContenido MySQL error: " . $e->getMessage());
            }
        }
        $store = self::readJsonStore();
        return $store['contenido'] ?? [];
    }

    public static function updateContenido(int $id, array $data): ?array {
        if (self::$usingMySQL && self::$pdo) {
            try {
                $fields = [];
                $params = [];
                $allowed = ['titulo', 'subtitulo', 'contenido', 'versiculo_referencia', 'versiculo_texto'];
                foreach ($allowed as $f) {
                    if (array_key_exists($f, $data)) {
                        $fields[] = "`$f` = ?";
                        $params[] = $data[$f];
                    }
                }
                if (!empty($fields)) {
                    $params[] = $id;
                    $stmt = self::$pdo->prepare("UPDATE contenido_institucional SET " . implode(', ', $fields) . " WHERE id = ?");
                    $stmt->execute($params);
                }
                $stmt = self::$pdo->prepare("SELECT * FROM contenido_institucional WHERE id = ?");
                $stmt->execute([$id]);
                $row = $stmt->fetch();
                if ($row) return $row;
            } catch (Throwable $e) {
                error_log("updateContenido MySQL error: " . $e->getMessage());
            }
        }

        $store = self::readJsonStore();
        foreach ($store['contenido'] as &$c) {
            if ((int) ($c['id'] ?? 0) === $id) {
                $c = array_merge($c, $data);
                self::writeJsonStore($store);
                return $c;
            }
        }
        return null;
    }
}
