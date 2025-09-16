import { handleNavClick } from "../utils/scrollToSection";
import { Link } from "react-router-dom";
import { useState } from "react";
import { User, Globe, Menu, X } from "lucide-react";

function NavigationBar() {
  const [language, setLanguage] = useState("fra");
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("accueil");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleClick = (e, section) => {
    handleNavClick(e, section);
    setActiveSection(section);
    setIsMobileMenuOpen(false); // Close mobile menu on click
  };

  return (
    <nav className="px-4 md:px-10 bg-cover bg-center bg-no-repeat bg-white shadow-sm w-full z-50">
      <div className="flex items-center justify-between h-16">
        {/* Navigation desktop */}
        <div className="hidden md:flex items-center space-x-8">
          {["accueil", "actes-urbanisme", "objectifs", "services"].map((section) => (
            <a
              key={section}
              href={`#${section}`}
              onClick={(e) => handleClick(e, section)}
              className={`px-3 py-2 text-sm font-medium cursor-pointer transition-colors duration-300 ${
                activeSection === section ? "text-[#269745]" : "text-gray-800 hover:text-[#269745]"
              }`}
            >
              {section === "accueil" && "Accueil"}
              {section === "actes-urbanisme" && "Acte d'urbanisme"}
              {section === "objectifs" && "Objectifs"}
              {section === "services" && "Services"}
            </a>
          ))}
        </div>

        {/* Bouton connexion & langue desktop */}
        <div className="hidden md:flex items-center space-x-4">
          <Link
            to="/login"
            className="bg-[#269745] text-white px-4 py-2 rounded-lg hover:bg-[#1e7e3a] flex items-center space-x-2 transition-colors duration-300"
          >
            <User className="w-4 h-4" />
            <span>Connexion</span>
          </Link>

          <div className="relative">
            <button
              onClick={() => setIsLanguageOpen(!isLanguageOpen)}
              className="flex items-center space-x-1 text-gray-800 hover:text-[#269745] transition-colors"
            >
              <Globe className="w-5 h-5" />
              <span className="text-sm font-medium">{language.toUpperCase()}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-4 w-4 transition-transform ${isLanguageOpen ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

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
              </div>
            )}
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-2 bg-white shadow-md rounded-lg py-4 px-4 space-y-2">
          {["accueil", "actes-urbanisme", "objectifs", "services"].map((section) => (
            <a
              key={section}
              href={`#${section}`}
              onClick={(e) => handleClick(e, section)}
              className={`block px-3 py-2 text-sm font-medium cursor-pointer transition-colors duration-300 ${
                activeSection === section ? "text-[#269745]" : "text-gray-800 hover:text-[#269745]"
              }`}
            >
              {section === "accueil" && "Accueil"}
              {section === "actes-urbanisme" && "Acte d'urbanisme"}
              {section === "objectifs" && "Objectifs"}
              {section === "services" && "Services"}
            </a>
          ))}

          <Link
            to="/login"
            className="block bg-[#269745] text-white px-4 py-2 rounded-lg hover:bg-[#1e7e3a] flex items-center space-x-2 transition-colors duration-300"
          >
            <User className="w-4 h-4" />
            <span>Connexion</span>
          </Link>

          <div className="relative">
            <button
              onClick={() => setIsLanguageOpen(!isLanguageOpen)}
              className="flex items-center space-x-1 text-gray-800 hover:text-[#269745] transition-colors mt-2"
            >
              <Globe className="w-5 h-5" />
              <span className="text-sm font-medium">{language.toUpperCase()}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-4 w-4 transition-transform ${isLanguageOpen ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

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
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default NavigationBar;
