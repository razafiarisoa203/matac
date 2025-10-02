import axios from 'axios';
import { store } from '../store/store';

// Utilisation de l'URL de base depuis les variables d'environnement
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const BASE_AUTH_URL = `${API_URL}/serviceauth`;
const BASE_CITOYEN_URL = `${API_URL}/servicecitoyen`;
const APP_ID = import.meta.env.VITE_APP_ID || 15; // Default to 15 if not set
// Configuration de base pour les requêtes axios
const getAuthConfig = () => {
  const token = localStorage.getItem('authToken');
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    withCredentials: true
  };
};

// ========== User Management ==========

/**
 * Récupérer la liste paginée des utilisateurs
 * @param {number} page - Numéro de page (défaut: 1)
 * @param {number} limit - Nombre d'éléments par page (défaut: 10)
 * @param {string} search - Terme de recherche optionnel
 * @returns {Promise<Object>} - Liste des utilisateurs et métadonnées de pagination
 */
export const getUsers = async (page = 1, limit = 10, search = '') => {
  try {
    const response = await axios.get(
      `${BASE_AUTH_URL}/users`,
      {
        ...getAuthConfig(),
        params: {
          page,
          limit: Math.min(limit, 100),
          ...(search && { search })
        },
        headers: {
          ...getAuthConfig().headers,
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      }
    );
    
    console.log('Réponse API getUsers:', response.data);
    
    const users = response.data?.data || [];
    const total = response.data?.total || 0;
    
    // Retourner directement les données sans double normalisation
    return {
      data: users,
      users: users,
      total: parseInt(total, 10) || 0,
      page: parseInt(response.data?.page || page, 10),
      limit: parseInt(response.data?.limit || limit, 10),
      totalPages: Math.ceil((parseInt(total, 10) || 0) / parseInt(limit, 10)) || 1,
      pagination: {
        page: parseInt(response.data?.page || page, 10),
        limit: parseInt(response.data?.limit || limit, 10),
        total: parseInt(total, 10) || 0,
        totalPages: Math.ceil((parseInt(total, 10) || 0) / parseInt(limit, 10)) || 1
      }
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    return {
      data: [],
      users: [],
      total: 0,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      totalPages: 0,
      pagination: {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        total: 0,
        totalPages: 0
      }
    };
  }
};


/**
 * Récupérer les détails d'un utilisateur spécifique
 * @param {string} userId - ID de l'utilisateur
 * @returns {Promise<Object>} - Détails de l'utilisateur
 */
export const getUserById = async (userId) => {
  try {
    const response = await axios.get(
      `${BASE_AUTH_URL}/users/${userId}`,
      getAuthConfig()
    );
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération de l'utilisateur ${userId}:`, error);
    throw error;
  }
};

/**
 * Mettre à jour le rôle d'un utilisateur
 * @param {string} userId - ID de l'utilisateur
 * @param {Array<number>} roleIds - Tableau des IDs des rôles à attribuer
 * @returns {Promise<Object>} - Réponse de l'API
 */
export const updateUserRoles = async (userId, roleIds) => {
  try {
    const response = await axios.put(
      `${BASE_AUTH_URL}/users/${userId}/roles`,
      { roleIds },
      getAuthConfig()
    );
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la mise à jour des rôles pour l'utilisateur ${userId}:`, error);
    throw error;
  }
};
// ========== Role Management ==========

/**
 * Récupérer tous les rôles de l'application
 * @returns {Promise<Array>} - Liste des rôles
 */
export const getRoles = async () => {
  try {
    const response = await axios.get(
      `${BASE_AUTH_URL}/roles/application/${APP_ID}`,
      getAuthConfig()
    );
    return response.data.data || response.data || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des rôles:', error);
    throw error;
  }
};
/**
 * Créer un nouveau rôle
 * @param {Object} roleData - Données du rôle à créer
 * @param {string} roleData.role_name - Nom du rôle
 * @param {string} roleData.role_slug - Slug du rôle (optionnel, généré automatiquement si non fourni)
 * @param {string} roleData.description - Description du rôle (optionnel)
 * @returns {Promise<Object>} - Le rôle créé
 */
export const createRole = async (roleData) => {
  try {
    const response = await axios.post(
      `${BASE_AUTH_URL}/roles`,
      {
        ...roleData,
        app_id: APP_ID
      },
      getAuthConfig()
    );
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la création du rôle:', error);
    throw error;
  }
};

/**
 * Mettre à jour un rôle existant
 * @param {number} roleId - ID du rôle à mettre à jour
 * @param {Object} roleData - Nouvelles données du rôle
 * @returns {Promise<Object>} - Le rôle mis à jour
 */
export const updateRole = async (roleId, roleData) => {
  try {
    const response = await axios.put(
      `${BASE_AUTH_URL}/roles/${roleId}`,
      roleData,
      getAuthConfig()
    );
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la mise à jour du rôle ${roleId}:`, error);
    throw error;
  }
};

/**
 * Supprimer un rôle
 * @param {number} roleId - ID du rôle à supprimer
 * @returns {Promise<Object>} - Réponse de l'API
 */
export const deleteRole = async (roleId) => {
  try {
    const response = await axios.delete(
      `${BASE_AUTH_URL}/roles/${roleId}`,
      getAuthConfig()
    );
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la suppression du rôle ${roleId}:`, error);
    throw error;
  }
};

/**
 * Récupérer les permissions d'un rôle
 * @param {number} roleId - ID du rôle
 * @returns {Promise<Array>} - Liste des permissions du rôle
 */
export const getRolePermissions = async (roleId) => {
  try {
    const response = await axios.get(
      `${BASE_AUTH_URL}/roles/${roleId}/permissions`,
      getAuthConfig()
    );
    return response.data.data || [];
  } catch (error) {
    console.error(`Erreur lors de la récupération des permissions du rôle ${roleId}:`, error);
    throw error;
  }
};

/**
 * Mettre à jour les permissions d'un rôle
 * @param {number} roleId - ID du rôle
 * @param {Array<number>} permissionIds - Tableau des IDs des permissions à attribuer
 * @returns {Promise<Object>} - Réponse de l'API
 */
export const updateRolePermissions = async (roleId, permissionIds) => {
  try {
    const response = await axios.put(
      `${BASE_AUTH_URL}/roles/${roleId}/permissions`,
      { permissionIds },
      getAuthConfig()
    );
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la mise à jour des permissions du rôle ${roleId}:`, error);
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

/**
 * Récupère tous les utilisateurs avec leurs rôles
 * @param {number} page - Numéro de page (défaut: 1)
 * @param {number} limit - Nombre d'éléments par page (défaut: 10, max: 100)
 * @returns {Promise<{users: Array, pagination: Object}>} - Liste des utilisateurs avec leurs rôles et infos de pagination
 */
export const getAllUsersByApplicationRole = async (page = 1, limit = 10) => {
  try {
    const response = await axios.get(
      `${BASE_AUTH_URL}/users`,
      {
        ...getAuthConfig(),
        params: {
          page,
          limit: Math.min(limit, 100) // Limite maximale de 100 éléments
        },
        headers: {
          ...getAuthConfig().headers,
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      }
    );

    console.log('Réponse de l\'API users:', response.data);

    // Extraire les données de la réponse
    const users = response.data.data || [];
    const total = response.data.total || 0;
    
    // Normaliser les données utilisateur
    const normalizedUsers = users.map(user => {
      // Extraire le rôle principal (on prend le premier rôle par défaut)
      const mainRole = user.appUserRoles?.[0]?.role || {};
      
      return {
        id: user.id || user.user_id,
        keycloak_id: user.keycloak_id || user.user_keycloak_id,
        email: user.email || user.user_email || '',
        pseudo: user.username || user.user_pseudo || '',
        phone: user.phone || user.user_phone || '',
        id_citizen: user.id_citizen,
        municipality_id: user.municipality_id,
        role_id: mainRole.role_id,
        role_name: mainRole.role_name || 'Aucun rôle',
        role_slug: mainRole.role_slug,
        roles: user.appUserRoles || [],
        created_at: user.createdAt || user.created_at,
        updated_at: user.updatedAt || user.updated_at,
        last_login: user.last_login,
        _raw: user
      };
    });
    
    // Retourner les données formatées dans la structure attendue par le composant
    return {
      data: normalizedUsers, // Pour la compatibilité avec le code existant
      users: normalizedUsers,
      total: parseInt(total, 10) || 0,
      totalPages: Math.ceil((parseInt(total, 10) || 0) / parseInt(limit, 10)) || 1,
      pagination: {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        total: parseInt(total, 10) || 0,
        totalPages: Math.ceil((parseInt(total, 10) || 0) / parseInt(limit, 10)) || 1
      }
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs:", error);
    throw error; // On propage l'erreur pour la gérer dans le composant
  }
};
