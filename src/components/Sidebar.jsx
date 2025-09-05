import {
  AlertTriangle,
  Building,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileCheck,
  FileText,
  LayoutDashboard,
  LogOut,
  Settings,
  User
} from 'lucide-react';
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const menuItems = [
    { 
      title: 'Mes actions', 
      icon: <LayoutDashboard className="w-5 h-5" />, 
      path: '/dashboard' 
    },
    { 
      title: 'Tous les alignements', 
      icon: <FileText className="w-5 h-5" />, 
      path: '/alignements' 
    },
    { 
      title: 'Mes dossiers', 
      icon: <FileCheck className="w-5 h-5" />, 
      path: '/dossiers' 
    },
    { 
      title: 'En attente', 
      icon: <Clock className="w-5 h-5" />, 
      path: '/en-attente',
      count: 5
    },
    { 
      title: 'Problèmes', 
      icon: <AlertTriangle className="w-5 h-5" />, 
      path: '/problemes',
      count: 2
    },
    { 
      title: 'Mon compte', 
      icon: <User className="w-5 h-5" />, 
      path: '/mon-compte' 
    },
    { 
      title: 'Administration', 
      icon: <Settings className="w-5 h-5" />, 
      path: '/admin',
      adminOnly: true
    },
  ];

  return (
    <div className={`fixed left-0 top-0 h-full bg-gray-800 text-white flex flex-col transition-all duration-300 z-50 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      {/* Header avec logo et bouton collapse */}
      <div className="p-4 flex items-center justify-between border-b border-gray-700 flex-shrink-0">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <Building className="w-8 h-8 text-lime-400" />
            <span className="text-xl font-bold">MATAC</span>
          </div>
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded-full hover:bg-gray-700 transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5 text-gray-300" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-gray-300" />
          )}
        </button>
      </div>

      {/* Navigation principale - scrollable */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav>
          <ul className="space-y-1 px-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                    location.pathname === item.path
                      ? 'bg-lime-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  {!isCollapsed && (
                    <>
                      <span className="ml-3 truncate">{item.title}</span>
                      {item.count && (
                        <span className="ml-auto bg-lime-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                          {item.count}
                        </span>
                      )}
                    </>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Footer avec déconnexion */}
      <div className="p-4 border-t border-gray-700 flex-shrink-0">
        <Link
          to="/logout"
          className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors w-full"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span className="ml-3">Déconnexion</span>}
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;