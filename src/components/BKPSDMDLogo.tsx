import React from 'react';

interface BKPSDMDLogoProps {
  className?: string;
  size?: number;
}

export default function BKPSDMDLogo({ className = '', size = 48 }: BKPSDMDLogoProps) {
  return (
    <div 
      className={`flex items-center justify-center shrink-0 select-none overflow-visible ${className}`} 
      style={{ 
        width: size, 
        height: size, 
        minWidth: size, 
        minHeight: size 
      }}
    >
      <img
        src="/logo-ttu.png"
        alt="Logo Kabupaten Timor Tengah Utara"
        className="w-full h-full object-contain select-none"
        style={{ 
          width: '100%', 
          height: '100%', 
          objectFit: 'contain' 
        }}
      />
    </div>
  );
}
