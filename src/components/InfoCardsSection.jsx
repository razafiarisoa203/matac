import { FileText, MapPin, Target } from "lucide-react";
import { useTranslation } from "react-i18next";

const InfoCardsSection = () => {
  const { t } = useTranslation();
  return (
    <section className="py-16 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Carte Indicateur */}
          <div className="bg-white p-6  -lg shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-lime-300   flex items-center justify-center mr-3">
                <Target className="w-5 h-5 text-gray-800" />
              </div>
              <h3 className="text-lg font-semibold text-lime-600">
                {t('infoCards.indicator.title')}
              </h3>
            </div>
            <p className="text-gray-600 text-sm">
              {t('infoCards.indicator.description')}
            </p>
          </div>

          {/* Carte Cartographie */}
          <div className="bg-white p-6  -lg shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-lime-300   flex items-center justify-center mr-3">
                <MapPin className="w-5 h-5 text-gray-800" />
              </div>
              <h3 className="text-lg font-semibold text-lime-600">
                {t('infoCards.mapping.title')}
              </h3>
            </div>
            <p className="text-gray-600 text-sm">
              {t('infoCards.mapping.description')}
            </p>
          </div>

          {/* Carte Documentation */}
          <div className="bg-white p-6  -lg shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-lime-300   flex items-center justify-center mr-3">
                <FileText className="w-5 h-5 text-gray-800" />
              </div>
              <h3 className="text-lg font-semibold text-lime-600">
                {t('infoCards.documentation.title')}
              </h3>
            </div>
            <p className="text-gray-600 text-sm">
              {t('infoCards.documentation.description')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InfoCardsSection;
