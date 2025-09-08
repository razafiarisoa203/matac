import {
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Clock,
  MapPin,
  Search,
  User
} from 'lucide-react';
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';


const ActionsDashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState('dateSubmission');
  const [sortDirection, setSortDirection] = useState('desc');
  const [selectedActions, setSelectedActions] = useState(new Set());

  const itemsPerPage = 10;

  // Données d'exemple étendues
  const allActions = useMemo(() => [
    {
      dossier: "56DAL-43023-05-2025",
      proprietaire: "Ruffin",
      commune: "Antananarivo",
      region: "Analamanga",
      dateSubmission: "2024-01-15",
      status: "pending",
      statusText: "En cours"
    },
    {
      dossier: "57DAL-43024-05-2025",
      proprietaire: "Marie Dupont",
      commune: "Fianarantsoa",
      region: "Haute Matsiatra",
      dateSubmission: "2024-01-20",
      status: "completed",
      statusText: "Terminé"
    },
    {
      dossier: "58DAL-43025-05-2025",
      proprietaire: "Jean Martin",
      commune: "Toamasina",
      region: "Atsinanana",
      dateSubmission: "2024-01-25",
      status: "rejected",
      statusText: "Rejeté"
    },
    {
      dossier: "59DAL-43026-05-2025",
      proprietaire: "Sophie Rakoto",
      commune: "Mahajanga",
      region: "Boeny",
      dateSubmission: "2024-02-01",
      status: "pending",
      statusText: "En cours"
    },
    {
      dossier: "60DAL-43027-05-2025",
      proprietaire: "Paul Andry",
      commune: "Antsiranana",
      region: "Diana",
      dateSubmission: "2024-02-05",
      status: "completed",
      statusText: "Terminé"
    }
  ], []);

  // Fonction de filtrage et tri
  const filteredAndSortedActions = useMemo(() => {
    let filtered = allActions;

    // Filtrage par terme de recherche
    if (searchTerm) {
      filtered = filtered.filter(action =>
        action.dossier.toLowerCase().includes(searchTerm.toLowerCase()) ||
        action.proprietaire.toLowerCase().includes(searchTerm.toLowerCase()) ||
        action.etat.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrage par statut
    if (statusFilter !== 'all') {
      filtered = filtered.filter(action => action.status === statusFilter);
    }

    // Tri
    filtered.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (sortField === 'dateSubmission' || sortField === 'dateDelivrance') {
        aVal = new Date(aVal || '1970-01-01');
        bVal = new Date(bVal || '1970-01-01');
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [allActions, searchTerm, statusFilter, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedActions.length / itemsPerPage);
  const currentActions = filteredAndSortedActions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Statistiques
  const stats = useMemo(() => {
    return {
      total: allActions.length,
      pending: allActions.filter(a => a.status === 'pending').length,
      completed: allActions.filter(a => a.status === 'completed').length,
      rejected: allActions.filter(a => a.status === 'rejected' || a.status === 'error').length
    };
  }, [allActions]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'error':
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSelectAction = (actionId) => {
    const newSelected = new Set(selectedActions);
    if (newSelected.has(actionId)) {
      newSelected.delete(actionId);
    } else {
      newSelected.add(actionId);
    }
    setSelectedActions(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedActions.size === currentActions.length) {
      setSelectedActions(new Set());
    } else {
      setSelectedActions(new Set(currentActions.map(a => a.id)));
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Placeholder */}
      <Sidebar />

      {/* Main Content */}
      <div className="ml-40 flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes actions</h1>
                  <p className="text-gray-600">Bienvenue dans votre espace personnel</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => navigate('/alignement')} className="bg-lime-600 hover:bg-lime-700 text-white px-6 py-2.5 flex items-center space-x-2 transition-colors shadow-sm">
                    <span className="text-lg">+</span>
                    <span>Nouvel alignement</span>
                  </button>
                  <button className="bg-lime-600 hover:bg-lime-700 text-white px-6 py-2.5 flex items-center space-x-2 transition-colors shadow-sm">
                    <span className="text-lg">+</span>
                    <span>Demande de permis</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div
                onClick={() => setStatusFilter('all')}
                className={`bg-white shadow-sm p-6 flex items-center justify-between hover:shadow-md transition-all cursor-pointer border-l-4 ${statusFilter === 'all' ? 'border-lime-500 bg-lime-50' : 'border-lime-500'}`}
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-lime-100 rounded-lg text-lime-600">
                    <span className="text-xl">
                      <MapPin className="w-6 h-6" />
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">Tous les actions</div>
                    <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
                  </div>
                </div>
                <span className="text-gray-400">→</span>
              </div>

              <div
                onClick={() => setStatusFilter('pending')}
                className={`bg-white shadow-sm p-6 flex items-center justify-between hover:shadow-md transition-all cursor-pointer border-l-4 ${statusFilter === 'pending' ? 'border-blue-500 bg-blue-50' : 'border-blue-500'}`}
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                    <span className="text-xl">
                      <Clock className="w-6 h-6" />
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">En attente</div>
                    <div className="text-2xl font-bold text-gray-800">{stats.pending}</div>
                  </div>
                </div>
                <span className="text-gray-400">→</span>
              </div>

              <div
                onClick={() => setStatusFilter('completed')}
                className={`bg-white shadow-sm p-6 flex items-center justify-between hover:shadow-md transition-all cursor-pointer border-l-4 ${statusFilter === 'completed' ? 'border-green-500 bg-green-50' : 'border-green-500'}`}
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-green-100 rounded-lg text-green-600">
                    <span className="text-xl">
                      <CheckCircle2 className="w-6 h-6" />
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">Approuvés</div>
                    <div className="text-2xl font-bold text-gray-800">{stats.completed}</div>
                  </div>
                </div>
                <span className="text-gray-400">→</span>
              </div>

              <div
                onClick={() => setStatusFilter('rejected')}
                className={`bg-white shadow-sm p-6 flex items-center justify-between hover:shadow-md transition-all cursor-pointer border-l-4 ${statusFilter === 'rejected' ? 'border-red-500 bg-red-50' : 'border-red-500'}`}
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-red-100 rounded-lg text-red-600">
                    <span className="text-xl">
                      <AlertCircle className="w-6 h-6" />
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">Refusés</div>
                    <div className="text-2xl font-bold text-gray-800">{stats.rejected}</div>
                  </div>
                </div>
                <span className="text-gray-400">→</span>
              </div>
            </div>

            {/* Search and View Controls */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher un dossier..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-lime-500 text-sm"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="p-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                  >
                    <option value="all">Tous</option>
                    <option value="pending">En attente</option>
                    <option value="completed">Terminé</option>
                    <option value="rejected">Refusé</option>
                  </select>
                  {/* <button 
                    onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                    className="p-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {viewMode === 'list' ? '📋' : '⊞'}
                  </button> */}
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={selectedActions.size === currentActions.length && currentActions.length > 0}
                          onChange={handleSelectAll}
                          className="rounded border-gray-300 text-lime-600 focus:ring-lime-500"
                        />
                      </th>
                      {[
                        { key: 'dossier', label: 'Dossier N°' },
                        { key: 'proprietaire', label: 'Propriétaire' },
                        { key: 'dateSubmission', label: 'Date de soumission' },
                        { key: 'etape', label: 'Étape' },
                        { key: 'etat', label: 'État' },
                        { key: 'ref', label: 'Réf. Délivrance' },
                        { key: 'dateDelivrance', label: 'Date de délivrance' }
                      ].map(({ key, label }) => (
                        <th
                          key={key}
                          onClick={() => handleSort(key)}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center space-x-1">
                            <span>{label}</span>
                            {sortField === key && (
                              <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                            )}
                          </div>
                        </th>
                      ))}
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Client
                      </th>

                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentActions.map((action, index) => (
                      <tr key={action.dossier || index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedActions.has(action.id)}
                            onChange={() => handleSelectAction(action.id)}
                            className="rounded border-gray-300 text-lime-600 focus:ring-lime-500"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {action.dossier}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {action.proprietaire}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {new Date(action.dateSubmission).toLocaleDateString('fr-FR', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {action.etape}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(action.status)}`}>
                            {action.etat}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {action.ref || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {action.dateDelivrance ? new Date(action.dateDelivrance).toLocaleDateString('fr-FR', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                          }) : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <button className="text-gray-400 hover:text-lime-600 transition-colors">
                            <User className="w-4 h-4" />
                          </button>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination */}
                <div className="bg-white px-6 py-4 flex items-center justify-between border-t border-gray-200 rounded-b-xl">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Précédent
                    </button>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Suivant
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Affichage de <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> à{' '}
                        <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredAndSortedActions.length)}</span> sur{' '}
                        <span className="font-medium">{filteredAndSortedActions.length}</span> résultats
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-lg shadow-sm -space-x-px">
                        <button
                          onClick={() => handlePageChange(1)}
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-lg border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <ChevronsLeft className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center px-3 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          const page = i + Math.max(1, currentPage - 2);
                          if (page > totalPages) return null;
                          return (
                            <button
                              key={page}
                              onClick={() => handlePageChange(page)}
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-colors ${currentPage === page
                                  ? 'z-10 bg-lime-600 border-lime-600 text-white hover:bg-lime-700'
                                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                              {page}
                            </button>
                          );
                        })}
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="relative inline-flex items-center px-3 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handlePageChange(totalPages)}
                          disabled={currentPage === totalPages}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-lg border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <ChevronsRight className="h-5 w-5" />
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions sélectionnées */}
            {selectedActions.size > 0 && (
              <div className="bg-lime-50 border border-lime-200 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-lime-800">
                      {selectedActions.size} élément(s) sélectionné(s)
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1.5 text-sm bg-lime-600 text-white rounded-lg hover:bg-lime-700 transition-colors">
                      Exporter
                    </button>
                    <button
                      onClick={() => setSelectedActions(new Set())}
                      className="px-3 py-1.5 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ActionsDashboard;