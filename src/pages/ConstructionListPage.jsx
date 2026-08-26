import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from '../components/Sidebar';
import HeaderDashboard from '../components/HeaderDashboard';
import SearchBar from '../components/SearchBar';
import { constructionService } from '../services/api/constructionSercvice';
import { Eye, FileText, Download, AlertCircle, Building, ChevronRight, Plus } from 'lucide-react';
import { Link } from "react-router-dom";

// Mapping des valeurs techniques (base de données) vers les libellés affichés
const STATUS_MAPPING = {
  'Reçu': 'Reçus',
  'En_cours_traitement': 'En cours de traitement',
  'En_attente_validation': 'En attente de validation',
  'En_attente_regularisation': 'En attente de régularisation',
  'Traite': 'Traité',
  'Rejete': 'Rejeté'
};

// Inverse mapping pour le filtrage (libellé → valeur technique)
const REVERSE_STATUS_MAPPING = Object.fromEntries(
  Object.entries(STATUS_MAPPING).map(([key, value]) => [value, key])
);

const ConstructionListPage = () => {
  const [constructions, setConstructions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState('tous');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const navigate = useNavigate();

  const userData = JSON.parse(localStorage.getItem('user'));
  const id_citizen = userData?.id_citizen;
  const idMandataire = id_citizen;

  // Responsive sidebar
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) setIsSidebarOpen(prev => !prev);
  };

  // Récupération des constructions
  const fetchConstructions = async () => {
    try {
      setLoading(true);
      const constructions = await constructionService.getConstructionMandataire(idMandataire);
      setConstructions(constructions);
      console.log("Constructions récupérées :", constructions);
    } catch (err) {
      console.error("Erreur:", err);
      setError("Impossible de charger les permis de construction.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConstructions();
  }, []);

  // Badge de statut (avec support dark mode)
  const getStatusBadge = (statusValue) => {
    const displayStatus = STATUS_MAPPING[statusValue] || statusValue;

    const statusConfig = {
      'Reçus': {
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-300 dark:border-yellow-700',
        text: 'Reçus'
      },
      'En cours de traitement': {
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-300 dark:border-yellow-700',
        text: 'En cours de traitement'
      },
      'En cours de traitement SRAT': {
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-300 dark:border-yellow-700',
        text: 'En cours de traitement SRAT'
      },
      'En attente de validation': {
        color: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-700',
        text: 'En attente de validation'
      },
      'En attente de régularisation': {
        color: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-700',
        text: 'En attente de régularisation'
      },
      'Traité': {
        color: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/40 dark:text-green-300 dark:border-green-700',
        text: 'Traité'
      },
      'Rejeté': {
        color: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/40 dark:text-red-300 dark:border-red-700',
        text: 'Rejeté'
      }
    };

    const config = statusConfig[displayStatus] || {
      color: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600',
      text: displayStatus || 'Inconnu'
    };

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
      day: '2-digit'
    });
  };

  // Filtrage des données
  const filteredConstructions = constructions.filter(construction => {
    const matchesSearch =
      construction.id_const?.toString().includes(searchTerm) ||
      construction.nomProprietaire?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      construction.cinProprietaire?.includes(searchTerm) ||
      construction.adresseProprietaire?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      construction.natureTravaux?.toLowerCase().includes(searchTerm.toLowerCase());

    const internalStatus = construction.statut_construction || 'en_attente_validation';

    if (selectedStatus === 'tous') return matchesSearch;

    const displayStatus = STATUS_MAPPING[internalStatus] || internalStatus;
    return matchesSearch && displayStatus === selectedStatus;
  });

  const itemsPerPage = 8;
  const totalPages = Math.ceil(filteredConstructions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedConstructions = filteredConstructions.slice(startIndex, startIndex + itemsPerPage);

  const generatePDF = (construction) => {
    console.log("Génération du PDF pour le permis:", construction.id_const);
    alert(`Génération du PDF pour le permis #${construction.id_const}`);
  };

  const viewDetails = (constructionId) => {
    navigate(`/permis-details/${constructionId}`);
  };

  // ====================== LOADING STATE ======================
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
        <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} isMobile={isMobile} />
        {isMobile && isSidebarOpen && (
          <div onClick={toggleSidebar} className="fixed inset-0 bg-black/40 z-30 lg:hidden" />
        )}
        <div className="flex-1 flex flex-col overflow-hidden">
          <HeaderDashboard toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} isMobile={isMobile} />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
                  <p className="mt-4 text-gray-600 dark:text-gray-400">
                    Chargement des permis de construction...
                  </p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // ====================== MAIN RENDER ======================
  return (
    <div className="min-h-screen bg-green-50 dark:bg-gray-900 flex">
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} isMobile={isMobile} />
      {isMobile && isSidebarOpen && (
        <div onClick={toggleSidebar} className="fixed inset-0 bg-black/40 z-30 lg:hidden" />
      )}

      <div className="lg:ml-65 flex-1 flex flex-col overflow-hidden">
        <HeaderDashboard toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} isMobile={isMobile} />

        <main className="flex-1 overflow-y-auto p-0 mt-25">
          {/* Header section */}
          <div className="bg-green-50 dark:bg-gray-900 p-6 mb-8 -mt-6">
            {/* Breadcrumb */}
            <nav className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-6" aria-label="Breadcrumb">
              <Link to="/" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">
                Accueil
              </Link>
              <ChevronRight className="w-4 h-4 mx-2 text-gray-400 dark:text-gray-500" />
              <Link to="/dashboard" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">
                Dashboard
              </Link>
              <ChevronRight className="w-4 h-4 mx-2 text-gray-400 dark:text-gray-500" />
              <span className="text-gray-900 dark:text-gray-200 font-medium">
                Liste des permis de construction
              </span>
            </nav>

            {/* Title + Total */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 ml-4 mr-4 lg:ml-14 lg:mr-16">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Liste des Permis de Construction
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {filteredConstructions.length} permis trouvé(s)
                  {searchTerm && ` pour "${searchTerm}"`}
                </p>
              </div>

              <div className="flex items-center space-x-4 mt-4 lg:mt-0">
                <div className="bg-white dark:bg-gray-800 shadow-sm dark:shadow-none border border-transparent dark:border-gray-700 p-3 rounded-lg flex items-center space-x-2">
                  <Building className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Total: {constructions.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Filtre statut */}
            <div className="flex flex-wrap gap-4 mb-6 ml-4 mr-4 lg:ml-14 lg:mr-16">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Filtrer par statut:
                </span>
                <select
                  value={selectedStatus}
                  onChange={(e) => {
                    setSelectedStatus(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm 
                             bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                             focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500
                             dark:focus:ring-green-400"
                >
                  <option value="tous">Tous les statuts</option>
                  {Object.values(STATUS_MAPPING).map(label => (
                    <option key={label} value={label}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Contenu principal */}
          <div className="space-y-8 bg-white dark:bg-gray-900 -mt-10 pt-8 pb-12">
            {/* SearchBar */}
            <div className="ml-4 mr-4 lg:ml-20 lg:mr-20">
              <SearchBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                placeholder="Rechercher par n° permis, nom propriétaire, CIN, adresse ou nature travaux..."
              />
            </div>

            {/* Bouton Nouveau permis */}
            <div className="ml-4 mr-4 lg:ml-20 lg:mr-20">
              <button
                onClick={() => navigate('/permis')}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium shadow-sm 
                           text-white bg-green-600 hover:bg-green-700 
                           dark:bg-green-600 dark:hover:bg-green-500
                           focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500
                           dark:focus:ring-offset-gray-900 transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                Nouveau permis de construction
              </button>
            </div>

            {/* Table container */}
            <div className="bg-white dark:bg-gray-800 shadow-sm dark:shadow-none border border-transparent dark:border-gray-700 overflow-hidden ml-4 mr-4 lg:ml-20 lg:mr-20 rounded-lg">
              {/* Erreur */}
              {error && (
                <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4 mb-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                      <button
                        onClick={fetchConstructions}
                        className="mt-2 text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium"
                      >
                        Réessayer
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Empty state */}
              {filteredConstructions.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                    Aucun permis trouvé
                  </h3>
                  <p className="mt-1 text-gray-500 dark:text-gray-400">
                    {searchTerm || selectedStatus !== 'tous'
                      ? "Aucun permis ne correspond à vos critères de recherche."
                      : "Aucun permis de construction n'a été créé pour le moment."}
                  </p>
                  <div className="mt-6">
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedStatus('tous');
                      }}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium shadow-sm 
                                 text-white bg-green-600 hover:bg-green-700 
                                 dark:bg-green-600 dark:hover:bg-green-500
                                 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500
                                 dark:focus:ring-offset-gray-800 transition-colors"
                    >
                      Réinitialiser les filtres
                    </button>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700/50">
                      <tr>
                        {[
                          'N° Permis',
                          'Propriétaire',
                          'CIN Propriétaire',
                          'Nature des travaux',
                          "Type d'affectation",
                          'Date de création',
                          'Statut',
                          'Actions'
                        ].map((header, idx) => (
                          <th
                            key={header}
                            scope="col"
                            className={`px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider lg:px-6 ${
                              idx === 7 ? 'text-right' : 'text-left'
                            }`}
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>

                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {paginatedConstructions.map((construction) => (
                        <tr
                          key={construction.id_const}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                        >
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white lg:px-6">
                            #{construction.id_const}
                          </td>

                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 lg:px-6">
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">
                                {construction.nomProprietaire}
                              </div>
                              <div className="text-gray-500 dark:text-gray-400 text-xs">
                                {construction.civiliteProprietaire}
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 lg:px-6">
                            {construction.cinProprietaire || 'N/A'}
                          </td>

                          <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300 lg:px-6">
                            <div className="max-w-xs">{construction.natureTravaux || 'N/A'}</div>
                          </td>

                          <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300 lg:px-6">
                            <div className="max-w-xs">{construction.typeAffectation || 'N/A'}</div>
                          </td>

                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 lg:px-6">
                            {formatDate(construction.created_at)}
                          </td>

                          <td className="px-4 py-4 whitespace-nowrap text-sm lg:px-6">
                            {getStatusBadge(construction.statut_construction || '')}
                          </td>

                          <td className="px-4 py-4 whitespace-nowrap text-right lg:px-6">
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => viewDetails(construction.id_const)}
                                className="inline-flex items-center px-3 py-1.5 border border-green-600 dark:border-green-500 
                                           text-sm font-medium rounded-md 
                                           text-green-600 dark:text-green-400 
                                           bg-white dark:bg-gray-800 
                                           hover:bg-green-50 dark:hover:bg-green-900/30 
                                           hover:text-green-700 dark:hover:text-green-300 
                                           transition-colors"
                                title="Voir détails"
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                Voir plus
                              </button>

                              <button
                                onClick={() => generatePDF(construction)}
                                className="inline-flex items-center px-3 py-1.5 border border-red-600 dark:border-red-500 
                                           text-sm font-medium rounded-md 
                                           text-red-600 dark:text-red-400 
                                           bg-white dark:bg-gray-800 
                                           hover:bg-red-50 dark:hover:bg-red-900/30 
                                           hover:text-red-700 dark:hover:text-red-300 
                                           transition-colors"
                                title="Télécharger PDF"
                              >
                                <Download className="w-4 h-4 mr-1" />
                                PDF
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-6 px-4 py-3 border-t border-gray-200 dark:border-gray-700">
                      <div className="text-sm text-gray-700 dark:text-gray-400">
                        Affichage de {startIndex + 1} à {Math.min(startIndex + itemsPerPage, filteredConstructions.length)} sur {filteredConstructions.length} permis
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm 
                                     text-gray-700 dark:text-gray-300
                                     disabled:opacity-50 disabled:cursor-not-allowed 
                                     hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          Précédent
                        </button>

                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }

                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`px-3 py-1 border rounded-md text-sm transition-colors ${
                                currentPage === pageNum
                                  ? 'bg-green-500 text-white border-green-500 dark:bg-green-600 dark:border-green-600'
                                  : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}

                        <button
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                          className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm 
                                     text-gray-700 dark:text-gray-300
                                     disabled:opacity-50 disabled:cursor-not-allowed 
                                     hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          Suivant
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ConstructionListPage;