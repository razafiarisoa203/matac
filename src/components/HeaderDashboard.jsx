// HeaderDashboard.jsx
import React, { useState, useRef, useEffect } from "react";
import { ArrowLeft, Menu, User, Globe, Sun, Moon } from "lucide-react";
import { LuBellRing } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { citoyenService } from "../services/api/citoyenService";
import { authService } from "../services/api/authService";

export default function HeaderDashboard({ toggleSidebar, isMobile, onProfileClick }) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [isProfileFormOpen, setIsProfileFormOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });
  const [citizenData, setCitizenData] = useState({
    nom: "",
    email: "",
    telephone: "",
  });
  const profileRef = useRef(null);
  const languageRef = useRef(null);

  const userData = authService.getUserInfo();
  const id_citizen = userData?.id_citizen || null;

  // 🔹 Gestion du thème sombre
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // 🔹 Gestion du changement de langue
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setIsLanguageOpen(false);
  };

  // 🔹 Navigation vers la page d'accueil
  const handleGoHome = () => {
    navigate('/');
  };

  // 🔹 Initialisation du thème
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // 🔹 Écouteur des changements de langue
  useEffect(() => {
    const handleLanguageChange = (lng) => setCurrentLanguage(lng);
    i18n.on('languageChanged', handleLanguageChange);
    return () => i18n.off('languageChanged', handleLanguageChange);
  }, [i18n]);

  // 🔹 Charger les données citoyen (dans useEffect)
  useEffect(() => {
    const fetchCitizenData = async () => {
      try {
        if (id_citizen) {
          const data = await citoyenService.getCitizenData(id_citizen);
          const formattedData = {
            nom: `${data?.citizen_lastname || ""} ${data?.citizen_name || ""}`,
            email: userData?.user_email || "",
            telephone: userData?.user_phone || "",
          };
          setCitizenData(formattedData);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données citoyen:", error);
      }
    };

    fetchCitizenData();
  }, [id_citizen, userData]);

  // 🔹 Fermer les menus si clic en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileFormOpen(false);
      }
      if (languageRef.current && !languageRef.current.contains(event.target)) {
        setIsLanguageOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🔹 Gestion du clic sur le profil
  const handleProfileClick = () => {
    setIsProfileFormOpen(!isProfileFormOpen);
    if (onProfileClick) onProfileClick();
  };

  // 🔹 Générer les initiales
  const getInitials = (name) => {
    if (!name) return "U";
    const words = name.trim().split(" ");
    return words.length > 1
      ? `${words[0][0]}${words[1][0]}`.toUpperCase()
      : name.slice(0, 2).toUpperCase();
  };

  return (
    <header className="fixed top-0 left-0 w-screen bg-green-50 dark:bg-gray-900 border-b border-transparent dark:border-gray-700 text-gray-800 dark:text-gray-100 flex items-center justify-between p-10 h-16 z-50 shadow-sm dark:shadow-black/30 transition-colors duration-300">
      <div className="flex items-center space-x-4">
        {isMobile ? (
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-full hover:bg-green-200 dark:hover:bg-gray-700 transition-colors"
          >
            <Menu size={24} className="text-black dark:text-white" />
          </button>
        ) : (
          <button
            onClick={handleGoHome}
            className="p-2 rounded-full hover:bg-green-200 dark:hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft size={24} className="text-black dark:text-white" />
          </button>
        )}
      </div>

      <div className="flex items-center space-x-2 mr-5">

        {/* Bouton profil */}
        <button
          onClick={handleProfileClick}
          className="flex items-center rounded-full bg-green-100 dark:bg-gray-800 hover:bg-green-200 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="flex items-center space-x-3 border-b border-gray-100 dark:border-gray-600 p-2 pr-5">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 text-white text-sm font-semibold">
              {getInitials(citizenData.nom)}
            </div>
            <div className="flex-1 text-left">
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">{citizenData.nom || "—"}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">{citizenData.email || "—"}</p>
            </div>
          </div>
        </button>

        {/* Bouton notifications */}
        <button
          className="p-2 text-black dark:text-white hover:bg-green-200 dark:hover:bg-gray-700 rounded-full transition-colors"
          aria-label="Notifications"
        >
          <LuBellRing className="w-5 h-5" />
        </button>

        {/* Bouton thème */}
        <button
          onClick={toggleDarkMode}
          className="p-2 text-black dark:text-white hover:bg-green-200 dark:hover:bg-gray-700 rounded-full transition-colors"
          aria-label={darkMode ? 'Désactiver le mode sombre' : 'Activer le mode sombre'}
        >
          {darkMode ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>

        {/* Bouton langue */}
        <div className="relative" ref={languageRef}>
          <button
            onClick={() => setIsLanguageOpen(!isLanguageOpen)}
            className="flex items-center space-x-1.5 px-3 py-2 text-sm font-semibold text-black dark:text-white bg-green-100 dark:bg-gray-800 hover:bg-green-200 dark:hover:bg-gray-700 rounded-full transition-colors border border-green-200 dark:border-gray-600"
          >
            <Globe className="w-4 h-4" />
            <span>{i18n.language === 'fr' ? 'FR' : i18n.language === 'mg' ? 'MG' : i18n.language.split('-')[0].toUpperCase()}</span>
          </button>

          {isLanguageOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-md shadow-lg dark:shadow-black/40 py-1 z-50">
              <button
                onClick={() => changeLanguage('fr')}
                className={`block px-4 py-2 text-sm w-full text-left ${i18n.language === 'fr'
                    ? 'bg-gray-100 dark:bg-gray-700 text-green-600 dark:text-green-400 font-medium'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
              >
                FR
              </button>
              <button
                onClick={() => changeLanguage('mg')}
                className={`block px-4 py-2 text-sm w-full text-left ${i18n.language === 'mg'
                    ? 'bg-gray-100 dark:bg-gray-700 text-green-600 dark:text-green-400 font-medium'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
              >
                MG
              </button>
            </div>
          )}
        </div>

      </div>

      {isProfileFormOpen && (
        <div
          ref={profileRef}
          className="absolute top-14 right-4 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl dark:shadow-black/40 border border-gray-200 dark:border-gray-700 p-4 animate-fadeIn"
        >
          {/* Détails utilisateur */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-gray-800 dark:text-gray-200">{citizenData.nom || "—"}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-gray-800 dark:text-gray-200">{citizenData.email || "—"}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-gray-800 dark:text-gray-200">{citizenData.telephone || "—"}</span>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex justify-end gap-2 pt-4 mt-4 border-t border-gray-100 dark:border-gray-600">
            <button
              onClick={() => setIsProfileFormOpen(false)}
              className="px-4 py-2 text-sm bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-md transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </header>
  );
}