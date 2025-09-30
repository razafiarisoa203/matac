// HeaderDashboard.jsx
import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, Menu, Bell, User, Upload, X } from "lucide-react";
import { useSelector } from "react-redux";
import { notificationService, citoyenService } from "../services/api";

export default function HeaderDashboard({ toggleSidebar, isSidebarOpen, isMobile, onProfileClick }) {
  const [isProfileFormOpen, setIsProfileFormOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState(null);

  // Références pour les menus déroulants
  const profileRef = useRef(null);
  const notificationRef = useRef(null);
  const fileInputRef = useRef(null);

  // Récupérer les données utilisateur depuis Redux ET localStorage
  const { citizens, user } = useSelector((state) => {
    //console.log('Redux user state:', JSON.stringify(state.user, null, 2));
    return state.user;
  });

  // Récupérer les données depuis localStorage comme fallback
  const [localStorageData, setLocalStorageData] = useState(null);

  useEffect(() => {
    // Récupérer les données du localStorage au chargement du composant
    const storedData = localStorage.getItem("userData");
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setLocalStorageData(parsedData);
       // console.log('Données du localStorage:', parsedData);
      } catch (error) {
        console.error('Erreur lors du parsing des données localStorage:', error);
      }
    }
  }, []);

  // Déterminer les données à afficher (priorité: Redux > localStorage)
  const displayUser = user || localStorageData?.user || null;
  const displayCitizens = citizens || localStorageData?.citizen || null;

  // Déterminer le nom d'utilisateur à afficher
  const displayName = displayCitizens?.citizen_name || 
                     displayCitizens?.name || 
                     displayCitizens?.pseudo || 
                     displayUser?.name || 
                     "Utilisateur";

  // Déterminer l'ID de l'utilisateur
  const userId = displayUser?.id || displayUser?.id_citizen || displayCitizens?.id;

  // Déterminer l'URL de l'image de profil
  const profileImage = displayCitizens?.profile_image || displayUser?.profile_image || null;

  // État local pour le formulaire de profil
  const [formData, setFormData] = useState({
    citizen_name: "",
    citizen_adress: "",
    email: "",
    password: "",
    profile_image: null
  });

  // Mettre à jour formData et l'aperçu d'image si les données changent
  useEffect(() => {
    const citizenData = displayCitizens || {};
    const userData = displayUser || {};
    
    //console.log('Données citoyen pour formulaire:', citizenData);
    //console.log('Données user pour formulaire:', userData);
    
    setFormData({
      citizen_name: citizenData.citizen_name || citizenData.name || citizenData.pseudo || userData.name || "",
      citizen_adress: citizenData.citizen_adress || citizenData.adress || citizenData.telephone || userData.address || "",
      email: citizenData.email || citizenData.user_email || userData.email || "",
      password: "",
      profile_image: null
    });
    
    const userProfileImage = citizenData.profile_image || userData.profile_image;
    if (userProfileImage) {
      setImagePreview(userProfileImage);
    } else {
      setImagePreview(null);
    }
  }, [displayCitizens, displayUser]);

  // Récupérer les notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const data = await notificationService.getAllNotifications();
        setNotifications(data);
        setError(null);
      } catch (err) {
        setError("Impossible de charger les notifications");
        console.error('Erreur lors de la récupération des notifications:', err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  // Gérer les clics en dehors des menus
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileFormOpen(false);
        setProfileError(null);
        setFormData(prev => ({ ...prev, password: "" }));
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Compter les notifications non lues
  const unreadCount = notifications.filter((notif) => notif.unread).length;

  const handleProfileClick = () => {
    setIsProfileFormOpen(!isProfileFormOpen);
    setIsNotificationOpen(false);
    if (onProfileClick) onProfileClick();
  };

  const handleNotificationClick = () => {
    setIsNotificationOpen(!isNotificationOpen);
    setIsProfileFormOpen(false);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Veuillez sélectionner un fichier image valide (JPEG, PNG, GIF).');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('L\'image ne doit pas dépasser 5MB.');
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
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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
    
    if (formData.password && formData.password.trim() !== "") {
      formDataToSend.append("password", formData.password);
    }
    
    if (formData.profile_image) {
      formDataToSend.append("profile_image", formData.profile_image);
    }

    setProfileLoading(true);
    setProfileError(null);

    try {
      const updatedProfile = await citoyenService.updateCitizenProfile(userId, formDataToSend);
     // console.log("Profil mis à jour avec succès:", updatedProfile);
      
      // Mettre à jour le localStorage avec les nouvelles données
      if (localStorageData) {
        const updatedLocalStorageData = {
          ...localStorageData,
          citizen: {
            ...localStorageData.citizen,
            citizen_name: formData.citizen_name,
            citizen_adress: formData.citizen_adress,
            email: formData.email,
            profile_image: updatedProfile.profile_image || localStorageData.citizen?.profile_image
          }
        };
        localStorage.setItem("userData", JSON.stringify(updatedLocalStorageData));
      }
      
      setIsProfileFormOpen(false);
      alert("Profil mis à jour avec succès!");
      setFormData(prev => ({ ...prev, password: "" }));
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error);
      setProfileError(error.response?.data?.message || "Erreur lors de la sauvegarde du profil");
      alert(error.response?.data?.message || "Erreur lors de la sauvegarde du profil");
    } finally {
      setProfileLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === id ? { ...notif, unread: false } : notif
        )
      );
     // console.log(`Notification ${id} marquée comme lue`);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la notification:", error);
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    const words = name.trim().split(" ");
    return words.length > 1
      ? `${words[0][0]}${words[1][0]}`.toUpperCase()
      : name.slice(0, 2).toUpperCase();
  };

  const isValidName = displayName && displayName !== "Utilisateur" && displayName.trim() !== "";

  // Afficher les informations de débogage
  useEffect(() => {
    //console.log('=== DONNÉES PROFIL DISPONIBLES ===');
    //console.log('Données Redux - user:', user);
   // console.log('Données Redux - citizens:', citizens);
    //console.log('Données localStorage:', localStorageData);
   // console.log('Données affichées - user:', displayUser);
   // console.log('Données affichées - citizens:', displayCitizens);
    //console.log('Nom affiché:', displayName);
    //console.log('ID utilisateur:', userId);
    //console.log('Image de profil:', profileImage);
    //console.log('================================');
  }, [user, citizens, localStorageData, displayUser, displayCitizens, displayName, userId, profileImage]);

  return (
    <header className="fixed top-0 left-0 w-screen bg-green-50 text-white flex items-center justify-between px-6 h-16 z-50">
      {/* Gauche */}
      <div className="flex items-center space-x-4">
        {isMobile ? (
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-full hover:bg-green-200 transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu size={24} className="text-black" />
          </button>
        ) : (
          <button className="p-2 rounded-full hover:bg-green-700 transition-colors">
            <ArrowLeft size={24} className="text-black" />
          </button>
        )}
        
        <h1 className="font-bold text-2xl tracking-wide text-black">MATAC</h1>
      </div>

      {/* Droite */}
      <div className="flex items-center space-x-5">
        {/* Notification */}
        <div className="relative">
          <button
            onClick={handleNotificationClick}
            className="p-2 rounded-full hover:bg-green-200 transition-colors relative"
            aria-label="Open notifications"
          >
            <Bell size={22} className="text-black" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {isNotificationOpen && (
            <div
              ref={notificationRef}
              className="absolute top-14 right-0 bg-white text-black shadow-lg rounded-lg p-4 w-full sm:w-[400px] z-50"
            >
              <h2 className="text-lg font-semibold mb-4">Notifications</h2>
              {loading ? (
                <p className="text-sm text-gray-500">Chargement...</p>
              ) : error ? (
                <p className="text-sm text-red-500">{error}</p>
              ) : notifications.length === 0 ? (
                <p className="text-sm text-gray-500">Aucune notification</p>
              ) : (
                <ul className="space-y-3">
                  {notifications.map((notification) => (
                    <li
                      key={notification.id}
                      className={`p-3 rounded-md ${
                        notification.unread ? "bg-green-100" : "bg-gray-100"
                      } hover:bg-green-200 transition-colors`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium">{notification.message}</p>
                          <p className="text-xs text-gray-500">{notification.timestamp}</p>
                        </div>
                        <div className="flex space-x-2">
                          {notification.unread && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="text-xs text-green-500 hover:text-green-700"
                            >
                              Marquer comme lu
                            </button>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        {/* Profil */}
        <div className="relative">
          <button
            onClick={handleProfileClick}
            className="flex items-center space-x-3 px-4 py-2 rounded-full bg-green-100 hover:bg-green-200 transition-colors"
            aria-label="Open profile"
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-200">
              {profileImage ? (
                <img 
                  src={profileImage} 
                  alt="Profil" 
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : isValidName ? (
                <span className="text-black text-base font-medium">{getInitials(displayName)}</span>
              ) : (
                <User size={24} className="text-black" />
              )}
            </div>
            <span className="text-black text-base font-medium truncate max-w-[150px]">
              {displayName}
            </span>
          </button>

          {/* Formulaire de profil */}
          {isProfileFormOpen && (
            <div
              ref={profileRef}
              className="absolute top-14 right-0 bg-white text-black shadow-xl rounded-xl p-6 w-full sm:w-[400px] z-50"
            >
              <h2 className="text-lg font-semibold text-center mb-6 border-b pb-2">Paramètres du profil</h2>
              
              {/* Informations sur la source des données */}
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-700">
                  <strong>Source des données:</strong> {user ? 'Redux' : localStorageData ? 'LocalStorage' : 'Aucune donnée'}
                </p>
              </div>
              
              {profileError && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                  {profileError}
                </div>
              )}
              
              <div className="space-y-4">
                {/* Photo de profil */}
                <div className="flex flex-col items-center">
                  <label className="block text-sm font-medium mb-2 text-gray-700">Photo de profil</label>
                  
                  <div className="relative mb-3">
                    {imagePreview ? (
                      <>
                        <img
                          src={imagePreview}
                          alt="Aperçu"
                          className="w-24 h-24 rounded-full object-cover border-2 border-green-500 shadow-md"
                        />
                        <button
                          onClick={removeImage}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 shadow-sm hover:bg-red-600 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </>
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-2 border-dashed border-gray-400">
                        <User size={32} className="text-gray-500" />
                      </div>
                    )}
                  </div>
                  
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                    id="profile-image-input"
                  />
                  
                  <label
                    htmlFor="profile-image-input"
                    className="flex items-center justify-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 cursor-pointer transition-colors font-medium"
                  >
                    <Upload size={16} className="mr-2" />
                    Choisir une image
                  </label>
                  
                  <p className="text-xs text-gray-500 mt-2">JPEG, PNG ou GIF (max 5MB)</p>
                </div>

                {/* Nom du citoyen */}
                <div>
                  <label htmlFor="citizen_name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nom complet
                  </label>
                  <input
                    id="citizen_name"
                    type="text"
                    value={formData.citizen_name || ""}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Votre nom complet"
                  />
                </div>

                {/* Adresse du citoyen */}
                <div>
                  <label htmlFor="citizen_adress" className="block text-sm font-medium text-gray-700 mb-1">
                    Adresse
                  </label>
                  <input
                    id="citizen_adress"
                    type="text"
                    value={formData.citizen_adress || ""}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Votre adresse complète"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email || ""}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="votre.email@example.com"
                  />
                </div>

                {/* Mot de passe */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Nouveau mot de passe (optionnel)
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={formData.password || ""}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Laissez vide pour conserver l'actuel"
                  />
                </div>

                {/* Boutons */}
                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button
                    onClick={() => {
                      setIsProfileFormOpen(false);
                      setProfileError(null);
                      setFormData(prev => ({ ...prev, password: "" }));
                    }}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    disabled={profileLoading}
                    className="px-8 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-green-300 disabled:cursor-not-allowed transition-colors font-semibold text-lg min-w-[120px] shadow-lg flex items-center space-x-2"
                  >
                    {profileLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Sauvegarde...</span>
                      </>
                    ) : (
                      <span>Modifier le profil</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}