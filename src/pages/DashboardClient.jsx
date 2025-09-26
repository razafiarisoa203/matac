// src/pages/AlignmentList.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from '../components/Sidebar';
import HeaderDashboard from '../components/HeaderDashboard';
import StatsCards from '../components/StatsCards';
import SearchBar from '../components/SearchBar';
import AlignmentTable from '../components/AlignmentTable';
import axios from "axios";

const DashboardClient = () => {
  const [alignments, setAlignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState('tous');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const navigate = useNavigate();

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

  // Fonction pour récupérer les alignements
  const fetchAlignments = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:3000/servicealignement/alignment");
      setAlignments(response.data);
      console.log("Tous les alignements récupérés :", response.data);
    } catch (err) {
      setError(err.message || "Erreur de récupération");
    } finally {
      setLoading(false);
    }
  };

  // Charger les alignements au montage du composant
  useEffect(() => {
    fetchAlignments();
  }, []);

  const getStatusBadge = (status) => {
    const statusConfig = {
      'en_cours': { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', text: 'En cours' },
      'approuve': { color: 'bg-green-100 text-green-800 border-green-200', text: 'Approuvé' },
      'rejete': { color: 'bg-red-100 text-red-800 border-red-200', text: 'Rejeté' },
      'en_attente': { color: 'bg-blue-100 text-blue-800 border-blue-200', text: 'En attente' }
    };
    const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800 border-gray-200', text: status || 'Inconnu' };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).replace(',', '');
  };

  // Filtrage des données
  const filteredAlignments = alignments.filter(alignment => {
    const matchesSearch =
      alignment.id_align?.toString().includes(searchTerm) ||
      alignment.qualite_demandeur?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alignment.terrain?.adresse?.toLowerCase().includes(searchTerm.toLowerCase());
    const normalizedStatus = alignment.status || 'en_attente';
    const matchesStatus = selectedStatus === 'tous' || normalizedStatus === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredAlignments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAlignments = filteredAlignments.slice(startIndex, startIndex + itemsPerPage);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} isMobile={isMobile} />

        {isMobile && isSidebarOpen && (
          <div
            onClick={toggleSidebar}
            className="fixed inset-0 bg-transparent z-30 lg:hidden"
            style={{ pointerEvents: 'all' }}
          ></div>
        )}

        <div className="flex-1 flex flex-col overflow-hidden">
          <HeaderDashboard toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} isMobile={isMobile} />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-500 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Chargement des alignements...</p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

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
          <StatsCards
            alignments={alignments}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            setCurrentPage={setCurrentPage}
          />

          <div className="space-y-8 bg-white -mt-10 pt-8 pb-12">
            <SearchBar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />

            <AlignmentTable
              alignments={alignments}
              filteredAlignments={filteredAlignments}
              paginatedAlignments={paginatedAlignments}
              error={error}
              searchTerm={searchTerm}
              selectedStatus={selectedStatus}
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              startIndex={startIndex}
              setCurrentPage={setCurrentPage}
              fetchAlignments={fetchAlignments}
              getStatusBadge={getStatusBadge}
              formatDate={formatDate}
              navigate={navigate}
            />

          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardClient;
