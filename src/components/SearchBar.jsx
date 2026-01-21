// src/components/SearchBar.jsx
import React from "react";
import { Search, Filter, List } from "lucide-react";

const SearchBar = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="bg-white shadow-sm p-4 mb-6 ml-4 mr-4 lg:ml-20 lg:mr-20 rounded">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded">
        <div className="relative flex-1 rounded">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 rounded" />
          <input
            type="text"
            placeholder="Rechercher un alignement..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-4 py-2.5 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm rounded"
          />
        </div>
        <div className="flex items-center space-x-2 rounded">
          <button className="p-2.5 border border-gray-300 hover:bg-gray-50 transition-colors rounded">
            <Filter className="w-5 h-5 text-gray-500" />
          </button>
          <button className="p-2.5 border border-gray-300 hover:bg-gray-50 transition-colors rounded">
            <List className="w-5 h-5 text-gray-500" />
          </button>
          <button className="p-2.5 border border-gray-300 hover:bg-gray-50 transition-colors rounded">
            <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;