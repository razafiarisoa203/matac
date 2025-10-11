import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';
// import { useSelector } from 'react-redux';
import UsersList from '../../components/Users/UsersList';
import RolesList from '../../components/Roles/RolesList';
import { Users, Shield, Settings, ArrowLeft } from 'lucide-react';
import KeyIcon from '@mui/icons-material/Key';
import ShieldIcon from '@mui/icons-material/Shield';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import axiosConfig from '../../services/api/axios.config';
//import { getAllUsersByApplicationRole } from '../../services/api/userService';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('users');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [token, setToken] = useState(() => {
    // On initialise le token au montage
    return location.state?.token || localStorage.getItem('access_token');
  });

  // Effet pour charger le token au montage
  useEffect(() => {
    const tokenFromState = location.state?.token || localStorage.getItem('access_token');
    if (tokenFromState) {
      setToken(tokenFromState);
      localStorage.setItem('access_token', tokenFromState); // attention, clé cohérente !
    } else {
      navigate('/login');
    }
  }, [location, navigate]);

  // Fonction pour charger les données utilisateurs
  const fetchUsersAndRoles = useCallback(async () => {
    if (!token) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Utilisation de la même méthode que dans UsersList
      //const usersData = await getAllUsersByApplicationRole();
      
      // Récupération des rôles
      const rolesResponse = await axiosConfig.get('/serviceauth/roles', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const rolesData = Array.isArray(rolesResponse?.data) ? rolesResponse.data : [];
      
      // Mettre à jour l'état avec les données
      setUsers([]);
      setRoles(rolesData);
      
      // Mettre en cache les données
      localStorage.setItem('cachedRoles', JSON.stringify(rolesData));
      
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      setError('Erreur lors du chargement des données');
      
      // Essayer de charger les données en cache en cas d'erreur
      try {
        const cachedUsers = localStorage.getItem('cachedUsers');
        const cachedRoles = localStorage.getItem('cachedRoles');
        
        if (cachedUsers) setUsers(JSON.parse(cachedUsers));
        if (cachedRoles) setRoles(JSON.parse(cachedRoles));
      } catch (cacheError) {
        console.error('Erreur lors du chargement du cache:', cacheError);
      }
    } finally {
      setIsLoading(false);
    }
  }, [token]);
  
  // Compter les utilisateurs par rôle et statut
  const countUsersByRole = useCallback(() => {
    console.log('=== DÉBUT DU COMPTAGE DES RÔLES ===');
    console.log('Nombre total d\'utilisateurs:', users.length);
    
    const stats = {
      admin: 0,
      client: 0,
      commune: 0,
      active: 0,
      inactive: 0,
      total: 0 // On a toujours 3 rôles : admin, client et commune
    };
    
    // Dictionnaire pour compter chaque rôle individuellement
    const roleCounts = {};
    
    // Compter les utilisateurs par rôle et statut
    users.forEach(user => {
      // Compter les utilisateurs actifs/inactifs
      if (user.isActive !== false) stats.active++;
      else stats.inactive++;
      
      // Compter les rôles
      if (user.appUserRoles?.length > 0) {
        user.appUserRoles.forEach(role => {
          const appId = role.application_id || role.applicationId;
          if (appId === 15) {
            const roleId = role.role_id || role.role?.id || role.roleId;
            
            // Incrémenter le compteur pour ce rôle
            roleCounts[roleId] = (roleCounts[roleId] || 0) + 1;
            
            // Mettre à jour les compteurs spécifiques
            if (roleId === 27) stats.client++;      // Client
            else if (roleId === 26) stats.admin++;   // Admin
            else if (roleId === 100) stats.commune++; // Commune
          }
        });
      }
    });
    
    // Compter le nombre total de rôles uniques
    stats.total = Object.keys(roleCounts).length;
    
    // Afficher le décompte détaillé des rôles
    console.log('\n=== DÉCOMPTE DÉTAILLÉ DES RÔLES ===');
    Object.entries(roleCounts).forEach(([roleId, count]) => {
      console.log(`Rôle ${roleId}: ${count} utilisateur(s)`);
    });
    
    console.log('\n=== RÉSUMÉ DES STATISTIQUES ===');
    console.log('Admin (94):', stats.admin);
    console.log('Client (93):', stats.client);
    console.log('Commune (100):', stats.commune);
    console.log('Utilisateurs actifs:', stats.active);
    console.log('Utilisateurs inactifs:', stats.inactive);
    console.log('Total de rôles uniques:', stats.total);
    
    return stats;
  }, [users]);
  
  // Obtenir les statistiques des utilisateurs
  const _userStats = useMemo(() => {
    if (!users || !roles) return { admin: 0, client: 0, commune: 0, active: 0, inactive: 0, total: 0 };
    if (users.length > 0 && roles.length > 0) {
      return countUsersByRole();
    }
    return { admin: 0, client: 0, commune: 0, active: 0, inactive: 0, total: 0 };
  }, [users, roles, countUsersByRole]);
  
  // Fonction pour attribuer un rôle à un utilisateur
  // const assignRole = async (userId, roleId) => {
  //   if (!token) {
  //     toast.error('Session expirée. Veuillez vous reconnecter.');
  //     return;
  //   }

  //   try {
  //     setIsLoading(true);
  //     const appId = import.meta.env.VITE_APP_ID || 15;
      
  //     await axios.put(
  //       `${import.meta.env.VITE_API_URL}/serviceauth/users/${userId}/roles`,
  //       { 
  //         role_id: roleId, 
  //         application_id: appId 
  //       },
  //       { 
  //         headers: { 
  //           'Authorization': `Bearer ${token}`,
  //           'Content-Type': 'application/json'
  //         } 
  //       }
  //     );
      
  //     // Recharger les données après mise à jour
  //     await fetchUsersAndRoles();
  //     toast.success('Rôle mis à jour avec succès');
  //   } catch (error) {
  //     console.error('Erreur lors de la mise à jour du rôle:', error);
  //     const errorMessage = error.response?.data?.message || 
  //                        error.message || 
  //                        'Erreur lors de la mise à jour du rôle';
  //     toast.error(errorMessage);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  
  // const _recentActivities = useMemo(() => {
  //   return users
  //     .sort((a, b) => new Date(b.lastLogin || b.createdAt) - new Date(a.lastLogin || a.createdAt))
  //     .slice(0, 5)
  //     .map(user => ({
  //       id: user.id,
  //       name: user.name || user.email?.split('@')[0] || 'Utilisateur',
  //       action: user.lastLogin ? 'Dernière connexion' : 'Compte créé',
  //       date: user.lastLogin || user.createdAt
  //     }));
  // }, [users]);
  
  // Formater les dates pour l'affichage (commenté car non utilisé actuellement)
  // const _formatDate = (dateString) => {
  //   if (!dateString) return 'N/A';
  //   const options = { 
  //     year: 'numeric', 
  //     month: 'short', 
  //     day: 'numeric',
  //     hour: '2-digit',
  //     minute: '2-digit'
  //   };
  //   return new Date(dateString).toLocaleDateString(undefined, options);
  // };
  
  // Effet pour charger les données au montage et quand le token change
  useEffect(() => {
    if (!token) {
      setError('Aucun token d\'authentification trouvé. Veuillez vous reconnecter.');
      return;
    }

    const loadData = async () => {
      console.log('Chargement des données avec le token:', token.substring(0, 10) + '...');
      setIsLoading(true);
      setError(null);
      
      try {
        await fetchUsersAndRoles();
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        const errorMessage = error.response?.data?.message || 
                           error.message || 
                           'Erreur lors du chargement des données. Veuillez réessayer.';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [token, fetchUsersAndRoles]);
  
  // Effet pour afficher les données des rôles et utilisateurs quand elles changent
  useEffect(() => {
    if (roles.length > 0) {
      console.log('Rôles chargés:', roles.map(r => ({ id: r.id, name: r.name })));
    }
    if (users.length > 0) {
      console.log('Utilisateurs chargés:', users.length);
    }
  }, [roles, users]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement en cours...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <button 
              variant="ghost"
              onClick={() => navigate(-1)} 
              className="mr-4 text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            Administration
          </h1>
          <div className="flex items-center space-x-4">
            <button
              variant="outline"
              onClick={() => navigate('/admin/settings')}
            >
              <Settings className="h-5 w-5 mr-2" />
              Paramètres
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="w-full">
            <div className="flex justify-between items-center mb-6">
              <div className="flex space-x-2 border-b border-gray-200 w-full">
                <button
                  onClick={() => setActiveTab('users')}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'users' 
                    ? 'border-b-2 border-blue-500 text-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <Users className="h-4 w-4" />
                  Utilisateurs
                </button>
                <button
                  onClick={() => setActiveTab('roles')}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'roles' 
                    ? 'border-b-2 border-blue-500 text-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <Shield className="h-4 w-4" />
                  Rôles
                </button>
                <button
                  onClick={() => setActiveTab('permissions')}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'permissions' 
                    ? 'border-b-2 border-blue-500 text-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <KeyIcon className="h-4 w-4" />
                  Permissions
                </button>
              </div>
              
              <div className="ml-4 flex-shrink-0">
                {activeTab === 'users' && (
                  <button onClick={() => navigate('/admin/users/new')}>
                    <PersonAddAltIcon className="h-4 w-4 mr-2" />
                    Nouvel utilisateur
                  </button>
                )}
                
                {activeTab === 'roles' && (
                  <button onClick={() => navigate('/admin/roles/new')}>
                    <ShieldIcon className="h-4 w-4 mr-2" />
                    Nouveau rôle
                  </button>
                )}
              </div>
            </div>

            {/* Utiliser display: none au lieu de conditional rendering */}
            <div style={{ display: activeTab === 'users' ? 'block' : 'none' }}>
              <div className="bg-white shadow rounded-lg p-6">
                
                <UsersList />
              </div>
            </div>
            
            <div style={{ display: activeTab === 'roles' ? 'block' : 'none' }}>
              <div className="bg-white shadow rounded-lg p-6">
                <RolesList />
              </div>
            </div>
            
            <div style={{ display: activeTab === 'permissions' ? 'block' : 'none' }}>
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Gestion des Permissions</h2>
                <p className="text-gray-600">
                  La gestion avancée des permissions sera disponible dans une prochaine version.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;