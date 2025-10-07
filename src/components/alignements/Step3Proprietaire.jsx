const Step3Proprietaire = ({ formData, handleInputChange }) => {
  return (
    <>
      <h3 className="text-xl font-medium text-gray-800 mb-8">Coordonnées du propriétaire</h3>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Adresse *</label>
          <input
            type="text"
            name="adresse_proprietaire"
            value={formData.adresse_proprietaire || ""}
            onChange={handleInputChange}
            placeholder="Adresse"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          {!formData.adresse_proprietaire && <p className="text-red-500 text-xs mt-1">Ce champ est requis</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Contact du propriétaire *</label>
          <input
            type="tel"
            name="contact_proprietaire"
            value={formData.contact_proprietaire || ""}
            onChange={handleInputChange}
            placeholder="Numéro de contact"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          {!formData.contact_proprietaire && <p className="text-red-500 text-xs mt-1">Ce champ est requis</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Adresse électronique *</label>
          <textarea
            name="email_proprietaire"
            value={formData.email_proprietaire || ""}
            onChange={handleInputChange}
            placeholder="Adresse électronique"
            rows="1"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          {!formData.email_proprietaire && <p className="text-red-500 text-xs mt-1">Ce champ est requis</p>}
        </div>
      </div>
    </>
  );
};

export default Step3Proprietaire;