import {
  FileText,
  User as UserIcon,
  Settings,
  TrendingUp,
  Building2,
  Globe,
  AlignJustify,
  LogOut,
} from 'lucide-react';
import { LuLayoutDashboard, LuMapPinHouse } from "react-icons/lu";
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { logout as ssoLogout } from '../utils/logout';


const Sidebar = ({ isSidebarOpen, toggleSidebar, isMobile }) => {
  const location = useLocation();

  const menuItems = [
    {
      title: 'Mes actions',
      icon: <TrendingUp className="w-5 h-5" />,
      path: '/dashboard',
    },
    {
      title: 'Alignement',
      icon: <AlignJustify className="w-5 h-5" />,
      path: '/alignement-list',
    },
    {
      title: 'Permis de construire',
      icon: <Building2 className="w-5 h-5" />,
      path: '/permis-list',
    },
    {
      title: "Prescription d'urbanisme",
      icon: <LuMapPinHouse className="w-5 h-5" />,
      path: '/prescription-urbanisme',
    },
    {
      title: 'Permis de remblai',
      icon: <Globe className="w-5 h-5" />,
      path: '/permis-remblai',
    },
  ];

  const handleLogout = async () => {
    try {
      await ssoLogout();
    } catch (error) {
      console.error('Erreur de déconnexion :', error);
    }
  };
  return (
    <div
      className={`
        fixed left-0 top-22 h-[calc(96vh-4rem)] bg-white dark:bg-gray-800 shadow-lg flex flex-col transition-all duration-300 z-40 w-64 border-r border-gray-200 dark:border-gray-700 rounded-tr-xl rounded-br-lg
        ${isMobile ? (isSidebarOpen ? 'translate-x-0' : '-translate-x-full') : ''}
      `}
    >
      {/* Header du sidebar */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
            <LuLayoutDashboard className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">MATAC</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Tableau de bord</p>
          </div>
        </div>
      </div>

      {/* Navigation - contenu scrollable */}
      <div className="flex-1 overflow-y-auto">
        <nav className="p-2">
          <ul className="space-y-1">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.path}
                  onClick={() => isMobile && toggleSidebar()}
                  className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 border-l-4 ${
                    location.pathname === item.path
                      ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-500 shadow-sm'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border-transparent hover:border-gray-300'
                  }`}
                >
                  <span className="flex-shrink-0 mr-3">{item.icon}</span>
                  <span className="font-medium text-sm">{item.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Footer - bouton déconnexion toujours visible */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <LogOut className="w-4 h-4 mr-2" />
          <span className="font-medium">Déconnexion</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
