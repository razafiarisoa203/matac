import React, { useState, useEffect } from 'react';
import { getRoles, deleteRole } from '../../services/api/userService';
import { toast } from 'react-toastify';
import RoleForm from './RoleForm';

const RolesList = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRole, setEditingRole] = useState(null);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const rolesData = await getRoles();
      setRoles(rolesData);
    } catch (error) {
      console.error('Error fetching roles:', error);
      toast.error('Erreur lors du chargement des rôles');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (roleId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce rôle ? Cette action est irréversible.')) {
      try {
        await deleteRole(roleId);
        toast.success('Rôle supprimé avec succès');
        fetchRoles();
      } catch (error) {
        console.error('Error deleting role:', error);
        toast.error(error.response?.data?.message || 'Erreur lors de la suppression du rôle');
      }
    }
  };

  const handleEdit = (role) => {
    setEditingRole(role);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingRole(null);
    fetchRoles();
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingRole(null);
  };

  if (showForm) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">
          {editingRole ? 'Modifier le rôle' : 'Créer un nouveau rôle'}
        </h2>
        <RoleForm 
          role={editingRole} 
          onSuccess={handleFormSuccess} 
          onCancel={handleCancel} 
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des Rôles</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Nouveau Rôle
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-4 text-center">Chargement des rôles...</div>
        ) : roles.length === 0 ? (
          <div className="p-8 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                vectorEffect="non-scaling-stroke"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun rôle</h3>
            <p className="mt-1 text-sm text-gray-500">Commencez par créer un nouveau rôle.</p>
            <div className="mt-6">
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Nouveau Rôle
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nom
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Slug
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {roles.map((role) => (
                  <tr key={role.role_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{role.role_name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded">
                        {role.role_slug}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 max-w-xs truncate">
                        {role.description || 'Aucune description'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(role)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDelete(role.role_id)}
                        className="text-red-600 hover:text-red-900"
                        disabled={role.role_slug === 'admin'}
                        title={role.role_slug === 'admin' ? 'Impossible de supprimer le rôle admin' : ''}
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default RolesList;
