import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Shield, 
  Search,
  AlertCircle,
  CheckCircle,
  X,
  Save,
  Settings
} from 'lucide-react';
import axios from 'axios';

// Mock API service - replace with your actual API calls
const roleService = {
  async getRoles() {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');
      
      // Récupérer uniquement les rôles spécifiques (Client, Admin, Commune) pour l'application 13635
      const targetRoleIds = [93, 94, 100]; // IDs des rôles à afficher
      const rolesPromises = targetRoleIds.map(roleId => 
        axios.get(`https://gateway.tsirylab.com/serviceauth/roles/${roleId}`, {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
      );

      const responses = await Promise.all(rolesPromises);
      
      // Extraire et formater les rôles
      return responses
        .filter(response => response.data) // Filtrer les réponses vides
        .map(response => {
          const role = response.data.data || response.data;
          return {
            id: role.role_id || role.id,
            name: role.role_name || role.name,
            slug: role.role_slug || role.slug,
            description: role.description || '',
            users_count: role.appUserRoles?.length || role.users_count || 0,
            created_at: role.created_at,
            updated_at: role.updated_at
          };
        });
    } catch (error) {
      console.error('Error fetching roles:', error);
      return [];
    }
  },

  async createRole(roleData) {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');
      
      const response = await axios.post('https://gateway.tsirylab.com/serviceauth/roles', roleData, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Retourner le nouveau rôle avec un compteur d'utilisateurs à 0
      return { ...response.data, users_count: 0 };
    } catch (error) {
      console.error('Error creating role:', error);
      throw error;
    }
  },

  async updateRole(id, roleData) {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');
      
      const response = await axios.put(`https://gateway.tsirylab.com/serviceauth/roles/${id}`, roleData, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error(`Error updating role ${id}:`, error);
      throw error;
    }
  },

  async deleteRole(id) {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');
      
      await axios.delete(`https://gateway.tsirylab.com/serviceauth/roles/${id}`, {
        headers: { 
          'Authorization': `Bearer ${token}`
        }
      });
      
      return { success: true };
    } catch (error) {
      console.error(`Error deleting role ${id}:`, error);
      throw error;
    }
  },

  async getRolePermissions(roleId) {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');
      
      const response = await axios.get(`https://gateway.tsirylab.com/serviceauth/roles/${roleId}/permissions`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Ensure we return an array of permissions
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error(`Error fetching permissions for role ${roleId}:`, error);
      // Return empty array on error to prevent UI breakage
      return [];
    }
  },

  async getApplicationRoles(appId) {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');
      
      const response = await axios.get(`https://gateway.tsirylab.com/serviceauth/roles/application/${appId}`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      // S'assurer que la réponse contient un tableau de rôles
      if (response.data && Array.isArray(response.data.roles)) {
        return response.data.roles;
      } else if (Array.isArray(response.data)) {
        return response.data;
      }
      
      console.warn('Format de réponse inattendu pour les rôles d\'application:', response.data);
      return [];
    } catch (error) {
      console.error(`Erreur lors de la récupération des rôles de l'application ${appId}:`, error);
      // Retourner un tableau vide en cas d'erreur pour éviter de casser l'UI
      return [];
    }
  }
};

