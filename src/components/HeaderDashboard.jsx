// HeaderDashboard.jsx
import React, { useState, useRef, useEffect } from "react";
import { ArrowLeft, Menu, Globe, Sun, Moon, Mail, Phone, X } from "lucide-react";
import { LuBellRing } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { citoyenService } from "../services/api/citoyenService";
import { authService } from "../services/api/authService";

export default function HeaderDashboard({ toggleSidebar, isMobile, onProfileClick }) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [isProfileFormOpen, setIsProfileFormOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });
  const [citizenData, setCitizenData] = useState({
    nom: "",
    email: "",
    telephone: "",
  });
  const profileRef = useRef(null);
  const languageRef = useRef(null);

  const userData = authService.getUserInfo();
  const id_citizen = userData?.id_citizen || userData?.citizen_id || null;
  const fallbackName =
    userData?.user_pseudo ||
    userData?.username ||
    [userData?.citizen_name, userData?.citizen_lastname].filter(Boolean).join(" ");

  // 🔹 Gestion du thème sombre
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode);
    if (newDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // 🔹 Gestion du changement de langue
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setIsLanguageOpen(false);
  };

  // 🔹 Navigation vers la page d'accueil
  const handleGoHome = () => {
    navigate("/");
  };

  // 🔹 Initialisation du thème
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // 🔹 Écouteur des changements de langue
  useEffect(() => {
    const handleLanguageChange = (lng) => setCurrentLanguage(lng);
    i18n.on("languageChanged", handleLanguageChange);
    return () => i18n.off("languageChanged", handleLanguageChange);
  }, [i18n]);

  // 🔹 Charger les données citoyen
  useEffect(() => {
    const fetchCitizenData = async () => {
      try {
        if (id_citizen) {
          const data = await citoyenService.getCitizenData(id_citizen);
          const formattedData = {
            nom:
              `${data?.citizen_lastname || ""} ${data?.citizen_name || ""}`.trim() ||
              fallbackName ||
              "Utilisateur",
            email: userData?.user_email || userData?.email || "",
            telephone: userData?.user_phone || userData?.phone_number || "",
          };
          setCitizenData(formattedData);
        } else {
          setCitizenData({
            nom: fallbackName || "Utilisateur",
            email: userData?.user_email || userData?.email || "",
            telephone: userData?.user_phone || userData?.phone_number || "",
          });
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données citoyen:", error);
      }
    };

    fetchCitizenData();
  }, [
    id_citizen,
    fallbackName,
    userData?.user_email,
    userData?.email,
    userData?.user_phone,
    userData?.phone_number,
  ]);

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
    setIsProfileFormOpen((prev) => !prev);
    if (onProfileClick) onProfileClick();
  };

  // 🔹 Générer les initiales
  const getInitials = (name) => {
    if (!name) return "U";
    const words = name.trim().split(/\s+/).filter(Boolean);
    return words.length > 1
      ? `${words[0][0]}${words[1][0]}`.toUpperCase()
      : name.slice(0, 2).toUpperCase();
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-green-50/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-green-100 dark:border-gray-700 text-gray-800 dark:text-gray-100 flex items-center justify-between px-4 h-16 z-50 shadow-sm dark:shadow-black/30 transition-colors duration-300">
      {/* Left */}
      <div className="flex items-center space-x-3">
        {isMobile ? (
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-full hover:bg-green-200/80 dark:hover:bg-gray-700 transition-colors"
            aria-label="Menu"
          >
            <Menu size={22} className="text-gray-800 dark:text-white" />
          </button>
        ) : (
          <button
            onClick={handleGoHome}
            className="p-2 rounded-full hover:bg-green-200/80 dark:hover:bg-gray-700 transition-colors"
            aria-label="Retour à l'accueil"
          >
            <ArrowLeft size={22} className="text-gray-800 dark:text-white" />
          </button>
        )}
      </div>

      {/* Right */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Bouton profil */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={handleProfileClick}
            className="flex items-center gap-2.5 rounded-full bg-green-100/80 dark:bg-gray-800 hover:bg-green-200/80 dark:hover:bg-gray-700 transition-all duration-200 border border-green-200/60 dark:border-gray-600 pl-1.5 pr-3 py-1.5 group"
          >
            <div className="w-9 h-9 flex items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700 text-white text-sm font-semibold shadow-sm ring-2 ring-white/30 dark:ring-gray-900/50 group-hover:scale-105 transition-transform">
              {getInitials(citizenData.nom)}
            </div>
            <div className="hidden sm:block text-left min-w-0">
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate max-w-[140px]">
                {citizenData.nom || "Utilisateur"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[140px]">
                {citizenData.email || "—"}
              </p>
            </div>
          </button>

          {/* Dropdown profil */}
          {isProfileFormOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl dark:shadow-black/50 border border-gray-200/80 dark:border-gray-700 overflow-hidden animate-in fade-in zoom-in-95 duration-150 z-50">
              {/* Header du dropdown */}
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700 px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white text-lg font-bold ring-2 ring-white/40">
                    {getInitials(citizenData.nom)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-semibold text-white truncate">
                      {citizenData.nom || "Utilisateur"}
                    </h3>
                    <p className="text-sm text-green-100/90 truncate">Citoyen</p>
                  </div>
                </div>
              </div>

              {/* Infos */}
              <div className="px-4 py-3 space-y-2.5">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-green-50 dark:bg-gray-700/60 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                    <p className="font-medium text-gray-800 dark:text-gray-100 truncate">
                      {citizenData.email || "—"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-green-50 dark:bg-gray-700/60 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Téléphone</p>
                    <p className="font-medium text-gray-800 dark:text-gray-100 truncate">
                      {citizenData.telephone || "—"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="border-t border-gray-100 dark:border-gray-700 px-3 py-3">
                <button
                  onClick={() => setIsProfileFormOpen(false)}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  Fermer
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Notifications */}
        <button
          className="p-2.5 text-gray-700 dark:text-gray-200 hover:bg-green-200/70 dark:hover:bg-gray-700 rounded-full transition-colors relative"
          aria-label="Notifications"
        >
          <LuBellRing className="w-5 h-5" />
        </button>

        {/* Thème */}
        <button
          onClick={toggleDarkMode}
          className="p-2.5 text-gray-700 dark:text-gray-200 hover:bg-green-200/70 dark:hover:bg-gray-700 rounded-full transition-colors"
          aria-label={darkMode ? "Désactiver le mode sombre" : "Activer le mode sombre"}
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Langue */}
        <div className="relative" ref={languageRef}>
          <button
            onClick={() => setIsLanguageOpen(!isLanguageOpen)}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-gray-800 dark:text-white bg-green-100/80 dark:bg-gray-800 hover:bg-green-200/80 dark:hover:bg-gray-700 rounded-full transition-colors border border-green-200/60 dark:border-gray-600"
          >
            <Globe className="w-4 h-4" />
            <span>
              {i18n.language === "fr"
                ? "FR"
                : i18n.language === "mg"
                ? "MG"
                : i18n.language.split("-")[0].toUpperCase()}
            </span>
          </button>

          {isLanguageOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg shadow-lg dark:shadow-black/40 py-1 z-50 overflow-hidden">
              <button
                onClick={() => changeLanguage("fr")}
                className={`block w-full px-4 py-2.5 text-sm text-left transition-colors ${
                  i18n.language === "fr"
                    ? "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-medium"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                Français
              </button>
              <button
                onClick={() => changeLanguage("mg")}
                className={`block w-full px-4 py-2.5 text-sm text-left transition-colors ${
                  i18n.language === "mg"
                    ? "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-medium"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                Malagasy
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}