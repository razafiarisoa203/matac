// import ApartmentIcon from '@mui/icons-material/Apartment';
import { Menu, User, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { handleNavClick } from "../utils/scrollToSection";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="w-full fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      {/* Bandeau supérieur avec logo + texte vert */}
      <div className="w-full flex items-center justify-between">
        {/* Logos à gauche */}
        <div className="flex justify-around px-4 bg-white w-[30%]">
          <div className="w-12 h-20 flex items-center justify-center">
            <img src="src/assets/logo/MDAT.jpeg" alt="MDAT" className="w-12 h-12 object-cover" />
          </div>
          <div className="w-12 h-20 flex items-center justify-center">
            <img src="src/assets/logo/REPUBLIQUE.png" alt="Republique" className="w-12 h-12 object-cover" />
          </div>
          <div className="w-12 h-20 flex items-center justify-center">
            <img src="src/assets/logo/OATF.jpg" alt="OATF" className="w-12 h-12 object-cover" />
          </div>
          <div className="w-12 h-20 flex items-center justify-center">
            <img src="src/assets/logo/logoUF.webp" alt="OATF" className="w-12 h-20 scale-65 object-cover" />
          </div>
          <div className="w-12 h-20 flex items-center justify-center">
            <img src="src/assets/logo/pnudlogo.png" alt="OATF" className="w-12 h-20 scale-75 object-cover" />
          </div>
        </div>

        {/* Bande verte à droite */}
        <div className="flex-1 bg-lime-300 text-right py-5 px-6">
          <span className="block text-gray-700 text-lg">
            Ministère en charge de l'Aménagement du Territoire
          </span>
          <span className="block text-gray-700 text-lg">
            Autorisation de Construire
          </span>
        </div>
      </div>

      {/* Barre de navigation en bas */}
      <nav className="bg-gray-800 text-white">
        <div className="px-10">
          <div className="flex items-center justify-between h-16">
            <div className="w-[10%]"></div>
            {/* Navigation desktop */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="hover:text-lime-400 px-3 py-2 text-sm font-medium">
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
                href="#objectifs"
                onClick={(e) => handleNavClick(e, "objectifs")}
                className="hover:text-lime-400 px-3 py-2 text-sm font-medium cursor-pointer"
              >
                Objectifs
              </a>
              <a
                href="#services"
                onClick={(e) => handleNavClick(e, "services")}
                className="hover:text-lime-400 px-3 py-2 text-sm font-medium cursor-pointer"
              >
                Services
              </a>
            </div>

            {/* Bouton connexion + icône bâtiment */}
            <div className="hidden md:flex items-center space-x-4">
              <Link
                to="/login"
                className="bg-lime-300 text-gray-800 px-4 py-2 hover:bg-lime-500 flex items-center space-x-2"
              >
                <User className="w-4 h-4" />
                <span>Connexion</span>
              </Link>
              {/* <ApartmentIcon className="w-8 h-8 text-white" /> */}
            </div>

            {/* Bouton menu mobile */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-300 hover:text-white"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
