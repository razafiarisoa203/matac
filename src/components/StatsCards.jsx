// src/components/StatsCards.jsx
import React from "react";
import { MapPin, Clock, CheckCircle2, AlertCircle, Building } from "lucide-react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const StatsCards = ({
  alignments = [],
  constructions = [],
  selectedStatus,
  setSelectedStatus,
  selectedType,
  setSelectedType,
  setCurrentPage
}) => {

  // Calcul des statistiques combinées
  const totalAlignments = alignments.length;
  const totalConstructions = constructions.length;
  const totalRequests = totalAlignments + totalConstructions;

  const alignmentsEnAttente = alignments.filter(a => (a.status || 'en_attente') === 'en_attente').length;
  const constructionsEnAttente = constructions.filter(c => (c.status || 'en_attente') === 'en_attente').length;
  const totalEnAttente = alignmentsEnAttente + constructionsEnAttente;

  const alignmentsApprouves = alignments.filter(a => a.status === 'approuve').length;
  const constructionsApprouves = constructions.filter(c => c.status === 'approuve').length;
  const totalApprouves = alignmentsApprouves + constructionsApprouves;

  const alignmentsRejetes = alignments.filter(a => a.status === 'rejete').length;
  const constructionsRejetes = constructions.filter(c => c.status === 'rejete').length;
  const totalRejetes = alignmentsRejetes + constructionsRejetes;

  const handleFilterClick = (status, type = 'tous') => {
    setSelectedStatus(status);
    setSelectedType(type);
    setCurrentPage(1);
  };

  return (
    <div className="bg-green-50 p-6 mb-8 -mt-6">
      {/* Breadcrumb */}
      <nav className="flex items-center text-sm text-gray-100 mb-6" aria-label="Breadcrumb">
        <Link to="/" className="text-black">Accueil</Link>
        <ChevronRight className="w-4 h-4 mx-2 text-black" />
        <span className="text-black">Dashboard</span>
      </nav>

      {/* Filtres par type */}
      <div className="flex flex-wrap gap-4 mb-6 ml-4 mr-4 lg:ml-14 lg:mr-16">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">Type de demande:</span>
          <select
            value={selectedType}
            onChange={(e) => {
              setSelectedType(e.target.value);
              setCurrentPage(1);
            }}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
          >
            <option value="tous">Tous les types</option>
            <option value="alignment">Alignements</option>
            <option value="construction">Constructions</option>
          </select>
        </div>

        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">Statut:</span>
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 mt-4 ml-4 mr-4 lg:ml-14 lg:mr-16">
        {/* Toutes les demandes */}
        <div
          onClick={() => handleFilterClick('tous', 'tous')}
          className={`bg-white shadow-sm p-4 flex items-center justify-between hover:shadow-md transition-all cursor-pointer border-l-4 rounded-lg ${selectedStatus === 'tous' && selectedType === 'tous' ? 'border-lime-500 bg-lime-50' : 'border-lime-500'}`}
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-lime-100 rounded-lg text-lime-600">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">Toutes les demandes</div>
              <div className="text-2xl font-bold text-gray-800">{totalRequests}</div>
            </div>
          </div>
          <span className="text-gray-400">→</span>
        </div>

        {/* En attente */}
        <div
          onClick={() => handleFilterClick('en_attente')}
          className={`bg-white shadow-sm p-4 flex items-center justify-between hover:shadow-md transition-all cursor-pointer border-l-4 rounded-lg ${selectedStatus === 'en_attente' ? 'border-blue-500 bg-blue-50' : 'border-blue-500'}`}
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">En attente</div>
              <div className="text-2xl font-bold text-gray-800">
                {totalEnAttente}
              </div>
            </div>
          </div>
          <span className="text-gray-400">→</span>
        </div>

        {/* Approuvés */}
        <div
          onClick={() => handleFilterClick('approuve')}
          className={`bg-white shadow-sm p-4 flex items-center justify-between hover:shadow-md transition-all cursor-pointer border-l-4 rounded-lg ${selectedStatus === 'approuve' ? 'border-green-500 bg-green-50' : 'border-green-500'}`}
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-lg text-green-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">Approuvés</div>
              <div className="text-2xl font-bold text-gray-800">
                {totalApprouves}
              </div>
            </div>
          </div>
          <span className="text-gray-400">→</span>
        </div>

        {/* Rejetés */}
        <div
          onClick={() => handleFilterClick('rejete')}
          className={`bg-white shadow-sm p-4 flex items-center justify-between hover:shadow-md transition-all cursor-pointer border-l-4 rounded-lg ${selectedStatus === 'rejete' ? 'border-red-500 bg-red-50' : 'border-red-500'}`}
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-red-100 rounded-lg text-red-600">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">Rejetés</div>
              <div className="text-2xl font-bold text-gray-800">
                {totalRejetes}
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