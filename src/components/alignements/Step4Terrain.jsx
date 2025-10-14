import { useTranslation } from 'react-i18next';
import { useEffect } from "react";

const Step4Terrain = ({
  statutTerrain,
  setStatutTerrain,
  formData,
  setFormData,
  handleInputChange,
}) => {
  const filterLettersOnly = (value) => {
    // Allow only letters, spaces, apostrophes, hyphens
    return value.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ\s'-]/g, "");
  };
  
 const { t } = useTranslation();

  const filterDigitsOnly = (value) => {
    // Allow only digits
    return value.replace(/[^0-9]/g, "");
  };

  const filterCoordinate = (value) => {
    // Allow digits, decimal point, and minus sign for coordinates
    return value.replace(/[^0-9.-]/g, "");
  };

  const handleLettersInputChange = (e) => {
    const { name, value } = e.target;
    const filteredValue = filterLettersOnly(value);
    handleInputChange({ target: { name, value: filteredValue } });
  };

  const handleDigitsInputChange = (e) => {
    const { name, value } = e.target;
    const filteredValue = filterDigitsOnly(value);
    handleInputChange({ target: { name, value: filteredValue } });
  };

  const handleCoordinateChange = (e) => {
    const { name, value } = e.target;
    let filteredValue = value;
    if (["xv_laborde", "yv_laborde", "longitude", "latitude"].includes(name)) {
      filteredValue = filterCoordinate(value);
    }
    

    // Update the specific field
    handleInputChange({ target: { name, value: filteredValue } });

    // Sync with counterpart
    if (name === "xv_laborde") {
      handleInputChange({
        target: { name: "longitude", value: filteredValue },
      });
    } else if (name === "yv_laborde") {
      handleInputChange({ target: { name: "latitude", value: filteredValue } });
    } else if (name === "longitude") {
      handleInputChange({
        target: { name: "xv_laborde", value: filteredValue },
      });
    } else if (name === "latitude") {
      handleInputChange({
        target: { name: "yv_laborde", value: filteredValue },
      });
    }
  };

  // Récupérer la position GPS si non renseignée
  useEffect(() => {
    if (!formData.longitude || !formData.latitude) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setFormData((prev) => ({
              ...prev,
              longitude: position.coords.longitude,
              latitude: position.coords.latitude,
            }));
            console.log("Position GPS chargée:", position.coords);
          },
          (error) => {
            console.warn(
              "Impossible de récupérer la position GPS, utiliser 0 par défaut",
              error
            );
            setFormData((prev) => ({
              ...prev,
              longitude: 0,
              latitude: 0,
            }));
          }
        );
      } else {
        console.warn("Geolocation non supportée, utiliser 0 par défaut");
        setFormData((prev) => ({
          ...prev,
          longitude: 0,
          latitude: 0,
        }));
      }
    }
  }, []);

  const renderInputField = (field) => {
    const lettersOnlyFields = ["nom_proprietaire"];
    const digitsOnlyFields = [
      "num_titre",
      "indice",
      "num_parcelle",
      "num_karatany",
    ];
    const coordinateFields = [
      "xv_laborde",
      "yv_laborde",
      "longitude",
      "latitude",
    ];

    let onChangeHandler = handleInputChange;
    let inputType = field === "superficie" ? "number" : "text";
    let inputProps = {};

    if (lettersOnlyFields.includes(field)) {
      onChangeHandler = handleLettersInputChange;
      inputType = "text";
      inputProps.pattern = "^[A-Za-zÀ-ÖØ-öø-ÿ\\s'-]+$";
    } else if (digitsOnlyFields.includes(field)) {
      onChangeHandler = handleDigitsInputChange;
      inputType = "text";
      inputProps.inputMode = "numeric";
      inputProps.pattern = "^[0-9]+$";
    } else if (coordinateFields.includes(field)) {
      onChangeHandler = handleCoordinateChange;
      inputType = "number";
      inputProps.step = "any";
      inputProps.min = "-180"; // For longitude, but approximate
      inputProps.max = "180";
    } else if (field === "superficie") {
      inputType = "number";
      inputProps.step = "any";
      inputProps.min = "0";
    }

    return (
      <div key={field}>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t(`alignment.${field}`)} *
        </label>
        <input
          type={inputType}
          {...inputProps}
          name={field}
          value={
            field === "xv_laborde"
              ? formData.longitude || ""
              : field === "yv_laborde"
                ? formData.latitude || ""
                : formData[field] || ""
          }
          onChange={onChangeHandler}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
        {!formData[field] && (
          <p className="text-red-500 text-xs mt-1">  {t('alignment.champ_requis')}</p>
        )}
      </div>
    );
  };

  return (
    <div>
      <h3 className="text-xl font-bold text-gray-800 mb-6">
       {t('alignment.identite_terrain')}
      </h3>

      {/* Choix du statut du terrain */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8 p-6 bg-white border border-gray-200 rounded-lg">
        {["titre", "cadastre", "certificat-foncier"].map((status) => (
          <label
            key={status}
            className="flex items-center cursor-pointer p-2 hover:bg-gray-50 transition-colors"
          >
            <input
              type="radio"
              name="statutTerrain"
              value={status}
              checked={statutTerrain === status}
              onChange={(e) => setStatutTerrain(e.target.value)}
              className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300"
            />
            <span className="ml-3 text-sm text-gray-700 font-medium">
              {status === "titre"
                ? t('alignment.titre')
                : status === "cadastre"
                  ? t('alignment.cadastre')
                  : t('alignment.certificat_foncier')}
            </span>
          </label>
        ))}
      </div>

      {/* Champs du formulaire selon le type de terrain */}
      <div className="space-y-6">
        {statutTerrain === "titre" && (
          <>
            {[
              "num_titre",
              "indice",
              "nom_proprietaire",
              "adresse",
              "num_parcelle",
              "section_dite",
              "canton",
              "superficie",
              "xv_laborde",
              "yv_laborde",
            ].map(renderInputField)}

            {/* Champs optionnels */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                 {t('alignment.num_karatany')}
              </label>
              <input
                type="text"
                inputMode="numeric"
                pattern="^[0-9]+$"
                name="num_karatany"
                value={formData.num_karatany || ""}
                onChange={handleDigitsInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('alignment.fokotany')} 
              </label>
              <input
                type="text"
                name="fokotany"
                value={formData.fokotany || ""}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </>
        )}

        {statutTerrain === "cadastre" && (
          <>
            {[
              "num_parcelle",
              "section_dite",
              "canton",
              "adresse",
              "superficie",
              "longitude",
              "latitude",
            ].map(renderInputField)}
          </>
        )}

        {statutTerrain === "certificat-foncier" && (
          <>
            {[
              "num_karatany",
              "adresse",
              "fokotany",
              "canton",
              "superficie",
              "longitude",
              "latitude",
            ].map(renderInputField)}
          </>
        )}
      </div>
    </div>
  );
};

export default Step4Terrain;
