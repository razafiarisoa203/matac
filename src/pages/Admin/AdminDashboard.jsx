import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Users, Shield, Settings, ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import { getAllUsersByApplicationRole } from '../../services/api/userService';

const AdminDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const state = useSelector((state) => state);
  
  // États
  const [token, setToken] = useState('');
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [_error, setError] = useState(null); // Préfixé avec _ car non utilisé

  // Effet pour charger le token au montage
  useEffect(() => {
    const tokenFromState = location.state?.token || localStorage.getItem('token');
    if (tokenFromState) {
      setToken(tokenFromState);
      localStorage.setItem('token', tokenFromState);
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
      const usersData = await getAllUsersByApplicationRole();
      
      // Récupération des rôles
      const rolesResponse = await axios.get('https://gateway.tsirylab.com/serviceauth/roles', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const rolesData = Array.isArray(rolesResponse?.data) ? rolesResponse.data : [];
      
      // Mettre à jour l'état avec les données
      setUsers(usersData);
      setRoles(rolesData);
      
      // Mettre en cache les données
      localStorage.setItem('cachedUsers', JSON.stringify(usersData));
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
          if (appId === 13635) {
            const roleId = role.role_id || role.role?.id || role.roleId;
            
            // Incrémenter le compteur pour ce rôle
            roleCounts[roleId] = (roleCounts[roleId] || 0) + 1;
            
            // Mettre à jour les compteurs spécifiques
            if (roleId === 93) stats.client++;
            else if (roleId === 94) stats.admin++;
            else if (roleId === 100) stats.commune++;
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
  const assignRole = async (userId, roleId) => {
    if (!token) {
      toast.error('Session expirée. Veuillez vous reconnecter.');
      return;
    }

    try {
      setIsLoading(true);
      const appId = import.meta.env.VITE_APP_ID || 13635;
      
      await axios.put(
        `${import.meta.env.VITE_API_URL}/serviceauth/users/${userId}/roles`,
        { 
          role_id: roleId, 
          application_id: appId 
        },
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );
      
      // Recharger les données après mise à jour
      await fetchUsersAndRoles();
      toast.success('Rôle mis à jour avec succès');
    } catch (error) {
      console.error('Erreur lors de la mise à jour du rôle:', error);
      const errorMessage = error.response?.data?.message || 
                         error.message || 
                         'Erreur lors de la mise à jour du rôle';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
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
          <p className="mt-4 text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate(-1)} 
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              aria-label={t('common.back')}
            >
              <ArrowLeft className="-ml-1 mr-2 h-4 w-4" />
              {t('common.back')}
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {t('admin.loggedInAs')}: <span className="font-medium">{state.user?.user?.username || t('common.admin')}</span>
            </span>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Cartes de statistiques */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Carte Utilisateurs */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{t('admin.stats.totalUsers')}</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">{users.length}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-4 sm:px-6">
              <div className="text-sm">
                <Link to="/users" className="font-medium text-blue-600 hover:text-blue-500">
                  {t('common.viewAll')} {t('common.users').toLowerCase()} →
                </Link>
              </div>
            </div>
          </div>

          {/* Carte Rôles */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{t('admin.stats.roles')}</dt>
                    <dd>
                      <div className="text-2xl font-bold text-gray-900">
                        {_userStats?.total || 0}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-4 sm:px-6">
              <div className="text-sm">
                <Link to="/RoleManagement" className="font-medium text-green-600 hover:text-green-500">
                  {t('admin.manageRoles')} →
                </Link>
              </div>
            </div>
          </div>

          {/* Carte Paramètres */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                  <Settings className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{t('common.settings')}</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {t('admin.systemSettings')}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-4 sm:px-6">
              <div className="text-sm">
                <a href="#" className="font-medium text-purple-600 hover:text-purple-500">
                  {t('common.configure')} →
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Section récente activité */}
        <div className="mt-8 bg-white shadow rounded-lg overflow-hidden">
         
        </div>

        {/* Section utilisateurs récents */}
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">{t('admin.users.recentUsers')}</h2>
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            {users.length === 0 ? (
              <div className="px-4 py-12 text-center">
                <p className="text-gray-500">{t('admin.users.noUsersFound')}</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {users.slice(0, 0).map((item, index) => {
                  const user = item.user || item;
                  const citoyen = item.citoyen || {};
                  const userKey = user.id || `user-${index}`;
                  // Trouver le rôle principal de l'utilisateur pour l'application 13635
                  const userRole = user.appUserRoles?.find(
                    role => role.application_id === 13635
                  )?.role;
                  return (
                    <li key={userKey} className="hover:bg-gray-50">
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <Users className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="ml-4">
                              <p className="text-sm font-medium text-blue-600 truncate">
                                {citoyen?.nom || (user.email ? user.email.split('@')[0] : t('common.user'))}
                              </p>
                              <p className="text-sm text-gray-500 truncate">
                                {user.email || t('admin.users.noEmail')}
                              </p>
                            </div>
                          </div>
                          <div className="mt-2 sm:mt-0 sm:ml-4 w-full sm:w-64">
                            <div className="flex items-center">
                              {userRole && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-2">
                                  {userRole.name}
                                </span>
                              )}
                              <select
                                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                value={userRole?.id || userRole?.role_id || ''}
                                onChange={(e) => {
                                  if (e.target.value) {
                                    assignRole(user.id, parseInt(e.target.value, 10));
                                  }
                                }}
                              >
                                <option value="">{t('admin.users.changeRole')}</option>
                                {Array.isArray(roles) && roles
                                .filter(role => [93, 94, 100].includes(role?.id))
                                .map((role) => (
                                  <option key={role.id} value={role.id}>
                                    {role.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
