// src/components/AlignmentTable.jsx
import React from "react";
import {
  Eye,
  FileText,
  AlertCircle
} from "lucide-react";
import Pagination from './Pagination';

const AlignmentTable = ({
  requests = [],
  filteredRequests = [],
  paginatedRequests = [],
  error,
  searchTerm,
  selectedStatus,
  selectedType,
  currentPage,
  totalPages,
  itemsPerPage,
  startIndex,
  setCurrentPage,
  fetchAlignments,
  fetchConstructions,
  getStatusBadge,
  getTypeTag,
  formatDate,
  navigate
}) => {

  const handleViewDetails = (request) => {
    if (request.type === 'alignment') {
      navigate(`/alignment-details/${request.id}`);
    } else if (request.type === 'construction') {
      navigate(`/construction-details/${request.id}`);
    }
  };

  const handleRefresh = async () => {
    try {
      await Promise.all([fetchAlignments(), fetchConstructions()]);
    } catch (err) {
      console.error('Erreur lors du rafraîchissement:', err);
    }
  };

  const getEmptyStateMessage = () => {
    if (searchTerm) {
      return "Aucune demande ne correspond à vos critères de recherche.";
    }
    if (selectedStatus !== 'tous') {
      return `Aucune demande avec le statut "${selectedStatus}".`;
    }
    if (selectedType !== 'tous') {
      return `Aucune demande de type "${selectedType}".`;
    }
    return "Vous n'avez pas encore créé de demande.";
  };

  const handleResetFilters = () => {
    // Ces fonctions doivent être passées en props depuis le parent
    if (typeof setSearchTerm === 'function') setSearchTerm('');
    if (typeof setSelectedStatus === 'function') setSelectedStatus('tous');
    if (typeof setSelectedType === 'function') setSelectedType('tous');
  };

  return (
    <>
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 ml-4 mr-4 lg:ml-20 lg:mr-20">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
              <button
                onClick={handleRefresh}
                className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium"
              >
                Réessayer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white shadow-sm overflow-hidden ml-4 mr-4 lg:ml-20 lg:mr-20">
        {filteredRequests.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">Aucune demande trouvée</h3>
            <p className="mt-1 text-gray-500">
              {getEmptyStateMessage()}
            </p>
            <div className="mt-6">
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
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
                    Type
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider lg:px-6">
                    Demandeur
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider lg:px-6">
                    Date de création
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider lg:px-6">
                    Statut
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider lg:px-6">
                    Ref.Delivrance
                  </th>
                  <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider lg:px-6">
                    Date de delivrance
                  </th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider lg:px-6">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedRequests.map((request) => (
                  <tr key={`${request.type}-${request.id}`} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 lg:px-6">
                      {request.reference}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap lg:px-6">
                      {getTypeTag(request.type)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 lg:px-6">
                      {request.nom}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 lg:px-6">
                      {formatDate(request.date)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 lg:px-6">
                      {getStatusBadge(request.status || '')}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap lg:px-6">
                      -
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-center lg:px-6">
                      -
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right lg:px-6">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleViewDetails(request)}
                          className="text-gray-400 hover:text-lime-600 transition-colors"
                          title="Voir détails"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
              filteredAlignmentsLength={filteredRequests.length}
              itemsPerPage={itemsPerPage}
              startIndex={startIndex}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default AlignmentTable;