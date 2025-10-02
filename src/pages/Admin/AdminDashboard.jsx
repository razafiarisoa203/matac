import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Shield, Settings, ArrowLeft, UserPlus, Key } from 'lucide-react';
import UsersList from './UsersList';
import RolesList from '../../components/Roles/RolesList';

// Bouton personnalisé avec Tailwind
const Button = ({ children, onClick, variant = 'default', className = '', ...props }) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  
  const variants = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 py-2 px-4',
    ghost: 'hover:bg-accent hover:text-accent-foreground h-10 py-2 px-4',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('users');
  const [isLoading] = useState(false);
  const [error] = useState(null);

  // Garder les composants montés pour éviter les remontages
  const usersListComponent = useMemo(() => <UsersList />, []);
  const rolesListComponent = useMemo(() => <RolesList />, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement en cours...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Button 
              variant="ghost"
              onClick={() => navigate(-1)} 
              className="mr-4 text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            Administration
          </h1>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => navigate('/admin/settings')}
            >
              <Settings className="h-5 w-5 mr-2" />
              Paramètres
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="w-full">
            <div className="flex justify-between items-center mb-6">
              <div className="flex space-x-2 border-b border-gray-200 w-full">
                <button
                  onClick={() => setActiveTab('users')}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'users' 
                    ? 'border-b-2 border-blue-500 text-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <Users className="h-4 w-4" />
                  Utilisateurs
                </button>
                <button
                  onClick={() => setActiveTab('roles')}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'roles' 
                    ? 'border-b-2 border-blue-500 text-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <Shield className="h-4 w-4" />
                  Rôles
                </button>
                <button
                  onClick={() => setActiveTab('permissions')}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'permissions' 
                    ? 'border-b-2 border-blue-500 text-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <Key className="h-4 w-4" />
                  Permissions
                </button>
              </div>
              
              <div className="ml-4 flex-shrink-0">
                {activeTab === 'users' && (
                  <Button onClick={() => navigate('/admin/users/new')}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Nouvel utilisateur
                  </Button>
                )}
                
                {activeTab === 'roles' && (
                  <Button onClick={() => navigate('/admin/roles/new')}>
                    <Shield className="h-4 w-4 mr-2" />
                    Nouveau rôle
                  </Button>
                )}
              </div>
            </div>

            {/* Utiliser display: none au lieu de conditional rendering */}
            <div style={{ display: activeTab === 'users' ? 'block' : 'none' }}>
              <div className="bg-white shadow rounded-lg p-6">
                {usersListComponent}
              </div>
            </div>
            
            <div style={{ display: activeTab === 'roles' ? 'block' : 'none' }}>
              <div className="bg-white shadow rounded-lg p-6">
                {rolesListComponent}
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
    </div>
  );
};

export default AdminDashboard;