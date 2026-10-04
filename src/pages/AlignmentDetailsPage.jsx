// src/pages/AlignmentDetailsPage.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from '../components/Sidebar';
import HeaderDashboard from '../components/HeaderDashboard';
import { alignmentService } from '../services/api/alignmentService';
import {
  Eye,
  Download,
  AlertCircle,
  MapPin,
  ChevronRight,
  ArrowLeft,
  User,
  FileText,
  Home,
  IdCard,
  Building,
  Briefcase
} from 'lucide-react';
import { Link } from "react-router-dom";
import { viewJoinFiles } from "../services/api/uploadService";

const AlignmentDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [alignment, setAlignment] = useState(null);
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

  // Fonction pour récupérer les détails de l'alignement
  const fetchAlignmentDetails = async () => {
    try {
      setLoading(true);
      const response = await alignmentService.getAlignmentById(id);
      console.log("Alignements: ", response);
      setAlignment(response.data || response);
      console.dir(response.id_cert_sit_jur, { depth: null });
    } catch (err) {
      setError(err.message || "Erreur de récupération des détails de l'alignement");
      console.error("Erreur:", err);
    } finally {
      setLoading(false);
    }
  };

  // Charger les détails au montage du composant
  useEffect(() => {
    if (id) {
      fetchAlignmentDetails();
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

  // Fonction pour générer le PDF
  const generatePDF = async () => {
    if (!alignment) {
      alert("Aucune donnée d'alignement disponible pour générer le PDF.");
      return;
    }

    try {
      // Import dynamique : évite de charger jsPDF tant que l'utilisateur
      // n'a pas demandé la génération du document.
      const [{ default: jsPDF }, { default: autoTable }] = await Promise.all([
        import("jspdf"),
        import("jspdf-autotable")
      ]);

      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      const margin = 15;
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      // Couleur principale
      const green = [101, 163, 13];
      const dark = [31, 41, 55];
      const gray = [107, 114, 128];

      const safe = (value) => {
        if (value === null || value === undefined || value === "") return "N/A";
        return String(value);
      };

      const addHeader = () => {
        doc.setFillColor(...green);
        doc.rect(0, 0, pageWidth, 28, "F");

        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text("DÉTAILS DE L'ALIGNEMENT", margin, 12);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.text(
          `Alignement #${safe(alignment.id_align)}`,
          margin,
          20
        );

        doc.setTextColor(...dark);
      };

      const addFooter = () => {
        const pageCount = doc.internal.getNumberOfPages();

        for (let page = 1; page <= pageCount; page++) {
          doc.setPage(page);
          doc.setFont("helvetica", "normal");
          doc.setFontSize(8);
          doc.setTextColor(...gray);

          doc.text(
            `Alignement #${safe(alignment.id_align)}`,
            margin,
            pageHeight - 8
          );

          doc.text(
            `Page ${page} / ${pageCount}`,
            pageWidth - margin,
            pageHeight - 8,
            { align: "right" }
          );
        }
      };

      addHeader();

      // Informations générales
      autoTable(doc, {
        startY: 35,
        margin: { left: margin, right: margin },
        head: [["INFORMATIONS GÉNÉRALES", "VALEUR"]],
        body: [
          ["Identifiant", safe(alignment.id_align)],
          ["Statut", safe(alignment.status || "en_attente")],
          ["Statut propriétaire", safe(alignment.status_proprietaire)],
          ["Qualité du demandeur", safe(alignment.qualite_demandeur)],
          ["Raison sociale", safe(alignment.raison_social)],
          ["NIF", safe(alignment.nif)],
          ["Date de création", formatDate(alignment.created_at)],
          ["Dernière mise à jour", formatDate(alignment.updated_at)],
          ["ID Mandataire", safe(alignment.id_mandataire)],
          ["Numéro carte statistique", safe(alignment.num_carte_stat)]
        ],
        theme: "grid",
        headStyles: {
          fillColor: green,
          textColor: [255, 255, 255],
          fontStyle: "bold"
        },
        styles: {
          font: "helvetica",
          fontSize: 9,
          cellPadding: 3,
          overflow: "linebreak"
        },
        columnStyles: {
          0: { cellWidth: 65, fontStyle: "bold" },
          1: { cellWidth: 115 }
        }
      });

      // Demandeur
      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 8,
        margin: { left: margin, right: margin },
        head: [["INFORMATIONS DU DEMANDEUR", "VALEUR"]],
        body: [
          ["Nom", safe(alignment.nom_demandaire)],
          ["Prénom", safe(alignment.prenom_mandataire)],
          ["CIN / Passeport", safe(alignment.cin_passeport_demandaire)],
          ["Âge", safe(alignment.age_demandaire)],
          ["Nationalité", safe(alignment.nationalite_demandaire)],
          ["Adresse", safe(alignment.adresse_demandaire)],
          ["Fonction", safe(alignment.fonction_demandaire)],
          ["Qualité du demandeur", safe(alignment.qualite_demandeur)]
        ],
        theme: "grid",
        headStyles: {
          fillColor: green,
          textColor: [255, 255, 255],
          fontStyle: "bold"
        },
        styles: {
          font: "helvetica",
          fontSize: 9,
          cellPadding: 3,
          overflow: "linebreak"
        },
        columnStyles: {
          0: { cellWidth: 65, fontStyle: "bold" },
          1: { cellWidth: 115 }
        }
      });

      // Terrain
      const terrain = alignment.terrain;

      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 8,
        margin: { left: margin, right: margin },
        head: [["INFORMATIONS DU TERRAIN", "VALEUR"]],
        body: [
          ["Adresse du terrain", safe(terrain?.adresse)],
          ["ID Terrain", safe(alignment.id_terrain)],
          ["Commune", safe(terrain?.commune)],
          ["Région", safe(terrain?.region)],
          ["Fokontany", safe(terrain?.fokontany)],
          [
            "Superficie",
            terrain?.superficie
              ? `${terrain.superficie} m²`
              : "N/A"
          ],
          ["Type de terrain", safe(terrain?.type_terrain)],
          ["Usage prévu", safe(terrain?.usage)],
          ["Propriétaire", safe(terrain?.proprietaire)],
          ["Numéro lot", safe(terrain?.numero_lot)],
          ["Limites", safe(terrain?.limites)]
        ],
        theme: "grid",
        headStyles: {
          fillColor: green,
          textColor: [255, 255, 255],
          fontStyle: "bold"
        },
        styles: {
          font: "helvetica",
          fontSize: 9,
          cellPadding: 3,
          overflow: "linebreak"
        },
        columnStyles: {
          0: { cellWidth: 65, fontStyle: "bold" },
          1: { cellWidth: 115 }
        }
      });

      // Documents et références
      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 8,
        margin: { left: margin, right: margin },
        head: [["DOCUMENTS ET RÉFÉRENCES", "VALEUR"]],
        body: [
          [
            "Certificat de situation juridique",
            safe(alignment.id_cert_sit_jur)
          ],
          ["Plan officiel", safe(alignment.id_plan_off)],
          ["NIF", safe(alignment.nif)],
          [
            "Numéro carte statistique",
            safe(alignment.num_carte_stat)
          ]
        ],
        theme: "grid",
        headStyles: {
          fillColor: green,
          textColor: [255, 255, 255],
          fontStyle: "bold"
        },
        styles: {
          font: "helvetica",
          fontSize: 9,
          cellPadding: 3,
          overflow: "linebreak"
        },
        columnStyles: {
          0: { cellWidth: 65, fontStyle: "bold" },
          1: { cellWidth: 115 }
        }
      });

      addFooter();

      // Nom de fichier propre et compatible Windows/Linux
      const fileName = `alignement_${safe(alignment.id_align)
        .replace(/[^a-zA-Z0-9_-]/g, "_")}.pdf`;

      doc.save(fileName);

      console.log("PDF généré avec succès :", fileName);
    } catch (error) {
      console.error("Erreur lors de la génération du PDF :", error);
      alert(
        "Impossible de générer le PDF. Vérifiez que les dépendances jsPDF et jspdf-autotable sont installées."
      );
    }
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
                  <p className="mt-4 text-gray-600">Chargement des détails de l'alignement...</p>
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
                      onClick={fetchAlignmentDetails}
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

  if (!alignment) {
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
                <h3 className="mt-4 text-lg font-medium text-gray-900">Alignement non trouvé</h3>
                <p className="mt-1 text-gray-500">
                  L'alignement demandé n'existe pas.
                </p>
                <div className="mt-6">
                  <button
                    onClick={() => navigate('/alignement-list')}
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
              <Link to="/alignement-list" className="text-black">Alignements</Link>
              <ChevronRight className="w-4 h-4 mx-2 text-black" />
              <span className="text-black">Détails de l'alignement #{alignment.id_align}</span>
            </nav>

            {/* En-tête avec informations principales */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 ml-4 mr-4 lg:ml-14 lg:mr-16">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate('/alignement-list')}
                  className="p-2 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Alignement #{alignment.id_align}
                  </h1>
                  <div className="flex items-center space-x-4 mt-2">
                    {getStatusBadge(alignment.status || 'en_attente')}
                    <span className="text-sm text-gray-600">
                      Créé le {formatDate(alignment.created_at)}
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
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'general'
                    ? 'border-lime-500 text-lime-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Informations Générales
                </button>
                <button
                  onClick={() => setActiveTab('demandeur')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'demandeur'
                    ? 'border-lime-500 text-lime-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  <User className="w-4 h-4 inline mr-2" />
                  Informations du Demandeur
                </button>
                <button
                  onClick={() => setActiveTab('terrain')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'terrain'
                    ? 'border-lime-500 text-lime-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  <Home className="w-4 h-4 inline mr-2" />
                  Informations du Terrain
                </button>
                <button
                  onClick={() => setActiveTab('documents')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'documents'
                    ? 'border-lime-500 text-lime-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  <FileText className="w-4 h-4 inline mr-2" />
                  Documents et Références
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
                      <MapPin className="w-5 h-5 mr-2 text-lime-600" />
                      Identification de la Demande
                    </h3>
                    <div className="space-y-4">
                      <InfoRow label="Statut propriétaire" value={alignment.status_proprietaire} />
                      <InfoRow label="Qualité du demandeur" value={alignment.qualite_demandeur} />
                      <InfoRow label="Raison sociale" value={alignment.raison_social} />
                      <InfoRow label="NIF" value={alignment.nif} />
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Briefcase className="w-5 h-5 mr-2 text-lime-600" />
                      Informations Administratives
                    </h3>
                    <div className="space-y-4">
                      <InfoRow label="Date de création" value={formatDate(alignment.created_at)} />
                      <InfoRow label="Dernière mise à jour" value={formatDate(alignment.updated_at)} />
                      <InfoRow label="ID Mandataire" value={alignment.id_mandataire} />
                      <InfoRow label="Numéro carte statistique" value={alignment.num_carte_stat} />
                    </div>
                  </div>
                </div>
              )}

              {/* Onglet Informations du Demandeur */}
              {activeTab === 'demandeur' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <User className="w-5 h-5 mr-2 text-lime-600" />
                      Identité du Demandeur
                    </h3>
                    <div className="space-y-4">
                      <InfoRow label="Nom" value={alignment.nom_demandaire} />
                      <InfoRow label="Prénom" value={alignment.prenom_mandataire} />
                      <InfoRow label="CIN/Passeport" value={alignment.cin_passeport_demandaire} />
                      <InfoRow label="Âge" value={alignment.age_demandaire} />
                      <InfoRow label="Nationalité" value={alignment.nationalite_demandaire} />
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <IdCard className="w-5 h-5 mr-2 text-lime-600" />
                      Coordonnées et Profession
                    </h3>
                    <div className="space-y-4">
                      <InfoRow label="Adresse" value={alignment.adresse_demandaire} />
                      <InfoRow label="Fonction" value={alignment.fonction_demandaire} />
                      <InfoRow label="Qualité du demandeur" value={alignment.qualite_demandeur} />
                    </div>
                  </div>
                </div>
              )}

              {/* Onglet Informations du Terrain */}
              {activeTab === 'terrain' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Home className="w-5 h-5 mr-2 text-lime-600" />
                      Localisation du Terrain
                    </h3>
                    <div className="space-y-4">
                      <InfoRow label="Adresse du terrain" value={alignment.terrain?.adresse} />
                      <InfoRow label="ID Terrain" value={alignment.id_terrain} />
                      {alignment.terrain && (
                        <>
                          <InfoRow label="Commune" value={alignment.terrain.commune} />
                          <InfoRow label="Région" value={alignment.terrain.region} />
                          <InfoRow label="Fokontany" value={alignment.terrain.fokontany} />
                          <InfoRow label="Superficie" value={alignment.terrain.superficie ? `${alignment.terrain.superficie} m²` : 'N/A'} />
                        </>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Building className="w-5 h-5 mr-2 text-lime-600" />
                      Caractéristiques du Terrain
                    </h3>
                    <div className="space-y-4">
                      {alignment.terrain ? (
                        <>
                          <InfoRow label="Type de terrain" value={alignment.terrain.type_terrain} />
                          <InfoRow label="Usage prévu" value={alignment.terrain.usage} />
                          <InfoRow label="Propriétaire" value={alignment.terrain.proprietaire} />
                          <InfoRow label="Numéro lot" value={alignment.terrain.numero_lot} />
                          <InfoRow label="Limites" value={alignment.terrain.limites} />
                        </>
                      ) : (
                        <p className="text-gray-500 text-sm">Aucune information de terrain disponible</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Onglet Documents et Références */}
              {activeTab === 'documents' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <FileText className="w-5 h-5 mr-2 text-lime-600" />
                      Références Administratives
                    </h3>
                    <div className="space-y-4">
                      <InfoRow
                        label="ID Certificat situation juridique"
                        value={alignment.id_cert_sit_jur ? alignment.id_cert_sit_jur.split('.')[0] : ''}
                      />

                      <InfoRow
                        label="ID Plan officiel"
                        value={alignment.id_plan_off ? alignment.id_plan_off.split('.')[0] : ''}
                      />

                      <InfoRow label="NIF" value={alignment.nif} />
                      <InfoRow label="Numéro carte statistique" value={alignment.num_carte_stat} />
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <FileText className="w-5 h-5 mr-2 text-lime-600" />
                      Pièces Jointes
                    </h3>
                    <div className="space-y-4">
                      {alignment.id_cert_sit_jur || alignment.id_plan_off ? (
                        <div className="space-y-3">
                          {/* Certificat situation juridique */}
                          {alignment.id_cert_sit_jur && (
                            <div className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                              <span className="text-sm font-medium text-gray-900">
                                {alignment.id_cert_sit_jur}
                              </span>
                              <a
                                href={viewJoinFiles({ filePath: alignment.id_cert_sit_jur })}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-lime-600 hover:text-lime-700 text-sm font-medium"
                              >
                                Télécharger
                              </a>

                            </div>
                          )}

                          {/* Plan officiel */}
                          {alignment.id_plan_off && (
                            <div className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                              <span className="text-sm font-medium text-gray-900">
                                {alignment.id_plan_off}
                              </span>
                              <a
                                href={viewJoinFiles({ filePath: alignment.id_plan_off })}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-lime-600 hover:text-lime-700 text-sm font-medium"
                                download
                              >
                                Télécharger
                              </a>
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">Aucune pièce jointe disponible</p>
                      )}
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

export default AlignmentDetailsPage;