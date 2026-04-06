import React from 'react';

export function SansMercantileLogo() {
  const brandOrange = '#ff7a00';

  return (
    <div className="group relative inline-flex items-center justify-center cursor-pointer h-10 min-w-[200px]">
      {/* Text Logo Layer - Sans Mercantile Branding */}
      <div className="flex items-center gap-2 transition-all duration-500 ease-in-out transform group-hover:scale-50 group-hover:opacity-0 pointer-events-none">
        <span className="text-xl font-bold" style={{ color: brandOrange }}>
          Sans
        </span>
        <span 
          className="text-xl font-bold"
          style={{
            background: 'linear-gradient(135deg, #ffffff, #e0e0e0)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: '0 0 20px rgba(255, 255, 255, 0.3)',
          }}
        >
          Mercantile™
        </span>
      </div>

      {/* Icon Logo Layer - Using the OMEGA logo.svg URL */}
      <div
        className="absolute inset-0 flex items-center justify-center transition-all duration-500 ease-in-out transform scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100"
      >
        <img 
          src="img/logo.svg" 
          alt="Sans Mercantile Logo" 
          className="w-10 h-10 object-contain"
          // Adding a subtle drop shadow to match the glowing effect from the index file
          style={{
            filter: 'drop-shadow(0 0 8px rgba(0, 255, 136, 0.4))'
          }}
          onError={(e) => {
            // Fallback just in case the path differs in your dev environment
            console.error("Logo not found at img/logo.svg");
          }}
        />
      </div>
      
      {/* Invisible anchor for navigation */}
      <a href="/" className="absolute inset-0 z-10" aria-label="Sans Mercantile Home"></a>
    </div>
  );
}

export default SansMercantileLogo;