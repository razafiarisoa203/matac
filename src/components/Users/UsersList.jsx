import React, { useState, useEffect } from 'react';
import { getUsers, updateUserRoles, getRoles } from '../../services/api/userService';
import { toast } from 'react-toastify';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [roles, setRoles] = useState([]);
  const [editingRoles, setEditingRoles] = useState(null);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  // Terme de recherche "debounced" pour éviter les requêtes à chaque frappe
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  const limit = 10;

  // Chargement des rôles au montage
  useEffect(() => {
    const loadRoles = async () => {
      try {
        const rolesData = await getRoles();
        setRoles(rolesData);
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
    setEditingRoles(userId);
    setSelectedRoles(user.appUserRoles?.map(ur => ur.role.role_id) || []);
  };

  const handleRoleChange = (roleId) => {
    setSelectedRoles(prev =>
      prev.includes(roleId)
        ? prev.filter(id => id !== roleId)
        : [...prev, roleId]
    );
  };

  const saveUserRoles = async (userId) => {
    try {
      await updateUserRoles(userId, selectedRoles);
      toast.success('Rôles mis à jour avec succès');
      setEditingRoles(null);
      // Rafraîchir la liste sans changer la page
      setLoading(true);
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
      console.error('Erreur lors de la mise à jour des rôles:', error);
      toast.error('Erreur lors de la mise à jour des rôles');
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => setEditingRoles(null);

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
                      {editingRoles === userId ? (
                        <div className="space-y-2">
                          {roles.map(role => (
                            <div key={role.role_id} className="flex items-center">
                              <input
                                type="checkbox"
                                id={`role-${userId}-${role.role_id}`}
                                checked={selectedRoles.includes(role.role_id)}
                                onChange={() => handleRoleChange(role.role_id)}
                                className="h-4 w-4 text-green-600 border-gray-300 rounded"
                              />
                              <label htmlFor={`role-${userId}-${role.role_id}`} className="ml-2 text-sm">{role.role_name}</label>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {user.appUserRoles?.map(ur => (
                            <span key={ur.role.role_id} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">{ur.role.role_name}</span>
                          )) || <span className="text-sm text-gray-500">Aucun rôle</span>}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      {editingRoles === userId ? (
                        <>
                          <button onClick={() => saveUserRoles(userId)} className="text-green-600 hover:text-green-900 mr-2">Enregistrer</button>
                          <button onClick={cancelEdit} className="text-gray-600 hover:text-gray-900">Annuler</button>
                        </>
                      ) : (
                        <button onClick={() => handleRoleEdit(user)} className="text-indigo-600 hover:text-indigo-900">Modifier les rôles</button>
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