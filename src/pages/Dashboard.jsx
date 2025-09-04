import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Plus, 
  MapPin, 
  FileText, 
  Download, 
  Printer, 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  Filter,
  MoreVertical,
  CheckCircle2,
  Clock,
  AlertCircle,
  User,
  Home,
  Settings,
  LogOut,
  List
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import NavigationBar from '../components/NavigationBar';

const ActionsDashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Données d'exemple basées sur l'image
  const actions = [
    {
      dossier: "55DAL-43030-5-2025",
      proprietaire: "Angélot",
      dateSubmission: "2025-09-03 15:59:33",
      etape: "Commune",
      etat: "en attente soumission",
      status: "pending",
      ref: "",
      dateDelivrance: ""
    },
    {
      dossier: "55DAL-43030-5-2025", 
      proprietaire: "Angélot",
      dateSubmission: "2025-09-03 15:59:33",
      etape: "Commune",
      etat: "en attente traitement",
      status: "pending",
      ref: "",
      dateDelivrance: ""
    },
    {
      dossier: "55DAL-43030-5-2025",
      proprietaire: "Angélot", 
      dateSubmission: "2025-09-03 15:59:33",
      etape: "Commune",
      etat: "traitée",
      status: "completed",
      ref: "XXXX-15",
      dateDelivrance: "2025-09-03 15:59:33"
    },
    {
      dossier: "55DAL-43030-5-2025",
      proprietaire: "Angélot",
      dateSubmission: "2025-09-03 15:59:33", 
      etape: "Commune",
      etat: "en attente de régularisation",
      status: "error",
      ref: "",
      dateDelivrance: ""
    }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* <Header />
        <NavigationBar />
         */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes actions</h1>
                  <p className="text-gray-600">Bienvenue dans votre espace personnel</p>
                </div>
                <div className="flex gap-5">
                <button
                  onClick={() => navigate('/alignement')}
                  className="bg-lime-600 hover:bg-lime-700 text-white px-6 py-2.5  -lg flex items-center space-x-2 transition-colors shadow-sm"
                >
                  <Plus className="w-5 h-5" />
                  <span>Nouvel alignement</span>
                </button>
                <button
                  onClick={() => navigate('/alignement')}
                  className="bg-lime-600 hover:bg-lime-700 text-white px-6 py-2.5  -lg flex items-center space-x-2 transition-colors shadow-sm"
                >
                  <Plus className="w-5 h-5" />
                  <span>Demande de permis</span>
                </button>
                </div>
              </div>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div 
                onClick={() => navigate('/alignements')}
                className="bg-white  -xl shadow-sm p-6 flex items-center justify-between hover:shadow-md transition-all cursor-pointer border-l-4 border-lime-500"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-lime-100  -lg text-lime-600">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">Tous les alignements</div>
                    <div className="text-2xl font-bold text-gray-800">15</div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
              
              <div 
                onClick={() => navigate('/alignements?status=en_attente')}
                className="bg-white  -xl shadow-sm p-6 flex items-center justify-between hover:shadow-md transition-all cursor-pointer border-l-4 border-blue-500"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-100  -lg text-blue-600">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">En attente</div>
                    <div className="text-2xl font-bold text-gray-800">7</div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
              
              <div 
                onClick={() => navigate('/alignements?status=approuve')}
                className="bg-white  -xl shadow-sm p-6 flex items-center justify-between hover:shadow-md transition-all cursor-pointer border-l-4 border-green-500"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-green-100  -lg text-green-600">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">Approuvés</div>
                    <div className="text-2xl font-bold text-gray-800">5</div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
              
              <div 
                onClick={() => navigate('/alignements?status=rejete')}
                className="bg-white  -xl shadow-sm p-6 flex items-center justify-between hover:shadow-md transition-all cursor-pointer border-l-4 border-red-500"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-red-100  -lg text-red-600">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">Refusés</div>
                    <div className="text-2xl font-bold text-gray-800">3</div>
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
                    placeholder="Rechercher un dossier..."
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

            {/* Table */}
            <div className="bg-white  -xl shadow-sm overflow-hidden mb-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Dossier N°
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Propriétaire
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date de soumission
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Étape
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        État
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Réf. Délivrance
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date de délivrance
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
                    {actions.map((action, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {action.dossier}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {action.proprietaire}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {action.dateSubmission}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {action.etape}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5  -full text-xs font-medium border ${getStatusColor(action.status)}`}>
                            {action.etat}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {action.ref || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {action.dateDelivrance || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <button className="text-gray-400 hover:text-lime-600 transition-colors">
                            <User className="w-4 h-4" />
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex justify-end space-x-2">
                            <button className="text-gray-400 hover:text-lime-600 transition-colors">
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
                        Affichage de <span className="font-medium">1</span> à <span className="font-medium">10</span> sur{' '}
                        <span className="font-medium">15</span> résultats
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
                          disabled={currentPage === 5}
                          className="relative inline-flex items-center px-3 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <span className="sr-only">Suivant</span>
                          <ChevronRight className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => setCurrentPage(5)}
                          disabled={currentPage === 5}
                          className="relative inline-flex items-center px-2 py-2  -r-lg border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <span className="sr-only">Dernière page</span>
                          <ChevronsRight className="h-5 w-5" />
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ActionsDashboard;