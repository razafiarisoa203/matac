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
  construction: import.meta.env.VITE_API_SERVICECONSTRUCTION, // Ajout du service construction
  notification: import.meta.env.VITE_API_SERVICENOTIFICATION, // Ajout du service notification
};

// Factory pour créer une instance Axios par service
const createApi = (baseURL) =>
  axios.create({
    baseURL,
    headers: { 'Content-Type': 'application/json' },
  });

// Ajout d'intercepteur pour le token
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
const constructionApi = addInterceptor(createApi(servicesApi.construction)); // Instance pour construction
const notificationApi = addInterceptor(createApi(servicesApi.notification)); // Instance pour notification

// Instance API générique (pour compatibilité)
const api = addInterceptor(createApi(servicesApi.auth));

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

// Service Construction (complété)
export const constructionService = {
  // Récupérer toutes les constructions
  async getConstruction() {
    try {
      const response = await constructionApi.get('/construction');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des constructions:', error);
      throw error;
    }
  },

  // Créer une nouvelle construction
  async createConstruction(constructionData) {
    try {
      const response = await constructionApi.post('/construction', constructionData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de la construction:', error);
      throw error;
    }
  },

  // Récupérer une construction par ID
  async getConstructionById(id) {
    try {
      const response = await constructionApi.get(`/construction/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de la construction:', error);
      throw error;
    }
  },

  // Mettre à jour une construction
  async updateConstruction(id, constructionData) {
    try {
      const response = await constructionApi.put(`/construction/${id}`, constructionData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la construction:', error);
      throw error;
    }
  },

  // Supprimer une construction
  async deleteConstruction(id) {
    try {
      const response = await constructionApi.delete(`/construction/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la suppression de la construction:', error);
      throw error;
    }
  },

  async submitPermisConstruction(permisData) {
    try {
      console.log('Envoi des données de permis de construction:', permisData);

      // Préparer les données pour l'API avec validation renforcée
      const submissionData = this.prepareConstructionData(permisData);

      // Valider les données avant envoi
      this.validateConstructionData(submissionData);

      const response = await constructionApi.post('/construction', submissionData);

      console.log('Réponse du serveur:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la soumission du permis:', error);
      throw error;
    }
  },

  // Méthode pour préparer les données au format attendu par le backend
  prepareConstructionData(permisData) {
    const {
      formData = {},
      pieces = [],
      uploadedFiles = {} // Maintenant on utilise uploadedFiles au lieu de files
    } = permisData;

    // Transformer les données radio en boolean
    const transformRadioToBoolean = (value) => {
      if (value === 'Oui') return true;
      if (value === 'Non') return false;
      return value;
    };

    // Nettoyer et valider les pièces - MAINTENANT OPTIONNEL
    const cleanedPieces = pieces
      .filter(piece =>
        // Ne garder que les pièces qui ont au moins un champ rempli
        piece.destination || piece.niveau || piece.surface ||
        piece.surfaceOuverture || piece.hauteurLinteaux || piece.hauteurPlafond
      )
      .map((piece, index) => {
        // S'assurer que toutes les propriétés requises existent
        const cleanedPiece = {
          niveau: piece.niveau ? parseInt(piece.niveau) || 0 : 0,
          destination: piece.destination || 'Non spécifié',
          surface: piece.surface ? parseFloat(piece.surface) || 0 : 0,
          surfaceOuverture: piece.surfaceOuverture ? parseFloat(piece.surfaceOuverture) || 0 : 0,
          hauteurLinteaux: piece.hauteurLinteaux ? parseFloat(piece.hauteurLinteaux) || 0 : 0,
          hauteurPlafond: piece.hauteurPlafond ? parseFloat(piece.hauteurPlafond) || 0 : 0
        };

        return cleanedPiece;
      });

    // Fonction pour nettoyer les valeurs numériques
    const cleanNumber = (value) => {
      if (value === '' || value === null || value === undefined) return undefined;
      const num = parseFloat(value);
      return isNaN(num) ? undefined : num;
    };

    // Fonction pour extraire les noms de fichiers uploadés
    const getUploadedFilenames = (fileType) => {
      if (!uploadedFiles[fileType] || !Array.isArray(uploadedFiles[fileType])) {
        return [];
      }

      return uploadedFiles[fileType]
        .map(file => file.filename || file.name) // Utiliser filename du serveur ou name du fichier
        .filter(filename => filename && filename.trim() !== ''); // Filtrer les noms vides
    };

    // Préparer les données de base
    const baseData = {
      // Section 1: Identification
      natureTravaux: formData.natureTravaux,
      typeAffectation: formData.typeAffectation,
      referenceAlignement: formData.referenceAlignement,

      // Propriétaire
      civiliteProprietaire: formData.civiliteProprietaire,
      nomProprietaire: formData.nomProprietaire,
      telProprietaire: formData.telProprietaire,
      emailProprietaire: formData.emailProprietaire,
      cinProprietaire: formData.cinProprietaire,
      adresseProprietaire: formData.adresseProprietaire,

      // Section 2: Renseignement architectural
      auteurOuvrage: formData.auteurOuvrage,
      nomAuteur: formData.nomAuteur,
      fonctionAuteur: formData.fonctionAuteur,
      numeroOrdreAuteur: formData.numeroOrdreAuteur,
      telAuteur: formData.telAuteur,
      emailAuteur: formData.emailAuteur,
      adresseAuteur: formData.adresseAuteur,
      zoneImplantation: formData.zoneImplantation,
      materiaux: formData.materiaux,
      dureeTravaux: cleanNumber(formData.dureeTravaux),
      montantTravaux: cleanNumber(formData.montantTravaux),
      longueurProjet: cleanNumber(formData.longueurProjet),
      largeurProjet: cleanNumber(formData.largeurProjet),
      hauteurProjet: cleanNumber(formData.hauteurProjet),

      // Section 3: Renseignement technique
      surfaceTerrain: cleanNumber(formData.surfaceTerrain),
      empriseSolExistant: cleanNumber(formData.empriseSolExistant),
      empriseSol: cleanNumber(formData.empriseSol),
      cesProjet: cleanNumber(formData.cesProjet),
      surfacePlancherExistant: cleanNumber(formData.surfacePlancherExistant),
      surfacePlancherProjet: cleanNumber(formData.surfacePlancherProjet),
      surfaceVerte: cleanNumber(formData.surfaceVerte),
      niveauRPlus: cleanNumber(formData.niveauRPlus),

      // Distances
      distanceCheminPublic: cleanNumber(formData.distanceCheminPublic),
      distanceSentierPublic: cleanNumber(formData.distanceSentierPublic),
      distanceRouteNationale: cleanNumber(formData.distanceRouteNationale),
      distanceRiviere: cleanNumber(formData.distanceRiviere),
      distanceCanalPublic: cleanNumber(formData.distanceCanalPublic),
      distanceInstallationEnergie: cleanNumber(formData.distanceInstallationEnergie),
      distanceLigneElectrique: cleanNumber(formData.distanceLigneElectrique),
      distanceProjetLimitePropriete: cleanNumber(formData.distanceProjetLimitePropriete),
      distanceMinimaleProjetConstructionExistante: cleanNumber(formData.distanceMinimaleProjetConstructionExistante),

      // Équipements terrain
      equipementEau: transformRadioToBoolean(formData.equipementEau),
      equipementElectricite: transformRadioToBoolean(formData.equipementElectricite),
      equipementAssainissement: transformRadioToBoolean(formData.equipementAssainissement),
      equipementVoieAcces: transformRadioToBoolean(formData.equipementVoieAcces),

      // Caractéristiques des pièces (OPTIONNEL)
      pieces: cleanedPieces.length > 0 ? cleanedPieces : undefined,

      pieceSousSol: transformRadioToBoolean(formData.pieceSousSol),

      // Équipement de l'ouvrage
      existantVhVb: transformRadioToBoolean(formData.existantVhVb),
      existantTerasse: transformRadioToBoolean(formData.existantTerasse),
      existantGardeCorp: transformRadioToBoolean(formData.existantGardeCorp),
      nbrVeranda: cleanNumber(formData.nbrVeranda),
      nbrCouloir: cleanNumber(formData.nbrCouloir),
      nbrEscalier: cleanNumber(formData.nbrEscalier),
      nbrServitude: cleanNumber(formData.nbrServitude),

      // Assainissement
      existantBranchementEauPublic: transformRadioToBoolean(formData.existantBranchementEauPublic),
      utilisationFosseEptique: transformRadioToBoolean(formData.utilisationFosseEptique),
      typeFosseEptique: formData.typeFosseEptique,
      evacuationEauxPluviales: cleanNumber(formData.evacuationEauxPluviales),
      nbrUsageFosse: cleanNumber(formData.nbrUsageFosse),
      capaciteFosse: cleanNumber(formData.capaciteFosse),
      utilisationPuisard: transformRadioToBoolean(formData.utilisationPuisard),
      puisardAuFondation: cleanNumber(formData.puisardAuFondation),
      presentationGoutiere: transformRadioToBoolean(formData.presentationGoutiere),
      presentationRegardCollecte: transformRadioToBoolean(formData.presentationRegardCollecte),

      // Documents (noms de fichiers uploadés) - OPTIONNEL
      planTerrain: getUploadedFilenames('planTerrain'),
      droitPropriete: getUploadedFilenames('droitPropriete'),
      planLimiteTerrain: getUploadedFilenames('planLimiteTerrain'),
      planMasse: getUploadedFilenames('planMasse'),
      planFacade: getUploadedFilenames('planFacade'),

      // Informations sur les fichiers uploadés (pour le backend)
      uploadedFilesInfo: this.prepareUploadedFilesInfo(uploadedFiles),

      // IDs requis (à adapter selon votre logique)
      id_align: 1, // À remplacer par l'ID d'alignement réel
      id_terrain: 1 // À remplacer par l'ID de terrain réel
    };

    // Nettoyer les données undefined et tableaux vides
    Object.keys(baseData).forEach(key => {
      if (baseData[key] === undefined ||
        baseData[key] === '' ||
        (Array.isArray(baseData[key]) && baseData[key].length === 0)) {
        delete baseData[key];
      }
    });

    console.log('Données préparées pour envoi:', baseData);
    return baseData;
  },

  // Préparer les informations détaillées sur les fichiers uploadés
  prepareUploadedFilesInfo(uploadedFiles) {
    const filesInfo = {};

    Object.keys(uploadedFiles).forEach(fileType => {
      if (uploadedFiles[fileType] && Array.isArray(uploadedFiles[fileType])) {
        filesInfo[fileType] = uploadedFiles[fileType].map(file => ({
          originalName: file.name,
          serverFilename: file.filename,
          size: file.size,
          type: file.type,
          uploadDate: file.uploadDate || new Date().toISOString(),
          url: file.url // URL de téléchargement si disponible
        }));
      }
    });

    // Ne retourner que si on a des fichiers
    return Object.keys(filesInfo).length > 0 ? filesInfo : undefined;
  },

  // Validation des données avant envoi (plus flexible)
  validateConstructionData(data) {
    console.log('Validation des données:', data);

    // Valider les pièces seulement si elles existent
    if (data.pieces && Array.isArray(data.pieces)) {
      data.pieces.forEach((piece, index) => {
        if (!piece.destination || typeof piece.destination !== 'string') {
          throw new Error(`La pièce ${index + 1} doit avoir une destination valide`);
        }

        if (typeof piece.niveau !== 'number' || isNaN(piece.niveau)) {
          throw new Error(`La pièce ${index + 1} doit avoir un niveau valide`);
        }

        if (typeof piece.surface !== 'number' || isNaN(piece.surface)) {
          throw new Error(`La pièce ${index + 1} doit avoir une surface valide`);
        }
      });
    }

    // Validation pour les champs requis
    const requiredFields = ['nomProprietaire', 'cinProprietaire', 'natureTravaux', 'typeAffectation'];
    const missingFields = requiredFields.filter(field => !data[field]);

    if (missingFields.length > 0) {
      throw new Error(`Champs requis manquants: ${missingFields.join(', ')}`);
    }

    // Validation des emails si présents
    if (data.emailProprietaire && !this.isValidEmail(data.emailProprietaire)) {
      throw new Error('L\'email du propriétaire n\'est pas valide');
    }

    if (data.emailAuteur && !this.isValidEmail(data.emailAuteur)) {
      throw new Error('L\'email de l\'auteur n\'est pas valide');
    }

    return true;
  },

  // Méthode utilitaire pour valider les emails
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
};

// Service Alignement
export const alignmentService = {
  getAllAlignment: async () => {
    return alignementApi.get('/alignment');
  },
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

// Service Notification (CORRIGÉ)
export const notificationService = {
  async getAllNotifications() {
    try {
      const response = await notificationApi.get('/notifications');
      console.log('All notifications retrieved:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des notifications:', error.response?.data || error.message);
      throw error;
    }
  },

  async markAsRead(notificationId) {
    try {
      const response = await notificationApi.patch(`/notifications/${notificationId}/read`);
      console.log('Notification marked as read:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors du marquage comme lu:', error.response?.data || error.message);
      throw error;
    }
  },

  async deleteNotification(notificationId) {
    try {
      const response = await notificationApi.delete(`/notifications/${notificationId}`);
      console.log('Notification deleted successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la suppression de la notification:', error.response?.data || error.message);
      throw error;
    }
  },

  async broadcastNotification(notificationData) {
    try {
      const response = await notificationApi.post('/notifications/broadcast', notificationData);
      console.log('Broadcast notification posted successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de la notification de diffusion:', error.response?.data || error.message);
      throw error;
    }
  }
};

// Service pour la gestion des rôles
export const roleService = {
  // Récupérer tous les rôles pour l'application MATAC
  async getRoles() {
    try {
      console.log('Début de la récupération des rôles...');
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error('Aucun token d\'authentification trouvé');
        throw new Error('Non authentifié');
      }

      const matacAppId = import.meta.env.VITE_APP_ID;
      console.log('ID de l\'application MATAC:', matacAppId);

      console.log('Envoi de la requête pour récupérer les rôles...');
      const response = await authApi.get(
        '/roles',
        {
          params: {
            applicationId: matacAppId
          },
          timeout: 10000
        }
      );

      console.log('Réponse reçue pour les rôles:', {
        status: response.status,
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
      console.error('Erreur lors de la récupération des rôles:', error);
      throw error;
    }
  },

  // Attribuer un rôle à un utilisateur pour l'application MATAC
  async assignRole(userId, roleId) {
    try {
      if (!userId || !roleId) {
        throw new Error('ID utilisateur et ID rôle sont requis');
      }

      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Non authentifié');
      }

      const matacAppId = import.meta.env.VITE_APP_ID;
      console.log(`Assignation du rôle ${roleId} à l'utilisateur ${userId} pour l'application ${matacAppId}`);

      const response = await authApi.post(
        '/roles/assign',
        {
          user_id: userId,
          role_id: roleId,
          application_id: matacAppId
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

      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error('Aucun token d\'authentification trouvé');
        throw new Error('Non authentifié');
      }

      const matacAppId = import.meta.env.VITE_APP_ID;
      console.log(`Récupération des rôles pour l'utilisateur ${userId} sur l'application ${matacAppId}`);

      try {
        const response = await authApi.get(
          `/users/${userId}/roles`,
          {
            params: {
              applicationId: matacAppId
            }
          }
        );

        console.log('Réponse complète des rôles:', response.data);

        let roles = [];
        if (response.data && Array.isArray(response.data.data)) {
          roles = response.data.data;
        } else if (response.data && response.data.roles) {
          roles = Array.isArray(response.data.roles) ? response.data.roles : [response.data.roles];
        } else if (Array.isArray(response.data)) {
          roles = response.data;
        }

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

        const response = await authApi.get(
          '/roles',
          {
            params: {
              userId: userId,
              applicationId: matacAppId
            }
          }
        );

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
      console.error('Erreur lors de la récupération des rôles utilisateur:', error);
      return [];
    }
  },

  // Récupérer tous les utilisateurs avec leurs rôles pour l'application MATAC
  async getAllUsers() {
    try {
      console.log('Début de la récupération des utilisateurs...');

      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error('Aucun token d\'authentification trouvé');
        throw new Error('Non authentifié');
      }

      const matacAppId = import.meta.env.VITE_APP_ID;
      console.log('ID de l\'application MATAC pour le filtrage:', matacAppId);

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

      console.log('Tentative de récupération des utilisateurs avec filtre d\'application...');
      try {
        const response = await authApi.get(
          '/users',
          {
            params: {
              applicationId: matacAppId
            },
            timeout: 15000
          }
        );

        console.log('Réponse de l\'API pour les utilisateurs (avec filtre):', {
          status: response.status,
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
          users = response.data.map(normalizeUserData);
          console.log(`Nombre d'utilisateurs récupérés (format direct): ${users.length}`);
          return users;
        }
      } catch (filterError) {
        console.warn('Erreur lors de la récupération avec filtre d\'application, tentative sans filtre...', filterError);
      }

      console.log('Tentative de récupération de tous les utilisateurs...');
      try {
        const fallbackResponse = await authApi.get(
          '/users',
          {
            timeout: 15000
          }
        );

        console.log('Réponse de l\'API pour tous les utilisateurs (sans filtre):', {
          status: fallbackResponse.status,
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

        if (allUsers.length > 0) {
          return allUsers;
        }

        return [];

      } catch (fallbackError) {
        console.error('Échec de la récupération de tous les utilisateurs:', fallbackError);
        return [];
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      return [];
    }
  }
};

export default {
  citoyenService,
  uploadService,
  territoireService,
  loginService,
  authService,
  constructionService,
  alignmentService,
  notificationService,
  roleService,
  TEMP_USER_ID
};