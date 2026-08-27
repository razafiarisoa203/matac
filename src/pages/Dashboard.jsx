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
        (action.etat || '').toLowerCase().includes(searchTerm.toLowerCase())
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
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800';
      case 'error':
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600';
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex transition-colors duration-300">
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
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Mes actions</h1>
                  <p className="text-gray-600 dark:text-gray-400">Bienvenue dans votre espace personnel</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => navigate('/alignement')} className="bg-lime-600 dark:bg-lime-700 hover:bg-lime-700 dark:hover:bg-lime-600 text-white px-6 py-2.5 flex items-center space-x-2 transition-colors shadow-sm">
                    <span className="text-lg">+</span>
                    <span>Nouvelle alignement</span>
                  </button>
                  <button onClick={() => navigate('/permis')} className="bg-lime-600 dark:bg-lime-700 hover:bg-lime-700 dark:hover:bg-lime-600 text-white px-6 py-2.5 flex items-center space-x-2 transition-colors shadow-sm">
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
                className={`bg-white dark:bg-gray-800 shadow-sm p-6 flex items-center justify-between hover:shadow-md dark:hover:shadow-black/30 transition-all cursor-pointer border-l-4 ${statusFilter === 'all' ? 'border-lime-500 bg-lime-50 dark:bg-lime-900/20' : 'border-lime-500'}`}
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-lime-100 dark:bg-lime-900/40 rounded-lg text-lime-600 dark:text-lime-400">
                    <span className="text-xl">
                      <MapPin className="w-6 h-6" />
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Tous les actions</div>
                    <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">{stats.total}</div>
                  </div>
                </div>
                <span className="text-gray-400 dark:text-gray-500">→</span>
              </div>

              <div
                onClick={() => setStatusFilter('pending')}
                className={`bg-white dark:bg-gray-800 shadow-sm p-6 flex items-center justify-between hover:shadow-md dark:hover:shadow-black/30 transition-all cursor-pointer border-l-4 ${statusFilter === 'pending' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-blue-500'}`}
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/40 rounded-lg text-blue-600 dark:text-blue-400">
                    <span className="text-xl">
                      <Clock className="w-6 h-6" />
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">En attente</div>
                    <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">{stats.pending}</div>
                  </div>
                </div>
                <span className="text-gray-400 dark:text-gray-500">→</span>
              </div>

              <div
                onClick={() => setStatusFilter('completed')}
                className={`bg-white dark:bg-gray-800 shadow-sm p-6 flex items-center justify-between hover:shadow-md dark:hover:shadow-black/30 transition-all cursor-pointer border-l-4 ${statusFilter === 'completed' ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-green-500'}`}
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-green-100 dark:bg-green-900/40 rounded-lg text-green-600 dark:text-green-400">
                    <span className="text-xl">
                      <CheckCircle2 className="w-6 h-6" />
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Approuvés</div>
                    <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">{stats.completed}</div>
                  </div>
                </div>
                <span className="text-gray-400 dark:text-gray-500">→</span>
              </div>

              <div
                onClick={() => setStatusFilter('rejected')}
                className={`bg-white dark:bg-gray-800 shadow-sm p-6 flex items-center justify-between hover:shadow-md dark:hover:shadow-black/30 transition-all cursor-pointer border-l-4 ${statusFilter === 'rejected' ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-red-500'}`}
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-red-100 dark:bg-red-900/40 rounded-lg text-red-600 dark:text-red-400">
                    <span className="text-xl">
                      <AlertCircle className="w-6 h-6" />
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Refusés</div>
                    <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">{stats.rejected}</div>
                  </div>
                </div>
                <span className="text-gray-400 dark:text-gray-500">→</span>
              </div>
            </div>

            {/* Search and View Controls */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                  <input
                    type="text"
                    placeholder="Rechercher un dossier..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-lime-500 text-sm"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="p-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-sm"
                  >
                    <option value="all">Tous</option>
                    <option value="pending">En attente</option>
                    <option value="completed">Terminé</option>
                    <option value="rejected">Refusé</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden mb-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={selectedActions.size === currentActions.length && currentActions.length > 0}
                          onChange={handleSelectAll}
                          className="rounded border-gray-300 dark:border-gray-600 text-lime-600 focus:ring-lime-500"
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
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                        >
                          <div className="flex items-center space-x-1">
                            <span>{label}</span>
                            {sortField === key && (
                              <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                            )}
                          </div>
                        </th>
                      ))}
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Client
                      </th>

                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {currentActions.map((action, index) => (
                      <tr key={action.dossier || index} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedActions.has(action.id)}
                            onChange={() => handleSelectAction(action.id)}
                            className="rounded border-gray-300 dark:border-gray-600 text-lime-600 focus:ring-lime-500"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                          {action.dossier}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                          {action.proprietaire}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                          {new Date(action.dateSubmission).toLocaleDateString('fr-FR', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                          {action.etape}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(action.status)}`}>
                            {action.statusText}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                          {action.ref || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                          {action.dateDelivrance ? new Date(action.dateDelivrance).toLocaleDateString('fr-FR', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                          }) : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <button className="text-gray-400 dark:text-gray-500 hover:text-lime-600 dark:hover:text-lime-400 transition-colors">
                            <User className="w-4 h-4" />
                          </button>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination */}
                <div className="bg-white dark:bg-gray-800 px-6 py-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 rounded-b-xl">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Précédent
                    </button>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Suivant
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
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
                          className="relative inline-flex items-center px-2 py-2 rounded-l-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <ChevronsLeft className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                                  ? 'z-10 bg-lime-600 dark:bg-lime-700 border-lime-600 dark:border-lime-700 text-white hover:bg-lime-700 dark:hover:bg-lime-600'
                                  : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                                }`}
                            >
                              {page}
                            </button>
                          );
                        })}
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="relative inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handlePageChange(totalPages)}
                          disabled={currentPage === totalPages}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
              <div className="bg-lime-50 dark:bg-lime-900/20 border border-lime-200 dark:border-lime-800 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-lime-800 dark:text-lime-300">
                      {selectedActions.size} élément(s) sélectionné(s)
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1.5 text-sm bg-lime-600 dark:bg-lime-700 text-white rounded-lg hover:bg-lime-700 dark:hover:bg-lime-600 transition-colors">
                      Exporter
                    </button>
                    <button
                      onClick={() => setSelectedActions(new Set())}
                      className="px-3 py-1.5 text-sm bg-gray-600 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
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