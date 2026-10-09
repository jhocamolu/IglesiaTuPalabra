import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'blue' | 'petrol' | 'white' | 'black' | 'gold' | 'current';
  withSlogan?: boolean;
  symbolOnly?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  variant = 'blue',
  withSlogan = true,
  symbolOnly = false,
  size = 'md'
}) => {
  // Brand colorimetry from Manual de Imagen:
  // Azul Petróleo: #0E5A6A / #136B7E (CMYK: C 60%, M 20%, Y 20%, K 4%)
  // Blanco: #FFFFFF / Negro: #111827 / Acento Dorado: #D4AF37
  const colorMap = {
    blue: '#0E5A6A',
    petrol: '#0E5A6A',
    white: '#FFFFFF',
    black: '#111827',
    gold: '#D4AF37',
    current: 'currentColor'
  };

  const strokeColor = colorMap[variant] || colorMap.blue;

  const sizeHeights = {
    xs: symbolOnly ? 'h-6' : 'h-6',
    sm: symbolOnly ? 'h-8' : (withSlogan ? 'h-9' : 'h-8'),
    md: symbolOnly ? 'h-11' : (withSlogan ? 'h-13' : 'h-10'),
    lg: symbolOnly ? 'h-14' : (withSlogan ? 'h-16' : 'h-14'),
    xl: symbolOnly ? 'h-20' : (withSlogan ? 'h-24' : 'h-20')
  };

  if (symbolOnly) {
    return (
      <div className={`inline-flex items-center justify-center select-none ${className}`}>
        <svg
          viewBox="0 0 280 350"
          className={`${sizeHeights[size]} w-auto transition-transform`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Tu Palabra - Símbolo Oficial"
        >
          <g stroke={strokeColor} strokeLinecap="round" strokeLinejoin="round">
            {/* Círculo (cabeza de la figura humana sobre la cruz/letra T) */}
            <circle cx="138" cy="134" r="16" strokeWidth="8" fill="none" />
            {/* Trazo vertical orgánico de la T (cruz y cuerpo) */}
            <path
              d="M 103 12 C 100 70, 99 140, 107 195 C 114 245, 128 300, 155 330 C 165 342, 171 332, 169 315 C 160 250, 148 185, 142 165 C 137 150, 133 175, 137 205 C 142 245, 153 260, 172 260 C 190 260, 203 235, 208 215 C 213 195, 214 245, 235 245 C 255 245, 270 215, 272 195"
              strokeWidth="9"
            />
            {/* Trazo horizontal dinámico de la T (los brazos de la cruz / figura humana) */}
            <path
              d="M 8 226 C 65 218, 140 186, 255 130"
              strokeWidth="9.5"
            />
          </g>
        </svg>
      </div>
    );
  }

  return (
    <div className={`inline-flex flex-col items-center select-none ${className}`}>
      <svg
        viewBox="0 0 750 350"
        className={`${sizeHeights[size]} w-auto transition-transform`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Tu Palabra - Un Encuentro de Gracia"
      >
        <g stroke={strokeColor} strokeLinecap="round" strokeLinejoin="round">
          {/* Círculo (cabeza de la figura humana sobre la cruz/letra T) */}
          <circle
            cx="138"
            cy="134"
            r="16"
            strokeWidth="8"
            fill="none"
          />

          {/* Trazo vertical orgánico de la T (mano alzada, cruz y cuerpo humano) */}
          <path
            d="M 103 12 C 100 70, 99 140, 107 195 C 114 245, 128 300, 155 330 C 165 342, 171 332, 169 315 C 160 250, 148 185, 142 165 C 137 150, 133 175, 137 205 C 142 245, 153 260, 172 260 C 190 260, 203 235, 208 215 C 213 195, 214 245, 235 245 C 255 245, 270 215, 272 195"
            strokeWidth="9"
          />

          {/* Trazo horizontal dinámico de la T (los brazos de la cruz / figura humana) */}
          <path
            d="M 8 226 C 65 218, 140 186, 255 130"
            strokeWidth="9.5"
          />

          {/* Letra 'P' de 'Palabra' (cursiva elegante) */}
          <path
            d="M 335 165 C 320 200, 305 245, 290 290 M 335 165 C 365 140, 415 142, 422 175 C 428 200, 405 228, 362 238 C 340 242, 320 244, 305 245"
            strokeWidth="8.5"
          />

          {/* Letra 'a' inicial */}
          <path
            d="M 405 208 C 390 195, 370 200, 362 215 C 352 232, 365 250, 385 248 C 405 245, 418 225, 418 200 L 418 245 C 418 250, 425 250, 432 245"
            strokeWidth="8"
          />

          {/* Letra 'l' esbelta con lazo ascendente */}
          <path
            d="M 432 245 C 445 235, 470 145, 482 120 C 490 102, 498 108, 492 128 C 478 175, 460 220, 462 245 C 463 250, 472 250, 480 242"
            strokeWidth="8"
          />

          {/* Letra 'a' media */}
          <path
            d="M 502 205 C 490 195, 472 202, 468 218 C 462 235, 474 250, 492 248 C 508 245, 518 225, 518 200 L 518 245 C 518 250, 525 250, 532 242"
            strokeWidth="8"
          />

          {/* Letra 'b' con ascendente alto */}
          <path
            d="M 532 242 C 542 235, 568 145, 580 120 C 588 102, 595 108, 590 128 C 578 175, 565 220, 570 245 C 578 252, 600 245, 608 225 C 612 215, 608 208, 600 208"
            strokeWidth="8"
          />

          {/* Letra 'r' */}
          <path
            d="M 605 208 C 615 205, 630 205, 638 215 C 638 225, 632 238, 632 245 C 632 250, 640 250, 648 242"
            strokeWidth="8"
          />

          {/* Letra 'a' final con remate abierto y fluido */}
          <path
            d="M 672 205 C 660 195, 642 202, 638 218 C 632 235, 644 250, 662 248 C 678 245, 688 225, 688 200 L 688 245 C 692 255, 715 250, 742 238"
            strokeWidth="8"
          />
        </g>

        {/* Slogan Oficial: UN ENCUENTRO DE GRACIA (Tipografía Petita con tracking amplio) */}
        {withSlogan && (
          <text
            x="485"
            y="312"
            textAnchor="middle"
            fill={strokeColor}
            fontSize="26"
            fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
            fontWeight="600"
            letterSpacing="0.32em"
          >
            UN ENCUENTRO DE GRACIA
          </text>
        )}
      </svg>
    </div>
  );
};
