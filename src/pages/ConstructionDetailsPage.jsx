// src/pages/ConstructionDetailsPage.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from '../components/Sidebar';
import HeaderDashboard from '../components/HeaderDashboard';
import { constructionService } from '../services/api/constructionSercvice';
import { 
  Eye, 
  Download, 
  AlertCircle, 
  Building, 
  ChevronRight, 
  ArrowLeft,
  User,
  MapPin,
  Clock,
  FileText,
  Home,
  Ruler,
  Wrench,
  Layers
} from 'lucide-react';
import { Link } from "react-router-dom";

const ConstructionDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [construction, setConstruction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState('general');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  // Gestion du responsive (sidebar)
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setIsSidebarOpen(prev => !prev);
    }
  };

  // Fonction pour récupérer les détails de la construction
  const fetchConstructionDetails = async () => {
    try {
      setLoading(true);
      const response = await constructionService.getConstructionById(id);
      setConstruction(response.data || response);
      console.log("Détails de la construction récupérés :", response.data || response);
    } catch (err) {
      setError(err.message || "Erreur de récupération des détails du permis");
      console.error("Erreur:", err);
    } finally {
      setLoading(false);
    }
  };

  // Charger les détails au montage du composant
  useEffect(() => {
    if (id) {
      fetchConstructionDetails();
    }
  }, [id]);

  // Fonction pour obtenir le badge de statut
  const getStatusBadge = (status) => {
    const statusConfig = {
      'en_cours': { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', text: 'En cours' },
      'approuve': { color: 'bg-green-100 text-green-800 border-green-200', text: 'Approuvé' },
      'rejete': { color: 'bg-red-100 text-red-800 border-red-200', text: 'Rejeté' },
      'en_attente': { color: 'bg-blue-100 text-blue-800 border-blue-200', text: 'En attente' }
    };
    const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800 border-gray-200', text: status || 'Inconnu' };
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${config.color}`}>
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
      minute: '2-digit'
    });
  };

  const formatNumber = (value) => {
    if (value === null || value === undefined) return 'N/A';
    return new Intl.NumberFormat('fr-FR').format(value);
  };

  const formatCurrency = (value) => {
    if (value === null || value === undefined) return 'N/A';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'MGA'
    }).format(value);
  };

  const formatBoolean = (value) => {
    if (value === true) return 'Oui';
    if (value === false) return 'Non';
    return 'N/A';
  };

  // Fonction pour générer le PDF
  const generatePDF = () => {
    console.log("Génération du PDF pour le permis:", id);
    // Implémentation de la génération PDF à faire
    alert(`Génération du PDF pour le permis #${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} isMobile={isMobile} />

        {isMobile && isSidebarOpen && (
          <div
            onClick={toggleSidebar}
            className="fixed inset-0 bg-transparent z-30 lg:hidden"
            style={{ pointerEvents: 'all' }}
          ></div>
        )}

        <div className="flex-1 flex flex-col overflow-hidden">
          <HeaderDashboard toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} isMobile={isMobile} />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-500 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Chargement des détails du permis...</p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} isMobile={isMobile} />

        {isMobile && isSidebarOpen && (
          <div
            onClick={toggleSidebar}
            className="fixed inset-0 bg-transparent z-30 lg:hidden"
            style={{ pointerEvents: 'all' }}
          ></div>
        )}

        <div className="flex-1 flex flex-col overflow-hidden">
          <HeaderDashboard toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} isMobile={isMobile} />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-7xl mx-auto">
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                    <button
                      onClick={fetchConstructionDetails}
                      className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium"
                    >
                      Réessayer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!construction) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} isMobile={isMobile} />

        {isMobile && isSidebarOpen && (
          <div
            onClick={toggleSidebar}
            className="fixed inset-0 bg-transparent z-30 lg:hidden"
            style={{ pointerEvents: 'all' }}
          ></div>
        )}

        <div className="flex-1 flex flex-col overflow-hidden">
          <HeaderDashboard toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} isMobile={isMobile} />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-7xl mx-auto">
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">Permis non trouvé</h3>
                <p className="mt-1 text-gray-500">
                  Le permis de construction demandé n'existe pas.
                </p>
                <div className="mt-6">
                  <button
                    onClick={() => navigate('/permis-list')}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium shadow-sm text-white bg-lime-600 hover:bg-lime-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500"
                  >
                    Retour à la liste
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 flex">
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} isMobile={isMobile} />

      {isMobile && isSidebarOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-transparent z-30 lg:hidden"
          style={{ pointerEvents: 'all' }}
        ></div>
      )}

      <div className="lg:ml-65 flex-1 flex flex-col overflow-hidden">
        <HeaderDashboard toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} isMobile={isMobile} />

        <main className="flex-1 overflow-y-auto p-0 mt-25">
          {/* Header avec breadcrumb */}
          <div className="bg-green-50 p-6 mb-8 -mt-6">
            <nav className="flex items-center text-sm text-gray-100 mb-6" aria-label="Breadcrumb">
              <Link to="/" className="text-black">Accueil</Link>
              <ChevronRight className="w-4 h-4 mx-2 text-black" />
              <Link to="/dashboard" className="text-black">Dashboard</Link>
              <ChevronRight className="w-4 h-4 mx-2 text-black" />
              <Link to="/permis-list" className="text-black">Permis de construction</Link>
              <ChevronRight className="w-4 h-4 mx-2 text-black" />
              <span className="text-black">Détails du permis #{construction.id_const}</span>
            </nav>

            {/* En-tête avec informations principales */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 ml-4 mr-4 lg:ml-14 lg:mr-16">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate('/permis-list')}
                  className="p-2 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Permis de Construction #{construction.id_const}
                  </h1>
                  <div className="flex items-center space-x-4 mt-2">
                    {getStatusBadge(construction.status || 'en_attente')}
                    <span className="text-sm text-gray-600">
                      Créé le {formatDate(construction.created_at)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 mt-4 lg:mt-0">
                <button
                  onClick={generatePDF}
                  className="inline-flex items-center px-4 py-2 border border-red-600 text-sm font-medium rounded-lg text-red-600 bg-white hover:bg-red-50 hover:text-red-700 transition-colors"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Télécharger PDF
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white -mt-10 pt-8 pb-12">
            {/* Navigation par onglets */}
            <div className="ml-4 mr-4 lg:ml-20 lg:mr-20 border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('general')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'general'
                      ? 'border-lime-500 text-lime-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Building className="w-4 h-4 inline mr-2" />
                  Informations Générales
                </button>
                <button
                  onClick={() => setActiveTab('proprietaire')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'proprietaire'
                      ? 'border-lime-500 text-lime-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <User className="w-4 h-4 inline mr-2" />
                  Propriétaire
                </button>
                <button
                  onClick={() => setActiveTab('architectural')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'architectural'
                      ? 'border-lime-500 text-lime-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Home className="w-4 h-4 inline mr-2" />
                  Renseignement Architectural
                </button>
                <button
                  onClick={() => setActiveTab('technique')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'technique'
                      ? 'border-lime-500 text-lime-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Ruler className="w-4 h-4 inline mr-2" />
                  Renseignement Technique
                </button>
                <button
                  onClick={() => setActiveTab('pieces')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'pieces'
                      ? 'border-lime-500 text-lime-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Layers className="w-4 h-4 inline mr-2" />
                  Pièces et Équipements
                </button>
              </nav>
            </div>

            {/* Contenu des onglets */}
            <div className="ml-4 mr-4 lg:ml-20 lg:mr-20 mt-8">
              
              {/* Onglet Informations Générales */}
              {activeTab === 'general' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Building className="w-5 h-5 mr-2 text-lime-600" />
                      Identification du Projet
                    </h3>
                    <div className="space-y-4">
                      <InfoRow label="Nature des travaux" value={construction.natureTravaux} />
                      <InfoRow label="Type d'affectation" value={construction.typeAffectation} />
                      <InfoRow label="Référence alignement" value={construction.referenceAlignement} />
                      <InfoRow label="Zone d'implantation" value={construction.zoneImplantation} />
                      <InfoRow label="Matériaux utilisés" value={construction.materiaux} />
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Clock className="w-5 h-5 mr-2 text-lime-600" />
                      Planning et Budget
                    </h3>
                    <div className="space-y-4">
                      <InfoRow label="Durée des travaux" value={construction.dureeTravaux ? `${construction.dureeTravaux} mois` : 'N/A'} />
                      <InfoRow label="Montant des travaux" value={formatCurrency(construction.montantTravaux)} />
                      <InfoRow label="Date de création" value={formatDate(construction.created_at)} />
                      <InfoRow label="Dernière mise à jour" value={formatDate(construction.updated_at)} />
                    </div>
                  </div>
                </div>
              )}

              {/* Onglet Propriétaire */}
              {activeTab === 'proprietaire' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <User className="w-5 h-5 mr-2 text-lime-600" />
                      Informations du Propriétaire
                    </h3>
                    <div className="space-y-4">
                      <InfoRow label="Civilité" value={construction.civiliteProprietaire} />
                      <InfoRow label="Nom complet" value={construction.nomProprietaire} />
                      <InfoRow label="CIN" value={construction.cinProprietaire} />
                      <InfoRow label="Téléphone" value={construction.telProprietaire} />
                      <InfoRow label="Email" value={construction.emailProprietaire} />
                      <InfoRow label="Adresse" value={construction.adresseProprietaire} />
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Wrench className="w-5 h-5 mr-2 text-lime-600" />
                      Auteur de l'Ouvrage
                    </h3>
                    <div className="space-y-4">
                      <InfoRow label="Auteur" value={construction.auteurOuvrage} />
                      <InfoRow label="Nom" value={construction.nomAuteur} />
                      <InfoRow label="Fonction" value={construction.fonctionAuteur} />
                      <InfoRow label="N° d'ordre" value={construction.numeroOrdreAuteur} />
                      <InfoRow label="Téléphone" value={construction.telAuteur} />
                      <InfoRow label="Email" value={construction.emailAuteur} />
                      <InfoRow label="Adresse" value={construction.adresseAuteur} />
                    </div>
                  </div>
                </div>
              )}

              {/* Onglet Renseignement Architectural */}
              {activeTab === 'architectural' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Ruler className="w-5 h-5 mr-2 text-lime-600" />
                      Dimensions du Projet
                    </h3>
                    <div className="space-y-4">
                      <InfoRow label="Longueur" value={construction.longueurProjet ? `${formatNumber(construction.longueurProjet)} m` : 'N/A'} />
                      <InfoRow label="Largeur" value={construction.largeurProjet ? `${formatNumber(construction.largeurProjet)} m` : 'N/A'} />
                      <InfoRow label="Hauteur" value={construction.hauteurProjet ? `${formatNumber(construction.hauteurProjet)} m` : 'N/A'} />
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Home className="w-5 h-5 mr-2 text-lime-600" />
                      Caractéristiques
                    </h3>
                    <div className="space-y-4">
                      <InfoRow label="Zone d'implantation" value={construction.zoneImplantation} />
                      <InfoRow label="Matériaux principaux" value={construction.materiaux} />
                    </div>
                  </div>
                </div>
              )}

              {/* Onglet Renseignement Technique */}
              {activeTab === 'technique' && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 mb-4">Surfaces</h4>
                      <div className="space-y-3">
                        <InfoRow label="Surface terrain" value={construction.surfaceTerrain ? `${formatNumber(construction.surfaceTerrain)} m²` : 'N/A'} />
                        <InfoRow label="Emprise au sol existant" value={construction.empriseSolExistant ? `${formatNumber(construction.empriseSolExistant)} m²` : 'N/A'} />
                        <InfoRow label="Emprise au sol projet" value={construction.empriseSol ? `${formatNumber(construction.empriseSol)} m²` : 'N/A'} />
                        <InfoRow label="Surface plancher existant" value={construction.surfacePlancherExistant ? `${formatNumber(construction.surfacePlancherExistant)} m²` : 'N/A'} />
                        <InfoRow label="Surface plancher projet" value={construction.surfacePlancherProjet ? `${formatNumber(construction.surfacePlancherProjet)} m²` : 'N/A'} />
                        <InfoRow label="Surface verte" value={construction.surfaceVerte ? `${formatNumber(construction.surfaceVerte)} m²` : 'N/A'} />
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 mb-4">Distances</h4>
                      <div className="space-y-3">
                        <InfoRow label="Distance chemin public" value={construction.distanceCheminPublic ? `${formatNumber(construction.distanceCheminPublic)} m` : 'N/A'} />
                        <InfoRow label="Distance route nationale" value={construction.distanceRouteNationale ? `${formatNumber(construction.distanceRouteNationale)} m` : 'N/A'} />
                        <InfoRow label="Distance rivière" value={construction.distanceRiviere ? `${formatNumber(construction.distanceRiviere)} m` : 'N/A'} />
                        <InfoRow label="Distance limite propriété" value={construction.distanceProjetLimitePropriete ? `${formatNumber(construction.distanceProjetLimitePropriete)} m` : 'N/A'} />
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 mb-4">Équipements Terrain</h4>
                      <div className="space-y-3">
                        <InfoRow label="Raccordement eau" value={formatBoolean(construction.equipementEau)} />
                        <InfoRow label="Raccordement électricité" value={formatBoolean(construction.equipementElectricite)} />
                        <InfoRow label="Assainissement" value={formatBoolean(construction.equipementAssainissement)} />
                        <InfoRow label="Voie d'accès" value={formatBoolean(construction.equipementVoieAcces)} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Onglet Pièces et Équipements */}
              {activeTab === 'pieces' && (
                <div className="space-y-8">
                  {/* Liste des pièces */}
                  {construction.pieces && construction.pieces.length > 0 && (
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Layers className="w-5 h-5 mr-2 text-lime-600" />
                        Caractéristiques des Pièces
                      </h3>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead>
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Niveau</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Destination</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Surface (m²)</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Surface Ouverture (m²)</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hauteur Linteaux (m)</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hauteur Plafond (m)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {construction.pieces.map((piece, index) => (
                              <tr key={index}>
                                <td className="px-4 py-3 text-sm text-gray-900">{piece.niveau}</td>
                                <td className="px-4 py-3 text-sm text-gray-900">{piece.destination}</td>
                                <td className="px-4 py-3 text-sm text-gray-900">{formatNumber(piece.surface)}</td>
                                <td className="px-4 py-3 text-sm text-gray-900">{formatNumber(piece.surfaceOuverture)}</td>
                                <td className="px-4 py-3 text-sm text-gray-900">{formatNumber(piece.hauteurLinteaux)}</td>
                                <td className="px-4 py-3 text-sm text-gray-900">{formatNumber(piece.hauteurPlafond)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Équipements de l'ouvrage */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 mb-4">Équipements</h4>
                      <div className="space-y-3">
                        <InfoRow label="VH/VB" value={formatBoolean(construction.existantVhVb)} />
                        <InfoRow label="Terasse" value={formatBoolean(construction.existantTerasse)} />
                        <InfoRow label="Garde-corps" value={formatBoolean(construction.existantGardeCorp)} />
                        <InfoRow label="Nombre de vérandas" value={construction.nbrVeranda} />
                        <InfoRow label="Nombre de couloirs" value={construction.nbrCouloir} />
                        <InfoRow label="Nombre d'escaliers" value={construction.nbrEscalier} />
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 mb-4">Assainissement</h4>
                      <div className="space-y-3">
                        <InfoRow label="Branchement eau public" value={formatBoolean(construction.existantBranchementEauPublic)} />
                        <InfoRow label="Utilisation fosse septique" value={formatBoolean(construction.utilisationFosseEptique)} />
                        <InfoRow label="Type fosse septique" value={construction.typeFosseEptique} />
                        <InfoRow label="Nombre d'usagers fosse" value={construction.nbrUsageFosse} />
                        <InfoRow label="Capacité fosse" value={construction.capaciteFosse ? `${construction.capaciteFosse} L` : 'N/A'} />
                        <InfoRow label="Utilisation puisard" value={formatBoolean(construction.utilisationPuisard)} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
// Composant pour afficher une ligne d'information
const InfoRow = ({ label, value }) => (
  <div className="flex justify-between items-start py-2 border-b border-gray-200 last:border-b-0">
    <span className="text-sm font-medium text-gray-600">{label}</span>
    <span className="text-sm text-gray-900 text-right max-w-xs">{value || 'N/A'}</span>
  </div>
);

export default ConstructionDetailsPage;