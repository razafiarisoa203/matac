import { useState } from "react";
import { Menu, X, User, Building } from "lucide-react";
import { Link } from "react-router-dom";
import { handleNavClick } from "../utils/scrollToSection";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      {/* Bandeau vert */}
      <div className="bg-lime-400 text-right px-6 py-2">
        <span className="text-gray-700 text-sm">
          Ministère en charge de l'Aménagement du Territoire
        </span>
        <br />
        <span className="text-gray-700 text-sm">
          Autorisation de Construire
        </span>
      </div>

      {/* Barre de navigation */}
      <nav className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <div className="flex space-x-2">
                <div className="w-8 h-8 bg-white rounded  flex items-center justify-center">
                  <img
                    src="src/assets/logo/MDAT.jpeg"
                    alt="MDAT"
                    className="w-6 h-6 object-cover  "
                  />
                </div>
                <div className="w-8 h-8 bg-white rounded  flex items-center justify-center">
                  <img
                    src="src/assets/logo/REPUBLIQUE.png"
                    alt="RÃ©publique"
                    className="w-6 h-6 object-cover  "
                  />
                </div>
                <div className="w-8 h-8 bg-white  rounded flex items-center justify-center">
                  <img
                    src="src/assets/logo/OATF.jpg"
                    alt="OATF"
                    className="w-6 h-6 object-cover  "
                  />
                </div>
              </div>
            </div>

            {/* Navigation desktop */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <Link
                  to="/"
                  className="hover:text-lime-400 px-3 py-2 text-sm font-medium"
                >
                  Accueil
                </Link>
                <a
                  href="#acte"
                  onClick={(e) => handleNavClick(e, "acte")}
                  className="hover:text-lime-400 px-3 py-2 text-sm font-medium cursor-pointer"
                >
                  Acte d'urbanisme
                </a>
                <a
                  href="#services"
                  onClick={(e) => handleNavClick(e, "services")}
                  className="hover:text-lime-400 px-3 py-2 text-sm font-medium cursor-pointer"
                >
                  Services
                </a>
                <a
                  href="#objectifs"
                  onClick={(e) => handleNavClick(e, "objectifs")}
                  className="hover:text-lime-400 px-3 py-2 text-sm font-medium cursor-pointer"
                >
                  Objectifs
                </a>
              </div>
            </div>

            {/* Bouton connexion */}
            <div className="hidden md:block">
              <Link
                to="/login"
                className="bg-lime-400 text-gray-800 px-4 py-2 rounded  hover:bg-lime-500 flex items-center space-x-2"
              >
                <User className="w-4 h-4" />
                <span>Connexion</span>
              </Link>
            </div>

            {/* Bouton menu mobile */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-300 hover:text-white"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>

            {/* IcÃ´ne bÃ¢timent */}
            <div className="hidden md:block">
              <Building className="w-8 h-8 text-lime-400" />
            </div>
          </div>
        </div>

        {/* Menu mobile */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-700">
              <Link
                to="/"
                className="block px-3 py-2 text-base font-medium hover:text-lime-400"
                onClick={() => setIsMenuOpen(false)}
              >
                Accueil
              </Link>
              <a
                href="#acte"
                onClick={(e) => {
                  handleNavClick(e, "acte");
                  setIsMenuOpen(false);
                }}
                className="block px-3 py-2 text-base font-medium hover:text-lime-400 cursor-pointer"
              >
                Acte d'urbanisme
              </a>
              <a
                href="#services"
                onClick={(e) => {
                  handleNavClick(e, "services");
                  setIsMenuOpen(false);
                }}
                className="block px-3 py-2 text-base font-medium hover:text-lime-400 cursor-pointer"
              >
                Services
              </a>
              <a
                href="#objectifs"
                onClick={(e) => {
                  handleNavClick(e, "objectifs");
                  setIsMenuOpen(false);
                }}
                className="block px-3 py-2 text-base font-medium hover:text-lime-400 cursor-pointer"
              >
                Objectifs
              </a>
              <Link
                to="/login"
                className="w-full mt-2 bg-lime-400 text-gray-800 px-4 py-2   hover:bg-lime-500 flex items-center justify-center space-x-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <User className="w-4 h-4" />
                <span>Connexion</span>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
