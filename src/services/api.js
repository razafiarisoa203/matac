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
        throw new Error('Service utilisateur indisponible');
      }
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération des données utilisateur:', error);
      // Retourner des données par défaut au lieu de lancer une erreur
      return {
        citizen_name: 'Utilisateur',
        citizen_lastname: 'Test',
        citizen_national_card_number: '000000000000',
        citizen_work: 'Particulier'
      };
    }
  }
};

// Services pour les alignements
export const alignmentService = {
  // Créer un nouveau terrain
  createTerrain: async (terrainData) => {
    try {
      const formData = new URLSearchParams();
      Object.keys(terrainData).forEach(key => {
        if (terrainData[key] !== null && terrainData[key] !== undefined) {
          formData.append(key, terrainData[key]);
        }
      });

      const response = await fetch(`${API_BASE_ALIGNMENT}/servicealignement/terrain`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur lors de la création du terrain: ${errorText}`);
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
      const formData = new URLSearchParams();
      Object.keys(alignmentData).forEach(key => {
        if (alignmentData[key] !== null && alignmentData[key] !== undefined) {
          formData.append(key, alignmentData[key]);
        }
      });

      const response = await fetch(`${API_BASE_ALIGNMENT}/servicealignement/alignment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur lors de la création de l'alignement: ${errorText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la création de l\'alignement:', error);
      throw error;
    }
  },

  // Récupérer tous les alignements
  getAlignments: async (mandataire = null) => {
    try {
      let url = `${API_BASE_ALIGNMENT}/servicealignement/alignment`;
      if (mandataire) {
        url += `?mandataire=${encodeURIComponent(mandataire)}`;
      }

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des alignements');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération des alignements:', error);
      throw error;
    }
  },

  // Récupérer un alignement par ID
  getAlignment: async (id) => {
    try {
      const response = await fetch(`${API_BASE_ALIGNMENT}/servicealignement/alignment/${id}`);
      
      if (!response.ok) {
        throw new Error('Alignement non trouvé');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'alignement:', error);
      throw error;
    }
  },

  // Récupérer les pièces jointes d'un alignement
  getPieceJointes: async (alignmentId) => {
    try {
      const response = await fetch(`${API_BASE_ALIGNMENT}/servicealignement/piece-jointe/alignment/${alignmentId}`);
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des pièces jointes');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération des pièces jointes:', error);
      throw error;
    }
  },

  // Créer une pièce jointe avec informations de fichier
  createPieceJointe: async (pieceJointeData) => {
    try {
      const formData = new URLSearchParams();
      Object.keys(pieceJointeData).forEach(key => {
        if (pieceJointeData[key] !== null && pieceJointeData[key] !== undefined) {
          formData.append(key, pieceJointeData[key]);
        }
      });

      const response = await fetch(`${API_BASE_ALIGNMENT}/servicealignement/piece-jointe/with-file-info`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur lors de la création de la pièce jointe: ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la création de la pièce jointe:', error);
      throw error;
    }
  },

  // Récupérer tous les terrains
  getTerrains: async (filters = {}) => {
    try {
      let url = `${API_BASE_ALIGNMENT}/servicealignement/terrain`;
      const params = new URLSearchParams();
      
      if (filters.numTitre) {
        params.append('numTitre', filters.numTitre);
      }
      if (filters.proprietaire) {
        params.append('proprietaire', filters.proprietaire);
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des terrains');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération des terrains:', error);
      throw error;
    }
  },

  // Récupérer un terrain par ID
  getTerrain: async (id) => {
    try {
      const response = await fetch(`${API_BASE_ALIGNMENT}/servicealignement/terrain/${id}`);
      
      if (!response.ok) {
        throw new Error('Terrain non trouvé');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération du terrain:', error);
      throw error;
    }
  },

  // Uploader un fichier
  uploadFile: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`http://localhost:3000/upload`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur lors de l'upload du fichier: ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      throw error;
    }
  }
};

export { TEMP_USER_ID };
