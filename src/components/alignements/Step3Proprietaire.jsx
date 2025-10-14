import { useTranslation } from 'react-i18next';
const Step3Proprietaire = ({ formData, handleInputChange }) => {
  const { t } = useTranslation();
  return (
    <>
      <h3 className="text-xl font-medium text-gray-800 mb-8">{t('alignment.information')}</h3>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('alignment.adresse')}</label>
          <input
            type="text"
            name="adresse_proprietaire"
            value={formData.adresse_proprietaire || ""}
            onChange={handleInputChange}
            placeholder="Adresse"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          {!formData.adresse_proprietaire && <p className="text-red-500 text-xs mt-1">{t('alignment.champ_requis')}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('alignment.contact')}</label>
          <input
            type="tel"
            name="contact_proprietaire"
            value={formData.contact_proprietaire || ""}
            onChange={handleInputChange}
            placeholder="Numéro de contact"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          {!formData.contact_proprietaire && <p className="text-red-500 text-xs mt-1">{t('alignment.champ_requis')}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('alignment.email')}</label>
          <textarea
            name="email_proprietaire"
            value={formData.email_proprietaire || ""}
            onChange={handleInputChange}
            placeholder="Adresse électronique"
            rows="1"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          {!formData.email_proprietaire && <p className="text-red-500 text-xs mt-1">{t('alignment.champ_requis')}</p>}
        </div>
      </div>
    </>
  );
};

export default Step3Proprietaire;