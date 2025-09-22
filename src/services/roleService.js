// roleService.js
import axios from 'axios'; // Importez axios directement

const ROLES_BASE_URL = import.meta.env.VITE_APP_ROLES_BASE_URL;

/**
 * Récupère les rôles d'un utilisateur pour une application spécifique
 * @param {string} appId - L'ID de l'application
 * @param {string} token - Le token d'authentification
 * @returns {Promise<Array>} - Liste des rôles de l'utilisateur pour l'application
 */
export const getUserRolesForApp = async (appId, token) => {
  if (!token) {
    console.error('Aucun token fourni pour la récupération des rôles');
    return [];
  }

  try {
    console.log(`Récupération des rôles pour l'application ${appId}...`);
    
    // Créer une instance axios avec le token
    const instance = axios.create({
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const response = await instance.get(`${ROLES_BASE_URL}/${appId}`);
    
    console.log('Réponse complète des rôles:', response);
    
    // Gestion de différentes structures de réponse
    if (response.data) {
      if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data.roles) {
        return response.data.roles;
      } else if (response.data.data?.roles) {
        return response.data.data.roles;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        return response.data.data;
      }
    }
    
    console.warn('Format de réponse inattendu pour les rôles:', response.data);
    return [];
    
  } catch (error) {
    console.error('Erreur lors de la récupération des rôles:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    return [];
  }
};

/**
 * Vérifie si un utilisateur a un rôle spécifique pour une application
 * @param {string} appId - L'ID de l'application
 * @param {string} role - Le rôle à vérifier
 * @param {string} token - Le token d'authentification
 * @returns {Promise<boolean>} - True si l'utilisateur a le rôle, false sinon
 */
export const hasRoleForApp = async (appId, role, token) => {
  const roles = await getUserRolesForApp(appId, token);
  return roles.includes(role);
};

/**
 * Vérifie si un utilisateur a l'un des rôles spécifiés pour une application
 * @param {string} appId - L'ID de l'application
 * @param {Array<string>} requiredRoles - Les rôles à vérifier
 * @param {string} token - Le token d'authentification
 * @returns {Promise<boolean>} - True si l'utilisateur a au moins un des rôles, false sinon
 */
export const hasAnyRoleForApp = async (appId, requiredRoles, token) => {
  const userRoles = await getUserRolesForApp(appId, token);
  return requiredRoles.some(role => userRoles.includes(role));
};