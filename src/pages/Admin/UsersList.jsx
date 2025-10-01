import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, ArrowLeft, Loader2 } from 'lucide-react';
import { getAllUsersByApplicationRole } from '../../services/api/userService';

const MATAC_APP_ID = import.meta.env.VITE_APP_ID || '15';

const UsersList = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const usersData = await getAllUsersByApplicationRole();
        console.log('Données brutes de l\'API:', usersData);
        
        // Normaliser les données utilisateur
        const normalizeUserData = (data) => {
          if (!data || !Array.isArray(data)) {
            console.error('Données utilisateur invalides:', data);
            return [];
          }
          
          return data.map(user => {
            if (!user) {
              console.warn('Utilisateur null ou undefined dans les données');
              return null;
            }

            try {
              // Vérifier si l'utilisateur a une propriété 'user' imbriquée
              const hasNestedUser = user.user && typeof user.user === 'object';
              
              // Extraire les propriétés avec des valeurs par défaut
              const baseUser = {
                ...user,
                id: user.id || (hasNestedUser ? user.user.user_id : null) || `user-${Math.random().toString(36).substr(2, 9)}`,
                email: user.email || (hasNestedUser ? user.user.email : null) || 'email@inconnu.com',
                firstname: user.firstname || (hasNestedUser ? user.user.firstname : null) || '',
                lastname: user.lastname || (hasNestedUser ? user.user.lastname : null) || '',
                role_id: user.role_id || (hasNestedUser ? user.user.role_id : null) || 93, // Client par défaut
                role_name: user.role_name || (hasNestedUser ? user.user.role_name : null) || 'Client',
                created_at: user.created_at || (hasNestedUser ? user.user.created_at : null) || new Date().toISOString(),
                updated_at: user.updated_at || (hasNestedUser ? user.user.updated_at : null) || new Date().toISOString(),
                last_login: user.last_login || (hasNestedUser ? user.user.last_login : null)
              };

              // Si on a un objet user imbriqué, on le conserve pour la rétrocompatibilité
              if (hasNestedUser) {
                baseUser.user = {
                  ...user.user,
                  ...baseUser
                };
              }

              return baseUser;
            } catch (error) {
              console.error('Erreur lors de la normalisation de l\'utilisateur:', error, user);
              return null;
            }
          }).filter(Boolean); // Filtrer les utilisateurs invalides
        };
        
        const normalizedUsers = normalizeUserData(usersData);
        
        // Afficher les données brutes pour le débogage
        console.log('Données utilisateur brutes:', usersData);
        console.log('Utilisateurs normalisés:', normalizedUsers);
        
        // Afficher les formats de date pour le débogage
        normalizedUsers.forEach((user, index) => {
          console.log(`Utilisateur ${index}:`, {
            id: user.id,
            email: user.email,
            created_at: user.created_at,
            created_at_type: typeof user.created_at,
            updated_at: user.updated_at,
            last_login: user.last_login
          });
        });
        
        setUsers(normalizedUsers);
      } catch (err) {
        console.error('Erreur lors du chargement des utilisateurs:', err);
        setError('Impossible de charger les utilisateurs. Veuillez réessayer.');
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
  }, []);

  // Afficher le chargement
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="text-lg font-medium">Chargement des utilisateurs...</p>
        <p className="text-sm text-gray-500">Veuillez patienter pendant que nous récupérons les données</p>
      </div>
    );
  }

  // Afficher les erreurs
  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-red-50 rounded-lg shadow-sm">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-red-800 mb-2">Erreur lors du chargement des données</h3>
          <p className="text-red-700 mb-6">{error}</p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={()=>{}}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Réessayer
            </button>
            <button
              onClick={() => navigate('/admin')}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Retour au tableau de bord
            </button>
          </div>
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
                Gestion des utilisateurs
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                {users.length} utilisateur{users.length !== 1 ? 's' : ''} au total
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => navigate('/admin-dashboard')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <ArrowLeft className="-ml-1 mr-2 h-4 w-4" />
                Retour
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Barre de recherche */}
        <div className="mb-6">
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md p-2 border"
              placeholder="Rechercher un utilisateur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Liste des utilisateurs */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          {users.length === 0 ? (
            <div className="px-4 py-12 text-center">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun utilisateur trouvé</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm 
                  ? 'Aucun utilisateur ne correspond à votre recherche.'
                  : 'Aucun utilisateur disponible pour le moment.'}
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {users.map((user, index) => {
                const userKey = `user-${user.id}-${index}`; // Clé unique pour chaque élément de la liste
                const photoUrl = user.citoyen?.citizen_photo?.includes('hello') 
                  ? `https://gateway.tsirylab.com/serviceupload/file/preview/hello${user.citoyen.citizen_photo.split("hello")[1].replace("/","%2F")}`
                  : null;
                
                return (
                  <li key={userKey} className="hover:bg-gray-50">
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            {photoUrl ? (
                              <img src={photoUrl} className="h-10 w-10 rounded-full object-cover" alt="" />
                            ) : (
                              <Users className="h-5 w-5 text-blue-600" />
                            )}
                          </div>
                          <div className="ml-4 min-w-0">
                            <p className="text-sm font-medium text-blue-600 truncate">
                              {user.user.user_email}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {user.email}
                            </p>
                            <div className="text-xs text-gray-500 space-y-1 mt-1">
                              <div className="flex items-start">
                                <span className="w-20 text-gray-400">Créé:</span>
                                <span className="break-all">
                                  {(() => {
                                    const dateStr = user.created_at || user.user?.created_at;
                                    if (!dateStr) return 'N/A';
                                    
                                    try {
                                      // Essayer de parser la date en tenant compte de différents formats
                                      let date;
                                      if (typeof dateStr === 'string') {
                                        // Essayer différents formats de date
                                        date = new Date(dateStr);
                                        if (isNaN(date.getTime())) {
                                          // Si le format ISO ne fonctionne pas, essayer d'autres formats
                                          const timestamp = Date.parse(dateStr);
                                          date = isNaN(timestamp) ? null : new Date(timestamp);
                                        }
                                      } else if (typeof dateStr === 'number') {
                                        date = new Date(dateStr);
                                      } else if (dateStr.toDate) {
                                        // Si c'est un objet Firestore Timestamp
                                        date = dateStr.toDate();
                                      }
                                      
                                      if (!date || isNaN(date.getTime())) {
                                        console.error('Format de date invalide:', dateStr);
                                        return 'Format invalide';
                                      }
                                      
                                      return date.toLocaleString('fr-FR', {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: false
                                      });
                                    } catch (error) {
                                      console.error('Erreur de format de date:', error);
                                      return 'Erreur date';
                                    }
                                  })()}
                                </span>
                              </div>
                              <div className="flex items-start">
                                <span className="w-20 text-gray-400">Dernière connexion:</span>
                                <span className="break-all">
                                  {(() => {
                                    const dateStr = user.last_login || user.user?.last_login;
                                    if (!dateStr) return 'Jamais';
                                    
                                    try {
                                      let date;
                                      if (typeof dateStr === 'string') {
                                        date = new Date(dateStr);
                                        if (isNaN(date.getTime())) {
                                          const timestamp = Date.parse(dateStr);
                                          date = isNaN(timestamp) ? null : new Date(timestamp);
                                        }
                                      } else if (typeof dateStr === 'number') {
                                        date = new Date(dateStr);
                                      } else if (dateStr.toDate) {
                                        date = dateStr.toDate();
                                      }
                                      
                                      if (!date || isNaN(date.getTime())) {
                                        console.error('Format de date de connexion invalide:', dateStr);
                                        return 'Inconnu';
                                      }
                                      
                                      return date.toLocaleString('fr-FR', {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: false
                                      });
                                    } catch (error) {
                                      console.error('Erreur de format de date de connexion:', error);
                                      return 'Erreur';
                                    }
                                  })()}
                                </span>
                              </div>
                              <div className="flex items-start">
                                <span className="w-20 text-gray-400">Mise à jour:</span>
                                <span className="break-all">
                                  {(() => {
                                    const dateStr = user.updated_at || user.user?.updated_at;
                                    if (!dateStr) return 'N/A';
                                    
                                    try {
                                      let date;
                                      if (typeof dateStr === 'string') {
                                        date = new Date(dateStr);
                                        if (isNaN(date.getTime())) {
                                          const timestamp = Date.parse(dateStr);
                                          date = isNaN(timestamp) ? null : new Date(timestamp);
                                        }
                                      } else if (typeof dateStr === 'number') {
                                        date = new Date(dateStr);
                                      } else if (dateStr.toDate) {
                                        date = dateStr.toDate();
                                      }
                                      
                                      if (!date || isNaN(date.getTime())) {
                                        console.error('Format de date de mise à jour invalide:', dateStr);
                                        return 'Inconnu';
                                      }
                                      
                                      return date.toLocaleString('fr-FR', {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: false
                                      });
                                    } catch (error) {
                                      console.error('Erreur de format de date de mise à jour:', error);
                                      return 'Erreur';
                                    }
                                  })()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="mt-2 sm:mt-0 sm:ml-4 w-full sm:w-72">
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                            <div className="flex-1 min-w-0">
                            <select
                              className="block w-full pl-3 pr-10 py-2 text-sm border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                              value={user.role_id || ''}
                              onChange={async (e) => {
                                const newRoleId = e.target.value;
                                const newRoleName = e.target.options[e.target.selectedIndex].text;
                                
                                console.group('=== DÉBUT MISE À JOUR RÔLE ===');
                                console.log('Utilisateur source:', {
                                  id: user.id,
                                  user_id: user.user_id,
                                  user: user.user
                                });
                                
                                try {
                                  setUsers(prevUsers => {
                                    console.log('Pré-mise à jour - Nombre d\'utilisateurs:', prevUsers.length);
                                    
                                    const updatedUsers = prevUsers.map(u => {
                                      // Afficher les informations de chaque utilisateur pour le débogage
                                      console.log('Vérification utilisateur:', {
                                        id: u.id,
                                        user_id: u.user_id,
                                        user: u.user,
                                        matchesId: u.id === user.id,
                                        matchesUserId: u.user_id === user.user_id,
                                        matchesUserObj: u.user?.id === user.user?.id || u.user?.user_id === user.user?.user_id
                                      });
                                      
                                      // Vérifier si c'est l'utilisateur courant avec plus de précision
                                      const isTargetUser = 
                                        (u.id && u.id === user.id) || 
                                        (u.user_id && u.user_id === user.user_id) ||
                                        (u.user?.id && u.user.id === user.user?.id) ||
                                        (u.user?.user_id && u.user.user_id === user.user?.user_id);
                                      
                                      if (!isTargetUser) {
                                        console.log('Utilisateur non ciblé, ignoré');
                                        return u;
                                      }
                                      
                                      console.log('Utilisateur ciblé trouvé, mise à jour en cours...');
                                      
                                      // Créer une copie profonde de l'utilisateur
                                      const updatedUser = { ...u };
                                      
                                      // Mettre à jour le rôle dans la structure appropriée
                                      if (updatedUser.user) {
                                        updatedUser.user = { 
                                          ...updatedUser.user,
                                          role_id: newRoleId,
                                          role_name: newRoleName 
                                        };
                                      }
                                      
                                      // Mettre à jour au niveau racine
                                      updatedUser.role_id = newRoleId;
                                      updatedUser.role_name = newRoleName;
                                      
                                      console.log('Utilisateur après mise à jour:', updatedUser);
                                      return updatedUser;
                                    });
                                    
                                    console.log('Post-mise à jour - Nombre d\'utilisateurs:', updatedUsers.length);
                                    return updatedUsers;
                                  });
                                  
                                  // Ici, vous pouvez ajouter un appel API pour sauvegarder le changement
                                  // await updateUserRole(user.id || user.user_id, newRoleId);
                                  
                                } catch (error) {
                                  console.error('Erreur lors de la mise à jour du rôle:', error);
                                } finally {
                                  console.groupEnd();
                                }
                              }}
                            >
                              <option value="">Sélectionner un rôle</option>
                              <option value="93">Client</option>
                              <option value="94">Admin</option>
                              <option value="100">Commune</option>
                          </select>

                            </div>
                            {user.role_id && (
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                user.role_name?.toLowerCase() === 'admin' 
                                  ? 'bg-purple-100 text-purple-800' 
                                  : 'bg-green-100 text-green-800'
                              }`}>
                                {user.role_name || 'Aucun rôle'}
                              </span>
                            )}
                          </div>
                          <div className="mt-1 text-xs text-gray-500">
                            {user.updated_at && `Mis à jour: ${new Date(user.updated_at).toLocaleString()}`}
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
      </main>
    </div>
  );
};

export default UsersList;
