import axios from 'axios';

// Constante temporaire pour les tests - à remplacer par l'ID utilisateur réel en production
export const TEMP_USER_ID = 'temp_user_id_123';

// Récupération des URLs depuis le .env
const servicesApi = {
  // Tous les services utilisent l'URL de base avec leur chemin respectif
  territoire: `${import.meta.env.VITE_API_URL}/serviceterritoire-v2`,
  auth: `${import.meta.env.VITE_API_URL}/serviceauth/auth`,
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

// Configuration spéciale pour citoyenApi pour gérer les fichiers
const createCitoyenApi = (baseURL) => {
  const instance = axios.create({
    baseURL,
    // Ne pas définir le Content-Type ici, il sera défini automatiquement avec le bon boundary
  });

  // Intercepteur pour ajouter le token d'authentification
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      // Pour les requêtes FormData, laisser le navigateur définir le Content-Type avec le bon boundary
      if (config.data instanceof FormData) {
        delete config.headers['Content-Type'];
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
const citoyenApi = createCitoyenApi(servicesApi.citoyen); // Utilise la configuration spéciale
const uploadApi = addInterceptor(createApi(servicesApi.upload));
const alignementApi = addInterceptor(createApi(servicesApi.alignement));
const notificationApi = addInterceptor(createApi(servicesApi.auth)); // Utilise le même endpoint que auth pour les notifications

// ===================== Services =====================

// Service Citoyen
export const citoyenService = {
  async checkCIN(cin, maxRetries = 2) {
    // Vérification de base du format CIN (12 chiffres)
    if (!/^\d{12}$/.test(cin)) {
      throw new Error('Format CIN invalide. Le CIN doit contenir exactement 12 chiffres.');
    }

    let lastError;
    let attempt = 0;
    const endpoints = [
      `/citizens/check-cin?cin=${cin}`,  // Nouvel endpoint
      `/citizens/${cin}`                  // Ancien endpoint de secours
    ];

    while (attempt <= maxRetries) {
      for (const endpoint of endpoints) {
        try {
          attempt++;
          console.log(`Tentative ${attempt} avec l'endpoint: ${endpoint}`);
          
          const response = await citoyenApi.get(endpoint);
          
          // Si on utilise le premier endpoint
          if (endpoint.includes('check-cin')) {
            if (typeof response.data?.exists === 'boolean') {
              return { 
                exists: response.data.exists, 
                data: response.data,
                source: 'check-cin-endpoint'
              };
            }
            return { exists: false, source: 'check-cin-endpoint' };
          } 
          // Si on utilise le deuxième endpoint
          else {
            return { 
              exists: true, 
              data: response.data,
              source: 'citizens-endpoint'
            };
          }
          
        } catch (error) {
          lastError = error;
          
          // Journalisation détaillée de l'erreur
          console.error(`Erreur lors de la tentative ${attempt} avec ${endpoint}:`, {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            message: error.message
          });

          // Si c'est une erreur 404 sur le deuxième endpoint, le CIN n'existe pas
          if (error.response?.status === 404 && endpoint.includes(cin)) {
            return { 
              exists: false,
              source: 'citizens-endpoint-404'
            };
          }

          // Attendre avant de réessayer (backoff exponentiel)
          if (attempt < maxRetries) {
            const delay = Math.min(1000 * Math.pow(2, attempt), 10000); // Maximum 10 secondes
            console.log(`Nouvelle tentative dans ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        }
      }
    }

    // Si on arrive ici, toutes les tentatives ont échoué
    const errorMessage = lastError?.response?.status === 500
      ? "Le service de vérification du CIN est actuellement indisponible. Veuillez réessayer plus tard ou contacter le support technique."
      : "Impossible de vérifier le CIN. Veuillez vérifier votre connexion internet et réessayer.";
    
    const error = new Error(errorMessage);
    error.isRetryable = true; // Pour permettre une nouvelle tentative côté UI
    error.originalError = lastError;
    throw error;
  },

  async createCitizen(citizenData) {
    try {
      console.log('Début de createCitizen avec les données:', citizenData);
      
      // Créer un nouvel objet FormData
      const formData = new FormData();
      let fokotanyFormattedId = '';
      
      // Vérifier si c'est déjà un FormData
      const isFormData = citizenData instanceof FormData;
      console.log('Données reçues est un FormData:', isFormData);
      
      // Si c'est un FormData, le cloner, sinon ajouter les champs manuellement
      if (isFormData) {
        const entries = Array.from(citizenData.entries());
        
        // D'abord, collecter le fokotany_formatted_id s'il est présent
        const fokotanyEntry = entries.find(([key]) => key === 'fokotany_formatted_id');
        if (fokotanyEntry) {
          fokotanyFormattedId = fokotanyEntry[1];
        }
        
        // Ajouter tous les champs sauf fokotany_id qui sera ajouté après
        for (const [key, value] of entries) {
          if (key !== 'fokotany_id' && value !== null && value !== undefined) {
            console.log(`Ajout de ${key}:`, value);
            formData.append(key, value);
          }
        }
        
        // Ajouter fokotany_id avec la même valeur que fokotany_formatted_id
        if (fokotanyFormattedId) {
          console.log(`Ajout de fokotany_id:`, fokotanyFormattedId);
          formData.append('fokotany_id', fokotanyFormattedId);
        }
      } else {
        // Pour un objet standard, traiter fokotany_formatted_id en premier
        if (citizenData.fokotany_formatted_id) {
          fokotanyFormattedId = citizenData.fokotany_formatted_id;
          formData.append('fokotany_formatted_id', fokotanyFormattedId);
          formData.append('fokotany_id', fokotanyFormattedId);
        }
        
        // Ajouter les autres champs
        Object.entries(citizenData).forEach(([key, value]) => {
          if (key !== 'fokotany_formatted_id' && key !== 'fokotany_id' && 
              value !== undefined && value !== null) {
            // Pour les champs de type fichier, toujours les ajouter même s'ils sont vides
            if (key === 'citizen_photo' || (value instanceof File)) {
              console.log(`Ajout du fichier ${key}:`, value.name || 'fichier vide');
              formData.append(key, value);
            } else if (value !== '') { // Ne pas ajouter les chaînes vides
              console.log(`Ajout de ${key}:`, value);
              formData.append(key, value);
            }
          }
        });
      }
      
      // Afficher le contenu de FormData pour débogage
      console.log('Contenu de FormData:');
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }
      
      console.log('Envoi de la requête POST à /citizens');
      
      // Utiliser l'instance citoyenApi configurée qui gère déjà le token et le Content-Type
      const response = await citoyenApi.post('/citizens', formData);
      
      console.log('Réponse reçue:', response);
      return response.data;
      
    } catch (error) {
      console.error('Erreur dans createCitizen:', {
        message: error.message,
        code: error.code,
        response: {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          headers: error.response?.headers
        },
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers,
          data: error.config?.data
        }
      });
      
      // Créer une erreur plus détaillée
      const apiError = new Error(error.response?.data?.message || 'Erreur lors de la création du citoyen');
      apiError.status = error.response?.status;
      apiError.details = error.response?.data;
      
      throw apiError;
    }
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
    try {
      console.log('[API] Récupération des communes...');
      const response = await territoireApi.get('/communes/members');
      
      // Vérifier la structure de la réponse
      if (!response.data) {
        console.warn('[API] Aucune donnée dans la réponse des communes');
        return [];
      }
      
      // Gérer différents formats de réponse
      const data = response.data.data || response.data;
      const communes = Array.isArray(data) ? data : [data];
      
      console.log(`[API] ${communes.length} communes récupérées`);
      return communes.map(c => ({
        id: c.id || c.commune_id || '',
        commune_id: c.id || c.commune_id || '',
        formatted_id: c.id || c.commune_id || '',
        name: c.nom || c.name || `Commune ${c.id || c.commune_id || ''}`,
        ...c
      }));
      
    } catch (error) {
      console.error('[API] Erreur lors de la récupération des communes:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      return [];
    }
  },
  
  async getRegions() {
    const response = await territoireApi.get('/regions');
    return response.data;
  },
  
  async getFokotanys(communeFormattedId) {
    try {
      if (!communeFormattedId) {
        console.warn('[API] Aucun ID de commune fourni pour la récupération des fokotanys');
        return [];
      }

      console.log(`[API] Récupération des fokotanys pour la commune ${communeFormattedId}...`);
      
      // Récupérer d'abord la liste des communes avec leurs fokotanys
      const communes = await this.getCommunes();
      
      // Trouver la commune correspondante
      const commune = communes.find(c => 
        c.formatted_id === communeFormattedId || 
        c.commune_id?.toString() === communeFormattedId ||
        c.id?.toString() === communeFormattedId
      );
      
      if (!commune) {
        console.warn(`[API] Aucune commune trouvée avec l'ID ${communeFormattedId}`);
        return [];
      }
      
      // Récupérer les fokotanys de la commune
      const fokotanys = commune.fokotanys || [];
      
      if (fokotanys.length === 0) {
        console.warn(`[API] Aucun fokotany trouvé pour la commune ${communeFormattedId} (${commune.name})`);
      } else {
        console.log(`[API] ${fokotanys.length} fokotanys récupérés pour la commune ${communeFormattedId} (${commune.name})`);
      }
      
      // Formater les données des fokotanys
      return fokotanys.map(f => {
        const fokotanyId = f.fokotany_id || f.id || '';
        // Extraire le formatted_id de l'objet fokotany
        const formattedId = f.formatted_id || f.formatted_id || fokotanyId;
        
        console.log('Fokotany data:', {
          original: f,
          id: fokotanyId,
          formatted_id: formattedId
        });
        
        return {
          id: fokotanyId,
          fokotany_id: fokotanyId,
          formatted_id: formattedId,
          name: f.name || f.nom || `Fokotany ${fokotanyId}`,
          // Conserver toutes les propriétés d'origine
          ...f
        };
      });
      
    } catch (error) {
      console.error(`[API] Erreur lors de la récupération des fokotanys:`, {
        communeFormattedId,
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url,
        method: error.config?.method
      });
      
      // Si c'est une erreur 404, retourner un tableau vide au lieu de lever une exception
      if (error.response?.status === 404) {
        console.warn(`[API] Aucun fokotany trouvé pour la commune ${communeFormattedId}`);
        return [];
      }
      
      // Pour les autres erreurs, propager avec un message clair
      throw new Error(`Impossible de charger les fokotanys pour la commune ${communeFormattedId}. Veuillez réessayer plus tard.`);
    }
  },
  
  async getCommuneMembers(communeFormattedId) {
    try {
      if (!communeFormattedId) {
        console.warn('[API] Aucun ID de commune fourni pour la récupération des membres');
        return [];
      }

      console.log(`[API] Récupération des membres pour la commune ${communeFormattedId}...`);
      
      // Utilisation du nouvel endpoint pour les membres de la commune
      let response;
      try {
        // Ajout d'un timeout pour éviter les attentes trop longues
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 secondes de timeout
        
        response = await territoireApi.get(`/communes/members`, {
          params: { commune_id: communeFormattedId },
          signal: controller.signal
        });
        clearTimeout(timeoutId);
      } catch (error) {
        console.error('[API] Erreur lors de la récupération des membres de la commune:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
        return [];
      }
      
      // Vérifier la structure de la réponse
      if (!response.data) {
        console.warn('[API] Aucune donnée dans la réponse des membres de la commune');
        return [];
      }
      
      // Gérer différents formats de réponse
      const data = response.data.data || response.data;
      
      // S'assurer que nous retournons un tableau
      const members = Array.isArray(data) ? data : [data];
      
      if (members.length === 0) {
        console.warn(`[API] Aucun membre trouvé pour la commune ${communeFormattedId}`);
      } else {
        console.log(`[API] ${members.length} membres récupérés pour la commune ${communeFormattedId}`);
      }
      
      return members.map(member => ({
        id: member.id || member.user_id || '',
        user_id: member.user_id || member.id || '',
        name: member.name || `${member.first_name || ''} ${member.last_name || ''}`.trim() || `Membre ${member.id || ''}`,
        role: member.role || 'Membre',
        phone: member.phone || member.telephone || '',
        email: member.email || '',
        ...member
      }));
      
    } catch (error) {
      console.error(`[API] Erreur lors de la récupération des membres de la commune:`, {
        communeFormattedId,
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url,
        method: error.config?.method
      });
      
      // En cas d'erreur, retourner un tableau vide
      return [];
    }
  },
};

// Service Login
export const loginService = {
  async login(loginData) {
    // ⚠️ on utilise authApi.post et pas axios.post avec une URL en dur
    const response = await authApi.post('login', loginData);

    if (response.data && response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      authApi.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    }

    return response.data;
  },
};

// Service Auth
export const authService = {
  async forgotPassword(user_email) {
    // Compatibilité: certains backends attendent "email" au lieu de "user_email"
    const payload = { user_email, email: user_email };
    let lastError;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        // 1) Essayer d'abord sans Authorization sur URL absolue (évite intercepteur/token invalide)
        const absUrl = `${import.meta.env.VITE_API_URL}/serviceauth/auth/forgot-password`;
        const response = await axios.post(absUrl, payload, {
          timeout: 30000,
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          withCredentials: true
        });
        // Selon les implémentations, on peut recevoir {success:true, message:..., data:...}
        return response.data || { success: true };
      } catch (error) {
        lastError = error;
        const isTimeout = error?.code === 'ECONNABORTED';
        const is5xx = (error?.response?.status || 0) >= 500;
        // Backoff exponentiel léger pour timeouts/5xx
        if ((isTimeout || is5xx) && attempt < 2) {
          const wait = 800 * Math.pow(2, attempt);
          await new Promise(res => setTimeout(res, wait));
          continue;
        }
        // 2) Fallback: tenter via instance authApi (peut injecter Authorization si nécessaire)
        try {
          const response2 = await authApi.post('/forgot-password', payload, { timeout: 30000 });
          return response2.data || { success: true };
        } catch (err2) {
          lastError = err2;
        }
        // 3) Erreur fonctionnelle (ex: 400/404): propager avec un message clair
        const msg = error?.response?.data?.message || error?.message || 'Impossible d\'envoyer le code pour le moment.';
        const e = new Error(msg);
        e.status = error?.response?.status;
        e.code = error?.code;
        throw e;
      }
    }
    const msg = lastError?.response?.data?.message || 'Le service est indisponible. Veuillez réessayer dans un instant.';
    const e = new Error(msg);
    e.status = lastError?.response?.status;
    e.code = lastError?.code;
    throw e;
  },
  async getUserData(user_id) {
    const response = await authApi.get(`/user/${user_id}`);
    return response.data;
  },
  async getConnectedUser() {
    const response = await authApi.get('/profile');
    return response.data;
  },
  async registerUser(userData) {
    try {
      // 1. First create the user
      const userResponse = await axios.post('https://gateway.tsirylab.com/serviceauth/users', {
        user_pseudo: userData.user_pseudo,
        user_email: userData.user_email,
        user_password: userData.user_password,
        user_phone: userData.user_phone,
        municipality_id: userData.municipality_id,
        id_citizen: userData.id_citizen || null
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      // 2. If user creation is successful and we have citizen data, create citizen profile
      if (userResponse.data && userResponse.data.id && userData.citizenData) {
        const formData = new FormData();
        
        // Required fields
        const requiredFields = [
          'citizen_name',
          'citizen_lastname',
          'citizen_national_card_number',
          'citizen_adress',
          'fokotany_formatted_id'
        ];

        // Check if all required fields are present
        const missingFields = requiredFields.filter(field => !userData.citizenData[field]);
        if (missingFields.length > 0) {
          throw new Error(`Missing required citizen fields: ${missingFields.join(', ')}`);
        }
        
        // Append file if it exists (required)
        if (!userData.citizenData.citizen_photo) {
          throw new Error('Citizen photo is required');
        }
        formData.append('citizen_photo', userData.citizenData.citizen_photo);
        
        // Append all citizen data
        const citizenFields = [
          'citizen_name', 'citizen_lastname', 'citizen_national_card_number',
          'citizen_adress', 'citizen_city', 'fokotany_formatted_id',
          'citizen_national_card_date', 'citizen_national_card_location'
        ];
        
        citizenFields.forEach(field => {
          if (userData.citizenData[field] !== undefined) {
            formData.append(field, userData.citizenData[field]);
          }
        });
        
        // Create citizen profile
        await axios.post('https://gateway.tsirylab.com/servicecitoyen/citizens', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });
      }
      
      return userResponse.data;
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      throw error;
    }
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

// Service Notification
export const notificationService = {
  async sendVerificationEmail(email, code) {
    try {
      const response = await axios.post('/servicenotification/email/send', {
        to: email,
        subject: 'Réinitialisation de votre mot de passe',
        template: 'password-reset',
        data: {
          code: code,
          expiration: '15 minutes'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email de vérification:', error.response?.data || error.message);
      throw error;
    }
  },

  async getAllNotifications() {
    try {
      const response = await notificationApi.get('/servicenotification/notifications');
      console.log('All notifications retrieved:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des notifications:', error.response?.data || error.message);
      throw error;
    }
  },

  async markAsRead(notificationId) {
    try {
      const response = await notificationApi.patch(`/servicenotification/notifications/${notificationId}/read`);
      console.log('Notification marked as read:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors du marquage comme lu:', error.response?.data || error.message);
      throw error;
    }
  },

  async deleteNotification(notificationId) {
    try {
      const response = await notificationApi.delete(`/servicenotification/notifications/${notificationId}`);
      console.log('Notification deleted successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la suppression de la notification:', error.response?.data || error.message);
      throw error;
    }
  },

  async broadcastNotification(notificationData) {
    try {
      const response = await notificationApi.post('/servicenotification/notifications/broadcast', notificationData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
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