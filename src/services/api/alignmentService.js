// src/services/api/alignmentService.js
import axiosConfig from "./axios.config";
import { authService } from "./authService";

/**
 * Retourne l'ID du citoyen connecté (même logique que HeaderDashboard).
 * Retourne null si l'utilisateur n'est pas identifié.
 */
// Profil enregistré par l'application (contient id_citizen), lisible même si le token a expiré
const readStoredProfile = () => {
  try {
    return JSON.parse(sessionStorage.getItem("user_profile") || "{}");
  } catch {
    return {};
  }
};

const getCurrentCitizenId = async () => {
  const user = authService.getUserInfo() || {};
  console.log("[alignmentService] getUserInfo() =", user);

  let id =
    user.id_citizen ||
    user.citizen_id ||
    user.citizen?.id_citizen ||
    readStoredProfile().id_citizen ||
    user.id ||
    null;

  // Repli : on demande le profil au serveur (/serviceauth/auth/profile)
  if (!id) {
    console.warn("[alignmentService] id_citizen absent du token, appel du profil serveur...");
    const profile = await authService.getUserProfile();
    console.log("[alignmentService] getUserProfile() =", profile);
    id = profile?.id_citizen || profile?.citizen?.id_citizen || null;
  }

  return id ? String(id).trim() : null;
};

export const alignmentService = {
  // Récupération de tous les alignements du mandataire connecté
  getAllAlignment: async (mandataire = null) => {
    // Si aucun ID n'est fourni, on utilise celui du citoyen connecté
    const idMandataire = mandataire || (await getCurrentCitizenId());

    try {
      const response = await axiosConfig.get(
        `/servicealignement/alignment?mandataire=${encodeURIComponent(idMandataire ?? "")}`
      );
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return [];
      }
      console.error("Erreur lors de la récupération des alignements:", error);
      throw error;
    }
  },

  getConstructionByReference: async (referenceAlignement) => {
    try {
      const response = await axiosConfig.get(
        `/servicealignement/alignment/by-reference/${referenceAlignement}`
      );
      return response.data;
    } catch (error) {
      console.error("❌ Erreur lors de la récupération de la construction :", error);
      throw error;
    }
  },

  // Création d'un alignement : id_mandataire = id_citizen de l'utilisateur connecté
  createAlignment: async (donneAlignment) => {
    const idMandataire = await getCurrentCitizenId();

    if (!idMandataire) {
      throw new Error("Utilisateur non identifié, veuillez vous reconnecter.");
    }

    // On écrase toute valeur vide ou " " envoyée par le formulaire
    let payload;
    if (donneAlignment instanceof FormData) {
      donneAlignment.set("id_mandataire", idMandataire);
      payload = donneAlignment;
    } else {
      payload = { ...donneAlignment, id_mandataire: idMandataire };
    }

    // Log de contrôle (à retirer une fois le problème réglé)
    if (payload instanceof FormData) {
      console.log("[alignmentService] id_mandataire envoyé :", payload.get("id_mandataire"));
    } else {
      console.log("[alignmentService] id_mandataire envoyé :", payload.id_mandataire);
    }

    try {
      const response = await axiosConfig.post("/servicealignement/alignment", payload);
      return response.data;
    } catch (error) {
      console.error(
        "Erreur lors de la création de l'alignement:",
        error?.response?.data || error
      );
      throw error;
    }
  },

  // Récupérer un terrain par ID
  getTerrainById: async (id) => {
    try {
      const response = await axiosConfig.get(`/servicealignement/terrain/${id}`);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération de terrain:", error);
      throw error;
    }
  },

  // Récupérer un terrain par numéro de titre
  getTerrainByTitre: async (num_titre) => {
    try {
      const response = await axiosConfig.get(
        `/servicealignement/terrain/by-num-titre/${num_titre}`
      );
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération de terrain:", error);
      throw error;
    }
  },

  // Récupérer un alignement par ID
  getAlignmentById: async (id) => {
    try {
      const response = await axiosConfig.get(`/servicealignement/alignment/${id}`);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération de l'alignement:", error);
      throw error;
    }
  },

  // Récupérer un alignement par ID avec tous les détails
  getAlignmentDetails: async (id) => {
    try {
      const response = await axiosConfig.get(`/servicealignement/alignment/${id}/details`);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des détails:", error);
      throw error;
    }
  },

  // Générer un PDF pour un alignement
  generateAlignmentPDF: async (id) => {
    try {
      const response = await axiosConfig.get(`/servicealignement/alignment/${id}/pdf`, {
        responseType: "blob",
      });
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la génération du PDF:", error);
      throw error;
    }
  },

  // Mettre à jour le statut d'un alignement
  updateAlignmentStatus: async (id, status) => {
    try {
      const response = await axiosConfig.patch(`/servicealignement/alignment/${id}/status`, {
        status,
      });
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
      throw error;
    }
  },

  // Création d'un terrain
  createTerrain: async (terrainData) => {
    try {
      const response = await axiosConfig.post("/servicealignement/terrain", terrainData);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la création du terrain:", error);
      throw error;
    }
  },
};