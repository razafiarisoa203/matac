import axiosConfig from "./axios.config";
import { territoireService } from "./territoireService";

export const citoyenService = {
async checkCIN(cin) {
    try {
      const response = await axiosConfig.get(
        `/servicecitoyen/citizens/${cin}`
      );

      return {
        exists: true,
        data: response.data,
      };
    } catch (error) {
      if (error.response?.status === 404) {
        return {
          exists: false,
        };
      }

      throw error;
    }
  },

/**
   * Récupère les informations complètes d'un citoyen.
   */
  async getCitizenData(id_cit) {
    try {
      const response = await axiosConfig.get(
        `/servicecitoyen/citizens/getCitizenById/${id_cit}`
      );

      return response.data;
    } catch (error) {
      console.error(
        "[CitoyenService] Erreur récupération citoyen :",
        error
      );

      throw error;
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
          if (key !== 'fokotany_id' && (value !== null && value !== undefined && value !== '')) {
            console.log(`Ajout de ${key}:`, value);
            formData.append(key, value);
          } else if (key === 'citizen_photo') {
            // Toujours ajouter citizen_photo même s'il est null/undefined/vide
            console.log(`Ajout de citizen_photo:`, value || 'vide');
            formData.append(key, value || '');
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

      // Utiliser l'instance axiosConfig configurée qui gère déjà le token et le Content-Type
      const response = await axiosConfig.post('/servicecitoyen/citizens', formData);

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

  async getCommunesOptions() {
    const communes = await territoireService.getCommunes();

    return communes.map((commune) => ({
      value:
        commune.formatted_id ||
        commune.commune_id ||
        commune.id,

      label: commune.name,

      formatted_id: commune.formatted_id,

      commune_id: commune.commune_id,

      _raw: commune,
    }));
  },

  async getFokotanyOptions(communeFormattedId) {
    const fokotanys =
      await territoireService.getFokotanys(
        communeFormattedId
      );

    return fokotanys.map((fokotany) => ({
      value:
        fokotany.formatted_id ||
        fokotany.fokotany_id ||
        fokotany.id,

      label: fokotany.name,

      formatted_id: fokotany.formatted_id,

      fokotany_id: fokotany.fokotany_id,

      _raw: fokotany,
    }));
  },

  async updateCitizen(idCitizen, formData) {
    try {
      const response = await axiosConfig.patch(
        `/servicecitoyen/citizens/${idCitizen}`,
        formData
      );

      return response.data;
    } catch (error) {
      console.error(
        "[CitoyenService] Erreur mise à jour citoyen :",
        error
      );

      throw error;
    }
  },


};
