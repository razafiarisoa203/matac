import axios from 'axios';
import { store } from '../store/store';

// Utilisation de l'URL de base depuis les variables d'environnement
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const BASE_AUTH_URL = `${API_URL}/serviceauth`;
const BASE_CITOYEN_URL = `${API_URL}/servicecitoyen`;
// Récupérer le profil utilisateur
export const getUserProfile = async () => {
  try {
    const token = localStorage.getItem('token');
    console.log('Token utilisé pour la requête:', token ? 'présent' : 'absent');
    
    if (!token) {
      throw new Error('Aucun token trouvé dans le localStorage');
    }
    
    console.log('Envoi de la requête vers:', `${API_URL}/auth/profile`);
    
    const response = await axios.get(`${API_URL}/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      withCredentials: true
    });
    
    console.log('Réponse de l\'API:', {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      data: response.data
    });
    
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    throw error;
  }
};

// Get user profile
export const getProfile = async () => {
  try {
    const { token } = store.getState().user;
    const response = await axios.get(`${API_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

// Update user profile
export const updateProfile = async (userData) => {
  try {
    const { token } = store.getState().user;
    const response = await axios.put(`${API_URL}/users/me`, userData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Change password
export const changePassword = async (currentPassword, newPassword) => {
  try {
    const { token } = store.getState().user;
    const response = await axios.post(
      `${API_URL}/users/change-password`,
      { currentPassword, newPassword },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error changing password:', error);
    throw error;
  }
};

// Get user notifications
export const getNotifications = async () => {
  try {
    const { token } = store.getState().user;
    const response = await axios.get(`${API_URL}/notifications`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

// Mark notification as read
export const markNotificationAsRead = async (notificationId) => {
  try {
    const { token } = store.getState().user;
    const response = await axios.patch(
      `${API_URL}/notifications/${notificationId}/read`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async () => {
  try {
    const { token } = store.getState().user;
    const response = await axios.patch(
      `${API_URL}/notifications/read-all`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
};

// Configuration de base pour les requêtes axios
const getAuthConfig = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Aucun token d\'authentification trouvé');
  }

  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};

export const getAllUsersByApplicationRole = async () => {
  try {
    const config = getAuthConfig();
    const appId = import.meta.env.VITE_APP_ID || 15;

    // 1. Récupérer les utilisateurs de l'application
    const response = await axios.get(
      `${BASE_AUTH_URL}/users/application/${appId}?limit=100&page=1`,
      config
    );

    // 2. Si pas de données, on retourne un tableau vide
    if (!response.data || !response.data.data) {
      return [];
    }

    // 3. Récupérer les citoyens en parallèle
    const users = response.data.data;
    const usersWithCitizens = await Promise.all(
      users.map(async (user) => {
        if (!user.id_citizen) return { user, citoyen: null };
        
        try {
          const res = await axios.get(
            `${BASE_CITOYEN_URL}/citizens/getCitizenById/${user.id_citizen}`,
            config
          );
          return { user, citoyen: res.data || null };
        } catch (error) {
          console.error('Erreur récupération citoyen:', error);
          return { user, citoyen: null };
        }
      })
    );

    return usersWithCitizens;
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs:", error);
    throw error; // On propage l'erreur pour la gérer dans le composant
  }
};
