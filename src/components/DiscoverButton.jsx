import React from "react";

const DiscoverButton = ({ to, className }) => {
  return (
    <a
      href={to}
      className={`relative inline-flex items-center overflow-hidden font-medium transition-all duration-500 ease-in-out rounded-lg group ${className}`}
    >
      {/* Partie gauche - Texte avec fond vert */}
      <div className="relative bg-[#098E00] text-white px-8 py-4 z-10 transition-colors duration-500 group-hover:bg-white group-hover:text-[#098E00] rounded-l-lg">
        Découvrir
      </div>

      {/* Partie droite - Flèche avec fond blanc et couleur verte */}
      <div className="relative bg-white text-[#098E00] px-6 py-4 z-10 transition-colors duration-500 group-hover:bg-[#098E00] group-hover:text-white rounded-r-lg">
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M13 5L20 12L13 19M4 12H20"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Overlay vert qui se déplace */}
      <div className="absolute inset-0 w-1/2 bg-[#098E00] transition-all duration-500 ease-in-out transform group-hover:translate-x-full z-0 rounded-lg"></div>
    </a>
  );
};

export default DiscoverButton;
