import { handleNavClick } from "../utils/scrollToSection";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { User, Globe, Menu, X } from "lucide-react";

function NavigationBar() {
  const { t, i18n } = useTranslation();
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("accueil");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Mettre à jour le document title et la direction du texte en fonction de la langue
  useEffect(() => {
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
  }, [i18n.language]);
  
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setIsLanguageOpen(false);
  };

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
            <span>{t('common.login')}</span>
          </Link>

          <div className="relative">
            <button
              onClick={() => setIsLanguageOpen(!isLanguageOpen)}
              className="flex items-center space-x-1 text-gray-800 hover:text-[#269745] transition-colors"
            >
              <Globe className="w-5 h-5" />
              <span className="text-sm font-medium">{i18n.language.toUpperCase()}</span>
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
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <button
                  onClick={() => changeLanguage('fr')}
                  className={`block px-4 py-2 text-sm w-full text-left ${
                    i18n.language === 'fr' 
                      ? 'bg-gray-100 text-[#269745] font-medium' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {t('languages.fr')}
                </button>
                <button
                  onClick={() => changeLanguage('mg')}
                  className={`block px-4 py-2 text-sm w-full text-left ${
                    i18n.language === 'mg' 
                      ? 'bg-gray-100 text-[#269745] font-medium' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {t('languages.mg')}
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
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-md py-2 z-40">
          {["accueil", "actes-urbanisme", "objectifs", "services"].map((section) => {
            let sectionName = '';
            switch (section) {
              case 'accueil':
                sectionName = t('navigation.home');
                break;
              case 'actes-urbanisme':
                sectionName = t('navigation.urbanPlanningActs');
                break;
              case 'objectifs':
                sectionName = t('navigation.objectives');
                break;
              case 'services':
                sectionName = t('navigation.services');
                break;
              default:
                sectionName = section;
            }
            
            return (
              <a
                key={section}
                href={`#${section}`}
                onClick={(e) => handleClick(e, section)}
                className={`block px-4 py-2 text-base font-medium ${
                  activeSection === section ? "text-[#269745]" : "text-gray-800 hover:text-[#269745]"
                }`}
              >
                {sectionName}
              </a>
            );
          })}
          <div className="border-t border-gray-200 my-2"></div>
          <Link
            to="/login"
            className="block px-4 py-2 text-base font-medium text-gray-800 hover:text-[#269745]"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {t('common.login')}
          </Link>
          <div className="px-4 py-2">
            <div className="flex items-center space-x-2 text-gray-800">
              <Globe className="w-5 h-5" />
              <span className="text-base font-medium">{t('common.language')}</span>
            </div>
            <div className="mt-2 space-y-1">
              <button
                onClick={() => {
                  changeLanguage('fr');
                  setIsMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 text-sm rounded ${
                  i18n.language === 'fr' 
                    ? 'bg-gray-100 text-[#269745] font-medium' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {t('languages.fr')}
              </button>
              <button
                onClick={() => {
                  changeLanguage('mg');
                  setIsMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 text-sm rounded ${
                  i18n.language === 'mg' 
                    ? 'bg-gray-100 text-[#269745] font-medium' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {t('languages.mg')}
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default NavigationBar;
