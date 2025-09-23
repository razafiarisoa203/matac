// src/components/AlignmentTable.jsx
import React from "react";
import {
  Eye,
  FileText,
  AlertCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Pagination from './Pagination';

const AlignmentTable = ({
  alignments,
  filteredAlignments,
  paginatedAlignments,
  error,
  searchTerm,
  selectedStatus,
  currentPage,
  totalPages,
  itemsPerPage,
  startIndex,
  setCurrentPage,
  fetchAlignments,
  getStatusBadge,
  formatDate,
  navigate
}) => {
  const handleViewDetails = (alignmentId) => {
    navigate(`/alignment-details/${alignmentId}`);
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
      <div className="bg-white shadow-sm overflow-hidden ml-4 mr-4 lg:ml-20 lg:mr-20">
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
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium shadow-sm text-white bg-lime-600 hover:bg-lime-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500"
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
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider lg:px-6">
                    N° Dossier
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
                {paginatedAlignments.map((alignment) => (
                  <tr key={alignment.id_align} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 lg:px-6">
                      #{alignment.id_align}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 lg:px-6">
                      {alignment.qualite_demandeur || 'N/A'}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 lg:px-6">
                      {formatDate(alignment.created_at)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 lg:px-6">
                    {getStatusBadge(alignment.status || 'en_attente')}
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
                          onClick={() => handleViewDetails(alignment.id_align)}
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

            {/* ✅ Pagination extraite */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
              filteredAlignmentsLength={filteredAlignments.length}
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