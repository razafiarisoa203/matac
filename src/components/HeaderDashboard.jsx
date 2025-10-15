// HeaderDashboard.jsx
import React, { useState, useRef, useEffect } from "react";
import { ArrowLeft, Menu, User } from "lucide-react";
import { citoyenService } from "../services/api/citoyenService";
import { authService } from "../services/api/authService";

export default function HeaderDashboard({ toggleSidebar, isMobile, onProfileClick }) {
  const [isProfileFormOpen, setIsProfileFormOpen] = useState(false);
  const [citizenData, setCitizenData] = useState({
    nom: "",
    email: "",
    telephone: "",
  });
  const profileRef = useRef(null);

  const userData = authService.getUserInfo();
  const id_citizen = userData?.id_citizen || null;

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

  // 🔹 Fermer le menu si clic en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileFormOpen(false);
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

  // 🔹 Vérification du nom valide
  const isValidName =
    citizenData.nom && citizenData.nom !== "Utilisateur" && citizenData.nom.trim() !== "";

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
        {/* Bouton profil */}
        <button
          onClick={handleProfileClick}
          className="flex items-center px-4 py-2 rounded-full bg-green-100 hover:bg-green-200"
        >
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-200">
            {isValidName ? (
              <span className="text-black">{getInitials(citizenData.nom)}</span>
            ) : (
              <User size={24} className="text-black" />
            )}
          </div>
        </button>

        {isProfileFormOpen && (
          <div
            ref={profileRef}
            className="absolute top-14 right-4 w-[420px] bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 animate-fadeIn"
          >
            {/* En-tête du profil */}
            <div className="flex flex-col items-center border-b border-gray-200 pb-5">
              <div className="relative">
                <div className="w-24 h-24 flex items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-600 text-white text-3xl font-bold shadow-lg">
                  {citizenData.nom.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-400 border-2 border-white rounded-full"></div>
              </div>

              <div className="text-center mt-4">
                <h2 className="text-xl font-semibold text-gray-800">{citizenData.nom}</h2>
                <p className="text-sm text-gray-500">{citizenData.email}</p>
              </div>
            </div>

            {/* Détails utilisateur (affichage statique) */}
            <div className="mt-6 space-y-4">
              <div>
                <label className="text-sm text-gray-500">Nom complet</label>
                <div className="mt-1 text-base font-medium text-gray-800 px-3 py-2">
                  {citizenData.nom || "—"}
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-500">Adresse email</label>
                <div className="mt-1 text-base font-medium text-gray-800 px-3 py-2">
                  {citizenData.email || "—"}
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-500">Numéro de téléphone</label>
                <div className="mt-1 text-base font-medium text-gray-800 px-3 py-2">
                  {citizenData.telephone || "—"}
                </div>
              </div>
            </div>

            {/* Boutons */}
            <div className="flex justify-end gap-3 pt-6 mt-4 border-t border-gray-200">
              <button
                onClick={() => setIsProfileFormOpen(false)}
                className="px-6 py-2 rounded-lg border border-gray-300 text-red-600 hover:bg-red-100 transition-all"
              >
                Fermer
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
