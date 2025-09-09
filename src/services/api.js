import axios from 'axios';

const API_BASE_URL = 'https://gateway.tsirylab.com';

// Constante temporaire pour les tests - à remplacer par l'ID utilisateur réel en production
export const TEMP_USER_ID = 'temp_user_id_123';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',

  },
});

// Add a request interceptor to include auth token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Service Citoyen API
export const citoyenService = {
  // Vérifier si un CIN existe
  async checkCIN(cin) {
    try {
      const response = await api.get(`/servicecitoyen/citizens/${cin}`);
      return {
        exists: true,
        data: response.data
      };
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return { exists: false };
      }
      throw error;
    }
  },

  
  
  // Créer un nouveau citoyen
  async createCitizen(citizenData) {
    const response = await api.post('/serviceauth/users/register-with-citizen-short', citizenData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};

// Service Upload API
export const uploadService = {
  async uploadCitizenPhoto(photoFile) {
    const formData = new FormData();
    formData.append('file', photoFile);
    
    const response = await api.post('/serviceupload/api/upload/citizen-photo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  }
};

// Service Territoire API
export const territoireService = {
  // Récupérer la liste des communes
  async getCommunes() {
    const response = await api.get('/serviceterritoire/communes');
    console.log(response.data)
    return response.data;
  },
  
  // Récupérer la liste des fokontany par commune
  async getFokotanys(communeId) {
    const response = await api.get(`/serviceterritoire/api/fokotanys/commune/${communeId}`);
    return response.data;
  }
};

export const loginService = {
  async login(loginData) {
    // Utilise l'endpoint le plus probable pour un backend NestJS
    const response = await api.post('/serviceauth/auth/login', loginData);
    return response.data;
  }
};

// Service Auth API
export const authService = {
  // Demander la réinitialisation du mot de passe
  async forgotPassword(user_email) {
    const response = await api.post('/serviceauth/auth/forgot-password', { user_email });
    return response.data;
  }
};

// Service pour les opérations d'alignement
export const alignmentService = {
  // Créer un nouvel alignement
  createAlignment: async (alignmentData) => {
    return api.post('/alignments', alignmentData);
  },
  
  // Récupérer un alignement par son ID
  getAlignment: async (id) => {
    return api.get(`/alignments/${id}`);
  },
  
  // Mettre à jour un alignement
  updateAlignment: async (id, alignmentData) => {
    return api.put(`/alignments/${id}`, alignmentData);
  },
  
  // Supprimer un alignement
  deleteAlignment: async (id) => {
    return api.delete(`/alignments/${id}`);
  },
  
  // Télécharger un fichier pour un alignement
  uploadFile: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/alignments/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export default api;
