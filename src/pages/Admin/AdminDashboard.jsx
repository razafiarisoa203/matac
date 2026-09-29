import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Shield, Settings, ArrowLeft, Eye, User } from 'lucide-react';
import KeyIcon from '@mui/icons-material/Key';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import ShieldIcon from '@mui/icons-material/Shield';
import { toast } from 'react-toastify';

import RolesList from '../../components/Roles/RolesList';
import { useCitizenPhotos } from '../../hooks/useCitizenPhotos';
import { roleService } from '../../services/api/roleService';
import { getUsers } from '../../services/api/userService';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('users');

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const limit = 10;

  const [roles, setRoles] = useState([]);
  const [rolesLoading, setRolesLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });

  const [roleToAdd, setRoleToAdd] = useState('');
  const [roleActionLoading, setRoleActionLoading] = useState(false);
  const [profileUser, setProfileUser] = useState(null);

  // Utilisation du Custom Hook pour les photos
  const photos = useCitizenPhotos(users);

  // Charger la liste des rôles
  useEffect(() => {
    const loadRoles = async () => {
      try {
        const rolesData = await roleService.getRoles();
        setRoles(rolesData || []);
      } catch (error) {
        console.error('Erreur chargement rôles:', error);
        toast.error('Erreur lors du chargement des rôles');
      } finally {
        setRolesLoading(false);
      }
    };
    loadRoles();
  }, []);

  // Debounce de recherche (retour à la page 1 quand le terme change)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Extraction de liste unifiée des réponses API
  const extractUsersList = (response) => {
    if (Array.isArray(response)) return response;
    if (Array.isArray(response?.data)) return response.data;
    if (Array.isArray(response?.users)) return response.users;
    if (Array.isArray(response?.data?.users)) return response.data.users;
    if (Array.isArray(response?.data?.items)) return response.data.items;
    return [];
  };

  // Chargement des utilisateurs.
  // showLoader = false : rafraîchissement silencieux (après ajout/retrait de rôle)
  const fetchUsersData = useCallback(
    async (showLoader = true) => {
      try {
        if (showLoader) setLoading(true);
        const response = await getUsers(page, limit, debouncedSearchTerm);
        const rawList = extractUsersList(response);
        const formattedUsers = rawList.map((u) => u?._raw || u);

        setUsers(formattedUsers);

        // Met à jour l'utilisateur ouvert dans la modale
        setProfileUser((prev) => {
          if (!prev) return null;
          const targetId = prev.user_id || prev.id;
          return formattedUsers.find((u) => (u.user_id || u.id) === targetId) || prev;
        });

        const totalCount = response?.total || response?.data?.total || formattedUsers.length;
        const newPagination = {
          page: response?.page || response?.data?.page || page,
          limit: response?.limit || response?.data?.limit || limit,
          total: totalCount,
          totalPages:
            response?.totalPages ||
            response?.data?.totalPages ||
            Math.ceil(totalCount / limit) ||
            1,
        };

        // Évite un re-render inutile si rien n'a changé
        setPagination((prev) =>
          prev.page === newPagination.page &&
          prev.limit === newPagination.limit &&
          prev.total === newPagination.total &&
          prev.totalPages === newPagination.totalPages
            ? prev
            : newPagination
        );
      } catch (error) {
        console.error('Erreur chargement utilisateurs:', error);
        toast.error('Erreur lors du chargement des utilisateurs');
      } finally {
        if (showLoader) setLoading(false);
      }
    },
    [page, limit, debouncedSearchTerm]
  );

  useEffect(() => {
    fetchUsersData();
  }, [fetchUsersData]);

  // Fermeture de la modale avec la touche 'Echap'
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setProfileUser(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Calcul mémoïsé des rôles disponibles pour la modale
  const availableRoles = useMemo(() => {
    if (!Array.isArray(roles) || !profileUser) return [];
    const assignedIds = (profileUser?.appUserRoles || [])
      .filter((ur) => ur?.role?.role_id !== undefined && ur?.role?.role_id !== null)
      .map((ur) => ur.role.role_id.toString());

    return roles.filter(
      (r) => r?.role_id !== undefined && !assignedIds.includes(r.role_id.toString())
    );
  }, [roles, profileUser]);

  // Actions de rôles
  const handleRemoveRole = async (userId, roleId) => {
    if (roleActionLoading) return;
    try {
      setRoleActionLoading(true);
      await roleService.removeUserRoles(userId, [roleId]);
      toast.success('Rôle retiré avec succès');
      await fetchUsersData(false);
    } catch (error) {
      toast.error(`Erreur: ${error?.response?.data?.message || 'Impossible de retirer le rôle'}`);
    } finally {
      setRoleActionLoading(false);
    }
  };

  const handleAddRoleModal = async () => {
    if (!profileUser || !roleToAdd) return;
    const userId = profileUser.user_id || profileUser.id;

    try {
      setRoleActionLoading(true);
      await roleService.assignUserRoles(userId, [parseInt(roleToAdd, 10)]);
      toast.success('Rôle ajouté avec succès');
      setRoleToAdd('');
      await fetchUsersData(false);
    } catch (error) {
      toast.error(`Erreur: ${error?.response?.data?.message || "Impossible d'ajouter le rôle"}`);
    } finally {
      setRoleActionLoading(false);
    }
  };

  const profileUserId = profileUser?.user_id || profileUser?.id;
  const profilePhotoUrl = profileUser?.id_citizen ? photos[profileUser.id_citizen] : null;

  const paginationBtnClass = (disabled) =>
    `text-sm font-medium px-4 py-2 border rounded-md transition-colors ${
      disabled
        ? 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed'
        : 'bg-slate-700 text-slate-100 border-slate-600 hover:bg-slate-600'
    }`;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <button onClick={() => navigate(-1)} className="mr-4 text-gray-600 hover:text-gray-800">
              <ArrowLeft className="h-6 w-6" />
            </button>
            Administration
          </h1>
          <button
            onClick={() => navigate('/admin/settings')}
            className="inline-flex items-center text-sm font-medium px-4 py-2 border rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <Settings className="h-5 w-5 mr-2" />
            Paramètres
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <div className="flex space-x-2 border-b border-gray-200 w-full">
              {[
                { key: 'users', label: 'Utilisateurs', icon: Users },
                { key: 'roles', label: 'Rôles', icon: Shield },
                { key: 'permissions', label: 'Permissions', icon: KeyIcon },
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === key
                      ? 'border-b-2 border-blue-500 text-blue-600'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </div>

            <div className="ml-4 flex-shrink-0">
              {activeTab === 'users' && (
                <button
                  onClick={() => navigate('/admin/users/new')}
                  className="inline-flex items-center bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-green-700"
                >
                  <PersonAddAltIcon className="h-4 w-4 mr-2" />
                  Nouvel utilisateur
                </button>
              )}
              {activeTab === 'roles' && (
                <button
                  onClick={() => navigate('/admin/roles/new')}
                  className="inline-flex items-center bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-green-700"
                >
                  <ShieldIcon className="h-4 w-4 mr-2" />
                  Nouveau rôle
                </button>
              )}
            </div>
          </div>

          {/* Onglet Utilisateurs */}
          {activeTab === 'users' && (
            <div className="bg-slate-900 shadow rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-100">Gestion des Utilisateurs</h2>
                {pagination.total > 0 && (
                  <span className="text-sm text-slate-400">{pagination.total} utilisateur(s) au total</span>
                )}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setDebouncedSearchTerm(searchTerm);
                  setPage(1);
                }}
                className="mb-6 flex max-w-md"
              >
                <input
                  type="text"
                  placeholder="Rechercher un utilisateur..."
                  className="flex-1 px-4 py-2 bg-slate-800 text-slate-100 border border-slate-600 rounded-l-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit" className="bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-r-md hover:bg-green-700">
                  Rechercher
                </button>
              </form>

              <div className="border border-slate-700 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  {loading ? (
                    <div className="p-10 text-center text-sm text-slate-300">Chargement...</div>
                  ) : (
                    <table className="min-w-full divide-y divide-slate-700">
                      <thead className="bg-slate-800">
                        <tr>
                          {['Photo', 'Nom', 'Email', 'Téléphone', 'Rôles', 'Actions'].map((h, i) => (
                            <th key={h} className={`px-6 py-3 text-xs font-semibold text-slate-300 uppercase ${i === 5 ? 'text-right' : 'text-left'}`}>
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700 bg-slate-900">
                        {users.length === 0 ? (
                          <tr>
                            <td colSpan="6" className="px-6 py-12 text-center text-sm text-slate-400">
                              Aucun utilisateur trouvé
                            </td>
                          </tr>
                        ) : (
                          users.map((u, index) => {
                            const realUserId = u?.user_id || u?.id;
                            const rowKey = realUserId || u?.id_citizen || `idx-${index}`;
                            const pUrl = u?.id_citizen ? photos[u.id_citizen] : null;

                            return (
                              <tr key={rowKey} className="hover:bg-slate-800 transition-colors">
                                <td className="px-6 py-4">
                                  {pUrl ? (
                                    <img src={pUrl} alt="" className="h-10 w-10 rounded-full object-cover ring-1 ring-slate-600" />
                                  ) : (
                                    <div className="h-10 w-10 rounded-full bg-slate-700 flex items-center justify-center">
                                      <User className="h-5 w-5 text-slate-300" />
                                    </div>
                                  )}
                                </td>
                                <td className="px-6 py-4 text-sm font-medium text-slate-100">{u?.user_pseudo || u?.username || 'Non défini'}</td>
                                <td className="px-6 py-4 text-sm text-slate-300">{u?.user_email || u?.email || 'N/A'}</td>
                                <td className="px-6 py-4 text-sm text-slate-300">{u?.user_phone || u?.phone || 'Non défini'}</td>
                                <td className="px-6 py-4">
                                  <div className="flex flex-wrap gap-1.5 max-w-xs">
                                    {u?.appUserRoles?.map((ur, rIdx) => {
                                      const rId = ur?.role?.role_id;
                                      const rName = ur?.role?.role_name || 'Inconnu';
                                      if (!rId) return null;
                                      return (
                                        <span key={`${rId}-${rIdx}`} className="inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                          {rName}
                                          <button
                                            type="button"
                                            onClick={() => handleRemoveRole(realUserId, rId)}
                                            disabled={roleActionLoading}
                                            className="h-4 w-4 rounded-full text-green-700 hover:text-red-600 disabled:opacity-50"
                                          >
                                            ✕
                                          </button>
                                        </span>
                                      );
                                    })}
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                  <button
                                    onClick={() => { setProfileUser(u); setRoleToAdd(''); }}
                                    className="inline-flex items-center justify-center bg-slate-100 hover:bg-white h-8 w-8 rounded-md text-slate-900"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  )}
                </div>

                {/* Pagination */}
                {!loading && pagination.totalPages > 1 && (
                  <div className="flex justify-between items-center px-6 py-3 border-t border-slate-700 bg-slate-800">
                    <button
                      type="button"
                      disabled={pagination.page <= 1}
                      onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                      className={paginationBtnClass(pagination.page <= 1)}
                    >
                      Précédent
                    </button>
                    <span className="text-sm text-slate-300">
                      Page {pagination.page} sur {pagination.totalPages} ({pagination.total} utilisateurs)
                    </span>
                    <button
                      type="button"
                      disabled={pagination.page >= pagination.totalPages}
                      onClick={() => setPage((prev) => Math.min(pagination.totalPages, prev + 1))}
                      className={paginationBtnClass(pagination.page >= pagination.totalPages)}
                    >
                      Suivant
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'roles' && (
            <div className="bg-white shadow rounded-lg p-6">
              <RolesList />
            </div>
          )}

          {activeTab === 'permissions' && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Gestion des Permissions</h2>
              <p className="text-gray-600">Prochainement disponible.</p>
            </div>
          )}
        </div>
      </main>

      {/* Modale Profil Utilisateur Inlinée */}
      {profileUser && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
          onClick={() => setProfileUser(null)}
        >
          <div
            className="bg-slate-900 border border-slate-700 rounded-lg shadow-xl max-w-md w-full p-6 text-slate-100 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* En-tête */}
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-lg font-bold text-slate-100">Détails de l'utilisateur</h2>
              <button
                type="button"
                onClick={() => setProfileUser(null)}
                className="text-slate-400 hover:text-white text-xl font-bold p-1 leading-none"
              >
                ✕
              </button>
            </div>

            {/* Profil & Photo */}
            <div className="flex items-center gap-4 mb-4">
              {profilePhotoUrl ? (
                <img
                  src={profilePhotoUrl}
                  alt={profileUser?.user_pseudo || 'Photo profil'}
                  className="h-16 w-16 rounded-full object-cover ring-2 ring-slate-700"
                />
              ) : (
                <div className="h-16 w-16 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
                  <User className="h-8 w-8 text-slate-400" />
                </div>
              )}
              <div className="overflow-hidden">
                <p className="font-semibold text-lg text-slate-100 truncate">
                  {profileUser?.user_pseudo || profileUser?.username || 'Non défini'}
                </p>
                <p className="text-sm text-slate-400 truncate">{profileUser?.user_email || profileUser?.email || 'N/A'}</p>
              </div>
            </div>

            {/* Informations détaillées */}
            <dl className="grid grid-cols-3 gap-y-3 text-sm border-t border-b border-slate-800 py-4 mb-4">
              <dt className="text-slate-400 font-medium">Téléphone</dt>
              <dd className="col-span-2 text-slate-200">{profileUser?.user_phone || profileUser?.phone || 'Non défini'}</dd>

              <dt className="text-slate-400 font-medium">ID Utilisateur</dt>
              <dd className="col-span-2 break-all text-slate-200 font-mono text-xs">{profileUserId || 'N/A'}</dd>

              <dt className="text-slate-400 font-medium">Rôles actuels</dt>
              <dd className="col-span-2">
                {Array.isArray(profileUser?.appUserRoles) && profileUser.appUserRoles.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {profileUser.appUserRoles.map((ur, idx) => {
                      const roleId = ur?.role?.role_id;
                      const roleName = ur?.role?.role_name || 'Inconnu';
                      if (!roleId) return null;

                      return (
                        <span
                          key={`modal-role-${roleId}-${idx}`}
                          className="inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-full text-xs font-medium bg-emerald-950 text-emerald-300 border border-emerald-800"
                        >
                          <span>{roleName}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveRole(profileUserId, roleId)}
                            disabled={roleActionLoading}
                            className="flex items-center justify-center h-4 w-4 rounded-full text-emerald-400 hover:bg-emerald-900 hover:text-red-400 disabled:opacity-50"
                          >
                            ✕
                          </button>
                        </span>
                      );
                    })}
                  </div>
                ) : (
                  <span className="text-xs text-slate-500 italic">Aucun rôle attribué</span>
                )}
              </dd>
            </dl>

            {/* Ajout de rôle */}
            <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/60">
              <label className="block text-xs font-medium text-slate-300 mb-2">
                Ajouter un rôle à cet utilisateur
              </label>
              <div className="flex gap-2">
                <select
                  value={roleToAdd}
                  onChange={(e) => setRoleToAdd(e.target.value)}
                  className="flex-1 text-sm px-2.5 py-1.5 border border-slate-600 rounded-md bg-slate-900 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">Sélectionner un rôle...</option>
                  {rolesLoading ? (
                    <option disabled>Chargement des rôles...</option>
                  ) : availableRoles.length === 0 ? (
                    <option disabled>Tous les rôles sont attribués</option>
                  ) : (
                    availableRoles.map((role) => (
                      <option key={`modal-opt-${role.role_id}`} value={role.role_id}>
                        {role.role_name}
                      </option>
                    ))
                  )}
                </select>

                <button
                  type="button"
                  onClick={handleAddRoleModal}
                  disabled={roleActionLoading || !roleToAdd}
                  className="text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-1.5 rounded-md disabled:opacity-50 transition-colors"
                >
                  Ajouter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;