import axiosConfig from "./axios.config";

//Recuperer tous commune
export const territoireService = {
  async getCommunes() {
    try {
      const response = await axiosConfig.get(`/serviceterritoire-v2/communes/basic?page=1&limit=100`);
      // Gérer différents formats de réponse
      const data = response.data?.data || response.data;
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('[API] Erreur lors de la récupération des communes:', error);
      throw new Error('Impossible de charger les communes. Veuillez réessayer plus tard.');
    }
  },

  async getCommunesByRegion() {
    //formatted_id
    const response = await axiosConfig.get(`/serviceterritoire-v2/communes/basic?page=1&limit=100`);
    return response.data;
  },

  //Recuperer tous region
  async getRegions() {
    const response = await axiosConfig.get('/serviceterritoire-v2/regions?page=1&limit=100');
    return response.data;
  },

  //Fonkotany
  async getFokotanys(communeFormattedId) {
    try {
      if (!communeFormattedId) {
        console.warn('[API] Aucun ID de commune fourni pour la récupération des fokotanys');
        return [];
      }

      console.log(`[API] Récupération des fokotanys pour la commune ${communeFormattedId}...`);

      // Utiliser l'endpoint direct pour récupérer les fokotanys par commune
      const response = await axiosConfig.get(`/serviceterritoire-v2/fokotanys/commune/${communeFormattedId}`);
      
      // Gérer différents formats de réponse
      const data = response.data?.data || response.data;
      const fokotanys = Array.isArray(data) ? data : [];

      if (fokotanys.length === 0) {
        console.warn(`[API] Aucun fokotany trouvé pour la commune ${communeFormattedId}`);
      } else {
        console.log(`[API] ${fokotanys.length} fokotanys récupérés pour la commune ${communeFormattedId}`);
      }

      // Formater les données des fokotanys
      return fokotanys.map(f => ({
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