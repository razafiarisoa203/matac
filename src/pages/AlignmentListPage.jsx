// src/pages/AlignmentListPage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from '../components/Sidebar';
import HeaderDashboard from '../components/HeaderDashboard';
import SearchBar from '../components/SearchBar';
import { alignmentService } from '../services/api/alignmentService';
import { Eye, FileText, Download, AlertCircle, MapPin, ChevronRight, Plus } from 'lucide-react';
import { Link } from "react-router-dom";


const AlignmentListPage = () => {
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

  // Charger les alignements au montage du composant
  useEffect(() => {
    fetchAlignments();
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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  // Filtrage des données
  const filteredAlignments = alignments.filter(alignment => {
    const matchesSearch =
      alignment.id_align?.toString().includes(searchTerm) ||
      alignment.nom_demandaire?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alignment.cin_passeport_demandaire?.includes(searchTerm) ||
      alignment.terrain?.adresse?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const normalizedStatus = alignment.status || 'en_attente';
    const matchesStatus = selectedStatus === 'tous' || normalizedStatus === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  const itemsPerPage = 8;
  const totalPages = Math.ceil(filteredAlignments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAlignments = filteredAlignments.slice(startIndex, startIndex + itemsPerPage);

  // Fonction pour générer le PDF (à implémenter)
  const generatePDF = (alignment) => {
    console.log("Génération du PDF pour l'alignement:", alignment.id_align);
    // Implémentation de la génération PDF à faire
    alert(`Génération du PDF pour l'alignement #${alignment.id_align}`);
  };

  // Fonction pour voir les détails
  const viewDetails = (alignmentId) => {
    navigate(`/alignment-details/${alignmentId}`);
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
          {/* Header avec breadcrumb */}
          <div className="bg-green-50 p-6 mb-8 -mt-6">
            <nav className="flex items-center text-sm text-gray-100 mb-6" aria-label="Breadcrumb">
              <Link to="/" className="text-black">Accueil</Link>
              <ChevronRight className="w-4 h-4 mx-2 text-black" />
              <Link to="/dashboard" className="text-black">Dashboard</Link>
              <ChevronRight className="w-4 h-4 mx-2 text-black" />
              <span className="text-black">Liste des alignements</span>
            </nav>

            {/* Titre et statistiques */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 ml-4 mr-4 lg:ml-14 lg:mr-16">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Liste des Alignements</h1>
                <p className="text-gray-600 mt-1">
                  {filteredAlignments.length} alignement(s) trouvé(s)
                  {searchTerm && ` pour "${searchTerm}"`}
                </p>
              </div>
              
              <div className="flex items-center space-x-4 mt-4 lg:mt-0">
                <div className="bg-white shadow-sm p-3 rounded-lg flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-lime-600" />
                  <span className="text-sm font-medium text-gray-700">Total: {alignments.length}</span>
                </div>
              </div>
            </div>

            {/* Filtres */}
            <div className="flex flex-wrap gap-4 mb-6 ml-4 mr-4 lg:ml-14 lg:mr-16">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">Filtrer par statut:</span>
                <select 
                  value={selectedStatus} 
                  onChange={(e) => {
                    setSelectedStatus(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                >
                  <option value="tous">Tous les statuts</option>
                  <option value="en_attente">En attente</option>
                  <option value="en_cours">En cours</option>
                  <option value="approuve">Approuvé</option>
                  <option value="rejete">Rejeté</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-8 bg-white -mt-10 pt-8 pb-12">
            {/* Barre de recherche */}
            <div className="ml-4 mr-4 lg:ml-20 lg:mr-20">
              <SearchBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                placeholder="Rechercher par n° dossier, nom, CIN ou adresse..."
              />
            </div>
            {/*Bouton ajouter alignement*/}
            <div className="ml-4 mr-4 lg:ml-20 lg:mr-20">
              <button
                onClick={() => navigate('/alignement')}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium shadow-sm text-white bg-lime-600 hover:bg-lime-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500"
              >
                <Plus className="w-5 h-5 mr-2" />
                Ajouter un alignement
              </button>
            </div>
            {/* Tableau des alignements */}
            <div className="bg-white shadow-sm overflow-hidden ml-4 mr-4 lg:ml-20 lg:mr-20">
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error}</p>
                      <button
                        onClick={fetchAlignments}
                        className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium"
                      >
                        Réessayer
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {filteredAlignments.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900">Aucun alignement trouvé</h3>
                  <p className="mt-1 text-gray-500">
                    {searchTerm || selectedStatus !== 'tous'
                      ? "Aucun alignement ne correspond à vos critères de recherche."
                      : "Aucun alignement n'a été créé pour le moment."}
                  </p>
                  <div className="mt-6">
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedStatus('tous');
                      }}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium shadow-sm text-white bg-lime-600 hover:bg-lime-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500"
                    >
                      Réinitialiser les filtres
                    </button>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider lg:px-6">
                          N° Dossier
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider lg:px-6">
                          Demandeur
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider lg:px-6">
                          Adresse du terrain
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider lg:px-6">
                          Statut propriétaire
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider lg:px-6">
                          Qualité demandeur
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider lg:px-6">
                          Date de création
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider lg:px-6">
                          Statut
                        </th>
                        <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider lg:px-6">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {paginatedAlignments.map((alignment) => (
                        <tr key={alignment.id_align} className="hover:bg-gray-50">
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 lg:px-6">
                            #{alignment.id_align}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 lg:px-6">
                            <div>
                              <div className="font-medium">{alignment.nom_demandaire} {alignment.prenom_mandataire}</div>
                              <div className="text-gray-500 text-xs">{alignment.qualite_demandeur}</div>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-700 lg:px-6">
                            <div className="max-w-xs truncate">
                              {alignment.terrain?.adresse || alignment.adresse_demandaire || 'N/A'}
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-700 lg:px-6">
                            <div className="max-w-xs truncate">
                              {alignment.status_proprietaire || 'N/A'}
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-700 lg:px-6">
                            <div className="max-w-xs truncate">
                              {alignment.qualite_demandeur || 'N/A'}
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 lg:px-6">
                            {formatDate(alignment.created_at)}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 lg:px-6">
                            {getStatusBadge(alignment.status || 'en_attente')}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-right lg:px-6">
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => viewDetails(alignment.id_align)}
                                className="inline-flex items-center px-3 py-1.5 border border-lime-600 text-sm font-medium rounded-md text-lime-600 bg-white hover:bg-lime-50 hover:text-lime-700 transition-colors"
                                title="Voir détails"
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                Voir plus
                              </button>
                              <button
                                onClick={() => generatePDF(alignment)}
                                className="inline-flex items-center px-3 py-1.5 border border-red-600 text-sm font-medium rounded-md text-red-600 bg-white hover:bg-red-50 hover:text-red-700 transition-colors"
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
                    <div className="flex items-center justify-between mt-6 px-4 py-3 border-t border-gray-200">
                      <div className="text-sm text-gray-700">
                        Affichage de {startIndex + 1} à {Math.min(startIndex + itemsPerPage, filteredAlignments.length)} sur {filteredAlignments.length} alignement(s)
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
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
                              className={`px-3 py-1 border rounded-md text-sm ${
                                currentPage === pageNum
                                  ? 'bg-lime-500 text-white border-lime-500'
                                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                        
                        <button
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                          className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
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

export default AlignmentListPage;