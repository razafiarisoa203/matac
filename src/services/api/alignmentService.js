import axiosConfig from "./axios.config";
//import axios from "axios";

export const alignmentService = {

  /* //Création d’un alignement
   createAlignment: async (donneAlignment) => {
     try {
       const response = await axios.post('http://localhost:3001/servicealignement/alignment', donneAlignment);
       return response.data;
     } catch (error) {
       console.error('Erreur lors de la création de l\'alignement:', error);
       throw error;
     }
   },*/

// Récupération tous les alignements par id utilisateur connecter
  getAllAlignment: async (mandataire = null) => {
    try {
      const response = await axiosConfig.get(`/servicealignement/alignment?mandataire=${mandataire}`);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des alignements:", error);
      throw error;
    }
  },

  async getConstructionByReference(referenceAlignement) {
      try {
        const response = await axiosConfig.get(`/servicealignement/alignment/by-reference/${referenceAlignement}`);
        return response.data;
      } catch (error) {
        console.error('Erreur lors de la récupération de la construction:', error);
        throw error;
      }
    },

  // Création d’un alignement
  createAlignment: async (donneAlignment) => {
    try {
      const response = await axiosConfig.post('/servicealignement/alignment', donneAlignment);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de l\'alignement:', error);
      throw error;
    }
  },
  //Recuperer un terrain par ID
  getTerrainById: async (id) => {
    try {
      const response = await axiosConfig.get(`/servicealignement/terrain/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de terrain:', error)
      throw error;
    }
  },

  //Recuperer un terrain par numero titre
  getTerrainByTitre: async (num_titre) => {
    try {
      const response = await axiosConfig.get(`/servicealignement/terrain/by-num-titre/${num_titre}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de terrain:', error)
      throw error;
    }
  },

  // Récupérer un alignement par ID
  getAlignmentById: async (id) => {
    try {
      const response = await axiosConfig.get(`/servicealignement/alignment/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'alignement:', error);
      throw error;
    }
  },

  // Récupérer un alignement par ID avec tous les détails
  getAlignmentDetails: async (id) => {
    try {
      const response = await axiosConfig.get(`/servicealignement/alignment/${id}/details`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des détails:', error);
      throw error;
    }
  },

  // Générer un PDF pour un alignement
  generateAlignmentPDF: async (id) => {
    try {
      const response = await axiosConfig.get(`/servicealignement/alignment/${id}/pdf`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      throw error;
    }
  },

  // Mettre à jour le statut d’un alignement
  updateAlignmentStatus: async (id, status) => {
    try {
      const response = await axiosConfig.patch(`/servicealignement/alignment/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      throw error;
    }
  },

  // Création d’un terrain
  createTerrain: async (terrainData) => {
    try {
      const response = await axiosConfig.post('/servicealignement/terrain', terrainData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création du terrain:', error);
      throw error;
    }
  },
};
