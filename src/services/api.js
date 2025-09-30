import axios from 'axios';

// Constante temporaire pour les tests - à remplacer par l'ID utilisateur réel en production
export const TEMP_USER_ID = 'temp_user_id_123';

// Récupération des URLs depuis le .env
const servicesApi = {
  // Tous les services utilisent l'URL de base avec leur chemin respectif
  territoire: `${import.meta.env.VITE_API_URL}/serviceterritoire-v2`,
  auth: `${import.meta.env.VITE_API_URL}/serviceauth`,
  citoyen: `${import.meta.env.VITE_API_URL}/servicecitoyen`,
  upload: `${import.meta.env.VITE_API_URL}/serviceupload`,
  alignement: `${import.meta.env.VITE_API_URL}/servicealignement`,
};

// Factory pour créer une instance Axios par service
const createApi = (baseURL) =>
  axios.create({
    baseURL,
    headers: { 'Content-Type': 'application/json' },
  });

// Ajout d’intercepteur pour le token
const addInterceptor = (instance) => {
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
  return instance;
};

// Instances axios par service
const territoireApi = addInterceptor(createApi(servicesApi.territoire));
const authApi = addInterceptor(createApi(servicesApi.auth));
const citoyenApi = addInterceptor(createApi(servicesApi.citoyen));
const uploadApi = addInterceptor(createApi(servicesApi.upload));
const alignementApi = addInterceptor(createApi(servicesApi.alignement));

// ===================== Services =====================

// Service Citoyen
export const citoyenService = {
  async checkCIN(cin) {
    try {
      const response = await citoyenApi.get(`/citizens/${cin}`);
      return { exists: true, data: response.data };
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return { exists: false };
      }
      throw error;
    }
  },

  async createCitizen(citizenData) {
    const response = await authApi.post(
      '/users/register-with-citizen-short',
      citizenData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data;
  },
};

