import axios from 'axios';

// Constante temporaire pour les tests - à remplacer par l'ID utilisateur réel en production
export const TEMP_USER_ID = 'temp_user_id_123';

// Récupération des URLs depuis le .env
const servicesApi = {
  territoire: import.meta.env.VITE_API_SERVICETERITOIRE,
  auth: import.meta.env.VITE_API_SERVICEAUTH,
  citoyen: import.meta.env.VITE_API_SERVICECITOYEN,
  upload: import.meta.env.VITE_API_SERVICEUPLOAD,
  alignement: import.meta.env.VITE_API_SERVICEALIGNEMENT,
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

export const constructionService = {
  // Récupérer toutes les constructions
  getConstruction: async () => {
    try {
      const response = await fetch(`${API_BASE_CONSTRUCTION}/serviceconstruction/construction`);
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération des constructions:', error);
      return [];
    }
  },

  // Créer une nouvelle construction
  createConstruction: async (constructionData) => {
    try {
      const response = await fetch(`${API_BASE_CONSTRUCTION}/serviceconstruction/construction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(constructionData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création de la construction');
      }

      return await response.json();
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
