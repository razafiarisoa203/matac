// HeaderDashboard.jsx
import React, { useState, useRef, useEffect } from "react";
import { ArrowLeft, Menu, User } from "lucide-react";
import { useSelector } from "react-redux";

export default function HeaderDashboard({ toggleSidebar, isMobile, onProfileClick }) {
  const [isProfileFormOpen, setIsProfileFormOpen] = useState(false);
  const profileRef = useRef(null);


  // Récupérer les données depuis Redux
  const userState = useSelector((state) => state.user || {});
  const citizens = userState.citizens || null;
  const user = userState.user || null;


  // Si Redux ne contient rien, on prend les données stockées dans le localStorage pour garder la session,
  // Fallback localStorage
  const [localStorageData, setLocalStorageData] = useState(null);
  useEffect(() => {
    const storedData = localStorage.getItem("userData");
    if (storedData) {
      try {
        setLocalStorageData(JSON.parse(storedData));
      } catch (error) {
        console.error("Erreur parsing localStorage:", error);
      }
    }
  }, []);

  // Données à afficher(On décide quelles données afficher, priorisant Redux puis localStorage.)
  const displayUser = user || localStorageData?.user || null;
  const displayCitizens = citizens || localStorageData?.citizen || null;

  //On choisit le nom à afficher selon ce qui est disponible.(Même logique pour email et telephone)
  const displayName =
    displayCitizens?.citizen_name ||
    displayCitizens?.name ||
    displayCitizens?.pseudo ||
    displayUser?.name ||
    "Utilisateur";

  const email =
    displayCitizens?.email ||
    displayCitizens?.user_email ||
    displayUser?.email ||
    "email@exemple.com";

  const telephone =
    displayCitizens?.citizen_adress ||
    displayCitizens?.adress ||
    displayCitizens?.telephone ||
    displayUser?.address ||
    "";

  // Fermer le menu si clic en dehors(Écoute les clics sur le document;
  // Si le clic est en dehors du formulaire, le menu se ferme.)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileFormOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
//Gestion du clic sur le profil
//Ouvre ou ferme le formulaire de profil.
//Appelle la fonction onProfileClick si fournie.
  const handleProfileClick = () => {
    setIsProfileFormOpen(!isProfileFormOpen);
    if (onProfileClick) onProfileClick();
  };
//Initiales de l’utilisateur
//Permet de générer les initiales à partir du nom pour l’avatar
  const getInitials = (name) => {
    if (!name) return "U";
    const words = name.trim().split(" ");
    return words.length > 1
      ? `${words[0][0]}${words[1][0]}`.toUpperCase()
      : name.slice(0, 2).toUpperCase();
  };
//Vérification du nom valide
//Vérifie que le nom affiché n’est pas juste une valeur par défaut
  const isValidName =
    displayName && displayName !== "Utilisateur" && displayName.trim() !== "";

  return (
    <header className="fixed top-0 left-0 w-screen bg-green-50 text-white flex items-center justify-between px-6 h-16 z-50">
      <div className="flex items-center space-x-4">
        {isMobile ? (
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-full hover:bg-green-200"
          >
            <Menu size={24} className="text-black" />
          </button>
        ) : (
          <button className="p-2 rounded-full hover:bg-green-700">
            <ArrowLeft size={24} className="text-black" />
          </button>
        )}
        <h1 className="font-bold text-2xl text-black">MATAC</h1>
      </div>

      <div className="relative">
        {/* Bouton profil sans texte à côté */}
        <button
          onClick={handleProfileClick}
          className="flex items-center px-4 py-2 rounded-full bg-green-100 hover:bg-green-200"
        >
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-200">
            {isValidName ? (
              <span className="text-black">{getInitials(displayName)}</span>
            ) : (
              <User size={24} className="text-black" />
            )}
          </div>
        </button>

        {/* Formulaire profil - affichage statique */}
        {isProfileFormOpen && (
          <div
            ref={profileRef}
            className="absolute top-14 right-0 bg-white text-black shadow-xl rounded-xl p-6 w-[400px]"
          >
            {/* En-tête du profil */}
            <div className="flex flex-col items-center mb-6 border-b pb-4">
              <div className="w-20 h-20 flex items-center justify-center rounded-full bg-red-500 text-white text-3xl font-semibold shadow-md">
                {displayName.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="text-center mt-3">
                <h2 className="text-lg font-semibold text-gray-800">{displayName}</h2>
                <p className="text-sm text-gray-500">{email}</p>
              </div>
            </div>

            {/* Formulaire statique (pas de sauvegarde) */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Nom</label>
                <input
                  type="text"
                  value={displayName}
                  readOnly
                  className="w-full p-3 border rounded-lg bg-gray-100 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  readOnly
                  className="w-full p-3 border rounded-lg bg-gray-100 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Telephone</label>
                <input
                  type="text"
                  value={telephone}
                  readOnly
                  className="w-full p-3 border rounded-lg bg-gray-100 cursor-not-allowed"
                />
              </div>

              {/* Boutons */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  onClick={() => setIsProfileFormOpen(false)}
                  className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                >
                  Annuler
                </button>
                <button
                  className="px-8 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition cursor-not-allowed opacity-70"
                  disabled
                >
                  Modifier le profil
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </header>
  );
}