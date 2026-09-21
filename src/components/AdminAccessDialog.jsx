import React, { useEffect, useState } from 'react';
import { authService } from '../services/api/authService';
import { useNavigate } from 'react-router-dom';
import { roleService } from '../services/api/roleService';

const APP_ID = import.meta.env.VITE_APP_ID || 'matac-frontend';

const AdminAccessDialog = ({ onClose, token, userData }) => {
  const navigate = useNavigate();
  const [userRoles, setUserRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [shouldShow, setShouldShow] = useState(true);

  useEffect(() => {
    const fetchUserRoles = async () => {
      try {
        console.log('AdminAccessDialog - Récupération des rôles avec token:', token);
        console.log('AdminAccessDialog - UserData reçu:', userData);
        
        // Utiliser d'abord les rôles de userData si disponibles
        if (userData?.roles && Array.isArray(userData.roles)) {
          console.log('AdminAccessDialog - Utilisation des rôles de userData:', userData.roles);
          setUserRoles(userData.roles);
          setIsLoading(false);
          return;
        }
        
        // Sinon, récupérer via l'API
        if (token) {
          console.log('AdminAccessDialog - Récupération des rôles via API');
          const roles = await roleService.getUserRolesForApp(APP_ID, token);
          console.log('AdminAccessDialog - Rôles récupérés via API:', roles);
          setUserRoles(roles);
        }
      } catch (error) {
        console.error('AdminAccessDialog - Erreur lors de la récupération des rôles:', error);
        // En cas d'erreur, utiliser les rôles de userData si disponibles
        if (userData?.roles) {
          setUserRoles(userData.roles);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserRoles();
  }, [token, userData]);

  const handleAdminAccess = () => {
    console.log('AdminAccessDialog - Redirection vers admin dashboard');
    // Sauvegarder l'état admin avant la redirection
    localStorage.setItem('isAdminView', 'true');
    // Rediriger vers une route admin temporaire pour les tests
    // À remplacer par l'URL réelle de l'admin plus tard
    navigate('/admin-dashboard', { 
      state: { token },
      replace: true 
    });
    onClose();
  };

  const handleCommuneAccess = () => {
    const token = authService.getToken();
    if (!token) {
      alert("Aucun token trouvé. Veuillez vous reconnecter.");
      return;
    }

    const projectBUrl = "https://matac-commune.tsirylab.com/";
    window.open(`${projectBUrl}/auth?token=${token}`, "_blank");
  };

  const communeAuthorizedRoles = ["Service-technique", "Maire", "Chef-Service-technique"];

  const canAccessCommune = React.useMemo(() => {
    if (!Array.isArray(userRoles)) return false;

    return userRoles.some((role) => {
      const roleValue = role?.role_slug || role?.role_name || role;
      return communeAuthorizedRoles.some((allowedRole) =>
        String(roleValue).trim().toLowerCase() === allowedRole.toLowerCase()
      );
    });
  }, [userRoles]);

  const handleContinueAsClient = () => {
    console.log('AdminAccessDialog - Continuation en tant que client');
    if (authService.stayAsClient) {
      authService.stayAsClient();
    }
    // Rediriger vers le tableau de bord client
    navigate('/dashboard');
    onClose();
  };

  const hasAdminRole = React.useMemo(() => {
    const isAdmin = Array.isArray(userRoles) && userRoles.some(role => {
      const roleValue = role.role_slug || role.role_name || role;
      const result = ['Admin', 'Client', 'Service-technique', 'Maire', 'Chef-Service-technique', 'Super-Admin']
        .some(adminRole => String(roleValue).toLowerCase() === adminRole.toLowerCase());
      return result;
    });
    
    console.log('AdminAccessDialog - hasAdminRole:', isAdmin, 'avec rôles:', userRoles);
    return isAdmin;
  }, [userRoles]);
  
  // Fonction pour formater l'affichage des rôles
  const formatRoles = (roles) => {
    if (!Array.isArray(roles)) return '';
    return roles.map(r => r.role_name || r.role_slug || r).join(', ');
  };

  // Ne pas rediriger automatiquement - laisser l'utilisateur choisir
  useEffect(() => {
    if (!isLoading && !hasAdminRole) {
      console.log('AdminAccessDialog - Aucun rôle admin trouvé, fermeture du dialog');
      // Si pas de rôles admin après chargement, fermer le dialog et rediriger
      setShouldShow(false);
      setTimeout(() => {
        navigate('/dashboard');
        onClose();
      }, 100);
    }
  }, [isLoading, hasAdminRole]);

  if (!shouldShow) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <div className="flex items-center justify-center mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
          <p className="text-center">Chargement des autorisations...</p>
          <p className="text-sm text-gray-500 mt-2 text-center">Vérification de vos droits d'accès</p>
        </div>
      </div>
    );
  }

  if (!hasAdminRole) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-black flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full shadow-xl">
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0">
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-bold text-gray-900">Accès administrateur détecté</h3>
          </div>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-700">
            Vous avez les privilèges d'administration pour cette application.
          </p>
          {userRoles.length > 0 && (
            <p className="text-sm text-gray-500 mt-2">
              <strong>Rôles :</strong> {formatRoles(userRoles)}
            </p>
          )}
          <p className="text-gray-700 mt-3">
            Souhaitez-vous accéder à l'interface d'administration ou continuer avec l'interface utilisateur ?
          </p>
        </div>
        
        <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3 justify-end">
          <button
            onClick={handleContinueAsClient}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Interface utilisateur
          </button>
          <button
            onClick={handleAdminAccess}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Interface d'administration
          </button>
          {canAccessCommune && (
            <button
              onClick={handleCommuneAccess}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Interface commune
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAccessDialog;