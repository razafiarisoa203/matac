import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  MapPin, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  User,
  Home,
  Building,
  CheckSquare,
  Clock,
  AlertTriangle,
  FileCheck,
  LogOut
} from 'lucide-react';

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
    <div className={`h-screen bg-gray-800 text-white flex flex-col transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <div className="p-4 flex items-center justify-between border-b border-gray-700">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <Building className="w-8 h-8 text-lime-400" />
            <span className="text-xl font-bold">MATAC</span>
          </div>
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1  -full hover:bg-gray-700"
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5 text-gray-300" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-gray-300" />
          )}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav>
          <ul className="space-y-1 px-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-3  -lg transition-colors ${
                    location.pathname === item.path
                      ? 'bg-lime-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  {!isCollapsed && (
                    <>
                      <span className="ml-3">{item.title}</span>
                      {item.count && (
                        <span className="ml-auto bg-lime-500 text-white text-xs font-medium px-2 py-0.5  -full">
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

      <div className="p-4 border-t border-gray-700">
        <Link
          to="/logout"
          className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700  -lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          {!isCollapsed && <span className="ml-3">Déconnexion</span>}
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
