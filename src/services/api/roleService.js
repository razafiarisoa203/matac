import axiosConfig from "./axios.config";

// Service pour la gestion des rôles
export const roleService = {
    // Récupérer tous les rôles pour l'application MATAC
    async getRoles() {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          throw new Error('Non authentifié');
        }
  
        const matacAppId = import.meta.env.VITE_APP_ID;
        const response = await axiosConfig.get(
          'serviceauth/roles',
          {
            params: {
              applicationId: matacAppId
            },
            timeout: 10000
          }
        );
        if (!response.data || !Array.isArray(response.data.data)) {
          throw new Error('Format de réponse inattendu pour les rôles');
        }
  
        const roles = response.data.data;
        return roles;
      } catch (error) {
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
        const response = await axiosConfig.post(
          'serviceauth/roles/assign',
          {
            user_id: userId,
            role_id: roleId,
            application_id: matacAppId
          }
        );
        return response.data;
      } catch (error) {
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
          throw new Error('Non authentifié');
        }
  
        const matacAppId = import.meta.env.VITE_APP_ID;
  
        try {
          const response = await axiosConfig.get(
            `serviceauth/users/${userId}/roles`,
            {
              params: {
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
          return roles;
  
        } catch (endpointError) {
  
          const response = await axiosConfig.get(
            'serviceauth/roles',
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
          return roles;
        }
      } catch (error) {

        return [];
      }
    },
  
    // Récupérer tous les utilisateurs avec leurs rôles pour l'application MATAC
    async getAllUsers() {
      try {
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
        try {
          const response = await axiosConfig.get(
            'serviceauth/users',
            {
              params: {
                applicationId: matacAppId
              },
              timeout: 15000
            }
          );
  
          let users = [];
          if (response.data && Array.isArray(response.data.data)) {
            users = response.data.data.map(normalizeUserData);
  
            if (users.length > 0) {
              return users;
            }
          } else if (Array.isArray(response.data)) {
            users = response.data.map(normalizeUserData);
            return users;
          }
        } catch (filterError) {
          
        }
  
        console.log('Tentative de récupération de tous les utilisateurs...');
        try {
          const fallbackResponse = await axiosConfig.get(
            'serviceauth/users',
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
    },


    async getUserRolesForApp  (appId, token) {
      if (!token) {
        console.error('Aucun token fourni pour la récupération des rôles');
        return [];
      }
    
      try {
        console.log(`Récupération des rôles pour l'application ${appId}...`);
        
        const response = await axiosConfig.get(`/serviceauth/roles/${appId}`);
        
        console.log('Réponse complète des rôles:', response);
        
        // Gestion de différentes structures de réponse
        if (response.data) {
          if (Array.isArray(response.data)) {
            return response.data;
          } else if (response.data.roles) {
            return response.data.roles;
          } else if (response.data.data?.roles) {
            return response.data.data.roles;
          } else if (response.data.data && Array.isArray(response.data.data)) {
            return response.data.data;
          }
        }
        
        console.warn('Format de réponse inattendu pour les rôles:', response.data);
        return [];
        
      } catch (error) {
        console.error('Erreur lors de la récupération des rôles:', {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data
        });
        return [];
      }
    }, 
};

export default roleService;

