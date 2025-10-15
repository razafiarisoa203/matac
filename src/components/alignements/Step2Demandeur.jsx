
import { useTranslation } from 'react-i18next';
const Step2Demandeur = ({
  statutProprietaire, setStatutProprietaire, qualiteDemandeur, setQualiteDemandeur,
  formData, handleInputChange, isLoadingUserData, userDataLoaded, resetFormData, loadUserData
}) => {
  const { t } = useTranslation();
  const filterLettersOnly = (value, fieldName) => {
    // Allow only letters, spaces, apostrophes, hyphens
    return value.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ\s'-]/g, '');
  };

  const filterDigitsOnly = (value) => {
    // Allow only digits
    return value.replace(/[^0-9]/g, '');
  };

  const handleFilteredInputChange = (e) => {
    const { name, value } = e.target;
    let filteredValue = value;

    if (['nom', 'prenoms', 'nationalite', 'nomRepresentant', 'prenomsRepresentant', 
        'nom_demandaire', 'prenom_mandataire', 'nationalite_demandaire'].includes(name)) {
      filteredValue = filterLettersOnly(value, name);
    } else if (['cinPasseport', 'cinPasseportRepresentant', 'cin_passeport_demandaire', 
                 'carteStatistique'].includes(name)) {
      filteredValue = filterDigitsOnly(value);
    }

    // Update formData with filtered value
    handleInputChange({ target: { name, value: filteredValue } });
  };

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
                  <span className="text-sm text-blue-700">{t('alignment.chargement_info')}</span>
                </div>
              </div>
            )}
            {userDataLoaded && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
                <span className="text-sm text-green-700">{t('alignment.info_chargees')}</span>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">{t('alignment.civilite')}</label>
              <div className="flex flex-col space-y-3 bg-transparent">
                {["M", "Mme"].map((option) => (
                  <label key={option} className="flex items-center cursor-pointer p-2">
                    <input
                      required
                      type="radio"
                      name="civilite"
                      value={option}
                      checked={formData.civilite === option}
                      onChange={handleInputChange} 
                      className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300"
                    />
                    <span className="ml-3 text-sm text-gray-700 font-medium">
                      {option === "M" ? t('alignment.monsieur') : t('alignment.madame')}
                    </span>
                  </label>
                ))}
                {formData.civilite === "" && (
                  <p className="text-red-500 text-xs mt-1">{t('alignment.champ_requis')}</p>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('alignment.nom')}</label>
              <div className="flex-justify center">
              <input
                required
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleFilteredInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder= {t('alignment.entrez_nom')}
                pattern="^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$"
              />
              </div>
              {formData.nom === "" && (
                <p className="text-red-500 text-xs mt-1">{t('alignment.champ_requis')}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('alignment.prenoms')}</label>
              <input
                required={true}
                type="text"
                name="prenoms"
                value={formData.prenoms}
                onChange={handleFilteredInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder={t('alignment.entrez_prenoms')}
                pattern="^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$"
              />
              {formData.prenoms === "" && (
                <p className="text-red-500 text-xs mt-1">{t('alignment.champ_requis')}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('alignment.cin_passeport')}</label>
              <input
                required={true}
                inputMode="numeric"
                type="text"
                name="cinPasseport"
                value={formData.cinPasseport}
                onChange={handleFilteredInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder={t('alignment.numero_cin_ou_passeport')}
                pattern="^[0-9]+$"
              />
              {formData.cinPasseport === "" && (
                <p className="text-red-500 text-xs mt-1">{t('alignment.champ_requis')}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('alignment.fonction')}</label>
              <input
                required={true}
                type="text"
                name="fonction"
                value={formData.fonction}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder={t('alignment.entrez_fonction')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('alignment.nationalite')}</label>
              <input
                required={true}
                type="text"
                name="nationalite"
                value={formData.nationalite}
                onChange={handleFilteredInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder={t('alignment.entrez_nationalite')}
                pattern="^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$"
              />
              {formData.nationalite === "" && (
                <p className="text-red-500 text-xs mt-1">{t('alignment.champ_requis')}</p>
              )}
            </div>
          </>
        )}
        {statutProprietaire === "particulier" && qualiteDemandeur === "mandataire" && (
          <>
            <div>
            <h3 className="text-lg font-semibold">{t('alignment.identite_demandeur_mandataire')}</h3>
              <label className="block text-sm font-medium text-gray-700 mb-4">{t('alignment.civilite')}</label>
              <div className="flex flex-col space-y-3 bg-transparent">
                {["M", "Mme"].map((option) => (
                  <label key={option} className="flex items-center cursor-pointer p-2">
                    <input
                     required={true}
                      type="radio"
                      name="civilite"
                      value={option}
                      checked={formData.civilite === option}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300"
                    />
                    <span className="ml-3 text-sm text-gray-700 font-medium">
                      {option === "M" ? t('alignment.monsieur') : t('alignment.madame')}
                    </span>
                  </label>
                ))}
                {formData.civilite === "" && (
                  <p className="text-red-500 text-xs mt-1">{t('alignment.champ_requis')}</p>
                )}
              </div>
            </div>
            <div className="justify-center">
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('alignment.nom')}</label>
              <input
                required={true}
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleFilteredInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder={t('alignment.entrez_nom')}
                pattern="^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$"
              />
              {formData.nom === "" && (
                <p className="text-red-500 text-xs mt-1">{t('alignment.champ_requis')}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('alignment.prenoms')}</label>
              <input
                required={true}
                type="text"
                name="prenoms"
                value={formData.prenoms}
                onChange={handleFilteredInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder={t('alignment.entrez_les_prenoms')}
                pattern="^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$"
              />
              {formData.prenoms === "" && (
                <p className="text-red-500 text-xs mt-1">{t('alignment.champ_requis')}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('alignment.cin_passeport')}</label>
              <input
                required={true}
                inputMode="numeric"
                type="text"
                name="cinPasseport"
                value={formData.cinPasseport}
                onChange={handleFilteredInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder={t('alignment.numero_cin_ou_passeport')}
                pattern="^[0-9]+$"
              />
              {formData.cinPasseport === "" && (
                <p className="text-red-500 text-xs mt-1">{t('alignment.champ_requis')}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('alignment.fonction')}</label>
              <input
                required={true}
                type="text"
                name="fonction"
                value={formData.fonction}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder={t('alignment.entrez_fonction')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('alignment.nationalite')}</label>
              <input
                required={true}
                type="text"
                name="nationalite"
                value={formData.nationalite}
                onChange={handleFilteredInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder={t('alignment.entrez_nationalite')}
                pattern="^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$"
              />
              {formData.nationalite === "" && (
                <p className="text-red-500 text-xs mt-1">{t('alignment.champ_requis')}</p>
              )}
            </div>
            <div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">{t('alignment.civilite')}</label>
                <div className="flex flex-col space-y-3 bg-transparent">
                  {["M", "Mme"].map((option) => (
                    <label key={option} className="flex items-center cursor-pointer p-2">
                      <input
                        required={true}
                        type="radio"
                        name="civilite2"
                        value={option}
                        checked={formData.civilite2 === option}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300"
                      />
                      <span className="ml-3 text-sm text-gray-700 font-medium">
                        {option === "M" ? t('alignment.monsieur') : t('alignment.madame')}
                      </span>
                    </label>
                  ))}
                  {formData.civilite2 === "" && (
                    <p className="text-red-500 text-xs mt-1">{t('alignment.champ_requis')}</p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('alignment.nom')}</label>
                <input
                  required={true}
                  type="text"
                  name="nom_demandaire"
                  value={formData.nom_demandaire}
                  onChange={handleFilteredInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder={t('alignment.entrez_nom')}
                  pattern="^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$"
                />
                {formData.nom_demandaire === "" && (
                  <p className="text-red-500 text-xs mt-1">{t('alignment.champ_requis')}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('alignment.prenoms')}</label>
                <input
                  required={true}
                  type="text"
                  name="prenom_mandataire"
                  value={formData.prenom_mandataire}
                  onChange={handleFilteredInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder={t('alignment.entrez_prenoms')}
                  pattern="^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$"
                />

                {formData.prenom_mandataire === "" && (
                  <p className="text-red-500 text-xs mt-1">{t('alignment.champ_requis')}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('alignment.cin_passeport')}</label>
                <input
                  required={true}
                  inputMode="numeric"
                  type="text"
                  name="cin_passeport_demandaire"
                  value={formData.cin_passeport_demandaire}
                  onChange={handleFilteredInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder={t('alignment.numero_cin_ou_passeport')}
                  pattern="^[0-9]+$"
                />
                {formData.cin_passeport_demandaire === "" && (
                  <p className="text-red-500 text-xs mt-1">{t('alignment.champ_requis')}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('alignment.fonction')}</label>
                <input
                  required={true}
                  type="text"
                  name="fonction_demandaire"
                  value={formData.fonction_demandaire}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder={t('alignment.entrez_fonction')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('alignment.nationalite')}</label>
                <input
                  required={true}
                  type="text"
                  name="nationalite_demandaire"
                  value={formData.nationalite_demandaire}
                  onChange={handleFilteredInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder={t('alignment.entrez_nationalite')}
                  pattern="^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$"
                />
                {formData.nationalite_demandaire === "" && (
                  <p className="text-red-500 text-xs mt-1">{t('alignment.champ_requis')}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('alignment.age')}</label>
                <input
                  required={true}
                  inputMode="numeric"
                  type="number"
                  name="age_demandaire"
                  value={formData.age_demandaire}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder={t('alignment.entrez_age')}
                  pattern="^[0-9]+$"
                />
              </div>
            </div>
          </>
        )}
        {statutProprietaire === "personne-morale" && (
          <>
            <h1>{t('alignment.personne_morale')}</h1>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('alignment.raison_sociale')}</label>
              <input
                required={true}
                type="text"
                name="raisonSociale"
                value={formData.raisonSociale}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder={t('alignment.entrez_raison_sociale')}
              />
              {formData.raisonSociale === "" && (
                <p className="text-red-500 text-xs mt-1">{t('alignment.champ_requis')}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('alignment.numero_carte_statistique')}</label>
              <input
                required={true}
                type="text"
                name="carteStatistique"
                value={formData.carteStatistique}
                onChange={handleFilteredInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder={t('alignment.entrez_numero_carte_statistique')}
                inputMode="numeric"
                pattern="^[0-9]+$"
              />
              {formData.carteStatistique === "" && (
                <p className="text-red-500 text-xs mt-1">{t('alignment.champ_requis')}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('alignment.nif')}</label>
              <input
                required={true}
                type="text"
                name="nif"
                value={formData.nif}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder={t('alignment.entrez_nif')}
              />
              {formData.nif === "" && (
                <p className="text-red-500 text-xs mt-1">{t('alignment.champ_requis')}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">{t('alignment.civilite_representant')}</label>
              <div className="flex flex-col space-y-3 bg-transparent">
                {["M", "Mme", "Mlle"].map((option) => (
                  <label key={option} className="flex items-center cursor-pointer p-2">
                    <input
                      required={true}
                      type="radio"
                      name="civiliteRepresentant"
                      value={option}
                      checked={formData.civiliteRepresentant === option}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300"
                    />
                    <span className="ml-3 text-sm text-gray-700 font-medium">
                      {option === "M" ? t('alignment.monsieur') : option === "Mme" ? t('alignment.madame') : t('alignment.mademoiselle')}
                    </span>
                  </label>
                ))}
                {formData.civiliteRepresentant === "" && (
                  <p className="text-red-500 text-xs mt-1">{t('alignment.champ_requis')}</p>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('alignment.nom_representant')}</label>
              <input
                required={true}
                type="text"
                name="nomRepresentant"
                value={formData.nomRepresentant}
                onChange={handleFilteredInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder={t('alignment.entrez_nom_representant')}
                pattern="^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$"
              />
              {formData.nomRepresentant === "" && (
                <p className="text-red-500 text-xs mt-1">{t('alignment.champ_requis')}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('alignment.prenoms_representant')}</label>
              <input
                required={true}
                type="text"
                name="prenomsRepresentant"
                value={formData.prenomsRepresentant}
                onChange={handleFilteredInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder={t('alignment.entrez_prenoms_representant')}
                pattern="^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$"
              />
              {formData.prenomsRepresentant === "" && (
                <p className="text-red-500 text-xs mt-1">{t('alignment.champ_requis')}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('alignment.adresse_representant')}</label>
              <input 
                required={true}
                type="text"
                name="adresseRepresentant"
                value={formData.adresseRepresentant}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder={t('alignment.entrez_adresse_representant')}
              />
              {formData.adresseRepresentant === "" && (
                <p className="text-red-500 text-xs mt-1">{t('alignment.champ_requis')}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('alignment.cin_passeport_representant')}</label>
              <input
                required={true}
                inputMode="numeric"
                type="text"
                name="cinPasseportRepresentant"
                value={formData.cinPasseportRepresentant}
                onChange={handleFilteredInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder={t('alignment.entrez_cin_passeport_representant')}
                pattern="^[0-9]+$"
              />
              {formData.cinPasseportRepresentant === "" && (
                <p className="text-red-500 text-xs mt-1">{t('alignment.champ_requis')}</p>
              )}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div>
      <h3 className="text-xl font-bold text-gray-800 mb-6">{t('alignment.renseignement')}</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 p-6 bg-white border border-gray-200 rounded-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">{t('alignment.statut_proprietaire')}</label>
          <div className="space-y-3">
            <label className="flex items-center cursor-pointer p-2 hover:bg-gray-50 transition-colors">
              <input
                required={true}
                type="radio"
                name="statutProprietaire"
                value="particulier"
                checked={statutProprietaire === "particulier"}
                onChange={(e) => setStatutProprietaire(e.target.value)}
                className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300"
              />
              <span className="ml-3 text-sm text-gray-700 font-medium">{t('alignment.particulier')}</span>
            </label>
            <label className="flex items-center cursor-pointer p-2 hover:bg-gray-50 transition-colors">
              <input
                required={true}
                type="radio"
                name="statutProprietaire"
                value="personne-morale"
                checked={statutProprietaire === "personne-morale"}
                onChange={(e) => setStatutProprietaire(e.target.value)}
                className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300"
              />
              <span className="ml-3 text-sm text-gray-700 font-medium">{t('alignment.personne_morale')}</span>
            </label>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">{t('alignment.qualite_demandeur')}</label>
          <div className="space-y-3">
            <label
              className={`flex items-center p-2 transition-colors ${
                statutProprietaire === "personne-morale" ? "cursor-not-allowed bg-gray-50" : "cursor-pointer hover:bg-gray-50"
              }`}
            >
              <input
                required={true}
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
                {t('alignment.proprietaire')}
              </span>
              {statutProprietaire === "personne-morale" && (
                <span className="ml-2 text-xs text-gray-400 italic">{t('alignment.non_disponible')}</span>
              )}
            </label>
            <label className="flex items-center cursor-pointer p-2 hover:bg-gray-50 transition-colors">
              <input 
                required={true}
                type="radio"
                name="qualiteDemandeur"
                value="mandataire"
                checked={qualiteDemandeur === "mandataire"}
                onChange={handleQualiteDemandeurChange}
                className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300"
              />
              <span className="ml-3 text-sm text-gray-700 font-medium">{t('alignment.mandataire')}</span>
            </label>
          </div>
        </div>
      </div>
      {renderFormContent()}
    </div>
  );
};

export default Step2Demandeur;