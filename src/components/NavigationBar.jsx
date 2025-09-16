import { handleNavClick } from "../utils/scrollToSection";
import { Link } from "react-router-dom";
import { useState } from "react";
import { User, X, Menu, Zap, Globe } from "lucide-react";

function NavigationBar() {
  const [language, setLanguage] = useState("fra");
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);

  return (
    // Barre de navigation en haut sans fond
    <nav className="px-10 bg-cover bg-center bg-no-repeat bg-white">
      <div className="flex items-center justify-between h-16">
        {/* Navigation desktop */}
        <div className="hidden md:flex items-center space-x-8">
          <a
            href="#accueil"
            onClick={(e) => handleNavClick(e, "accueil")}
            className="hover:text-[#269745] px-3 py-2 text-sm font-medium cursor-pointer text-gray-800"
          >
            Accueil
          </a>
          <a
            href="#actes-urbanisme"
            onClick={(e) => handleNavClick(e, "actes-urbanisme")}
            className="hover:text-[#269745] px-3 py-2 text-sm font-medium cursor-pointer text-gray-800"
          >
            Acte d'urbanisme
          </a>
          <a
            href="#objectifs"
            onClick={(e) => handleNavClick(e, "objectifs")}
            className="hover:text-[#269745] px-3 py-2 text-sm font-medium cursor-pointer text-gray-800"
          >
            Objectifs
          </a>
          <a
            href="#services"
            onClick={(e) => handleNavClick(e, "services")}
            className="hover:text-[#269745] px-3 py-2 text-sm font-medium cursor-pointer text-gray-800"
          >
            Services
          </a>
        </div>

        {/* Bouton connexion avec couleur verte et nouveaux éléments */}
        <div className="hidden md:flex items-center space-x-4">
          <Link
            to="/login"
            className="bg-[#269745] text-white px-4 py-2 rounded-lg hover:bg-[#1e7e3a] flex items-center space-x-2 transition-colors duration-300"
          >
            <User className="w-4 h-4" />
            <span>Connexion</span>
          </Link>

          {/* Sélecteur de langue avec icône globe */}
          <div className="relative">
            <button
              onClick={() => setIsLanguageOpen(!isLanguageOpen)}
              className="flex items-center space-x-1 text-gray-800 hover:text-[#269745] transition-colors"
            >
              <Globe className="w-5 h-5" />
              <span className="text-sm font-medium">
                {language.toUpperCase()}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-4 w-4 transition-transform ${isLanguageOpen ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Menu déroulant langue */}
            {isLanguageOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg py-1 z-50">
                <button
                  onClick={() => {
                    setLanguage("fra");
                    setIsLanguageOpen(false);
                  }}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  Français (FRA)
                </button>
                <button
                  onClick={() => {
                    setLanguage("mlg");
                    setIsLanguageOpen(false);
                  }}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  Malagasy (MLG)
                </button>
                {/* Icône Flash */}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavigationBar;
