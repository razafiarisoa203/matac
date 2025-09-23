import React, { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Users, Shield, Settings, ArrowLeft } from 'lucide-react';
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
  const [error, setError] = useState(null);

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
      
      // Mise à jour des états
      setUsers(usersData || []);
      setRoles(rolesData);
      
      // Mise en cache des données
      if (usersData) {
        localStorage.setItem('cachedUsers', JSON.stringify(usersData));
      }
      
      console.log(`Données chargées: ${usersData?.length || 0} utilisateurs, ${rolesData.length} rôles`);
      
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      setError('Erreur lors du chargement des données');
      
      // Essayer de charger depuis le cache en cas d'erreur
      try {
        const cachedData = localStorage.getItem('cachedUsers');
        if (cachedData) {
          const parsedData = JSON.parse(cachedData);
          setUsers(parsedData);
        }
      } catch (cacheError) {
        console.error('Erreur lors du chargement du cache:', cacheError);
      }
    } finally {
      setIsLoading(false);
    }
  }, [token]);
  
  // Compter les utilisateurs par rôle pour l'application 13635
  const countUsersByRole = useCallback(() => {
    console.log('=== DEBUT DU COMPTAGE UTILISATEURS PAR ROLE ===');
    console.log('Liste des rôles:', roles);
    console.log('Nombre total d\'utilisateurs:', users.length);
    
    // Initialiser les compteurs pour les rôles spécifiques
    const roleCounts = {
      93: 0,  // Client
      94: 0,  // Admin
      100: 0  // Commune
    };
    
    // Compter les utilisateurs par rôle pour l'application 13635
    users.forEach((userItem) => {
      const user = userItem.user || userItem;
      
      console.log(`\nUtilisateur:`, {
        id: user.id,
        email: user.email,
        appUserRoles: user.appUserRoles?.map(r => ({
          role_id: r.role_id || r.role?.role_id,
          role_name: r.role?.name,
          app_id: r.application_id
        }))
      });
      
      if (user.appUserRoles && user.appUserRoles.length > 0) {
        user.appUserRoles.forEach(userRole => {
          const roleId = userRole.role_id || userRole.role?.role_id;
          const appId = userRole.application_id;
          
          // Vérifier si le rôle est pour l'application 13635
          if (appId === 13635 && roleId) {
            console.log(`- Rôle trouvé pour l'app 13635: ${roleId} (${userRole.role?.name || 'Inconnu'})`);
            
            if (roleId in roleCounts) {
              roleCounts[roleId]++;
              console.log(`  Compteur mis à jour pour le rôle ${roleId}: ${roleCounts[roleId]}`);
            }
          }
        });
      }
    });
    
    // Calculer le total des utilisateurs ayant un rôle dans l'application 13635
    const totalUsersWithRoles = roleCounts[93] + roleCounts[94] + roleCounts[100];
    
    console.log('=== RESULTATS DU COMPTAGE POUR L\'APP 13635 ===');
    console.log( 'rôle:', totalUsersWithRoles);
    console.log('Clients (93):', roleCounts[93]);
    console.log('Admins (94):', roleCounts[94]);
    console.log('Communes (100):', roleCounts[100]);
    console.log('============================\n');
    
    return {
      ...roleCounts,
      total: totalUsersWithRoles
    };
  }, [users, roles]);
  
  // Effet pour charger les données au montage et quand le token change
  useEffect(() => {
    if (token) {
      console.log('Chargement des données avec le token:', token.substring(0, 10) + '...');
      fetchUsersAndRoles();
    }
  }, [token, fetchUsersAndRoles]);
  
  // Effet pour afficher les données des rôles et utilisateurs quand elles changent
  useEffect(() => {
    if (roles.length > 0) {
      console.log('Rôles chargés:', roles.map(r => ({ id: r.id, name: r.name })));
    }
    if (users.length > 0) {
      console.log('Utilisateurs chargés:', users.length);
      countUsersByRole(); // Appel initial pour afficher les logs
    }
  }, [roles, users, countUsersByRole]);

  const assignRole = async (userId, roleId) => {
    if (!userId || !roleId || !token) return;
    
    try {
      // Mettre à jour le rôle de l'utilisateur
      await axios.put(
        `https://gateway.tsirylab.com/serviceauth/roles/${userId}`,
        { roleId },
        {
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      // Mettre à jour l'état local pour refléter le changement
      setUsers(prevUsers => 
        prevUsers.map(user => {
          if (user.id === userId) {
            // Mettre à jour uniquement le rôle de l'utilisateur concerné
            const updatedRoles = user.appUserRoles?.map(role => 
              role.role_id === roleId ? { ...role, role: { ...role.role, id: roleId } } : role
            ) || [];
            
            return { 
              ...user, 
              appUserRoles: updatedRoles,
              role_id: roleId 
            };
          }
          return user;
        })
      );
      
      console.log(`Rôle mis à jour pour l'utilisateur ${userId}: ${roleId}`);
      
    } catch (error) {
      console.error('Erreur lors de la mise à jour du rôle:', {
        userId,
        roleId,
        error: error.response?.data || error.message
      });
      
      // Optionnel: Afficher une notification d'erreur à l'utilisateur
      // setError('Échec de la mise à jour du rôle. Veuillez réessayer.');
    }
  };

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
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl font-bold text-gray-900">
                {t('admin_dashboard_title') || 'Tableau de bord administrateur'}
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Gestion complète des utilisateurs et des rôles
              </p>
              {error && (
                <div className="mt-2 text-sm text-red-600">
                  {error}
                </div>
              )}
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <ArrowLeft className="-ml-1 mr-2 h-4 w-4" />
              Retour au tableau de bord
            </button>
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
                    <dt className="text-sm font-medium text-gray-500 truncate">Utilisateurs</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {isLoading ? (
                          <div className="animate-pulse h-6 w-8 bg-gray-200 rounded"></div>
                        ) : (
                          <span>{users?.length || 0}</span>
                        )}
                      </div>
                    </dd>
                  </dl>
                  {import.meta.env.DEV && (
                    <div className="text-xs text-gray-400 mt-1">
                      {users?.length || 0} utilisateur(s) chargé(s)
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-4 sm:px-6">
              <div className="text-sm">
                <Link to="/users" className="font-medium text-blue-600 hover:text-blue-500">
                  Voir tous les utilisateurs →
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
                    <dt className="text-sm font-medium text-gray-500 truncate">Rôles</dt>
                    <dd className="flex flex-col space-y-1 mt-2">
                      <div className="flex justify-between items-center">
                        <span className="text-base font-medium text-gray-700">Rôles disponibles:</span>
                        <span className="text-2xl font-bold text-blue-600">3</span>
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-4 sm:px-6">
              <div className="text-sm">
                <Link to="/RoleManagement" className="font-medium text-green-600 hover:text-green-500">
                  Gérer les rôles →
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
                    <dt className="text-sm font-medium text-gray-500 truncate">Paramètres</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      Configuration du système
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-4 sm:px-6">
              <div className="text-sm">
                <a href="#" className="font-medium text-purple-600 hover:text-purple-500">
                  Configurer →
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
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            {users.length === 0 ? (
              <div className="px-4 py-12 text-center">
                <p className="text-gray-500">Aucun utilisateur trouvé</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {users.slice(0, 5).map((item) => {
                  const user = item.user || item;
                  const citoyen = item.citoyen || {};
                  // Trouver le rôle principal de l'utilisateur pour l'application 13635
                  const userRole = user.appUserRoles?.find(
                    role => role.application_id === 13635
                  )?.role;
                  return (
                    <li key={user.id} className="hover:bg-gray-50">
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <Users className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="ml-4">
                              <p className="text-sm font-medium text-blue-600 truncate">
                                {citoyen?.nom || (user.email ? user.email.split('@')[0] : 'Utilisateur')}
                              </p>
                              <p className="text-sm text-gray-500 truncate">
                                {user.email || 'Aucun email'}
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
                                <option value="">Changer de rôle</option>
                                {roles.filter(role => [93, 94, 100].includes(role.id)).map((role) => (
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
