import axios from 'axios';
import { store } from '../store/store';

const API_URL = import.meta.env.VITE_API_SERVICEAUTH || 'http://localhost:5000';
const API_URL_CITOYEN = import.meta.env.VITE_API_SERVICECITOYEN || 'http://localhost:5000';
const API_BASE_NOTIFICATION = import.meta.env.VITE_API_SERVICENOTIFICATION;

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

//envoi notification envoyer admin
export const sendNotif = async ({ to, subject, body, filePath = "" }) => {
  try {
    const response = await fetch(`${API_BASE_NOTIFICATION}/email/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ to, subject, body, filePath }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erreur lors de l'envoi de la notification: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur lors de notifier l'admin:", error);
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

export const getAllUsersByApplicationRole = async () => {
  try {
    // 1. On récupère la première page pour avoir total & limit
    const firstRes = await axios.get(`${API_URL}/users/application/${13635}?limit=100&page=1`);
    const { limit, total, data: firstPageUsers } = firstRes.data;

    const numberOfPages = Math.ceil(total / limit) || 1;

    // 2. Préparer toutes les requêtes des autres pages
    const requests = [];
    for (let i = 2; i <= numberOfPages; i++) {
      requests.push(axios.get(`${API_URL}/users?limit=100&page=${i}`));
    }

    // 3. Exécuter en parallèle
    const responses = await Promise.all(requests);

    // 4. Rassembler tous les utilisateurs
    let allUsers = [...firstPageUsers];
    responses.forEach((res) => {
      allUsers = [...allUsers, ...res.data.data];
    });

    // 5. Filtrer les utilisateurs avec le rôle (id=67)
    const filteredUsers = allUsers.filter((u) =>
      u.appUserRoles?.some((r) => r.role.role_id === 93)
    );

    // 6. Récupérer les citoyens en parallèle
    const citizenRequests = filteredUsers.map(async (user) => {
      try {
        const res = await axios.get(
          `${API_URL_CITOYEN}/citizens/getCitizenById/${user.id_citizen}`
        );
        return { user, citoyen: res.data || null };
      } catch {
        return { user, citoyen: null }; // gestion en cas d'erreur
      }
    });

    const usersWithCitizens = await Promise.all(citizenRequests);
    return usersWithCitizens;
  } catch (e) {
    console.error("Erreur lors de la récupération des utilisateurs:", e);
    return null;
  }
};
