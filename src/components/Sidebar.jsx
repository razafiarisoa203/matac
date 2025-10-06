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
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Sidebar = ({ isSidebarOpen, toggleSidebar, isMobile }) => {
  const location = useLocation();
  const navigate = useNavigate();

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
      title: 'Permis de remblai',
      icon: <Globe className="w-5 h-5" />,
      path: '/permis-remblai',
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div
      className={`
        fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white shadow-md rounded-tr-3xl flex flex-col justify-between transition-all duration-300 z-40 w-64 border-r border-gray-200
        ${isMobile ? (isSidebarOpen ? 'translate-x-0' : '-translate-x-full') : ''}
      `}
    >
      {/* Contenu principal (avatar + menu) */}
      <div className="flex flex-col flex-1 overflow-y-auto">
        {/* Header avec avatar et icônes */}
        <div className="p-4 flex flex-col items-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold text-gray-700">
            TA
          </div>
          <div className="flex space-x-3">
            <button className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-green-600 hover:bg-gray-300 transition-colors">
              <UserIcon className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-green-600 hover:bg-gray-300 transition-colors">
              <Settings className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-green-600 hover:bg-gray-300 transition-colors">
              <FileText className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-2">
          <ul className="space-y-1">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.path}
                  onClick={() => isMobile && toggleSidebar()}
                  className={`flex items-center px-4 py-3 transition-colors border-l-4 ${
                    location.pathname === item.path
                      ? 'bg-green-400 text-white border-green-400'
                      : 'text-gray-700 hover:bg-green-100 border-transparent'
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

      {/* Footer - bouton déconnexion */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          <LogOut className="w-4 h-4 mr-2" />
          <span>Déconnexion</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
