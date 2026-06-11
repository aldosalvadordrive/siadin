import React, { useState } from 'react';

interface GarudaLogoProps {
  className?: string;
  size?: number;
  grayscale?: boolean;
}

const GARUDA_SOURCES = [
  '/garuda-pancasila.png?v=3',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/National_emblem_of_Indonesia_Garuda_Pancasila.svg/1000px-National_emblem_of_Indonesia_Garuda_Pancasila.svg.png',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/National_emblem_of_Indonesia_Garuda_Pancasila.svg/1280px-National_emblem_of_Indonesia_Garuda_Pancasila.svg.png'
];

export default function GarudaLogo({ className = '', size = 85, grayscale = false }: GarudaLogoProps) {
  const [imgIndex, setImgIndex] = useState(0);
  const [hasError, setHasError] = useState(false);

  const handleImgError = () => {
    if (imgIndex < GARUDA_SOURCES.length - 1) {
      setImgIndex(prev => prev + 1);
    } else {
      setHasError(true);
    }
  };

  return (
    <div
      id="garuda-logo-container"
      className={`flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      {!hasError ? (
        <img
          id="garuda-logo-img"
          src={GARUDA_SOURCES[imgIndex]}
          alt="Lambang Negara Garuda Pancasila"
          referrerPolicy="no-referrer"
          className={`w-full h-full object-contain select-none transition-all duration-300 ${
            grayscale ? 'filter grayscale brightness-50 contrast-125' : ''
          }`}
          onError={handleImgError}
        />
      ) : (
        <svg
          id="garuda-logo-svg"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`w-full h-full select-none ${grayscale ? 'text-slate-700' : 'text-amber-600'}`}
        >
          {/* Detailed fallback geometric/stylized representation of Garuda Pancasila */}
          {/* Wings */}
          <path
            d="M 50,30 C 35,28 15,22 8,38 C 12,48 24,52 35,46 C 40,44 46,42 50,42 C 54,42 60,44 65,46 C 76,52 88,48 92,38 C 85,22 65,28 50,30 Z"
            fill="currentColor"
            stroke="#0000"
          />
          <path
            d="M 50,30 C 30,30 20,40 12,56 C 18,60 28,58 36,52 C 40,49 46,44 50,44 C 54,44 60,49 64,52 C 72,58 82,60 88,56 C 80,40 70,30 50,30 Z"
            fill="currentColor"
            opacity="0.85"
          />
          
          {/* Tail */}
          <path
            d="M 42,42 L 35,80 C 40,83 45,84 50,84 C 55,84 60,83 65,80 L 58,42 Z"
            fill="currentColor"
            stroke="rgba(0,0,0,0.1)"
            strokeWidth="0.5"
          />
          <path
            d="M 45,42 L 40,74 C 43,76 47,77 50,77 C 53,77 57,76 60,74 L 55,42 Z"
            fill="currentColor"
            opacity="0.75"
          />
          
          {/* Body and Head */}
          <path
            d="M 50,16 C 53,16 55,18 56,21 C 57,19 59,18 61,18 L 61,20 C 59,20 57,21 57,23 L 50,44 L 43,23 C 43,21 41,20 39,20 L 39,18 C 41,18 43,19 44,21 C 45,18 47,16 50,16 Z"
            fill="currentColor"
          />
          {/* Beak / Head detail */}
          <path
            d="M 50,16 Q 52,14 54,15 Q 52,17 50,18 Z"
            fill="currentColor"
          />
          {/* Shield in center */}
          <path
            d="M 42,32 L 58,32 C 58,46 56,52 50,56 C 44,52 42,46 42,32 Z"
            fill="#dc2626"
            stroke="#ffffff"
            strokeWidth="1.5"
          />
          {/* Shield cross divider */}
          <line x1="42" y1="42" x2="58" y2="42" stroke="#ffffff" strokeWidth="1" />
          <line x1="50" y1="32" x2="50" y2="56" stroke="#ffffff" strokeWidth="1" />
          
          {/* Heart/Shield center mini shield */}
          <path
            d="M 47,40 L 53,40 C 53,46 52,48 50,50 C 48,48 47,46 47,40 Z"
            fill="#000000"
          />
          <polygon points="50,41 51,43 53,43 51,44 52,46 50,45 48,46 49,44 47,43 49,43" fill="#facc15" />
          
          {/* Scroll under feet */}
          <path
            d="M 33,65 C 40,68 60,68 67,65 L 67,69 C 60,72 40,72 33,69 Z"
            fill="#ffffff"
            stroke="currentColor"
            strokeWidth="0.5"
          />
          <text x="50" y="69" textAnchor="middle" fontSize="3" fontWeight="bold" fill="currentColor">
            BHINNEKA TUNGGAL IKA
          </text>
        </svg>
      )}
    </div>
  );
}
