import { handleNavClick } from "../utils/scrollToSection";
import { Link } from "react-router-dom";
import { useState } from "react";
import { User, X, Menu } from "lucide-react";

function NavigationBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    // Barre de navigation en haut sans fond
    <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent">
      <div className="px-10">
        <div className="flex items-center justify-between h-16">
          <div className="w-[10%]"></div>
          {/* Navigation desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to=""
              className="hover:text-[#098E00] px-3 py-2 text-sm font-medium text-gray-800"
            >
              Accueil
            </Link>
            <a
              href="#acte"
              onClick={(e) => handleNavClick(e, "acte")}
              className="hover:text-[#098E00] px-3 py-2 text-sm font-medium cursor-pointer text-gray-800"
            >
              Acte d'urbanisme
            </a>
            <a
              href="#objectifs"
              onClick={(e) => handleNavClick(e, "objectifs")}
              className="hover:text-[#098E00] px-3 py-2 text-sm font-medium cursor-pointer text-gray-800"
            >
              Objectifs
            </a>
            <a
              href="#services"
              onClick={(e) => handleNavClick(e, "services")}
              className="hover:text-[#098E00] px-3 py-2 text-sm font-medium cursor-pointer text-gray-800"
            >
              Services
            </a>
          </div>

          {/* Bouton connexion avec couleur verte */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/login"
              className="bg-[#098E00] text-white px-4 py-2 hover:bg-[#076B00] flex items-center space-x-2 transition-colors duration-300"
            >
              <User className="w-4 h-4" />
              <span>Connexion</span>
            </Link>
          </div>

          {/* Bouton menu mobile */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-800 hover:text-[#098E00] transition-colors duration-300"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavigationBar;
