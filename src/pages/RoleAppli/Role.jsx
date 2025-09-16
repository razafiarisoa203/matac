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

// Mock API service - replace with your actual API calls
const roleService = {
  async getRoles() {
    // GET /serviceauth/roles
    // Replace with actual API call
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([
          { id: 1, name: 'Admin', description: 'Full system access', users_count: 3 },
          { id: 2, name: 'Manager', description: 'Management level access', users_count: 8 },
          { id: 3, name: 'User', description: 'Basic user access', users_count: 45 }
        ]);
      }, 500);
    });
  },

  async createRole(roleData) {
    // POST /serviceauth/roles
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ id: Date.now(), ...roleData, users_count: 0 });
      }, 500);
    });
  },

  async updateRole(id, roleData) {
    // PUT /serviceauth/roles/{id}
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ id, ...roleData });
      }, 500);
    });
  },

  async deleteRole(id) {
    // DELETE /serviceauth/roles/{id}
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ success: true });
      }, 500);
    });
  },

  async getRolePermissions(id) {
    // GET /serviceauth/roles/{id}/permissions
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([
          { id: 1, name: 'user.create', description: 'Create users' },
          { id: 2, name: 'user.read', description: 'View users' },
          { id: 3, name: 'user.update', description: 'Update users' },
          { id: 4, name: 'user.delete', description: 'Delete users' },
          { id: 5, name: 'role.manage', description: 'Manage roles' }
        ]);
      }, 500);
    });
  },

  async getApplicationRoles(appId) {
    // GET /serviceauth/roles/application/{app_id}
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([
          { id: 1, name: 'App Admin', application_id: appId },
          { id: 2, name: 'App User', application_id: appId }
        ]);
      }, 500);
    });
  }
};

const RoleManagement = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
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
      const rolesData = await roleService.getRoles();
      setRoles(rolesData);
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