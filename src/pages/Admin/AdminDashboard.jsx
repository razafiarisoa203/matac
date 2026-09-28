import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RolesList from '../../components/Roles/RolesList';
import { Users, Shield, Settings, ArrowLeft, Eye, User } from 'lucide-react';
import KeyIcon from '@mui/icons-material/Key';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import ShieldIcon from '@mui/icons-material/Shield';
import { roleService } from '../../services/api/roleService';
import { getUsers } from '../../services/api/userService';
import { toast } from 'react-toastify';
import axios from 'axios';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('users');

  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [limit] = useState(10);
  const [roles, setRoles] = useState([]);
  const [rolesLoading, setRolesLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [photos, setPhotos] = useState({}); // { [id_citizen]: photo_url }

  const [roleToAdd, setRoleToAdd] = useState('');
  
  const [roleActionLoading, setRoleActionLoading] = useState(false);

  
  const [profileUser, setProfileUser] = useState(null);

  // --- Récupération des photos des citoyens ---
  useEffect(() => {
    users.forEach((user) => {
      if (user?.id_citizen && !photos[user.id_citizen]) {
        axios
          .get(`https://gateway.tsirylab.com/serviceauth/users/user-citizen/${user.id_citizen}`)
          .then((res) => {
            const photoPath = res.data?.citizen?.citizen_photo;
            let fullPhotoUrl = null;

            if (photoPath) {
              if (photoPath.startsWith('http')) {
                fullPhotoUrl = photoPath.split("hello/").join("preview/hello%2F");
              } else if (photoPath.includes('hello')) {
                const pathAfterHello = photoPath.split('hello')[1];
                if (pathAfterHello) {
                  const encodedPath = pathAfterHello.replace(/\//g, '%2F');
                  fullPhotoUrl = `https://gateway.tsirylab.com/serviceupload/file/preview/hello${encodedPath}`;
                }
              } else {
                fullPhotoUrl = `https://gateway.tsirylab.com/serviceupload/file/preview/${photoPath.replace(/^\//, '')}`;
              }
            }

            setPhotos((prev) => ({
              ...prev,
              [user.id_citizen]: fullPhotoUrl,
            }));
          })
          .catch((err) => {
            console.error("Erreur fetch photo:", err);
            setPhotos((prev) => ({ ...prev, [user.id_citizen]: null }));
          });
      }
    });
  }, [users]);

  // Chargement des rôles au montage
  useEffect(() => {
    const loadRoles = async () => {
      try {
        const rolesData = await roleService.getRoles();
        setRoles(rolesData || []);
        setRolesLoading(false);
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

  
  useEffect(() => {
    let isMounted = true;

    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await getUsers(page, limit, debouncedSearchTerm);

        if (!isMounted) return;

        // Log de débogage : vérifie dans la console F12 la structure reçue
        console.log("Données brutes reçues de getUsers:", response);

        // Récupération flexible de la liste selon la structure backend
        let rawList = [];
        if (Array.isArray(response)) {
          rawList = response;
        } else if (Array.isArray(response?.data)) {
          rawList = response.data;
        } else if (Array.isArray(response?.users)) {
          rawList = response.users;
        } else if (Array.isArray(response?.data?.users)) {
          rawList = response.data.users;
        } else if (Array.isArray(response?.data?.items)) {
          rawList = response.data.items;
        }

        // Mappage sécurisé
        const formattedUsers = rawList.map(u => u?._raw || u);
        setUsers(formattedUsers);

        // Extraction de la pagination
        const newPagination = {
          page: response?.page || response?.data?.page || page,
          limit: response?.limit || response?.data?.limit || limit,
          total: response?.total || response?.data?.total || formattedUsers.length,
          totalPages: response?.totalPages || response?.data?.totalPages || Math.ceil((response?.total || formattedUsers.length) / limit) || 1
        };

        setPagination(prev => {
          if (
            prev.page === newPagination.page &&
            prev.limit === newPagination.limit &&
            prev.total === newPagination.total &&
            prev.totalPages === newPagination.totalPages
          ) {
            return prev;
          }
          return newPagination;
        });
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
      isMounted = false;
    };
  }, [page, debouncedSearchTerm, limit]);

  // Gestion recherche
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
  };

  // Recharge la liste des utilisateurs
  const refreshUsers = async () => {
    try {
      const response = await getUsers(page, limit, debouncedSearchTerm);
      
      let rawList = [];
      if (Array.isArray(response)) {
        rawList = response;
      } else if (Array.isArray(response?.data)) {
        rawList = response.data;
      } else if (Array.isArray(response?.users)) {
        rawList = response.users;
      } else if (Array.isArray(response?.data?.users)) {
        rawList = response.data.users;
      } else if (Array.isArray(response?.data?.items)) {
        rawList = response.data.items;
      }

      const updatedList = rawList.map(u => u?._raw || u);
      setUsers(updatedList);

      const newPagination = {
        page: response?.page || response?.data?.page || page,
        limit: response?.limit || response?.data?.limit || limit,
        total: response?.total || response?.data?.total || updatedList.length,
        totalPages: response?.totalPages || response?.data?.totalPages || Math.ceil((response?.total || updatedList.length) / limit) || 1
      };
      setPagination(prev => ({ ...prev, ...newPagination }));

      // Si le modal est ouvert, maj également l'utilisateur sélectionné
      if (profileUser) {
        const targetId = profileUser.user_id || profileUser.id;
        const updatedUser = updatedList.find(u => (u.user_id || u.id) === targetId);
        if (updatedUser) {
          setProfileUser(updatedUser);
        }
      }
    } catch (error) {
      console.error('Erreur lors du rechargement des utilisateurs:', error);
    }
  };

  // Retirer un rôle précis d'un utilisateur
  const handleRemoveRole = async (userId, roleId) => {
    if (roleActionLoading) return;
    try {
      setRoleActionLoading(true);
      await roleService.removeUserRoles(userId, [roleId]);
      toast.success('Rôle retiré avec succès');
      await refreshUsers();
    } catch (error) {
      console.error('Erreur lors du retrait du rôle:', error);
      toast.error(`Erreur lors du retrait du rôle: ${error?.response?.data?.message || error?.message || 'Erreur inconnue'}`);
    } finally {
      setRoleActionLoading(false);
    }
  };

  // Ajouter le rôle sélectionné à l'utilisateur du modal
  const handleAddRoleModal = async () => {
    if (!profileUser) return;
    const userId = profileUser.user_id || profileUser.id;

    if (!roleToAdd) {
      toast.error('Sélectionne un rôle à ajouter');
      return;
    }

    const alreadyAssignedIds = (profileUser.appUserRoles || [])
      .filter(ur => ur?.role?.role_id)
      .map(ur => ur.role.role_id.toString());

    if (alreadyAssignedIds.includes(roleToAdd.toString())) {
      toast.error('Ce rôle est déjà assigné à cet utilisateur');
      return;
    }

    try {
      setRoleActionLoading(true);
      await roleService.assignUserRoles(userId, [parseInt(roleToAdd)]);
      toast.success('Rôle ajouté avec succès');
      setRoleToAdd('');
      await refreshUsers();
    } catch (error) {
      console.error('Erreur lors de l\'ajout du rôle:', error);
      toast.error(`Erreur lors de l'ajout du rôle: ${error?.response?.data?.message || error?.message || 'Erreur inconnue'}`);
    } finally {
      setRoleActionLoading(false);
    }
  };

  // Rôles disponibles à l'ajout pour l'utilisateur sélectionné dans le modal
  const getAvailableRolesForProfileUser = () => {
    if (!profileUser) return [];
    const assignedIds = (profileUser.appUserRoles || [])
      .filter(ur => ur?.role?.role_id)
      .map(ur => ur.role.role_id.toString());
    return roles.filter(r => r?.role_id && !assignedIds.includes(r.role_id.toString()));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="mr-4 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            Administration
          </h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/admin/settings')}
              className="inline-flex items-center text-sm font-medium px-4 py-2 border rounded-md text-gray-700 bg-white hover:bg-gray-50"
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
          <div className="w-full">
            <div className="flex justify-between items-center mb-6">
              <div className="flex space-x-2 border-b border-gray-200 w-full">
                <button
                  onClick={() => setActiveTab('users')}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === 'users'
                      ? 'border-b-2 border-blue-500 text-blue-600'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Users className="h-4 w-4" />
                  Utilisateurs
                </button>
                <button
                  onClick={() => setActiveTab('roles')}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === 'roles'
                      ? 'border-b-2 border-blue-500 text-blue-600'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Shield className="h-4 w-4" />
                  Rôles
                </button>
                <button
                  onClick={() => setActiveTab('permissions')}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === 'permissions'
                      ? 'border-b-2 border-blue-500 text-blue-600'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <KeyIcon className="h-4 w-4" />
                  Permissions
                </button>
              </div>

              <div className="ml-4 flex-shrink-0">
                {activeTab === 'users' && (
                  <button
                    onClick={() => navigate('/admin/users/new')}
                    className="inline-flex items-center bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                  >
                    <PersonAddAltIcon className="h-4 w-4 mr-2" />
                    Nouvel utilisateur
                  </button>
                )}

                {activeTab === 'roles' && (
                  <button
                    onClick={() => navigate('/admin/roles/new')}
                    className="inline-flex items-center bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                  >
                    <ShieldIcon className="h-4 w-4 mr-2" />
                    Nouveau rôle
                  </button>
                )}
              </div>
            </div>

            {/* Onglet Utilisateurs */}
            <div style={{ display: activeTab === 'users' ? 'block' : 'none' }}>
              <div className="bg-slate-900 shadow rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-slate-100">Gestion des Utilisateurs</h2>
                  {pagination.total > 0 && (
                    <span className="text-sm text-slate-400">
                      {pagination.total} utilisateur{pagination.total > 1 ? 's' : ''} au total
                    </span>
                  )}
                </div>

                {/* Search */}
                <form onSubmit={handleSearch} className="mb-6 flex max-w-md">
                  <input
                    type="text"
                    placeholder="Rechercher un utilisateur..."
                    className="flex-1 px-4 py-2 bg-slate-800 text-slate-100 placeholder-slate-400 border border-slate-600 rounded-l-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-r-md hover:bg-green-700 transition-colors"
                  >
                    Rechercher
                  </button>
                </form>

                {/* Users Table */}
                <div className="bg-slate-900 border border-slate-700 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    {loading ? (
                      <div className="p-10 text-center text-sm text-slate-300">Chargement...</div>
                    ) : (
                      <>
                        <table className="min-w-full divide-y divide-slate-700">
                          <thead className="bg-slate-800 sticky top-0 z-10">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Photo</th>
                              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Nom</th>
                              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Email</th>
                              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Téléphone</th>
                              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Rôles</th>
                              <th className="px-6 py-3 text-right text-xs font-semibold text-slate-300 uppercase tracking-wider">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="bg-slate-900 divide-y divide-slate-700">
                            {users.length === 0 ? (
                              <tr>
                                <td colSpan="6" className="px-6 py-12 text-center text-sm text-slate-400">
                                  Aucun utilisateur trouvé
                                </td>
                              </tr>
                            ) : (
                              users.map((user, index) => {
                                const userId = user?.user_id || user?.id || user?.id_citizen || `user-idx-${index}`;
                                const photoUrl = user?.id_citizen ? photos[user.id_citizen] : null;

                                return (
                                  <tr key={userId} className="hover:bg-slate-800 transition-colors align-middle">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      {photoUrl ? (
                                        <img
                                          src={photoUrl}
                                          alt={`Photo de ${user.user_pseudo || 'l\'utilisateur'}`}
                                          className="h-10 w-10 rounded-full object-cover ring-1 ring-slate-600"
                                          onError={(e) => {
                                            e.target.style.display = 'none';
                                          }}
                                        />
                                      ) : (
                                        <div className="h-10 w-10 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center" title="Aucune photo">
                                          <User className="h-5 w-5 text-slate-300" />
                                        </div>
                                      )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-100">
                                      {user?.user_pseudo || user?.username || 'Non défini'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                                      {user?.user_email || user?.email || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                                      {user?.user_phone || user?.phone || 'Non défini'}
                                    </td>

                                    {/* Colonne Rôles : pastilles avec ✕ pour retirer */}
                                    <td className="px-6 py-4 align-middle">
                                      <div className="flex flex-wrap gap-1.5 max-w-[220px] sm:max-w-xs">
                                        {user?.appUserRoles && user.appUserRoles.length > 0 ? (
                                          user.appUserRoles.map((ur, rIndex) => {
                                            const roleId = ur?.role?.role_id;
                                            const roleName = ur?.role?.role_name || 'Inconnu';
                                            if (!roleId) return null;

                                            return (
                                              <span
                                                key={`role-${roleId}-${rIndex}`}
                                                className="inline-flex flex-shrink-0 items-center gap-1.5 whitespace-nowrap pl-2.5 pr-1.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                                              >
                                                <span className="whitespace-nowrap">{roleName}</span>
                                                <button
                                                  type="button"
                                                  onClick={() => handleRemoveRole(userId, roleId)}
                                                  disabled={roleActionLoading}
                                                  title={`Retirer le rôle ${roleName}`}
                                                  className="flex flex-shrink-0 items-center justify-center h-4 w-4 rounded-full text-green-700 hover:bg-green-200 hover:text-red-600 leading-none disabled:opacity-50 transition-colors"
                                                >
                                                  ✕
                                                </button>
                                              </span>
                                            );
                                          })
                                        ) : (
                                          <span className="text-xs text-slate-400 font-medium italic">Aucun rôle</span>
                                        )}
                                      </div>
                                    </td>

                                    {/* Colonne Actions */}
                                    <td className="px-6 py-4 text-right text-sm align-middle">
                                      <button
                                        onClick={() => {
                                          setProfileUser(user);
                                          setRoleToAdd('');
                                        }}
                                        title="Voir l'utilisateur"
                                        className="inline-flex items-center justify-center text-slate-900 bg-slate-100 border border-slate-300 hover:bg-white h-8 w-8 rounded-md transition-colors"
                                      >
                                        <Eye className="h-4 w-4" strokeWidth={2.25} />
                                      </button>
                                    </td>
                                  </tr>
                                );
                              })
                            )}
                          </tbody>
                        </table>

                        {/* Pagination */}
                        {pagination.totalPages > 1 && (
                          <div className="flex justify-between items-center px-6 py-3 border-t border-slate-700 bg-slate-800">
                            <button
                              disabled={pagination.page === 1}
                              onClick={() => setPage(prev => Math.max(1, prev - 1))}
                              className={`text-sm font-medium px-4 py-2 border rounded-md transition-colors ${
                                pagination.page === 1
                                  ? 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed'
                                  : 'bg-slate-700 text-slate-100 border-slate-600 hover:bg-slate-600'
                              }`}
                            >
                              Précédent
                            </button>
                            <span className="text-sm text-slate-300">
                              Page {pagination.page} sur {pagination.totalPages} ({pagination.total} utilisateurs)
                            </span>
                            <button
                              disabled={pagination.page === pagination.totalPages}
                              onClick={() => setPage(prev => Math.min(pagination.totalPages, prev + 1))}
                              className={`text-sm font-medium px-4 py-2 border rounded-md transition-colors ${
                                pagination.page === pagination.totalPages
                                  ? 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed'
                                  : 'bg-slate-700 text-slate-100 border-slate-600 hover:bg-slate-600'
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

      
      {profileUser && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setProfileUser(null)}
        >
          <div
            className="bg-slate-900 border border-slate-700 rounded-lg shadow-xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-lg font-bold text-slate-100">Détails de l'utilisateur</h2>
              <button
                onClick={() => setProfileUser(null)}
                className="text-slate-300 hover:text-white text-xl leading-none"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center gap-4 mb-4">
              {profileUser?.id_citizen && photos[profileUser.id_citizen] ? (
                <img
                  src={photos[profileUser.id_citizen]}
                  alt={`Photo de ${profileUser.user_pseudo || 'l\'utilisateur'}`}
                  className="h-16 w-16 rounded-full object-cover ring-1 ring-slate-600"
                />
              ) : (
                <div className="h-16 w-16 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center" title="Aucune photo">
                  <User className="h-8 w-8 text-slate-300" />
                </div>
              )}
              <div>
                <p className="font-semibold text-lg text-slate-100">{profileUser?.user_pseudo || profileUser?.username || 'Non défini'}</p>
                <p className="text-sm text-slate-300">{profileUser?.user_email || profileUser?.email || 'N/A'}</p>
              </div>
            </div>

            <dl className="grid grid-cols-3 gap-y-3 text-sm border-b border-slate-700 pb-4 mb-4">
              <dt className="text-slate-400 font-medium">Téléphone</dt>
              <dd className="col-span-2 text-slate-100">{profileUser?.user_phone || profileUser?.phone || 'Non défini'}</dd>

              <dt className="text-slate-400 font-medium">ID Utilisateur</dt>
              <dd className="col-span-2 break-all text-slate-100">{profileUser?.user_id || profileUser?.id || 'N/A'}</dd>

              <dt className="text-slate-400 font-medium">Créé le</dt>
              <dd className="col-span-2 text-slate-100">
                {profileUser?.createdAt
                  ? new Date(profileUser.createdAt).toLocaleDateString('fr-FR', {
                      year: 'numeric', month: 'long', day: 'numeric'
                    })
                  : 'Inconnu'}
              </dd>

              <dt className="text-slate-400 font-medium">Rôles actuels</dt>
              <dd className="col-span-2">
                {profileUser?.appUserRoles && profileUser.appUserRoles.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {profileUser.appUserRoles.map((ur, idx) => {
                      const roleId = ur?.role?.role_id;
                      const roleName = ur?.role?.role_name || 'Inconnu';
                      if (!roleId) return null;

                      return (
                        <span
                          key={`modal-user-role-${roleId}-${idx}`}
                          className="inline-flex items-center gap-1.5 whitespace-nowrap pl-2.5 pr-1.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                        >
                          <span>{roleName}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveRole(profileUser.user_id || profileUser.id, roleId)}
                            disabled={roleActionLoading}
                            title={`Retirer le rôle ${roleName}`}
                            className="flex flex-shrink-0 items-center justify-center h-4 w-4 rounded-full text-green-700 hover:bg-green-200 hover:text-red-600 leading-none disabled:opacity-50 transition-colors"
                          >
                            ✕
                          </button>
                        </span>
                      );
                    })}
                  </div>
                ) : (
                  <span className="text-xs text-slate-400 font-medium italic">Aucun rôle</span>
                )}
              </dd>
            </dl>

            {/* Formulaire d'ajout de rôle dans la modale */}
            <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
              <label className="block text-xs font-medium text-slate-300 mb-2">
                Ajouter un rôle à cet utilisateur
              </label>
              <div className="flex gap-2">
                <select
                  value={roleToAdd}
                  onChange={(e) => setRoleToAdd(e.target.value)}
                  className="flex-1 text-sm px-2.5 py-1.5 border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-slate-900 text-slate-100"
                >
                  <option value="">Sélectionner un rôle...</option>
                  {rolesLoading ? (
                    <option disabled>Chargement des rôles...</option>
                  ) : getAvailableRolesForProfileUser().length === 0 ? (
                    <option disabled>Tous les rôles sont attribués</option>
                  ) : (
                    getAvailableRolesForProfileUser().map((role) => (
                      <option key={`modal-role-${role.role_id}`} value={role.role_id}>
                        {role.role_name}
                      </option>
                    ))
                  )}
                </select>

                <button
                  onClick={handleAddRoleModal}
                  disabled={roleActionLoading || !roleToAdd}
                  className="text-xs font-medium text-white bg-green-600 hover:bg-green-700 px-4 py-1.5 rounded-md disabled:opacity-50 transition-colors"
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