const RoleManagement = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleStats, setRoleStats] = useState({
    total: 0,
    admin: 0,
    client: 0,
    commune: 0,
    other: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [errors, setErrors] = useState({});
  const [actionLoading, setActionLoading] = useState(false);

  const APPLICATION_ID = 13635;

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      setLoading(true);
      // Récupérer les rôles déjà formatés et filtrés
      const rolesData = await roleService.getRoles();
      
      // Mettre à jour la liste des rôles
      setRoles(rolesData);
      
      // Calculer les statistiques basées sur les IDs connus
      const stats = {
        total: rolesData.length,
        admin: rolesData.filter(r => r.id === 94).length,
        client: rolesData.filter(r => r.id === 93).length,
        commune: rolesData.filter(r => r.id === 100).length,
        other: 0 // Ne devrait pas y avoir d'autres rôles
      };
      
      setRoleStats(stats);
      
      // Logs pour le débogage
      console.log('=== RÔLES FILTRÉS ===');
      console.log(rolesData);
      console.log('=== STATISTIQUES ===');
      console.log(stats);
    } catch (error) {
      console.error('Error loading roles:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Le nom du rôle est requis';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'La description est requise';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateRole = async () => {
    if (!validateForm()) return;

    try {
      setActionLoading(true);
      const newRole = await roleService.createRole(formData);
      setRoles([...roles, newRole]);
      setShowCreateModal(false);
      setFormData({ name: '', description: '' });
      setErrors({});
    } catch (error) {
      console.error('Error creating role:', error);
      setErrors({ form: 'Erreur lors de la création du rôle' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditRole = async () => {
    if (!validateForm()) return;

    try {
      setActionLoading(true);
      const updatedRole = await roleService.updateRole(selectedRole.id, formData);
      setRoles(roles.map(role => 
        role.id === selectedRole.id ? updatedRole : role
      ));
      setShowEditModal(false);
      setSelectedRole(null);
      setFormData({ name: '', description: '' });
      setErrors({});
    } catch (error) {
      console.error('Error updating role:', error);
      setErrors({ form: 'Erreur lors de la modification du rôle' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteRole = async () => {
    try {
      setActionLoading(true);
      await roleService.deleteRole(selectedRole.id);
      setRoles(roles.filter(role => role.id !== selectedRole.id));
      setShowDeleteModal(false);
      setSelectedRole(null);
    } catch (error) {
      console.error('Error deleting role:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleViewPermissions = async (role) => {
    try {
      setSelectedRole(role);
      setActionLoading(true);
      const rolePermissions = await roleService.getRolePermissions(role.id);
      setPermissions(rolePermissions);
      setShowPermissionsModal(true);
    } catch (error) {
      console.error('Error loading permissions:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const openCreateModal = () => {
    setFormData({ name: '', description: '' });
    setErrors({});
    setShowCreateModal(true);
  };

  const openEditModal = (role) => {
    setSelectedRole(role);
    setFormData({
      name: role.name,
      description: role.description
    });
    setErrors({});
    setShowEditModal(true);
  };

  const openDeleteModal = (role) => {
    setSelectedRole(role);
    setShowDeleteModal(true);
  };

  const closeModals = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setShowPermissionsModal(false);
    setSelectedRole(null);
    setFormData({ name: '', description: '' });
    setErrors({});
    setPermissions([]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Shield className="mr-3 h-8 w-8 text-green-600" />
            Gestion des Rôles
          </h1>
          <p className="mt-2 text-gray-600">
            Gérez les rôles et permissions de votre application
          </p>
        </div>

        {/* Actions Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un rôle..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 w-full sm:w-80"
              />
            </div>
            <button
              onClick={openCreateModal}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nouveau Rôle
            </button>
          </div>
        </div>

        {/* Statistiques des rôles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <div className="text-sm font-medium text-gray-500">Total des Rôles</div>
            <div className="text-2xl font-semibold text-gray-900">{roleStats.total}</div>
          </div>
          {roleStats.other > 0 && (
            <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
              <div className="text-sm font-medium text-gray-500">Autres Rôles</div>
              <div className="text-2xl font-semibold text-yellow-600">{roleStats.other}</div>
            </div>
          )}
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRoles.map((role) => (
            <div key={role.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Users className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-gray-900">{role.name}</h3>
                    <p className="text-sm text-gray-500">{role.users_count} utilisateurs</p>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => handleViewPermissions(role)}
                    className="p-1 text-gray-400 hover:text-blue-600"
                    title="Voir les permissions"
                  >
                    <Settings className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => openEditModal(role)}
                    className="p-1 text-gray-400 hover:text-green-600"
                    title="Modifier"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => openDeleteModal(role)}
                    className="p-1 text-gray-400 hover:text-red-600"
                    title="Supprimer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4">{role.description}</p>
              <div className="flex justify-between items-center">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Actif
                </span>
              </div>
            </div>
          ))}
        </div>

        {filteredRoles.length === 0 && (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun rôle trouvé</h3>
            <p className="mt-1 text-sm text-gray-500">
              Commencez par créer un nouveau rôle.
            </p>
          </div>
        )}

        {/* Create/Edit Modal */}
        {(showCreateModal || showEditModal) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  {showCreateModal ? 'Créer un nouveau rôle' : 'Modifier le rôle'}
                </h3>
                <button onClick={closeModals} className="text-gray-400 hover:text-gray-600">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {errors.form && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{errors.form}</p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom du rôle <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Nom du rôle"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows="3"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      errors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Description du rôle"
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={closeModals}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Annuler
                </button>
                <button
                  onClick={showCreateModal ? handleCreateRole : handleEditRole}
                  disabled={actionLoading}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                  {actionLoading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>}
                  <Save className="h-4 w-4 mr-2" />
                  {showCreateModal ? 'Créer' : 'Modifier'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex items-center mb-4">
                <AlertCircle className="h-6 w-6 text-red-600 mr-3" />
                <h3 className="text-lg font-semibold">Confirmer la suppression</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Êtes-vous sûr de vouloir supprimer le rôle "<strong>{selectedRole?.name}</strong>" ?
                Cette action est irréversible.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={closeModals}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Annuler
                </button>
                <button
                  onClick={handleDeleteRole}
                  disabled={actionLoading}
                  className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                >
                  {actionLoading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>}
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Permissions Modal */}
        {showPermissionsModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  Permissions du rôle "{selectedRole?.role_name}"
                </h3>
                <button onClick={closeModals} className="text-gray-400 hover:text-gray-600">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="max-h-96 overflow-y-auto">
                {permissions.length > 0 ? (
                  <div className="space-y-2">
                    {permissions.map((permission) => (
                      <div key={permission.permission_id || permission.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                        <div>
                          <p className="font-medium text-gray-900">{permission.permission_name || permission.name}</p>
                          <p className="text-sm text-gray-500">{permission.permission_description || permission.description}</p>
                        </div>
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Shield className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">Aucune permission assignée</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={closeModals}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoleManagement;