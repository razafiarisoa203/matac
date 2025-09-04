import { Link } from "react-router-dom";
import { Target, MapPin, FileText } from "lucide-react";

const InfoCardsSection = () => {
  return (
    <section className="py-16 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Carte Indicateur */}
          <div className="bg-white p-6  -lg shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-lime-400   flex items-center justify-center mr-3">
                <Target className="w-5 h-5 text-gray-800" />
              </div>
              <h3 className="text-lg font-semibold text-lime-600">
                INDICATEUR
              </h3>
            </div>
            <p className="text-gray-600 text-sm">
              Suivez en temps réel les indicateurs clés de performance et les statistiques 
              des demandes de permis de construire à travers le pays.
            </p>
          </div>

          {/* Carte Cartographie */}
          <div className="bg-white p-6  -lg shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-lime-400   flex items-center justify-center mr-3">
                <MapPin className="w-5 h-5 text-gray-800" />
              </div>
              <h3 className="text-lg font-semibold text-lime-600">
                CARTOGRAPHIE
              </h3>
            </div>
            <p className="text-gray-600 text-sm">
              Visualisez les zones d'urbanisme, les permis délivrés et les projets 
              en cours sur notre plateforme cartographique interactive.
            </p>
          </div>

          {/* Carte Documentation */}
          <div className="bg-white p-6  -lg shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-lime-400   flex items-center justify-center mr-3">
                <FileText className="w-5 h-5 text-gray-800" />
              </div>
              <h3 className="text-lg font-semibold text-lime-600">
                DOCUMENTATION
              </h3>
            </div>
            <p className="text-gray-600 text-sm">
              Accédez à tous les documents nécessaires, formulaires et guides 
              pour vos démarches de demande de permis de construire.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InfoCardsSection;