// Service Upload
export const uploadService = {
  async uploadCitizenPhoto(photoFile) {
    const formData = new FormData();
    formData.append('file', photoFile);

    const response = await uploadApi.post(
      '/api/upload/citizen-photo',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data;
  },
};

// Service Territoire
export const territoireService = {
  async getCommunes() {
    const response = await territoireApi.get('/communes');
    return response.data;
  },
  async getRegions() {
    const response = await territoireApi.get('/regions');
    return response.data;
  },
  async getFokotanys(communeId) {
    const response = await territoireApi.get(`/api/fokotanys/commune/${communeId}`);
    return response.data;
  },
};

// Service Login
export const loginService = {
  async login(loginData) {
    const response = await authApi.post('/auth/login', loginData);
    return response.data;
  },
};

// Service Auth
export const authService = {
  async forgotPassword(user_email) {
    const response = await authApi.post('/auth/forgot-password', { user_email });
    return response.data;
  },
  async getUserData(user_id) {
    const response = await authApi.get(`/auth/user/${user_id}`);
    return response.data;
  },
  async getConnectedUser() {
    const response = await authApi.get('/auth/profile');
    return response.data;
  },
};

// Service Construction
export const constructionService = {
  // Récupérer toutes les constructions
  getConstruction: async () => {
    try {
      // Utilisation de l'API de territoire pour les constructions
      const response = await territoireApi.get('/construction');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des constructions:', error);
      throw error;
    }
  },

  // Créer une nouvelle construction
  createConstruction: async (constructionData) => {
    try {
      const response = await territoireApi.post('/construction', constructionData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de la construction:', error);
      throw error;
    }
  },
};

// Service Alignement
export const alignmentService = {
  createAlignment: async (alignmentData) => {
    return alignementApi.post('/alignment', alignmentData);
  },
  getAlignment: async (id) => {
    return alignementApi.get(`/alignment/${id}`);
  },
  updateAlignment: async (id, alignmentData) => {
    return alignementApi.put(`/alignment/${id}`, alignmentData);
  },
  deleteAlignment: async (id) => {
    return alignementApi.delete(`/alignment/${id}`);
  },
  uploadFile: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return alignementApi.post('/alignments/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  createTerrain: async (terrainData) => {
    return alignementApi.post('/terrain', terrainData);
  },
};


// Service pour la gestion des rôles
export const roleService = {
  // Récupérer tous les rôles pour l'application MATAC
  async getRoles() {
    try {
      console.log('Début de la récupération des rôles...');
      
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Aucun token d\'authentification trouvé');
        throw new Error('Non authentifié');
      }
      
      const matacAppId = import.meta.env.VITE_APP_ID;
      console.log('ID de l\'application MATAC:', matacAppId);
      
      console.log('Envoi de la requête pour récupérer les rôles...');
      const response = await axios.get(
        `${import.meta.env.VITE_API_SERVICEAUTH}/roles`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'X-Application-ID': matacAppId
          },
          params: {
            applicationId: matacAppId
          },
          timeout: 10000 // 10 secondes de timeout
        }
      );
      
      console.log('Réponse reçue pour les rôles:', {
        status: response.status,
        headers: response.headers,
        data: response.data
      });
      
      if (!response.data || !Array.isArray(response.data.data)) {
        console.error('Format de réponse inattendu pour les rôles:', response.data);
        throw new Error('Format de réponse inattendu pour les rôles');
      }
      
      const roles = response.data.data;
      console.log(`Nombre de rôles récupérés: ${roles.length}`, roles);
      return roles;
    } catch (error) {
      console.error('Erreur lors de la récupération des rôles:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw error;
    }
  },

  // Attribuer un rôle à un utilisateur pour l'application MATAC
  async assignRole(userId, roleId) {
    try {
      if (!userId || !roleId) {
        throw new Error('ID utilisateur et ID rôle sont requis');
      }
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Non authentifié');
      }
      
      const matacAppId = import.meta.env.VITE_APP_ID;
      console.log(`Assignation du rôle ${roleId} à l'utilisateur ${userId} pour l'application ${matacAppId}`);
      
      const response = await axios.post(
        `${import.meta.env.VITE_API_SERVICEAUTH}/roles/assign`,
        { 
          user_id: userId, 
          role_id: roleId,
          application_id: matacAppId
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'X-Application-ID': matacAppId
          }
        }
      );
      
      console.log('Réponse d\'assignation de rôle:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'attribution du rôle:', error);
      throw error;
    }
  },

  // Récupérer les rôles d'un utilisateur pour l'application MATAC
  async getUserRoles(userId) {
    try {
      if (!userId) {
        console.error('ID utilisateur manquant pour la récupération des rôles');
        return [];
      }
      
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Aucun token d\'authentification trouvé');
        throw new Error('Non authentifié');
      }
      
      const matacAppId = import.meta.env.VITE_APP_ID;
      console.log(`Récupération des rôles pour l'utilisateur ${userId} sur l'application ${matacAppId}`);
      
      try {
        // Essayer d'abord avec l'endpoint spécifique à l'utilisateur
        const response = await axios.get(
          `${import.meta.env.VITE_API_SERVICEAUTH}/users/${userId}/roles`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
              'X-Application-ID': matacAppId
            },
            params: {
              applicationId: matacAppId
            }
          }
        );
        
        console.log('Réponse complète des rôles:', response.data);
        
        // Normaliser la réponse pour s'assurer qu'on a toujours un tableau
        let roles = [];
        if (response.data && Array.isArray(response.data.data)) {
          roles = response.data.data;
        } else if (response.data && response.data.roles) {
          roles = Array.isArray(response.data.roles) ? response.data.roles : [response.data.roles];
        } else if (Array.isArray(response.data)) {
          roles = response.data;
        }
        
        // S'assurer que chaque rôle a les propriétés attendues
        roles = roles.map(role => ({
          id: role.id || role.role_id,
          role_id: role.role_id || role.id,
          role_name: role.role_name || role.name || role.role_name,
          role_slug: role.role_slug || role.slug || '',
          application: role.application || { 
            app_id: role.app_id || role.application_id || matacAppId,
            app_name: role.app_name || role.application_name || 'Inconnu'
          },
          application_id: role.application_id || (role.application ? role.application.app_id : null) || matacAppId,
          ...role
        }));
        
        console.log(`Rôles normalisés pour l'utilisateur ${userId}:`, roles);
        return roles;
        
      } catch (endpointError) {
        console.warn('Erreur avec l\'endpoint spécifique, tentative avec l\'endpoint général...', endpointError);
        
        // Fallback: essayer avec l'endpoint général
        const response = await axios.get(
          `${import.meta.env.VITE_API_SERVICEAUTH}/roles`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
              'X-Application-ID': matacAppId
            },
            params: {
              userId: userId,
              applicationId: matacAppId
            }
          }
        );
        
        // Normaliser la réponse
        let roles = [];
        if (response.data && Array.isArray(response.data.data)) {
          roles = response.data.data;
        } else if (response.data && response.data.roles) {
          roles = Array.isArray(response.data.roles) ? response.data.roles : [response.data.roles];
        } else if (Array.isArray(response.data)) {
          roles = response.data;
        }
        
        console.log(`Rôles récupérés (fallback) pour l'utilisateur ${userId}:`, roles);
        return roles;
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des rôles utilisateur:', {
        userId,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      return [];
    }
  },

  // Récupérer tous les utilisateurs avec leurs rôles pour l'application MATAC
  async getAllUsers() {
    try {
      console.log('Début de la récupération des utilisateurs...');
      
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Aucun token d\'authentification trouvé');
        throw new Error('Non authentifié');
      }
      
      const matacAppId = import.meta.env.VITE_APP_ID;
      console.log('ID de l\'application MATAC pour le filtrage:', matacAppId);
      
      // Fonction pour normaliser les données utilisateur
      const normalizeUserData = (user) => ({
        id: user.id || user.user_id,
        user_id: user.user_id || user.id,
        user_pseudo: user.user_pseudo || user.username || user.email?.split('@')[0] || 'Utilisateur',
        user_email: user.user_email || user.email,
        email: user.email || user.user_email,
        citizen_name: user.citizen_name || user.first_name || user.name?.split(' ')[0] || '',
        citizen_lastname: user.citizen_lastname || user.last_name || user.name?.split(' ').slice(1).join(' ') || '',
        created_at: user.created_at || new Date().toISOString(),
        updated_at: user.updated_at || null,
        ...user
      });
      
      // Première tentative : récupérer les utilisateurs avec le filtre d'application
      console.log('Tentative de récupération des utilisateurs avec filtre d\'application...');
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_SERVICEAUTH}/users`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
              'X-Application-ID': matacAppId
            },
            params: {
              applicationId: matacAppId
            },
            timeout: 15000
          }
        );
        
        console.log('Réponse de l\'API pour les utilisateurs (avec filtre):', {
          status: response.status,
          headers: response.headers,
          data: response.data
        });
        
        let users = [];
        if (response.data && Array.isArray(response.data.data)) {
          users = response.data.data.map(normalizeUserData);
          console.log(`Nombre d'utilisateurs récupérés avec filtre: ${users.length}`);
          
          if (users.length > 0) {
            return users;
          }
        } else if (Array.isArray(response.data)) {
          // Si la réponse est directement un tableau
          users = response.data.map(normalizeUserData);
          console.log(`Nombre d'utilisateurs récupérés (format direct): ${users.length}`);
          return users;
        }
      } catch (filterError) {
        console.warn('Erreur lors de la récupération avec filtre d\'application, tentative sans filtre...', {
          message: filterError.message,
          response: filterError.response?.data
        });
      }
      
      // Deuxième tentative : récupérer tous les utilisateurs et filtrer côté client
      console.log('Tentative de récupération de tous les utilisateurs...');
      try {
        const fallbackResponse = await axios.get(
          `${import.meta.env.VITE_API_SERVICEAUTH}/users`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
              'X-Application-ID': matacAppId
            },
            timeout: 15000
          }
        );
        
        console.log('Réponse de l\'API pour tous les utilisateurs (sans filtre):', {
          status: fallbackResponse.status,
          headers: fallbackResponse.headers,
          data: fallbackResponse.data
        });
        
        let allUsers = [];
        if (fallbackResponse.data && Array.isArray(fallbackResponse.data.data)) {
          allUsers = fallbackResponse.data.data.map(normalizeUserData);
        } else if (Array.isArray(fallbackResponse.data)) {
          allUsers = fallbackResponse.data.map(normalizeUserData);
        } else {
          console.error('Format de réponse inattendu pour les utilisateurs:', fallbackResponse.data);
          throw new Error('Format de réponse inattendu pour les utilisateurs');
        }
        
        console.log(`Nombre total d'utilisateurs récupérés: ${allUsers.length}`);
        
        // Si on a récupéré des utilisateurs, on les retourne tous
        // Le filtrage par application se fera côté client si nécessaire
        if (allUsers.length > 0) {
          return allUsers;
        }
        
        return [];
        
      } catch (fallbackError) {
        console.error('Échec de la récupération de tous les utilisateurs:', {
          message: fallbackError.message,
          response: fallbackError.response?.data
        });
        
        // En cas d'échec, retourner un tableau vide plutôt que de lancer une erreur
        // pour permettre à l'application de continuer à fonctionner
        return [];
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      // Retourner un tableau vide en cas d'erreur
      return [];
    }
  }
};