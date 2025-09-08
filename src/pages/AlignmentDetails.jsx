import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, User, Calendar, FileText, Download, Eye } from "lucide-react";

const API_BASE_ALIGNMENT = import.meta.env.VITE_API_SERVICEALIGNMENT || 'http://localhost:3000';

const AlignmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [alignment, setAlignment] = useState(null);
  const [pieceJointes, setPieceJointes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      fetchAlignmentDetails();
      fetchPieceJointes();
    }
  }, [id, fetchAlignmentDetails, fetchPieceJointes]);

  const fetchAlignmentDetails = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_ALIGNMENT}/servicealignement/alignment/${id}`);

      if (!response.ok) {
        throw new Error('Alignement non trouvé');
      }

      const data = await response.json();
      setAlignment(data);
    } catch (err) {
      setError(err.message);
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchPieceJointes = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_ALIGNMENT}/servicealignement/piece-jointe/alignment/${id}`);
      
      if (response.ok) {
        const data = await response.json();
        setPieceJointes(data);
      }
    } catch (err) {
      console.error('Erreur lors de la récupération des pièces jointes:', err);
    }
  }, [id]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      'en_cours': { color: 'bg-yellow-100 text-yellow-800', text: 'En cours' },
      'approuve': { color: 'bg-green-100 text-green-800', text: 'Approuvé' },
      'rejete': { color: 'bg-red-100 text-red-800', text: 'Rejeté' },
      'en_attente': { color: 'bg-blue-100 text-blue-800', text: 'En attente' }
    };

    const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', text: status || 'En attente' };

    return (
      <span className={`inline-flex items-center px-3 py-1  -full text-sm font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTerrainStatusText = (status) => {
    const statusMap = {
      'titre': 'Titre foncier',
      'cadastre': 'Cadastre',
      'certificat-foncier': 'Certificat foncier'
    };
    return statusMap[status] || status;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin  -full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des détails...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200  -md p-6">
            <p className="text-red-700 mb-4">{error}</p>
            <button
              onClick={() => navigate('/alignment-list')}
              className="bg-green-600 text-white px-4 py-2  -md hover:bg-green-700 transition-colors"
            >
              Retour à la liste
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/alignment-list')}
                className="mr-4 p-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h1 className="text-xl font-semibold text-gray-900">
                Détails de l'Alignement #{alignment?.id_align}
              </h1>
            </div>
            {getStatusBadge(alignment?.status)}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Informations principales */}
            <div className="lg:col-span-2 space-y-6">

              {/* Informations du demandeur */}
              <div className="bg-white overflow-hidden shadow  -lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg text-green-600 font-medium text-gray-900 mb-4 flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Informations du Demandeur
                  </h3>
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Statut du propriétaire</dt>
                      <dd className="mt-1 text-sm text-gray-900 capitalize">{alignment?.status_proprietaire || 'N/A'}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Qualité du demandeur</dt>
                      <dd className="mt-1 text-sm text-gray-900 capitalize">{alignment?.qualite_demandeur || 'N/A'}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">NIF</dt>
                      <dd className="mt-1 text-sm text-gray-900">{alignment?.nif || 'N/A'}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">ID Mandataire</dt>
                      <dd className="mt-1 text-sm text-gray-900">{alignment?.id_mandataire || 'N/A'}</dd>
                    </div>
                  </dl>
                </div>
              </div>

              {/* Informations du terrain */}
              {alignment?.terrain && (
                <div className="bg-white overflow-hidden shadow  -lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg text-green-600 font-medium text-gray-900 mb-4 flex items-center">
                      <MapPin className="h-5 w-5 mr-2" />
                      Informations du Terrain
                    </h3>
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <dt className="text-sm font-medium text-gray-500">Adresse</dt>
                        <dd className="mt-1 text-sm text-gray-900">{alignment.terrain.adresse}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Superficie</dt>
                        <dd className="mt-1 text-sm text-gray-900">{alignment.terrain.superficie} m²</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Statut du terrain</dt>
                        <dd className="mt-1 text-sm text-gray-900">{getTerrainStatusText(alignment.terrain.statut_terrain)}</dd>
                      </div>
                      {alignment.terrain.num_titre && (
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Numéro de titre</dt>
                          <dd className="mt-1 text-sm text-gray-900">{alignment.terrain.num_titre}</dd>
                        </div>
                      )}
                      {alignment.terrain.nom_proprietaire && (
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Propriétaire</dt>
                          <dd className="mt-1 text-sm text-gray-900">{alignment.terrain.nom_proprietaire}</dd>
                        </div>
                      )}
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Coordonnées</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          Lat: {alignment.terrain.latitude}, Long: {alignment.terrain.longitude}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              )}

              {/* Documents administratifs */}
              <div className="bg-white overflow-hidden shadow  -lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg text-green-600 font-medium text-gray-900 mb-4 flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Documents Administratifs
                  </h3>
                  {pieceJointes.length > 0 ? (
                    <div className="space-y-3">
                      {pieceJointes.map((piece, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50  -md">
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 text-gray-400 mr-3" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">{piece.nom_piece}</p>
                              <p className="text-xs text-gray-500">
                                Ajouté le {formatDate(piece.uploaded_at)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {piece.url_fichier && (
                              <a
                                href={piece.url_fichier}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-green-600 hover:text-green-800 transition-colors"
                              >
                                <Eye className="h-4 w-4" />
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm italic">Aucun document disponible</p>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar - Informations complémentaires */}
            <div className="space-y-6">

              {/* Résumé */}
              <div className="bg-white overflow-hidden shadow  -lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg text-green-600 font-medium text-gray-900 mb-4">Résumé</h3>
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Date de création</dt>
                      <dd className="mt-1 text-sm text-gray-900 flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        {formatDate(alignment?.created_at)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Dernière mise à jour</dt>
                      <dd className="mt-1 text-sm text-gray-900 flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        {formatDate(alignment?.updated_at)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Nombre de documents</dt>
                      <dd className="mt-1 text-sm text-gray-900">{pieceJointes.length}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AlignmentDetails;
