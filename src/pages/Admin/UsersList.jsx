import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Users, ArrowLeft, UserPlus, Loader2 } from 'lucide-react';
import { useSelector } from "react-redux";
import { getAllUsersByApplicationRole } from '../../services/api/userService';

const MATAC_APP_ID = import.meta.env.VITE_APP_ID || '13635';

const UsersList = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  useEffect(()=>{
    getAllUsersByApplicationRole()
    .then((res)=>{
      setUsers(res)
      console.log(res)
    })
    .catch((err)=>{
      setError(err.message)
    })
  },[])

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

  // Gestion des erreurs
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
              <button
                onClick={() => navigate('/admin/users/new')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <UserPlus className="-ml-1 mr-2 h-4 w-4" />
                Nouvel utilisateur
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
              {users.map((user) => {
                return (
                  <li key={user.id} className="hover:bg-gray-50">
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <Users className="h-5 w-5 text-blue-600" />
                            <img src={"https://gateway.tsirylab.com/serviceupload/file/preview/hello"+(user.citoyen.citizen_photo.split("hello")[1]).replace("/","%2F")} className='h-10 w-10 rounded-full' alt="" />
                          </div>
                          <div className="ml-4 min-w-0">
                            <p className="text-sm font-medium text-blue-600 truncate">
                              {user.user.user_email}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {user.email}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              Créé le: {new Date(user.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 sm:mt-0 sm:ml-4 w-full sm:w-72">
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                            <div className="flex-1 min-w-0">
                            <select
                            className="block w-full pl-3 pr-10 py-2 text-sm border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                            value={user.role_id || ''}
                            onChange={(e) => setUser({ ...user, role_id: e.target.value })}
                          >
                            <option value="">Sélectionner un rôle</option>
                            <option value="1">Admin</option>
                            <option value="2">Commune</option>
                            <option value="3">Client</option>
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
