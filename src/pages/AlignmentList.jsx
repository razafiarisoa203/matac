import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Search, 
  Plus, 
  MapPin, 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  Filter,
  List,
  MoreVertical,
  CheckCircle2,
  Clock,
  AlertCircle,
  User,
  Download,
  Printer,
  FileText
} from "lucide-react";
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import NavigationBar from '../components/NavigationBar';

const API_BASE_ALIGNMENT = import.meta.env.VITE_API_SERVICEALIGNMENT || 'http://localhost:3000';

const AlignmentList = () => {
  const [alignments, setAlignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState('tous');
  const navigate = useNavigate();

  useEffect(() => {
    fetchAlignments();
  }, []);

  const fetchAlignments = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_ALIGNMENT}/servicealignement/alignment`);
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des alignements');
      }
      
      const data = await response.json();
      setAlignments(data);
    } catch (err) {
      setError(err.message);
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (alignmentId) => {
    navigate(`/alignment-details/${alignmentId}`);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'en_cours': { 
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
        text: 'En cours'
      },
      'approuve': { 
        color: 'bg-green-100 text-green-800 border-green-200', 
        text: 'Approuvé'
      },
      'rejete': { 
        color: 'bg-red-100 text-red-800 border-red-200', 
        text: 'Rejeté'
      },
      'en_attente': { 
        color: 'bg-blue-100 text-blue-800 border-blue-200', 
        text: 'En attente'
      }
    };
    
    const config = statusConfig[status] || { 
      color: 'bg-gray-100 text-gray-800 border-gray-200', 
      text: status || 'Inconnu'
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5  -full text-xs font-medium border ${config.color}`}>
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

  const filteredAlignments = alignments.filter(alignment => {
    const matchesSearch = 
      alignment.id_align?.toString().includes(searchTerm) ||
      alignment.qualite_demandeur?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alignment.terrain?.adresse?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === 'tous' || alignment.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const itemsPerPage = 4;
  const totalPages = Math.ceil(filteredAlignments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAlignments = filteredAlignments.slice(startIndex, startIndex + itemsPerPage);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* <Header />
          <NavigationBar /> */}
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin  -full h-12 w-12 border-b-2 border-lime-500 mx-auto"></div>
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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* <Header />
        <NavigationBar /> */}
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes alignements</h1>
                  <p className="text-gray-600">Gérez vos demandes d'alignement</p>
                </div>
                <button
                  onClick={() => navigate('/alignement')}
                  className="bg-lime-600 hover:bg-lime-700 text-white px-6 py-2.5  -lg flex items-center space-x-2 transition-colors shadow-sm"
                >
                  <Plus className="w-5 h-5" />
                  <span>Nouvel alignement</span>
                </button>
              </div>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div 
                onClick={() => setSelectedStatus('tous')}
                className={`bg-white  -xl shadow-sm p-6 flex items-center justify-between hover:shadow-md transition-all cursor-pointer border-l-4 border-lime-500 ${
                  selectedStatus === 'tous' ? 'ring-2 ring-lime-500' : ''
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-lime-100  -lg text-lime-600">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">Tous les alignements</div>
                    <div className="text-2xl font-bold text-gray-800">{alignments.length}</div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
              
              <div 
                onClick={() => setSelectedStatus('en_attente')}
                className={`bg-white  -xl shadow-sm p-6 flex items-center justify-between hover:shadow-md transition-all cursor-pointer border-l-4 border-blue-500 ${
                  selectedStatus === 'en_attente' ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-100  -lg text-blue-600">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">En attente</div>
                    <div className="text-2xl font-bold text-gray-800">
                      {alignments.filter(a => a.status === 'en_attente').length}
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
              
              <div 
                onClick={() => setSelectedStatus('approuve')}
                className={`bg-white  -xl shadow-sm p-6 flex items-center justify-between hover:shadow-md transition-all cursor-pointer border-l-4 border-green-500 ${
                  selectedStatus === 'approuve' ? 'ring-2 ring-green-500' : ''
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-green-100  -lg text-green-600">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">Approuvés</div>
                    <div className="text-2xl font-bold text-gray-800">
                      {alignments.filter(a => a.status === 'approuve').length}
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
              
              <div 
                onClick={() => setSelectedStatus('rejete')}
                className={`bg-white  -xl shadow-sm p-6 flex items-center justify-between hover:shadow-md transition-all cursor-pointer border-l-4 border-red-500 ${
                  selectedStatus === 'rejete' ? 'ring-2 ring-red-500' : ''
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-red-100  -lg text-red-600">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">Refusés</div>
                    <div className="text-2xl font-bold text-gray-800">
                      {alignments.filter(a => a.status === 'rejete').length}
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* Search and View Controls */}
            <div className="bg-white  -xl shadow-sm p-6 mb-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher un alignement..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-4 py-2.5 border border-gray-300  -lg focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-lime-500 text-sm"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2.5 border border-gray-300  -lg hover:bg-gray-50 transition-colors">
                    <Filter className="w-5 h-5 text-gray-500" />
                  </button>
                  <button className="p-2.5 border border-gray-300  -lg hover:bg-gray-50 transition-colors">
                    <List className="w-5 h-5 text-gray-500" />
                  </button>
                  <button className="p-2.5 border border-gray-300  -lg hover:bg-gray-50 transition-colors">
                    <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Error Display */}
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

            {/* Table */}
            <div className="bg-white  -xl shadow-sm overflow-hidden mb-6">
              {filteredAlignments.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900">Aucun alignement trouvé</h3>
                  <p className="mt-1 text-gray-500">
                    {searchTerm || selectedStatus !== 'tous' 
                      ? "Aucun alignement ne correspond à vos critères de recherche." 
                      : "Vous n'avez pas encore créé de demande d'alignement."}
                  </p>
                  <div className="mt-6">
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedStatus('tous');
                        if (alignments.length === 0) {
                          navigate('/alignement');
                        }
                      }}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium  -lg shadow-sm text-white bg-lime-600 hover:bg-lime-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500"
                    >
                      {alignments.length === 0 ? 'Créer une demande' : 'Réinitialiser les filtres'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          N° Dossier
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Demandeur
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date de création
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Adresse
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Statut
                        </th>
                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Client
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {paginatedAlignments.map((alignment) => (
                        <tr key={alignment.id_align} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            #{alignment.id_align}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {alignment.qualite_demandeur || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {formatDate(alignment.created_at)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {alignment.terrain?.adresse || 'Non spécifiée'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(alignment.status || 'en_attente')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <button className="text-gray-400 hover:text-lime-600 transition-colors">
                              <User className="w-4 h-4" />
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => handleViewDetails(alignment.id_align)}
                                className="text-gray-400 hover:text-lime-600 transition-colors"
                                title="Voir détails"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                              <button className="text-gray-400 hover:text-lime-600 transition-colors">
                                <Printer className="w-4 h-4" />
                              </button>
                              <button className="text-gray-400 hover:text-lime-600 transition-colors">
                                <MoreVertical className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="bg-white px-6 py-4 flex items-center justify-between border-t border-gray-200  -b-xl">
                      <div className="flex-1 flex justify-between sm:hidden">
                        <button
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium  -lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Précédent
                        </button>
                        <button
                          onClick={() => setCurrentPage(prev => prev + 1)}
                          className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium  -lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                        >
                          Suivant
                        </button>
                      </div>
                      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm text-gray-700">
                            Affichage de <span className="font-medium">{Math.min(startIndex + 1, filteredAlignments.length)}</span> à{' '}
                            <span className="font-medium">
                              {Math.min(startIndex + itemsPerPage, filteredAlignments.length)}
                            </span>{' '}
                            sur <span className="font-medium">{filteredAlignments.length}</span> résultats
                          </p>
                        </div>
                        <div>
                          <nav className="relative z-0 inline-flex  -lg shadow-sm -space-x-px" aria-label="Pagination">
                            <button
                              onClick={() => setCurrentPage(1)}
                              disabled={currentPage === 1}
                              className="relative inline-flex items-center px-2 py-2  -l-lg border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              <span className="sr-only">Première page</span>
                              <ChevronsLeft className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                              disabled={currentPage === 1}
                              className="relative inline-flex items-center px-3 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              <span className="sr-only">Précédent</span>
                              <ChevronLeft className="h-5 w-5" />
                            </button>
                            {[1, 2, 3, 4, 5].map((page) => (
                              <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-colors ${
                                  currentPage === page
                                    ? 'z-10 bg-lime-600 border-lime-600 text-white hover:bg-lime-700'
                                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                                }`}
                              >
                                {page}
                              </button>
                            ))}
                            <button
                              onClick={() => setCurrentPage(prev => prev + 1)}
                              disabled={currentPage === totalPages}
                              className="relative inline-flex items-center px-3 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              <span className="sr-only">Suivant</span>
                              <ChevronRight className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => setCurrentPage(totalPages)}
                              disabled={currentPage === totalPages}
                              className="relative inline-flex items-center px-2 py-2  -r-lg border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              <span className="sr-only">Dernière page</span>
                              <ChevronsRight className="h-5 w-5" />
                            </button>
                          </nav>
                        </div>
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

export default AlignmentList;