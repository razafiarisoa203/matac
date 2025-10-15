const Step2Demandeur = ({
  statutProprietaire, setStatutProprietaire, qualiteDemandeur, setQualiteDemandeur,
  formData, handleInputChange, isLoadingUserData, userDataLoaded, resetFormData, loadUserData
}) => {
  const handleQualiteDemandeurChange = (e) => {
    const newValue = e.target.value;
    setQualiteDemandeur(newValue);
    if (newValue === "proprietaire" && statutProprietaire === "particulier") {
      loadUserData();
    } else if (newValue === "mandataire") {
      resetFormData();
    }
  };

  const renderFormContent = () => {
    return (
      <div className="space-y-6">
        {statutProprietaire === "particulier" && qualiteDemandeur === "proprietaire" && (
          <>
            {isLoadingUserData && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                  <span className="text-sm text-blue-700">Chargement des informations utilisateur...</span>
                </div>
              </div>
            )}
            {userDataLoaded && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
                <span className="text-sm text-green-700">✓ Informations utilisateur chargées automatiquement</span>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">Civilité *</label>
              <div className="flex flex-col space-y-3 bg-transparent">
                {["M", "Mme"].map((option) => (
                  <label key={option} className="flex items-center cursor-pointer p-2">
                    <input
                      type="radio"
                      name="civilite"
                      value={option}
                      checked={formData.civilite === option}
                      onChange={handleInputChange} 
                      className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300"
                    />
                    <span className="ml-3 text-sm text-gray-700 font-medium">
                      {option === "M" ? "Monsieur" : "Madame"}
                    </span>
                  </label>
                ))}
                {formData.civilite === "" && (
                  <p className="text-red-500 text-xs mt-1">Ce champ est requis</p>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Entrez votre nom"
              />
              {formData.nom === "" && (
                <p className="text-red-500 text-xs mt-1">Ce champ est requis</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Prénoms *</label>
              <input
                type="text"
                name="prenoms"
                value={formData.prenoms}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Entrez vos prénoms"
              />
              {formData.prenoms === "" && (
                <p className="text-red-500 text-xs mt-1">Ce champ est requis</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">CIN ou Passeport *</label>
              <input
                type="text"
                name="cinPasseport"
                value={formData.cinPasseport}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Numéro de CIN ou Passeport"
              />
              {formData.cinPasseport === "" && (
                <p className="text-red-500 text-xs mt-1">Ce champ est requis</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fonction</label>
              <input
                type="text"
                name="fonction"
                value={formData.fonction}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Entrez votre fonction (facultatif)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nationalité *</label>
              <input
                type="text"
                name="nationalite"
                value={formData.nationalite}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Entrez votre nationalité"
              />
              {formData.nationalite === "" && (
                <p className="text-red-500 text-xs mt-1">Ce champ est requis</p>
              )}
            </div>
          </>
        )}
        {statutProprietaire === "particulier" && qualiteDemandeur === "mandataire" && (
          <>
            <div>
            <h3 className="text-lg font-semibold">Identité du demandeur Mandataire</h3>
              <label className="block text-sm font-medium text-gray-700 mb-4">Civilité *</label>
              <div className="flex flex-col space-y-3 bg-transparent">
                {["M", "Mme"].map((option) => (
                  <label key={option} className="flex items-center cursor-pointer p-2">
                    <input
                      type="radio"
                      name="civilite"
                      value={option}
                      checked={formData.civilite === option}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300"
                    />
                    <span className="ml-3 text-sm text-gray-700 font-medium">
                      {option === "M" ? "Monsieur" : "Madame"}
                    </span>
                  </label>
                ))}
                {formData.civilite === "" && (
                  <p className="text-red-500 text-xs mt-1">Ce champ est requis</p>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Entrez votre nom"
              />
              {formData.nom === "" && (
                <p className="text-red-500 text-xs mt-1">Ce champ est requis</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Prénoms *</label>
              <input
                type="text"
                name="prenoms"
                value={formData.prenoms}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Entrez vos prénoms"
              />
              {formData.prenoms === "" && (
                <p className="text-red-500 text-xs mt-1">Ce champ est requis</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">CIN ou Passeport *</label>
              <input
                type="text"
                name="cinPasseport"
                value={formData.cinPasseport}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Numéro de CIN ou Passeport"
              />
              {formData.cinPasseport === "" && (
                <p className="text-red-500 text-xs mt-1">Ce champ est requis</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fonction</label>
              <input
                type="text"
                name="fonction"
                value={formData.fonction}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Entrez votre fonction (facultatif)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nationalité *</label>
              <input
                type="text"
                name="nationalite"
                value={formData.nationalite}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Entrez votre nationalité"
              />
              {formData.nationalite === "" && (
                <p className="text-red-500 text-xs mt-1">Ce champ est requis</p>
              )}
            </div>
            <div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">Civilité *</label>
                <div className="flex flex-col space-y-3 bg-transparent">
                  {["M", "Mme"].map((option) => (
                    <label key={option} className="flex items-center cursor-pointer p-2">
                      <input
                        type="radio"
                        name="civilite2"
                        value={option}
                        checked={formData.civilite2 === option}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300"
                      />
                      <span className="ml-3 text-sm text-gray-700 font-medium">
                        {option === "M" ? "Monsieur" : "Madame"}
                      </span>
                    </label>
                  ))}
                  {formData.civilite2 === "" && (
                    <p className="text-red-500 text-xs mt-1">Ce champ est requis</p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
                <input
                  type="text"
                  name="nom_demandaire"
                  value={formData.nom_demandaire}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Entrez le nom"
                />
                {formData.nom_demandaire === "" && (
                  <p className="text-red-500 text-xs mt-1">Ce champ est requis</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Prénoms *</label>
                <input
                  type="text"
                  name="prenom_mandataire"
                  value={formData.prenom_mandataire}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Entrez les prénoms"
                />
                {formData.prenom_mandataire === "" && (
                  <p className="text-red-500 text-xs mt-1">Ce champ est requis</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">CIN ou Passeport *</label>
                <input
                  type="text"
                  name="cin_passeport_demandaire"
                  value={formData.cin_passeport_demandaire}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Numéro de CIN ou Passeport"
                />
                {formData.cin_passeport_demandaire === "" && (
                  <p className="text-red-500 text-xs mt-1">Ce champ est requis</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fonction</label>
                <input
                  type="text"
                  name="fonction_demandaire"
                  value={formData.fonction_demandaire}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Entrez la fonction (facultatif)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nationalité *</label>
                <input
                  type="text"
                  name="nationalite_demandaire"
                  value={formData.nationalite_demandaire}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Entrez la nationalité"
                />
                {formData.nationalite_demandaire === "" && (
                  <p className="text-red-500 text-xs mt-1">Ce champ est requis</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                <input
                  type="number"
                  name="age_demandaire"
                  value={formData.age_demandaire}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Entrez l'âge"
                />
              </div>
            </div>
          </>
        )}
        {statutProprietaire === "personne-morale" && (
          <>
            <h1>Personne morale</h1>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Raison sociale *</label>
              <input
                type="text"
                name="raisonSociale"
                value={formData.raisonSociale}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Entrez la raison sociale"
              />
              {formData.raisonSociale === "" && (
                <p className="text-red-500 text-xs mt-1">Ce champ est requis</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Numéro de carte statistique *</label>
              <input
                type="text"
                name="carteStatistique"
                value={formData.carteStatistique}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Entrez le numéro de carte statistique"
              />
              {formData.carteStatistique === "" && (
                <p className="text-red-500 text-xs mt-1">Ce champ est requis</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">NIF *</label>
              <input
                type="text"
                name="nif"
                value={formData.nif}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Entrez le NIF"
              />
              {formData.nif === "" && (
                <p className="text-red-500 text-xs mt-1">Ce champ est requis</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">Civilité du représentant *</label>
              <div className="flex flex-col space-y-3 bg-transparent">
                {["M", "Mme", "Mlle"].map((option) => (
                  <label key={option} className="flex items-center cursor-pointer p-2">
                    <input
                      type="radio"
                      name="civiliteRepresentant"
                      value={option}
                      checked={formData.civiliteRepresentant === option}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300"
                    />
                    <span className="ml-3 text-sm text-gray-700 font-medium">
                      {option === "M" ? "Monsieur" : option === "Mme" ? "Madame" : "Mademoiselle"}
                    </span>
                  </label>
                ))}
                {formData.civiliteRepresentant === "" && (
                  <p className="text-red-500 text-xs mt-1">Ce champ est requis</p>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nom du représentant *</label>
              <input
                type="text"
                name="nomRepresentant"
                value={formData.nomRepresentant}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Entrez le nom du représentant"
              />
              {formData.nomRepresentant === "" && (
                <p className="text-red-500 text-xs mt-1">Ce champ est requis</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Prénoms du représentant *</label>
              <input
                type="text"
                name="prenomsRepresentant"
                value={formData.prenomsRepresentant}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Entrez les prénoms du représentant"
              />
              {formData.prenomsRepresentant === "" && (
                <p className="text-red-500 text-xs mt-1">Ce champ est requis</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Adresse du représentant *</label>
              <input
                type="text"
                name="adresseRepresentant"
                value={formData.adresseRepresentant}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Entrez l'adresse du représentant"
              />
              {formData.adresseRepresentant === "" && (
                <p className="text-red-500 text-xs mt-1">Ce champ est requis</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">CIN ou Passeport du représentant *</label>
              <input
                type="text"
                name="cinPasseportRepresentant"
                value={formData.cinPasseportRepresentant}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Numéro de CIN ou Passeport du représentant"
              />
              {formData.cinPasseportRepresentant === "" && (
                <p className="text-red-500 text-xs mt-1">Ce champ est requis</p>
              )}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div>
      <h3 className="text-xl font-bold text-gray-800 mb-6">Renseignement du demandeur</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 p-6 bg-white border border-gray-200 rounded-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">Spécifiez le Statut du propriétaire *</label>
          <div className="space-y-3">
            <label className="flex items-center cursor-pointer p-2 hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="statutProprietaire"
                value="particulier"
                checked={statutProprietaire === "particulier"}
                onChange={(e) => setStatutProprietaire(e.target.value)}
                className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300"
              />
              <span className="ml-3 text-sm text-gray-700 font-medium">Particulier</span>
            </label>
            <label className="flex items-center cursor-pointer p-2 hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="statutProprietaire"
                value="personne-morale"
                checked={statutProprietaire === "personne-morale"}
                onChange={(e) => setStatutProprietaire(e.target.value)}
                className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300"
              />
              <span className="ml-3 text-sm text-gray-700 font-medium">Personne morale</span>
            </label>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">Spécifiez la Qualité du demandeur *</label>
          <div className="space-y-3">
            <label
              className={`flex items-center p-2 transition-colors ${
                statutProprietaire === "personne-morale" ? "cursor-not-allowed bg-gray-50" : "cursor-pointer hover:bg-gray-50"
              }`}
            >
              <input
                type="radio"
                name="qualiteDemandeur"
                value="proprietaire"
                checked={qualiteDemandeur === "proprietaire"}
                onChange={handleQualiteDemandeurChange}
                disabled={statutProprietaire === "personne-morale"}
                className={`w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300 ${
                  statutProprietaire === "personne-morale" ? "opacity-50 cursor-not-allowed" : ""
                }`}
              />
              <span className={`ml-3 text-sm font-medium ${statutProprietaire === "personne-morale" ? "text-gray-400" : "text-gray-700"}`}>
                Propriétaire
              </span>
              {statutProprietaire === "personne-morale" && (
                <span className="ml-2 text-xs text-gray-400 italic">(non disponible)</span>
              )}
            </label>
            <label className="flex items-center cursor-pointer p-2 hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="qualiteDemandeur"
                value="mandataire"
                checked={qualiteDemandeur === "mandataire"}
                onChange={handleQualiteDemandeurChange}
                className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300"
              />
              <span className="ml-3 text-sm text-gray-700 font-medium">Mandataire</span>
            </label>
          </div>
        </div>
      </div>
      {renderFormContent()}
    </div>
  );
};

export default Step2Demandeur;