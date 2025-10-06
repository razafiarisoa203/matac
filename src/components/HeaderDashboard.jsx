// HeaderDashboard.jsx
import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, Menu, User, Upload, X } from "lucide-react";
import { useSelector } from "react-redux";
import { citoyenService } from "../services/api/citoyenService";

export default function HeaderDashboard({ toggleSidebar, isMobile, onProfileClick }) {
  const [isProfileFormOpen, setIsProfileFormOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [loading] = useState(false);
  const [error] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState(null);

  const profileRef = useRef(null);
  const notificationRef = useRef(null);
  const fileInputRef = useRef(null);

  //Récupérer Redux mais avec valeur par défaut
  const userState = useSelector((state) => state.user || {});
  const citizens = userState.citizens || null;
  const user = userState.user || null;

  //  Fallback localStorage
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

  // Données à afficher
  const displayUser = user || localStorageData?.user || null;
  const displayCitizens = citizens || localStorageData?.citizen || null;

  const displayName =
    displayCitizens?.citizen_name ||
    displayCitizens?.name ||
    displayCitizens?.pseudo ||
    displayUser?.name ||
    "Utilisateur";

  const userId =
    displayUser?.id || displayUser?.id_citizen || displayCitizens?.id;

  const profileImage =
    displayCitizens?.profile_image || displayUser?.profile_image || null;

  // Formulaire
  const [formData, setFormData] = useState({
    citizen_name: "",
    citizen_adress: "",
    email: "",
    password: "",
    profile_image: null,
  });

  useEffect(() => {
    const citizenData = displayCitizens || {};
    const userData = displayUser || {};

    setFormData({
      citizen_name:
        citizenData.citizen_name ||
        citizenData.name ||
        citizenData.pseudo ||
        userData.name ||
        "",
      citizen_adress:
        citizenData.citizen_adress ||
        citizenData.adress ||
        citizenData.telephone ||
        userData.address ||
        "",
      email: citizenData.email || citizenData.user_email || userData.email || "",
      password: "",
      profile_image: null,
    });

    const userProfileImage = citizenData.profile_image || userData.profile_image;
    setImagePreview(userProfileImage || null);
  }, [displayCitizens, displayUser]);

  // Fermer menus
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileFormOpen(false);
        setProfileError(null);
        setFormData((prev) => ({ ...prev, password: "" }));
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setIsNotificationOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleProfileClick = () => {
    setIsProfileFormOpen(!isProfileFormOpen);
    setIsNotificationOpen(false);
    if (onProfileClick) onProfileClick();
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Veuillez sélectionner un fichier image valide.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("L'image ne doit pas dépasser 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData((prev) => ({ ...prev, profile_image: file }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setFormData((prev) => ({ ...prev, profile_image: null }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSaveProfile = async () => {
    if (!userId) {
      setProfileError("Utilisateur non identifié");
      return;
    }
    const formDataToSend = new FormData();
    formDataToSend.append("citizen_name", formData.citizen_name);
    formDataToSend.append("citizen_adress", formData.citizen_adress);
    formDataToSend.append("email", formData.email);
    if (formData.password.trim() !== "") {
      formDataToSend.append("password", formData.password);
    }
    if (formData.profile_image) {
      formDataToSend.append("profile_image", formData.profile_image);
    }

    setProfileLoading(true);
    setProfileError(null);
    try {
      const updatedProfile = await citoyenService.updateCitizenProfile(
        userId,
        formDataToSend
      );

      if (localStorageData) {
        const updatedLocalStorageData = {
          ...localStorageData,
          citizen: {
            ...localStorageData.citizen,
            citizen_name: formData.citizen_name,
            citizen_adress: formData.citizen_adress,
            email: formData.email,
            profile_image:
              updatedProfile.profile_image ||
              localStorageData.citizen?.profile_image,
          },
        };
        localStorage.setItem("userData", JSON.stringify(updatedLocalStorageData));
      }

      setIsProfileFormOpen(false);
      alert("Profil mis à jour !");
      setFormData((prev) => ({ ...prev, password: "" }));
    } catch (error) {
      setProfileError(
        error.response?.data?.message || "Erreur lors de la sauvegarde"
      );
    } finally {
      setProfileLoading(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    const words = name.trim().split(" ");
    return words.length > 1
      ? `${words[0][0]}${words[1][0]}`.toUpperCase()
      : name.slice(0, 2).toUpperCase();
  };

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
        <button
          onClick={handleProfileClick}
          className="flex items-center space-x-3 px-4 py-2 rounded-full bg-green-100 hover:bg-green-200"
        >
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-200">
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profil"
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : isValidName ? (
              <span className="text-black">{getInitials(displayName)}</span>
            ) : (
              <User size={24} className="text-black" />
            )}
          </div>
          <span className="text-black truncate max-w-[150px]">{displayName}</span>
        </button>

        {/* Formulaire profil */}
        {isProfileFormOpen && (
          <div
            ref={profileRef}
            className="absolute top-14 right-0 bg-white text-black shadow-xl rounded-xl p-6 w-[400px]"
          >
            <h2 className="text-lg font-semibold text-center mb-6 border-b pb-2">
              Paramètres du profil
            </h2>

            {profileError && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                {profileError}
              </div>
            )}

            <div className="space-y-4">
              {/* Nom */}
              <div>
                <label className="block text-sm mb-1">Nom complet</label>
                <input
                  id="citizen_name"
                  type="text"
                  value={formData.citizen_name}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg"
                />
              </div>

              {/* Adresse */}
              <div>
                <label className="block text-sm mb-1">Adresse</label>
                <input
                  id="citizen_adress"
                  type="text"
                  value={formData.citizen_adress}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm mb-1">Email</label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg"
                />
              </div>

              {/* Mot de passe */}
              <div>
                <label className="block text-sm mb-1">Mot de passe</label>
                <input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  onClick={() => setIsProfileFormOpen(false)}
                  className="px-6 py-2 bg-gray-200 rounded-lg"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={profileLoading}
                  className="px-8 py-2 bg-green-500 text-white rounded-lg"
                >
                  {profileLoading ? "Sauvegarde..." : "Modifier le profil"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
