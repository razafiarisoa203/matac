import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import HeaderDashboard from '../components/HeaderDashboard';
import { ChevronRight } from 'lucide-react';
import { Link } from "react-router-dom";
import Carte from '../components/cartographie/carte';

const PrescriptionUrbanisme = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  // Gestion du responsive (sidebar)
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setIsSidebarOpen(prev => !prev);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 flex">
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} isMobile={isMobile} />

      {isMobile && isSidebarOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-transparent z-30 lg:hidden"
          style={{ pointerEvents: 'all' }}
        ></div>
      )}

      <div className="lg:ml-65 flex-1 flex flex-col overflow-hidden">
        <HeaderDashboard toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} isMobile={isMobile} />

        <main className="flex-1 overflow-y-auto p-0 mt-25">
          {/* Header avec breadcrumb */}
          <div className="bg-green-50 p-6 mb-8 -mt-6">
            <nav className="flex items-center text-sm text-gray-100 mb-6" aria-label="Breadcrumb">
              <Link to="/" className="text-black">Accueil</Link>
              <ChevronRight className="w-4 h-4 mx-2 text-black" />
              <Link to="/dashboard" className="text-black">Dashboard</Link>
              <ChevronRight className="w-4 h-4 mx-2 text-black" />
              <span className="text-black">Prescription d'urbanisme</span>
            </nav>

            {/* Titre */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 ml-4 mr-4 lg:ml-14 lg:mr-16">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Prescription d'Urbanisme</h1>
                <p className="text-gray-600 mt-1">
                  Gestion des prescriptions d'urbanisme
                </p>
              </div>
            </div>

            {/* Contenu principal */}
            <div className="bg-white rounded-lg shadow-sm p-6 ml-4 mr-4 lg:ml-14 lg:mr-16" style={{ height: 'calc(100vh - 200px)' }}>
              <Carte/>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PrescriptionUrbanisme;