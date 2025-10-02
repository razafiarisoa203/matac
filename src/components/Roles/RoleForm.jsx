import React, { useState, useEffect } from 'react';
import { createRole, updateRole, getRolePermissions } from '../../services/api/userService';
import { toast } from 'react-toastify';

const RoleForm = ({ role = null, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    role_name: '',
    role_slug: '',
    description: ''
  });
  const [permissions, setPermissions] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (role) {
      // If editing an existing role, populate the form
      setFormData({
        role_name: role.role_name || '',
        role_slug: role.role_slug || '',
        description: role.description || ''
      });
      
      // Load role permissions if editing
      loadRolePermissions(role.role_id);
    }
  }, [role]);

  const loadRolePermissions = async (roleId) => {
    try {
      const rolePermissions = await getRolePermissions(roleId);
      setSelectedPermissions(rolePermissions.map(p => p.permission_id));
    } catch (error) {
      console.error('Error loading role permissions:', error);
      toast.error('Erreur lors du chargement des permissions du rôle');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Auto-generate slug from role name
      ...(name === 'role_name' && {
        role_slug: value.toLowerCase().replace(/\s+/g, '-')
      })
    }));
  };

  const handlePermissionChange = (permissionId) => {
    setSelectedPermissions(prev =>
      prev.includes(permissionId)
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const roleData = {
        ...formData,
        permission_ids: selectedPermissions
      };

      if (role) {
        // Update existing role
        await updateRole(role.role_id, roleData);
        toast.success('Rôle mis à jour avec succès');
      } else {
        // Create new role
        await createRole(roleData);
        toast.success('Rôle créé avec succès');
      }
      
      onSuccess();
    } catch (error) {
      console.error('Error saving role:', error);
      toast.error(error.response?.data?.message || 'Erreur lors de la sauvegarde du rôle');
    } finally {
      setLoading(false);
    }
  };

  // Mock permissions - replace with actual permissions from your API
  const mockPermissions = [
    { permission_id: 1, name: 'user_create', description: 'Créer des utilisateurs' },
    { permission_id: 2, name: 'user_read', description: 'Voir les utilisateurs' },
    { permission_id: 3, name: 'user_update', description: 'Modifier les utilisateurs' },
    { permission_id: 4, name: 'user_delete', description: 'Supprimer des utilisateurs' },
    { permission_id: 5, name: 'role_manage', description: 'Gérer les rôles' },
  ];

  // Load permissions (in a real app, this would be an API call)
  useEffect(() => {
    setPermissions(mockPermissions);
  }, []);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              {role ? 'Modifier le rôle' : 'Nouveau rôle'}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {role 
                ? 'Mettez à jour les détails du rôle.'
                : 'Renseignez les informations pour créer un nouveau rôle.'}
            </p>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6 sm:col-span-4">
                <label htmlFor="role_name" className="block text-sm font-medium text-gray-700">
                  Nom du rôle *
                </label>
                <input
                  type="text"
                  name="role_name"
                  id="role_name"
                  required
                  value={formData.role_name}
                  onChange={handleChange}
                  className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div className="col-span-6 sm:col-span-4">
                <label htmlFor="role_slug" className="block text-sm font-medium text-gray-700">
                  Slug du rôle *
                </label>
                <input
                  type="text"
                  name="role_slug"
                  id="role_slug"
                  required
                  value={formData.role_slug}
                  onChange={handleChange}
                  className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-gray-100"
                  readOnly={!!role}
                />
                <p className="mt-2 text-sm text-gray-500">
                  Le slug est utilisé pour identifier le rôle dans le système. Il est généré automatiquement à partir du nom.
                </p>
              </div>

              <div className="col-span-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
                  placeholder="Décrivez le rôle et ses permissions"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Permissions</h3>
            <p className="mt-1 text-sm text-gray-500">
              Sélectionnez les permissions accordées à ce rôle.
            </p>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <div className="space-y-4">
              {permissions.map((permission) => (
                <div key={permission.permission_id} className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id={`permission-${permission.permission_id}`}
                      name="permissions"
                      type="checkbox"
                      checked={selectedPermissions.includes(permission.permission_id)}
                      onChange={() => handlePermissionChange(permission.permission_id)}
                      className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor={`permission-${permission.permission_id}`} className="font-medium text-gray-700">
                      {permission.name}
                    </label>
                    <p className="text-gray-500">{permission.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
        >
          {loading ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>
    </form>
  );
};

export default RoleForm;
