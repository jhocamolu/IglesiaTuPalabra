<?php
declare(strict_types=1);

/**
 * =====================================================================
 * MOTOR JWT (JSON WEB TOKEN) NATIVO PARA PHP 8.1 - HS256
 * =====================================================================
 * Sin dependencias externas ni Composer. 100% compatible con jsonwebtoken de Node.
 */

class JWT {
    private static function base64UrlEncode(string $data): string {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    private static function base64UrlDecode(string $data): ?string {
        $remainder = strlen($data) % 4;
        if ($remainder) {
            $padlen = 4 - $remainder;
            $data .= str_repeat('=', $padlen);
        }
        $decoded = base64_decode(strtr($data, '-_', '+/'), true);
        return $decoded !== false ? $decoded : null;
    }

    /**
     * Genera un token JWT firmado con HS256
     */
    public static function encode(array $payload, string $secret, int $expirySeconds = 604800): string {
        $header = [
            'typ' => 'JWT',
            'alg' => 'HS256'
        ];

        $now = time();
        $payload['iat'] = $payload['iat'] ?? $now;
        $payload['exp'] = $payload['exp'] ?? ($now + $expirySeconds);

        $b64Header = self::base64UrlEncode((string) json_encode($header, JSON_UNESCAPED_SLASHES));
        $b64Payload = self::base64UrlEncode((string) json_encode($payload, JSON_UNESCAPED_SLASHES));

        $signature = hash_hmac('sha256', "$b64Header.$b64Payload", $secret, true);
        $b64Signature = self::base64UrlEncode($signature);

        return "$b64Header.$b64Payload.$b64Signature";
    }

    /**
     * Valida y decodifica un token JWT. Devuelve el payload o null si es inválido/expirado.
     */
    public static function decode(string $token, string $secret): ?array {
        $parts = explode('.', trim($token));
        if (count($parts) !== 3) {
            return null;
        }

        [$b64Header, $b64Payload, $b64Signature] = $parts;

        $headerJson = self::base64UrlDecode($b64Header);
        $payloadJson = self::base64UrlDecode($b64Payload);

        if (!$headerJson || !$payloadJson) {
            return null;
        }

        $header = json_decode($headerJson, true);
        if (!is_array($header) || ($header['alg'] ?? '') !== 'HS256') {
            return null;
        }

        // Verificar firma
        $expectedSignature = self::base64UrlEncode(hash_hmac('sha256', "$b64Header.$b64Payload", $secret, true));
        if (!hash_equals($expectedSignature, $b64Signature)) {
            return null;
        }

        $payload = json_decode($payloadJson, true);
        if (!is_array($payload)) {
            return null;
        }

        // Verificar expiración
        if (isset($payload['exp']) && (int) $payload['exp'] < time()) {
            return null;
        }

        return $payload;
    }
}
