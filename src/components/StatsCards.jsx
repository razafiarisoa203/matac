// src/components/StatsCards.jsx
import React from "react";
import { MapPin, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const StatsCards = ({ alignments, selectedStatus, setSelectedStatus, setCurrentPage }) => {
  return (
    <div className="bg-green-50 p-6 mb-8 -mt-6">
      {/* Breadcrumb */}
      <nav className="flex items-center text-sm text-gray-100 mb-6" aria-label="Breadcrumb">
        <Link to="/" className="text-black">Accueil</Link>
        <ChevronRight className="w-4 h-4 mx-2 text-black" />
        <span className="text-black">Dashboard</span>
      </nav>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 mt-4 ml-4 mr-4 lg:ml-14 lg:mr-16">
        {/* Tous les alignements */}
        <div
          onClick={() => {
            setSelectedStatus("tous");
            setCurrentPage(1);
          }}
          className={`bg-white shadow-sm p-4 flex items-center justify-between hover:shadow-md transition-all cursor-pointer border-l-4 rounded-lg ${selectedStatus === 'tous' ? 'border-lime-500 bg-lime-50' : 'border-lime-500'}`}
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-lime-100 rounded-lg text-lime-600">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">Tous les alignements</div>
              <div className="text-2xl font-bold text-gray-800">{alignments.length}</div>
            </div>
          </div>
          <span className="text-gray-400">→</span>
        </div>

        {/* En attente */}
        <div
          onClick={() => {
            setSelectedStatus("en_attente");
            setCurrentPage(1);
          }}
          className={`bg-white shadow-sm p-4 flex items-center justify-between hover:shadow-md transition-all cursor-pointer border-l-4 rounded-lg ${selectedStatus === 'en_attente' ? 'border-blue-500 bg-blue-50' : 'border-blue-500'}`}
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">En attente</div>
              <div className="text-2xl font-bold text-gray-800">
                {alignments.filter((a) => (a.status || "en_attente") === "en_attente").length}
              </div>
            </div>
          </div>
          <span className="text-gray-400">→</span>
        </div>

        {/* Approuvés */}
        <div
          onClick={() => {
            setSelectedStatus("approuve");
            setCurrentPage(1);
          }}
          className={`bg-white shadow-sm p-4 flex items-center justify-between hover:shadow-md transition-all cursor-pointer border-l-4 rounded-lg ${selectedStatus === 'approuve' ? 'border-green-500 bg-green-50' : 'border-green-500'}`}
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-lg text-green-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">Approuvés</div>
              <div className="text-2xl font-bold text-gray-800">
                {alignments.filter((a) => a.status === "approuve").length}
              </div>
            </div>
          </div>
          <span className="text-gray-400">→</span>
        </div>

        {/* Rejetés */}
        <div
          onClick={() => {
            setSelectedStatus("rejete");
            setCurrentPage(1);
          }}
          className={`bg-white shadow-sm p-4 flex items-center justify-between hover:shadow-md transition-all cursor-pointer border-l-4 rounded-lg ${selectedStatus === 'rejete' ? 'border-red-500 bg-red-50' : 'border-red-500'}`}
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-red-100 rounded-lg text-red-600">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">Rejetés</div>
              <div className="text-2xl font-bold text-gray-800">
                {alignments.filter((a) => a.status === "rejete").length}
              </div>
            </div>
          </div>
          <span className="text-gray-400">→</span>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;