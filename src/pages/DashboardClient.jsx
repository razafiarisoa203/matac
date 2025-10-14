// src/pages/AlignmentList.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from '../components/Sidebar';
import HeaderDashboard from '../components/HeaderDashboard';
import StatsCards from '../components/StatsCards';
import SearchBar from '../components/SearchBar';
import AlignmentTable from '../components/AlignmentTable';
import { alignmentService } from '../services/api/alignmentService';
import { constructionService } from '../services/api/constructionSercvice';

const DashboardClient = () => {
  const [alignments, setAlignments] = useState([]);
  const [constructions, setConstructions] = useState([]); // Nouvel état pour les constructions
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState('tous');
  const [selectedType, setSelectedType] = useState('tous'); // Nouveau filtre pour le type
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

  // Fonction pour récupérer les alignements par ID utilisateur connecter
  const userData = JSON.parse(localStorage.getItem('user'));
  const id_citizen = userData?.id_citizen;

  const mandataireId = id_citizen; // ou un ID si tu veux filtrer

  const fetchAlignments = async () => {
    try {
      setLoading(true);
      const data = await alignmentService.getAllAlignment(mandataireId);
      setAlignments(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Erreur de récupération des alignements");
      console.error("Erreur:", err);
    } finally {
      setLoading(false);
    }
  };
  // Fonction pour récupérer les construction
  const fetchConstructions = async () => {
    try {
      const response = await constructionService.getConstruction(mandataireId);
      setConstructions(response.data || response);
      console.log("Toutes les constructions récupérées :", response.data || response);
    } catch (err) {
      console.error("Erreur de récupération des constructions:", err);
      setError(prev => prev + " | Erreur constructions: " + err.message);
    }
  };

  // Charger les données au montage du composant
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchAlignments(), fetchConstructions()]);
      } catch (err) {
        setError("Erreur lors du chargement des données");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Fonction pour obtenir le badge de statut
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

  // Fonction pour obtenir le tag de type
  const getTypeTag = (type) => {
    const typeConfig = {
      'alignment': { color: 'bg-purple-100 text-purple-800 border-purple-200', text: 'Alignement' },
      'construction': { color: 'bg-indigo-100 text-indigo-800 border-indigo-200', text: 'Construction' }
    };
    const config = typeConfig[type] || { color: 'bg-gray-100 text-gray-800 border-gray-200', text: type || 'Inconnu' };
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

  // Combiner et formater les données pour l'affichage
  const getAllRequests = () => {
    const alignmentRequests = alignments.map(alignment => ({
      id: alignment.id_align,
      reference: `ALG-${alignment.id_align}`,
      type: 'alignment',
      nom: alignment.qualite_demandeur || 'N/A',
      adresse: alignment.terrain?.adresse || 'N/A',
      date: alignment.created_at,
      status: alignment.status || 'Reçus',
      data: alignment
    }));

    const constructionRequests = constructions.map(construction => ({
      id: construction.id_const,
      reference: `CONST-${construction.id_const}`,
      type: 'construction',
      nom: construction.nomProprietaire || 'N/A',
      adresse: construction.adresseProprietaire || 'N/A',
      date: construction.created_at,
      status: construction.status || 'en_attente', // Ajouter un champ status dans votre entité Construction si nécessaire
      data: construction
    }));

    return [...alignmentRequests, ...constructionRequests].sort((a, b) =>
      new Date(b.date) - new Date(a.date)
    );
  };

  // Filtrage des données
  const allRequests = getAllRequests();
  const filteredRequests = allRequests.filter(request => {
    const matchesSearch =
      request.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.adresse?.toLowerCase().includes(searchTerm.toLowerCase());

    const normalizedStatus = request.status || 'en_attente';
    const matchesStatus = selectedStatus === 'tous' || normalizedStatus === selectedStatus;

    const matchesType = selectedType === 'tous' || request.type === selectedType;

    return matchesSearch && matchesStatus && matchesType;
  });

  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRequests = filteredRequests.slice(startIndex, startIndex + itemsPerPage);

  // Mise à jour des statistiques pour inclure les deux types
  const statsData = {
    alignments: alignments,
    constructions: constructions,
    selectedStatus: selectedStatus,
    setSelectedStatus: setSelectedStatus,
    selectedType: selectedType,
    setSelectedType: setSelectedType,
    setCurrentPage: setCurrentPage
  };

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
                  <p className="mt-4 text-gray-600">Chargement des demandes...</p>
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
            {...statsData}
          />

          <div className="space-y-8 bg-white -mt-10 pt-8 pb-12">
            <SearchBar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />

            <AlignmentTable
              requests={allRequests}
              filteredRequests={filteredRequests}
              paginatedRequests={paginatedRequests}
              error={error}
              searchTerm={searchTerm}
              selectedStatus={selectedStatus}
              selectedType={selectedType}
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              startIndex={startIndex}
              setCurrentPage={setCurrentPage}
              fetchAlignments={fetchAlignments}
              fetchConstructions={fetchConstructions}
              getStatusBadge={getStatusBadge}
              getTypeTag={getTypeTag}
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