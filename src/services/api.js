// Configuration des APIs
const API_BASE = import.meta.env.VITE_API_SERVICETERITOIRE;
const API_BASE_AUTH = import.meta.env.VITE_API_SERVICEAUTH;
const API_BASE_CITIZEN = import.meta.env.VITE_API_SERVICECITOYEN;
const API_BASE_ALIGNMENT = import.meta.env.VITE_API_SERVICEALIGNMENT || 'http://localhost:3000';

// ID utilisateur temporaire (en attendant l'implémentation du login)
const TEMP_USER_ID = '063c91cb-f3e3-4d8a-8737-32304aee41a0';

// Services pour les régions et communes
export const territoireService = {
  // Récupérer toutes les régions
  getRegions: async () => {
    try {
      const response = await fetch(`${API_BASE}/regions`);
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération des régions:', error);
      return [];
    }
  },

  // Récupérer les communes d'une région
  getCommunes: async (regionId) => {
    try {
      const response = await fetch(`${API_BASE}/communes?region=${regionId}`);
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération des communes:', error);
      return [];
    }
  }
};

// Services pour l'authentification
export const authService = {
  // Récupérer les données utilisateur
  getUserData: async (userId = TEMP_USER_ID) => {
    try {
      const response = await fetch(`${API_BASE_CITIZEN}/citoyens/${userId}`);
      if (!response.ok) {
        throw new Error('Utilisateur non trouvé');
      }
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération des données utilisateur:', error);
      throw error;
    }
  }
};

// Services pour les alignements
export const alignmentService = {
  // Créer un nouveau terrain
  createTerrain: async (terrainData) => {
    try {
      const response = await fetch(`${API_BASE_ALIGNMENT}/terrains`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(terrainData)
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la création du terrain');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la création du terrain:', error);
      throw error;
    }
  },

  // Créer une nouvelle demande d'alignement
  createAlignment: async (alignmentData) => {
    try {
      const response = await fetch(`${API_BASE_ALIGNMENT}/alignments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(alignmentData)
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la création de l\'alignement');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la création de l\'alignement:', error);
      throw error;
    }
  },

  // Uploader un fichier
  uploadFile: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_BASE_ALIGNMENT}/upload`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'upload du fichier');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      throw error;
    }
  }
};

export { TEMP_USER_ID };
