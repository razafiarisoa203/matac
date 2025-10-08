import React, { useState, useEffect } from 'react';
import { roleService } from '../../services/api/roleService';
import { toast } from 'react-toastify';

const RoleForm = ({ role = null, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    role_name: '',
    role_slug: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (role) {
      setFormData({
        role_name: role.role_name || '',
        role_slug: role.role_slug || ''
      });
    }
  }, [role]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'role_name' && {
        role_slug: value.toLowerCase().replace(/\s+/g, '-')
      })
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const roleData = { ...formData };
      if (role) {
        // Update
        const updated = await roleService.updateRole(role.role_id, roleData);
        toast.success('Rôle mis à jour avec succès');
        onSuccess && onSuccess({ type: 'update', role: updated?.data || updated });
      } else {
        // Create
        const created = await roleService.createRole(roleData);
        toast.success('Rôle créé avec succès');
        onSuccess && onSuccess({ type: 'create', role: created?.data || created });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de la sauvegarde du rôle');
    } finally {
      setLoading(false);
    }
  };

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
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end space-x-3">
        <button type="button" onClick={onCancel}
          className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
          Annuler
        </button>
        <button type="submit" disabled={loading}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50">
          {loading ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>
    </form>
  );
};

export default RoleForm;