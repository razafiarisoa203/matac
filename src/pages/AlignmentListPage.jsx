// src/pages/AlignmentListPage.jsx
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Sidebar from '../components/Sidebar';
import HeaderDashboard from '../components/HeaderDashboard';
import SearchBar from '../components/SearchBar';
import { alignmentService } from '../services/api/alignmentService';
import { Eye, FileText, Download, AlertCircle, MapPin, ChevronRight, Plus } from 'lucide-react';
import { authService } from "../services/api/authService";
import { jsPDF } from "jspdf";

const AlignmentListPage = () => {
  const [alignments, setAlignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState('tous');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const navigate = useNavigate();

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

  // Récupération ID utilisateur
  const userData = authService.getUserInfo();
  const id_citizen = userData?.id_citizen;
  const mandataireId = id_citizen;

  const fetchAlignments = async () => {
    try {
      setLoading(true);
      const data = await alignmentService.getAllAlignment(mandataireId);
      setAlignments(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Erreur de récupération des alignements");
      console.error("Erreur:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlignments();
  }, []);

  // Badge de statut compatible Dark Mode
  const getStatusBadge = (status) => {
    const statusConfig = {
      'en_cours': { color: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-300 dark:border-yellow-800', text: 'En cours' },
      'approuve': { color: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/40 dark:text-green-300 dark:border-green-800', text: 'Approuvé' },
      'rejete': { color: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/40 dark:text-red-300 dark:border-red-800', text: 'Rejeté' },
      'en_attente': { color: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-800', text: 'En attente' }
    };
    const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700', text: status || 'Inconnu' };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  // Filtrage des données
  const filteredAlignments = alignments.filter(alignment => {
    const matchesSearch =
      alignment.id_align?.toString().includes(searchTerm) ||
      alignment.nom_demandaire?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alignment.cin_passeport_demandaire?.includes(searchTerm) ||
      alignment.terrain?.adresse?.toLowerCase().includes(searchTerm.toLowerCase());

    const normalizedStatus = alignment.status || 'en_attente';
    const matchesStatus = selectedStatus === 'tous' || normalizedStatus === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const itemsPerPage = 8;
  const totalPages = Math.ceil(filteredAlignments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAlignments = filteredAlignments.slice(startIndex, startIndex + itemsPerPage);

  /**
   * Génère réellement un PDF à partir des données de l'alignement sélectionné.
   * Cette fonction utilise uniquement les données déjà récupérées par
   * getAllAlignment(), donc aucune donnée statique n'est ajoutée.
   */
  const generatePDF = (alignment) => {
    try {
      if (!alignment) {
        throw new Error("Aucun alignement sélectionné.");
      }

      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 18;
      const contentWidth = pageWidth - margin * 2;
      let y = 20;

      const value = (v) => {
        if (v === null || v === undefined || v === "") return "N/A";
        if (typeof v === "boolean") return v ? "Oui" : "Non";
        if (typeof v === "object") return JSON.stringify(v);
        return String(v);
      };

      const addPageNumber = () => {
        const pageCount = doc.getNumberOfPages();
        for (let page = 1; page <= pageCount; page += 1) {
          doc.setPage(page);
          doc.setFontSize(8);
          doc.setTextColor(110, 110, 110);
          doc.text(
            `Alignement #${value(alignment.id_align)} - Page ${page}/${pageCount}`,
            pageWidth / 2,
            pageHeight - 8,
            { align: "center" }
          );
        }
      };

      const ensureSpace = (height = 12) => {
        if (y + height > pageHeight - 18) {
          doc.addPage();
          y = 20;
        }
      };

      const addSection = (title) => {
        ensureSpace(18);
        doc.setFillColor(22, 101, 52);
        doc.roundedRect(margin, y - 5, contentWidth, 9, 1.5, 1.5, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(255, 255, 255);
        doc.text(title, margin + 4, y + 1);
        y += 13;
        doc.setTextColor(35, 35, 35);
      };

      const addField = (label, fieldValue) => {
        const textValue = value(fieldValue);
        const labelWidth = 58;
        const valueWidth = contentWidth - labelWidth - 4;
        const lines = doc.splitTextToSize(textValue, valueWidth);
        const rowHeight = Math.max(7, lines.length * 5 + 2);

        ensureSpace(rowHeight + 2);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(9.5);
        doc.setTextColor(70, 70, 70);
        doc.text(label, margin, y);

        doc.setFont("helvetica", "normal");
        doc.setTextColor(35, 35, 35);
        doc.text(lines, margin + labelWidth, y);

        y += rowHeight;
        doc.setDrawColor(225, 225, 225);
        doc.line(margin, y - 2, margin + contentWidth, y - 2);
        y += 2;
      };

      // En-tête
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.setTextColor(22, 101, 52);
      doc.text("DOSSIER D'ALIGNEMENT", margin, y);
      y += 8;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(90, 90, 90);
      doc.text(
        `Document généré le ${new Date().toLocaleString("fr-FR")}`,
        margin,
        y
      );
      y += 9;

      doc.setDrawColor(22, 101, 52);
      doc.setLineWidth(0.6);
      doc.line(margin, y, pageWidth - margin, y);
      y += 10;

      // Identification
      addSection("1. Identification de l'alignement");
      addField("N° dossier", `#${value(alignment.id_align)}`);
      addField(
        "Statut",
        alignment.statut_alignement || alignment.status || "N/A"
      );
      addField("Date de création", formatDate(alignment.created_at));
      addField("Statut propriétaire", alignment.status_proprietaire);
      addField("Qualité demandeur", alignment.qualite_demandeur);

      // Demandeur
      addSection("2. Informations du demandeur");
      addField("Nom", alignment.nom_demandaire);
      addField("Prénom / mandataire", alignment.prenom_mandataire);
      addField("CIN / Passeport", alignment.cin_passeport_demandaire);
      addField("Adresse", alignment.adresse_demandaire);
      addField("Téléphone", alignment.telephone_demandaire);
      addField("Email", alignment.email_demandaire);

      // Terrain
      addSection("3. Informations du terrain");
      const terrain = alignment.terrain || {};
      addField("Adresse du terrain", terrain.adresse || alignment.adresse_terrain);
      addField("Référence terrain", terrain.reference || terrain.reference_fonciere);
      addField("Lot", terrain.lot || alignment.lot);
      addField("Parcelle", terrain.parcelle || alignment.parcelle);
      addField("Commune", terrain.commune || alignment.commune);
      addField("Fokontany", terrain.fokontany || alignment.fokontany);

      if (terrain.superficie !== undefined || alignment.superficie !== undefined) {
        addField(
          "Superficie",
          terrain.superficie !== undefined
            ? terrain.superficie
            : alignment.superficie
        );
      }

      if (terrain.latitude !== undefined || alignment.latitude !== undefined) {
        addField(
          "Latitude",
          terrain.latitude !== undefined ? terrain.latitude : alignment.latitude
        );
      }

      if (terrain.longitude !== undefined || alignment.longitude !== undefined) {
        addField(
          "Longitude",
          terrain.longitude !== undefined
            ? terrain.longitude
            : alignment.longitude
        );
      }

      // Informations complémentaires : primitives disponibles dans la réponse API.
      const excludedKeys = new Set([
        "id_align",
        "statut_alignement",
        "status",
        "created_at",
        "nom_demandaire",
        "prenom_mandataire",
        "cin_passeport_demandaire",
        "adresse_demandaire",
        "telephone_demandaire",
        "email_demandaire",
        "qualite_demandeur",
        "status_proprietaire",
        "terrain",
        "adresse_terrain",
        "lot",
        "parcelle",
        "commune",
        "fokontany",
        "superficie",
        "latitude",
        "longitude",
      ]);

      const extraEntries = Object.entries(alignment).filter(
        ([key, val]) =>
          !excludedKeys.has(key) &&
          val !== null &&
          val !== undefined &&
          val !== "" &&
          (typeof val !== "object" || Array.isArray(val))
      );

      if (extraEntries.length > 0) {
        addSection("4. Informations complémentaires");
        extraEntries.forEach(([key, val]) => {
          const label = key
            .replace(/_/g, " ")
            .replace(/\b\w/g, (letter) => letter.toUpperCase());

          addField(label, Array.isArray(val) ? val.join(", ") : val);
        });
      }

      // Pied de document
      ensureSpace(20);
      y += 5;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(100, 100, 100);
      doc.text(
        "Document généré automatiquement à partir des données de l'alignement.",
        margin,
        y
      );

      addPageNumber();

      const fileName = `alignement_${value(alignment.id_align)
        .replace(/[^a-zA-Z0-9_-]/g, "_")}.pdf`;

      doc.save(fileName);
    } catch (err) {
      console.error("Erreur lors de la génération du PDF :", err);
      setError(
        err?.message ||
          "Une erreur est survenue lors de la génération du PDF."
      );
    }
  };

  const viewDetails = (alignmentId) => {
    navigate(`/alignment-details/${alignmentId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex transition-colors duration-200">
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
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
                  <p className="mt-4 text-gray-600 dark:text-gray-400">Chargement des alignements...</p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 dark:bg-gray-900 flex transition-colors duration-200">
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
          <div className="bg-green-50 dark:bg-gray-900 p-6 mb-8 -mt-6">
            <nav className="flex items-center text-sm mb-6" aria-label="Breadcrumb">
              <Link to="/" className="text-gray-900 dark:text-gray-300 hover:underline">Accueil</Link>
              <ChevronRight className="w-4 h-4 mx-2 text-gray-500 dark:text-gray-400" />
              <Link to="/dashboard" className="text-gray-900 dark:text-gray-300 hover:underline">Dashboard</Link>
              <ChevronRight className="w-4 h-4 mx-2 text-gray-500 dark:text-gray-400" />
              <span className="text-gray-900 dark:text-white font-medium">Liste des alignements</span>
            </nav>

            {/* Titre et statistiques */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 ml-4 mr-4 lg:ml-14 lg:mr-16">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Liste des Alignements</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {filteredAlignments.length} alignement(s) trouvé(s)
                  {searchTerm && ` pour "${searchTerm}"`}
                </p>
              </div>

              <div className="flex items-center space-x-4 mt-4 lg:mt-0">
                <div className="bg-white dark:bg-gray-800 dark:border dark:border-gray-700 shadow-sm p-3 rounded-lg flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Total: {alignments.length}</span>
                </div>
              </div>
            </div>

            {/* Filtres */}
            <div className="flex flex-wrap gap-4 mb-6 ml-4 mr-4 lg:ml-14 lg:mr-16">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filtrer par statut:</span>
                <select
                  value={selectedStatus}
                  onChange={(e) => {
                    setSelectedStatus(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="tous">Tous les statuts</option>
                  <option value="en_attente">En attente</option>
                  <option value="en_cours">En cours</option>
                  <option value="approuve">Approuvé</option>
                  <option value="rejete">Rejeté</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-8 bg-white dark:bg-gray-800 -mt-10 pt-8 pb-12 transition-colors duration-200">
            {/* Barre de recherche */}
            <div className="ml-4 mr-4 lg:ml-20 lg:mr-20">
              <SearchBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                placeholder="Rechercher par n° dossier, nom, CIN ou adresse..."
              />
            </div>

            {/* Bouton ajouter alignement */}
            <div className="ml-4 mr-4 lg:ml-20 lg:mr-20">
              <button
                onClick={() => navigate('/alignement')}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-800"
              >
                <Plus className="w-5 h-5 mr-2" />
                Ajouter un alignement
              </button>
            </div>

            {/* Tableau des alignements */}
            <div className="bg-white dark:bg-gray-800 border border-transparent dark:border-gray-700 shadow-sm overflow-hidden ml-4 mr-4 lg:ml-20 lg:mr-20 rounded-lg">
              {error && (
                <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4 mb-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                      <button
                        onClick={fetchAlignments}
                        className="mt-2 text-sm text-red-600 dark:text-red-400 hover:underline font-medium"
                      >
                        Réessayer
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {filteredAlignments.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Aucun alignement trouvé</h3>
                  <p className="mt-1 text-gray-500 dark:text-gray-400">
                    {searchTerm || selectedStatus !== 'tous'
                      ? "Aucun alignement ne correspond à vos critères de recherche."
                      : "Aucun alignement n'a été créé pour le moment."}
                  </p>
                  <div className="mt-6">
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedStatus('tous');
                      }}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-800"
                    >
                      Réinitialiser les filtres
                    </button>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-900/50">
                      <tr>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider lg:px-6">
                          N° Dossier
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider lg:px-6">
                          Demandeur
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider lg:px-6">
                          Adresse du terrain
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider lg:px-6">
                          Statut propriétaire
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider lg:px-6">
                          Qualité demandeur
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider lg:px-6">
                          Date de création
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider lg:px-6">
                          Statut
                        </th>
                        <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider lg:px-6">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {paginatedAlignments.map((alignment) => (
                        <tr key={alignment.id_align} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white lg:px-6">
                            #{alignment.id_align}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 lg:px-6">
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">{alignment.nom_demandaire} {alignment.prenom_mandataire}</div>
                              <div className="text-gray-500 dark:text-gray-400 text-xs">{alignment.qualite_demandeur}</div>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300 lg:px-6">
                            <div className="max-w-xs truncate">
                              {alignment.terrain?.adresse || alignment.adresse_demandaire || 'N/A'}
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300 lg:px-6">
                            <div className="max-w-xs truncate">
                              {alignment.status_proprietaire || 'N/A'}
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300 lg:px-6">
                            <div className="max-w-xs truncate">
                              {alignment.qualite_demandeur || 'N/A'}
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 lg:px-6">
                            {formatDate(alignment.created_at)}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 lg:px-6">
                            {getStatusBadge(alignment.statut_alignement || "")}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-right lg:px-6">
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => viewDetails(alignment.id_align)}
                                className="inline-flex items-center px-3 py-1.5 border border-green-600 dark:border-green-500 text-sm font-medium rounded-md text-green-600 dark:text-green-400 bg-white dark:bg-gray-800 hover:bg-green-50 dark:hover:bg-green-950/40 transition-colors"
                                title="Voir détails"
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                Voir plus
                              </button>
                              <button
                                onClick={() => generatePDF(alignment)}
                                className="inline-flex items-center px-3 py-1.5 border border-red-600 dark:border-red-500 text-sm font-medium rounded-md text-red-600 dark:text-red-400 bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                                title="Télécharger PDF"
                              >
                                <Download className="w-4 h-4 mr-1" />
                                PDF
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-6 px-4 py-3 border-t border-gray-200 dark:border-gray-700">
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        Affichage de {startIndex + 1} à {Math.min(startIndex + itemsPerPage, filteredAlignments.length)} sur {filteredAlignments.length} alignement(s)
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-md text-sm text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          Précédent
                        </button>

                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }

                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`px-3 py-1 border rounded-md text-sm ${currentPage === pageNum
                                ? 'bg-green-500 text-white border-green-500'
                                : 'border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}

                        <button
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                          className="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-md text-sm text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          Suivant
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AlignmentListPage;