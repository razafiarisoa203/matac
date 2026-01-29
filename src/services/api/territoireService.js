import axiosConfig from "./axios.config";

//Recuperer tous commune
export const territoireService = {
  // Fonction de recherche pour les communes
  async searchCommunes(searchTerm) {
    try {
      let allCommunes = [];
      let currentPage = 1;
      let hasMorePages = true;

      while (hasMorePages) {
        const response = await axiosConfig.get(`/serviceterritoire-v2/communes/basic?page=${currentPage}&limit=100`);
        const data = response.data?.data || response.data;
        const communes = Array.isArray(data) ? data : [];
        
        allCommunes = [...allCommunes, ...communes];

        hasMorePages = communes.length === 100;
        currentPage++;
      }

      // Filtrer les communes selon le terme de recherche
      if (searchTerm) {
        return allCommunes.filter(c => 
          (c.name || c.nom || '').toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      return allCommunes;
    } catch (error) {
      console.error('[API] Erreur lors de la recherche des communes:', error);
      throw new Error('Impossible de charger les communes. Veuillez réessayer plus tard.');
    }
  },

  // Récupérer toutes les communes avec pagination
  async getCommunes() {
    try {
      let allCommunes = [];
      let currentPage = 1;
      let hasMorePages = true;

      while (hasMorePages) {
        const response = await axiosConfig.get(`/serviceterritoire-v2/communes/basic?page=${currentPage}&limit=100`);
        const data = response.data?.data || response.data;
        const communes = Array.isArray(data) ? data : [];
        
        allCommunes = [...allCommunes, ...communes];

        // Vérifier s'il y a encore des pages
        hasMorePages = communes.length === 100;
        currentPage++;
      }

      console.log(`[API] ${allCommunes.length} communes récupérées au total`);
      return allCommunes;
    } catch (error) {
      console.error('[API] Erreur lors de la récupération des communes:', error);
      throw new Error('Impossible de charger les communes. Veuillez réessayer plus tard.');
    }
  },

  async getCommunesByRegion(regionId) {
  try {
    if (!regionId) {
      console.warn('[API] Aucun ID de région fourni');
      return [];
    }

    console.log(`[API] Récupération des communes pour la région ${regionId}...`);

    let allCommunes = [];
    let currentPage = 1;
    let hasMorePages = true;

    while (hasMorePages) {
      // Utiliser un endpoint qui filtre par région
      const response = await axiosConfig.get(
        `/serviceterritoire-v2/communes/basic?page=${currentPage}&limit=100&region_id=${regionId}`
      );
      
      const data = response.data?.data || response.data;
      const communes = Array.isArray(data) ? data : [];
      
      allCommunes = [...allCommunes, ...communes];

      hasMorePages = communes.length === 100;
      currentPage++;
    }

    console.log(`[API] ${allCommunes.length} communes récupérées pour la région ${regionId}`);
    
    // Formater les données
    return allCommunes.map(commune => ({
      id: commune.commune_id || commune.id || '',
      commune_id: commune.commune_id || commune.id || '',
      formatted_id: commune.formatted_id || commune.commune_id || commune.id || '',
      name: commune.name || commune.nom || `Commune ${commune.id || ''}`,
      region_id: commune.region_id || '',
      ...commune
    }));

  } catch (error) {
    console.error('[API] Erreur lors de la récupération des communes par région:', {
      regionId,
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw new Error(`Impossible de charger les communes pour la région ${regionId}.`);
  }
},

  //Recuperer tous region
  // async getRegions() {
  //   const response = await axiosConfig.get('/serviceterritoire-v2/regions?page=1&limit=100');
  //   return response.data;
  // },
  async getRegions() {
  try {
    const response = await axiosConfig.get('/serviceterritoire-v2/regions?page=1&limit=100');
    
    // Vérifier la structure de la réponse
    console.log('[API] Réponse des régions:', response.data);
    
    // Si la réponse a une propriété data qui est un tableau
    if (response.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    
    // Si la réponse est directement un tableau
    if (Array.isArray(response.data)) {
      return response.data;
    }
    
    // Si c'est un objet avec d'autres propriétés
    if (response.data && response.data.regions) {
      return response.data.regions;
    }
    
    // Par défaut, retourner un tableau vide
    console.warn('[API] Format de réponse des régions inattendu:', response.data);
    return [];
    
  } catch (error) {
    console.error('[API] Erreur lors de la récupération des régions:', error);
    throw new Error('Impossible de charger les régions. Veuillez réessayer plus tard.');
  }
},

  // Fonction de recherche pour les fokotanys
  async searchFokotanys(communeFormattedId, searchTerm) {
    try {
      if (!communeFormattedId) {
        console.warn('[API] Aucun ID de commune fourni pour la recherche des fokotanys');
        return [];
      }

      let allFokotanys = [];
      let currentPage = 1;
      let hasMorePages = true;

      while (hasMorePages) {
        const response = await axiosConfig.get(
          `/serviceterritoire-v2/fokotanys/commune/${communeFormattedId}?page=${currentPage}&limit=100`
        );
        
        const data = response.data?.data || response.data;
        const fokotanys = Array.isArray(data) ? data : [];

        allFokotanys = [...allFokotanys, ...fokotanys];

        hasMorePages = fokotanys.length === 100;
        currentPage++;
      }

      // Formater les données des fokotanys
      const formattedFokotanys = allFokotanys.map(f => ({
        id: f.fokotany_id || f.id || '',
        fokotany_id: f.fokotany_id || f.id || '',
        formatted_id: f.formatted_id || f.fokotany_id || f.id || '',
        name: f.name || f.nom || `Fokotany ${f.fokotany_id || f.id || ''}`,
        ...f
      }));

      // Filtrer les fokotanys selon le terme de recherche
      if (searchTerm) {
        return formattedFokotanys.filter(f => 
          (f.name || '').toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      return formattedFokotanys;
    } catch (error) {
      console.error('[API] Erreur lors de la recherche des fokotanys:', {
        communeFormattedId,
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });

      if (error.response?.status === 404) {
        console.warn(`[API] Aucun fokotany trouvé pour la commune ${communeFormattedId}`);
        return [];
      }

      throw new Error(`Impossible de charger les fokotanys pour la commune ${communeFormattedId}. Veuillez réessayer plus tard.`);
    }
  },

  //Fokotany avec pagination
  async getFokotanys(communeFormattedId) {
    try {
      if (!communeFormattedId) {
        console.warn('[API] Aucun ID de commune fourni pour la récupération des fokotanys');
        return [];
      }

      console.log(`[API] Récupération des fokotanys pour la commune ${communeFormattedId}...`);

      let allFokotanys = [];
      let currentPage = 1;
      let hasMorePages = true;

      while (hasMorePages) {
        // Utiliser l'endpoint direct pour récupérer les fokotanys par commune
        const response = await axiosConfig.get(`/serviceterritoire-v2/fokotanys/commune/${communeFormattedId}?page=${currentPage}&limit=100`);
        
        // Gérer différents formats de réponse
        const data = response.data?.data || response.data;
        const fokotanys = Array.isArray(data) ? data : [];

        allFokotanys = [...allFokotanys, ...fokotanys];

        hasMorePages = fokotanys.length === 100;
        currentPage++;
      }

      if (allFokotanys.length === 0) {
        console.warn(`[API] Aucun fokotany trouvé pour la commune ${communeFormattedId}`);
      } else {
        console.log(`[API] ${allFokotanys.length} fokotanys récupérés pour la commune ${communeFormattedId}`);
      }

      // Formater les données des fokotanys
      return allFokotanys.map(f => ({
        id: f.fokotany_id || f.id || '',
        fokotany_id: f.fokotany_id || f.id || '',
        formatted_id: f.formatted_id || f.fokotany_id || f.id || '',
        name: f.name || f.nom || `Fokotany ${f.fokotany_id || f.id || ''}`,
        ...f
      }));

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

        response = await axiosConfig.get(`/communes/members`, {
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