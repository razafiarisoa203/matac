import axiosConfig from "./axios.config";

export const citoyenService = {
  async checkCIN(cin) {
    try {
      const response = await axiosConfig.get(`/servicecitoyen/citizens/${cin}`);
      // Si on arrive ici, le CIN existe déjà
      return { exists: true, data: response.data };
    } catch (error) {
      // Si erreur 404, le CIN n'existe pas
      if (error.response?.status === 404) {
        return { exists: false };
      }
      // Pour toute autre erreur, on la lance
      throw error;
    }
  },

  async getCitizenData(id_cit) {
    try {
      const response = await axiosConfig.get(`/servicecitoyen/citizens/getCitizenById//${id_cit}`);
      return response.data;
    } catch (error) {
      return error;
    }
  },

  async createCitizen(citizenData) {
    try {
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

      // Utiliser l'instance citoyenApi configurée qui gère déjà le token et le Content-Type
      const response = await citoyenApi.post('/citizens', formData);

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

  // Helpers pour l'UI: retourner des options prêtes à l'emploi pour des <select>
  async getCommunesOptions() {
    const communes = await this.getCommunes();
    return communes.map(c => ({
      value: c.formatted_id || c.commune_id || c.id,
      label: c.name,
      formatted_id: c.formatted_id,
      commune_id: c.commune_id,
      _raw: c,
    }));
  },

  async getFokotanyOptions(communeFormattedId) {
    const fokotanys = await this.getFokotanys(communeFormattedId);
    return fokotanys.map(f => ({
      value: f.formatted_id || f.fokotany_id || f.id,
      label: f.name,
      formatted_id: f.formatted_id,
      fokotany_id: f.fokotany_id,
      _raw: f,
    }));
  },
};
