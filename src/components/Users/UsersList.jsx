import React, { useState, useEffect } from 'react';
import { roleService } from '../../services/api/roleService';
import { getUsers } from '../../services/api/userService';
import { toast } from 'react-toastify';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [forceRender, setForceRender] = useState(0);
  const [limit, setLimit] = useState(10);
  const [roles, setRoles] = useState([]);
  const [rolesLoading, setRolesLoading] = useState(true);
  const [editingRoles, setEditingRoles] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  // Terme de recherche "debounced" pour éviter les requêtes à chaque frappe
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Chargement des rôles au montage
  useEffect(() => {
    const loadRoles = async () => {
      try {
        console.log('Chargement des rôles commencé...');
        const rolesData = await roleService.getRoles();
        console.log('Rôles reçus du service:', rolesData);
        console.log('Nombre de rôles reçus:', rolesData.length);
        console.log('Détail de chaque rôle:');
        rolesData.forEach((role, index) => {
          console.log(`  Rôle ${index + 1}:`, {
            role_id: role.role_id,
            role_name: role.role_name,
            role_slug: role.role_slug
          });
        });
        setRoles(rolesData);
        setRolesLoading(false);
        setForceRender(prev => prev + 1); // Force re-render
        console.log('Rôles définis dans le state et rôlesLoading=false');
      } catch (error) {
        console.error('Erreur lors du chargement des rôles:', error);
        toast.error('Erreur lors du chargement des rôles');
      }
    };
    loadRoles();
  }, []);

  // Debounce du terme de recherche
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(t);
  }, [searchTerm]);

  // Chargement des utilisateurs
  useEffect(() => {
    let isMounted = true; // Pour éviter les updates sur un composant démonté

    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await getUsers(page, limit, debouncedSearchTerm);

        if (!isMounted) return; // Ne pas mettre à jour si le composant est démonté

        // Mettre à jour les utilisateurs - utiliser _raw pour les données originales
        const usersData = response.data || response.users || [];
        setUsers(usersData.map(u => u._raw || u));

        // Mettre à jour la pagination uniquement si les valeurs ont changé
        const newPagination = {
          page: response.page || page,
          limit: response.limit || limit,
          total: response.total || 0,
          totalPages: response.totalPages || 1
        };
        setPagination(prev => {
          if (
            prev.page === newPagination.page &&
            prev.limit === newPagination.limit &&
            prev.total === newPagination.total &&
            prev.totalPages === newPagination.totalPages
          ) {
            return prev; // Ne rien changer pour éviter un rerender inutile
          }
          return newPagination;
        });

        console.log('Pagination mise à jour:', newPagination);
      } catch (error) {
        console.error('Erreur lors du chargement des utilisateurs:', error);
        if (isMounted) {
          toast.error('Erreur lors du chargement des utilisateurs');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchUsers();

    return () => {
      isMounted = false; // Cleanup
    };
  }, [page, debouncedSearchTerm, limit]);

  // Gestion recherche
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1); // Reset page lors d'une nouvelle recherche
  };

  // Gestion édition des rôles
  const handleRoleEdit = (user) => {
    const userId = user.user_id || user.id;
    console.log('=== DÉBUT ÉDITION RÔLE ===');
    console.log('Utilisateur cliqué:', user);
    console.log('userId calculé:', userId);
    console.log('editingRoles avant:', editingRoles);
    setEditingRoles(userId);
    console.log('editingRoles après:', userId);
    // Get current role or default to empty
    const currentRoleId = user.appUserRoles?.[0]?.role?.role_id || '';
    console.log('currentRoleId trouvé:', currentRoleId);
    setSelectedRole(currentRoleId.toString());
    console.log('selectedRole défini à:', currentRoleId.toString());
  };

  const handleRoleChange = (roleId) => {
    setSelectedRole(roleId);
  };

  const saveUserRoles = async (userId) => {
    try {
      setLoading(true);
      console.log(`Sauvegarde du rôle ${selectedRole} pour l'utilisateur ${userId}`);

      // Assigner le rôle sélectionné (ou retirer tous les rôles si vide)
      if (selectedRole && selectedRole !== '') {
        console.log(`Assignation du rôle ${selectedRole} à l'utilisateur ${userId}`);
        await roleService.assignUserRoles(userId, [parseInt(selectedRole)]);
      } else {
        console.log('Aucun rôle sélectionné, suppression de tous les rôles');
        // Si aucun rôle sélectionné, supprimer tous les rôles existants
        const currentRoles = users.find(u => (u.user_id || u.id) === userId)?.appUserRoles?.map(ur => ur.role.role_id) || [];
        if (currentRoles.length > 0) {
          console.log(`Suppression des rôles ${currentRoles} pour l'utilisateur ${userId}`);
          await roleService.removeUserRoles(userId, currentRoles);
        }
      }

      toast.success('Rôle mis à jour avec succès');
      setEditingRoles(null);
      setSelectedRole('');

      // Rafraîchir la liste des utilisateurs
      console.log('Rafraîchissement de la liste des utilisateurs...');
      const response = await getUsers(page, limit, debouncedSearchTerm);
      const usersData = response.data || response.users || [];
      setUsers(usersData.map(u => u._raw || u));

      const newPagination = {
        page: response.page || page,
        limit: response.limit || limit,
        total: response.total || 0,
        totalPages: response.totalPages || 1
      };
      setPagination(prev => ({ ...prev, ...newPagination }));

    } catch (error) {
      console.error('Erreur lors de la mise à jour du rôle:', error);
      toast.error(`Erreur lors de la mise à jour du rôle: ${error?.response?.data?.message || error?.message || 'Erreur inconnue'}`);
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setEditingRoles(null);
    setSelectedRole('');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Gestion des Utilisateurs</h1>

      {/* Search */}
      <form onSubmit={handleSearch} className="mb-6 flex">
        <input
          type="text"
          placeholder="Rechercher un utilisateur..."
          className="flex-1 px-4 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded-r-md hover:bg-green-700"
        >
          Rechercher
        </button>
      </form>

      {/* Users Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-4 text-center">Chargement...</div>
        ) : (
          <>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Téléphone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôles</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">Aucun utilisateur trouvé</td>
                  </tr>
                ) : users.map(user => {
                  const userId = user.user_id || user.id;
                  return (
                  <tr key={userId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">{user.user_pseudo || 'Non défini'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.user_email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.user_phone || 'Non défini'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {(() => {
                        console.log('=== RENDU CELLULE RÔLE ===');
                        console.log('userId:', userId);
                        console.log('editingRoles:', editingRoles);
                        console.log('Condition editingRoles === userId:', editingRoles === userId);
                        console.log('roles.length:', roles.length);
                        console.log('selectedRole:', selectedRole);
                        
                        if (editingRoles === userId) {
                          console.log('✅ MODE ÉDITION - Affichage dropdown');
                          return (
                            <div key={`role-dropdown-${userId}-${forceRender}`}>
                              <select
                                value={selectedRole || ''}
                                onChange={(e) => {
                                  console.log('Changement de rôle sélectionné:', e.target.value);
                                  handleRoleChange(e.target.value);
                                }}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                              >
                                <option value="">Aucun rôle</option>
                                {roles && roles.length > 0 ? (
                                  roles.map((role, index) => {
                                    console.log(`Rendu option ${index + 1}:`, role.role_id, role.role_name);
                                    return (
                                      <option key={`role-option-${role.role_id}-${index}`} value={role.role_id}>
                                        {role.role_name}
                                      </option>
                                    );
                                  })
                                ) : (
                                  <option disabled>{rolesLoading ? 'Chargement des rôles...' : 'Aucun rôle disponible'}</option>
                                )}
                              </select>
                              {console.log('Dropdown rendu avec', roles?.length || 0, 'rôles')}
                            </div>
                          );
                        } else {
                          console.log('📋 MODE AFFICHAGE - Affichage rôles utilisateur');
                          return (
                            <div className="flex flex-wrap gap-1">
                              {user.appUserRoles?.map(ur => (
                                <span key={ur.role.role_id} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">{ur.role.role_name}</span>
                              )) || <span className="text-sm text-gray-500">Aucun rôle</span>}
                            </div>
                          );
                        }
                      })()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      {editingRoles === userId ? (
                        <>
                          <button onClick={() => saveUserRoles(userId)} className="text-green-600 hover:text-green-900 mr-2">Enregistrer</button>
                          <button onClick={cancelEdit} className="text-gray-600 hover:text-gray-900">Annuler</button>
                        </>
                      ) : (
                        <button 
                          onClick={() => {
                            console.log('=== CLIC SUR MODIFIER RÔLES ===');
                            console.log('user avant clic:', user);
                            console.log('editingRoles avant:', editingRoles);
                            handleRoleEdit(user);
                          }} 
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Modifier les rôles
                        </button>
                      )}
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-between items-center px-6 py-3 border-t">
                <button
                  disabled={pagination.page === 1}
                  onClick={() => setPage(prev => Math.max(1, prev - 1))}
                  className={`px-4 py-2 border rounded-md ${
                    pagination.page === 1 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Précédent
                </button>
                <span className="text-sm text-gray-700">
                  Page {pagination.page} sur {pagination.totalPages} ({pagination.total} utilisateurs)
                </span>
                <button
                  disabled={pagination.page === pagination.totalPages}
                  onClick={() => setPage(prev => Math.min(pagination.totalPages, prev + 1))}
                  className={`px-4 py-2 border rounded-md ${
                    pagination.page === pagination.totalPages 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Suivant
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UsersList;