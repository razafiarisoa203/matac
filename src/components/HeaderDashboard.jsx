// HeaderDashboard.jsx
import React, { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  Menu,
  Globe,
  Sun,
  Moon,
  Mail,
  Phone,
  X,
  Check,
  CheckCheck,
} from "lucide-react";
import { LuBellRing } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { citoyenService } from "../services/api/citoyenService";
import { authService } from "../services/api/authService";
import { notificationService } from "../services/api/notificationService";
import { useNotificationSocket } from "../hooks/useNotificationSocket";

export default function HeaderDashboard({
  toggleSidebar,
  isMobile,
  onProfileClick,
}) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [isProfileFormOpen, setIsProfileFormOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved !== null) return saved === "true";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  const [citizenData, setCitizenData] = useState({
    nom: "",
    email: "",
    telephone: "",
  });

  const profileRef = useRef(null);
  const languageRef = useRef(null);
  const notificationRef = useRef(null);

  const userData = authService.getUserInfo() || {};
  const id_citizen =
    userData?.id_citizen ||
    userData?.citizen_id ||
    userData?.id ||
    null;
  const fallbackName =
    userData?.user_pseudo ||
    userData?.username ||
    [userData?.citizen_name, userData?.citizen_lastname]
      .filter(Boolean)
      .join(" ");

  // ✅ Polling auto toutes les 8 secondes (plus de refresh manuel)
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    refetch,
  } = useNotificationSocket(id_citizen, 8000);

  // Toujours "connecté" côté polling REST
  const isConnected = Boolean(id_citizen);

  // 🔹 Actions notifications
  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);
    } catch (error) {
      console.error("Erreur lors du marquage comme lu:", error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead();
    } catch (error) {
      console.error(
        "Erreur lors du marquage de toutes les notifications comme lues:",
        error
      );
    }
  };

  const handleDeleteNotification = async (id, e) => {
    e.stopPropagation();
    try {
      if (notificationService.deleteNotification) {
        await notificationService.deleteNotification(id);
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de la notification:", error);
    } finally {
      refetch?.();
    }
  };

  // 🔹 Thème
  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // 🔹 Langue
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setIsLanguageOpen(false);
  };

  useEffect(() => {
    const handleLanguageChange = (lng) => setCurrentLanguage(lng);
    i18n.on("languageChanged", handleLanguageChange);
    return () => i18n.off("languageChanged", handleLanguageChange);
  }, [i18n]);

  // 🔹 Données citoyen
  useEffect(() => {
    let isMounted = true;
    const fetchCitizenData = async () => {
      const email = userData?.user_email || userData?.email || "";
      const telephone = userData?.user_phone || userData?.phone_number || "";

      if (!id_citizen) {
        if (isMounted) {
          setCitizenData({
            nom: fallbackName || "Utilisateur",
            email,
            telephone,
          });
        }
        return;
      }

      try {
        const data = await citoyenService.getCitizenData(id_citizen);
        if (isMounted) {
          const formattedNom =
            `${data?.citizen_lastname || ""} ${data?.citizen_name || ""}`.trim() ||
            fallbackName ||
            "Utilisateur";
          setCitizenData({ nom: formattedNom, email, telephone });
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données citoyen:", error);
        if (isMounted) {
          setCitizenData({
            nom: fallbackName || "Utilisateur",
            email,
            telephone,
          });
        }
      }
    };

    fetchCitizenData();
    return () => {
      isMounted = false;
    };
  }, [
    id_citizen,
    fallbackName,
    userData?.user_email,
    userData?.email,
    userData?.user_phone,
    userData?.phone_number,
  ]);

  // 🔹 Clic extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileFormOpen(false);
      }
      if (languageRef.current && !languageRef.current.contains(event.target)) {
        setIsLanguageOpen(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleProfileMenu = () => {
    setIsProfileFormOpen((prev) => !prev);
    setIsLanguageOpen(false);
    setIsNotificationsOpen(false);
    if (onProfileClick) onProfileClick();
  };

  const toggleNotificationsMenu = () => {
    setIsNotificationsOpen((prev) => !prev);
    setIsProfileFormOpen(false);
    setIsLanguageOpen(false);
    // Rafraîchir dès l'ouverture du menu
    if (!isNotificationsOpen) refetch?.();
  };

  const toggleLanguageMenu = () => {
    setIsLanguageOpen((prev) => !prev);
    setIsProfileFormOpen(false);
    setIsNotificationsOpen(false);
  };

  const getInitials = (name) => {
    if (!name) return "U";
    const words = name.trim().split(/\s+/).filter(Boolean);
    return words.length > 1
      ? `${words[0][0]}${words[1][0]}`.toUpperCase()
      : name.slice(0, 2).toUpperCase();
  };

  /** Affiche createdAt API sans conversion de fuseau */
  const formatNotifDate = (dateString) => {
    if (!dateString) return "";

    const s = String(dateString).trim();
    const match = s.match(
      /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2}))?/
    );

    if (match) {
      const [, , month, day, hour, minute] = match;
      return `${day}/${month} ${hour}:${minute}`;
    }

    const d = new Date(s);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleString("fr-FR", {
      timeZone: "UTC",
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-green-50/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-green-100 dark:border-gray-700 text-gray-800 dark:text-gray-100 flex items-center justify-between px-4 h-16 z-50 shadow-sm dark:shadow-black/30 transition-colors duration-300">
      {/* Gauche */}
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
            onClick={() => navigate("/")}
            className="p-2 rounded-full hover:bg-green-200/80 dark:hover:bg-gray-700 transition-colors"
            aria-label="Retour à l'accueil"
          >
            <ArrowLeft size={22} className="text-gray-800 dark:text-white" />
          </button>
        )}
      </div>

      {/* Droite */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={toggleProfileMenu}
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

          {isProfileFormOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl dark:shadow-black/50 border border-gray-200/80 dark:border-gray-700 overflow-hidden animate-in fade-in zoom-in-95 duration-150 z-50">
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

              <div className="px-4 py-3 space-y-2.5">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-green-50 dark:bg-gray-700/60 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Email
                    </p>
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
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Téléphone
                    </p>
                    <p className="font-medium text-gray-800 dark:text-gray-100 truncate">
                      {citizenData.telephone || "—"}
                    </p>
                  </div>
                </div>
              </div>

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
        <div className="relative" ref={notificationRef}>
          <button
            onClick={toggleNotificationsMenu}
            className="p-2.5 text-gray-700 dark:text-gray-200 hover:bg-green-200/70 dark:hover:bg-gray-700 rounded-full transition-colors relative"
            aria-label="Notifications"
          >
            <LuBellRing className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold h-4 min-w-4 px-1 rounded-full flex items-center justify-center animate-pulse">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-xl shadow-xl dark:shadow-black/50 border border-gray-200/80 dark:border-gray-700 overflow-hidden z-50">
              <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm text-gray-800 dark:text-gray-100">
                    Notifications
                  </h3>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isConnected ? "bg-green-500" : "bg-red-500"
                    }`}
                    title={
                      isConnected
                        ? "Mise à jour auto active"
                        : "Utilisateur non identifié"
                    }
                  />
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 hover:underline font-medium"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    Tout marquer comme lu
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-700/50">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-sm text-gray-500 dark:text-gray-400">
                    Aucune notification
                  </div>
                ) : (
                  notifications.map((notif, index) => (
                    <div
                      key={notif.id || `notif-${index}`}
                      className={`p-3.5 text-left transition-colors flex items-start gap-2 ${
                        notif.isRead
                          ? "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                          : "bg-green-50/60 dark:bg-gray-700/40 text-gray-900 dark:text-gray-100 font-medium"
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm leading-snug break-words">
                          {notif.message}
                        </p>
                        <span className="text-[11px] text-gray-400 dark:text-gray-500 block mt-1">
                          {notif.createdAt
                            ? formatNotifDate(notif.createdAt)
                            : ""}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 shrink-0 self-start">
                        {!notif.isRead && (
                          <button
                            onClick={() => handleMarkAsRead(notif.id)}
                            title="Marquer comme lu"
                            className="p-1 hover:bg-green-200/50 dark:hover:bg-gray-600 rounded-full text-green-600 dark:text-green-400 transition-colors"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={(e) =>
                            handleDeleteNotification(notif.id, e)
                          }
                          title="Supprimer la notification"
                          className="p-1 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-full text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Dark mode */}
        <button
          onClick={toggleDarkMode}
          className="p-2.5 text-gray-700 dark:text-gray-200 hover:bg-green-200/70 dark:hover:bg-gray-700 rounded-full transition-colors"
          aria-label={
            darkMode ? "Désactiver le mode sombre" : "Activer le mode sombre"
          }
        >
          {darkMode ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>

        {/* Langue */}
        <div className="relative" ref={languageRef}>
          <button
            onClick={toggleLanguageMenu}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-gray-800 dark:text-white bg-green-100/80 dark:bg-gray-800 hover:bg-green-200/80 dark:hover:bg-gray-700 rounded-full transition-colors border border-green-200/60 dark:border-gray-600"
          >
            <Globe className="w-4 h-4" />
            <span>
              {currentLanguage === "fr"
                ? "FR"
                : currentLanguage === "mg"
                ? "MG"
                : currentLanguage.split("-")[0].toUpperCase()}
            </span>
          </button>

          {isLanguageOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg shadow-lg dark:shadow-black/40 py-1 z-50 overflow-hidden">
              <button
                onClick={() => changeLanguage("fr")}
                className={`block w-full px-4 py-2.5 text-sm text-left transition-colors ${
                  currentLanguage === "fr"
                    ? "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-medium"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                Français
              </button>
              <button
                onClick={() => changeLanguage("mg")}
                className={`block w-full px-4 py-2.5 text-sm text-left transition-colors ${
                  currentLanguage === "mg"
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