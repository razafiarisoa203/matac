// src/components/Pagination.jsx
import React from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

const Pagination = ({
  currentPage,
  totalPages,
  setCurrentPage,
  filteredAlignmentsLength,
  itemsPerPage,
  startIndex
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 text-xs lg:px-6 lg:py-4">
      <div className="flex-1 flex justify-between sm:hidden">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="relative inline-flex items-center px-2 py-1 border border-gray-300 text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded"
        >
          Précédent
        </button>
        <button
          onClick={() => setCurrentPage(prev => prev + 1)}
          className="ml-2 relative inline-flex items-center px-2 py-1 border border-gray-300 text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors rounded"
        >
          Suivant
        </button>
      </div>
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="text-xs text-gray-700">
            Affichage de <span className="font-medium">{Math.min(startIndex + 1, filteredAlignmentsLength)}</span> à{' '}
            <span className="font-medium">
              {Math.min(startIndex + itemsPerPage, filteredAlignmentsLength)}
            </span>{' '}
            sur <span className="font-medium">{filteredAlignmentsLength}</span> résultats
          </p>
        </div>
        <div>
          <nav className="relative z-0 inline-flex shadow-sm -space-x-1" aria-label="Pagination">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-2 py-1 border border-gray-300 bg-white text-xs font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-l"
            >
              <ChevronsLeft className="h-3 w-3" />
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-2 py-1 border border-gray-300 bg-white text-xs font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-3 w-3" />
            </button>
            {[1, 2, 3, 4, 5].map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`relative inline-flex items-center px-2 py-1 border text-xs font-medium transition-colors ${currentPage === page
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
              className="relative inline-flex items-center px-2 py-1 border border-gray-300 bg-white text-xs font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="h-3 w-3" />
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center px-2 py-1 border border-gray-300 bg-white text-xs font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-r"
            >
              <ChevronsRight className="h-3 w-3" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Pagination;