import { useEffect } from "react";

const Step4Terrain = ({ statutTerrain, setStatutTerrain, formData, setFormData, handleInputChange }) => {
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
            console.warn("Impossible de récupérer la position GPS, utiliser 0 par défaut", error);
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

  const renderInputField = (field) => (
    <div key={field}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {field.replace("_", " ")} *
      </label>
      <input
        type={field === "superficie" ? "number" : "text"}
        name={field}
        value={
          field === "xv_laborde" ? formData.longitude || "" :
          field === "yv_laborde" ? formData.latitude || "" :
          formData[field] || ""
        }
        onChange={handleInputChange}
        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
      />
      {!formData[field] && <p className="text-red-500 text-xs mt-1">Ce champ est requis</p>}
    </div>
  );

  return (
    <div>
      <h3 className="text-xl font-bold text-gray-800 mb-6">Identité du Terrain</h3>

      {/* Choix du statut du terrain */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8 p-6 bg-white border border-gray-200 rounded-lg">
        {["titre", "cadastre", "certificat-foncier"].map((status) => (
          <label key={status} className="flex items-center cursor-pointer p-2 hover:bg-gray-50 transition-colors">
            <input
              type="radio"
              name="statutTerrain"
              value={status}
              checked={statutTerrain === status}
              onChange={(e) => setStatutTerrain(e.target.value)}
              className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300"
            />
            <span className="ml-3 text-sm text-gray-700 font-medium">
              {status === "titre" ? "Titre" : status === "cadastre" ? "Cadastre" : "Certificat foncier"}
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
              "yv_laborde"
            ].map(renderInputField)}

            {/* Champs optionnels */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Numéro Karatany (optionnel)</label>
              <input
                type="text"
                name="num_karatany"
                value={formData.num_karatany || ""}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fokotany (optionnel)</label>
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
            {["num_parcelle", "section_dite", "canton", "adresse", "superficie", "longitude", "latitude"].map(renderInputField)}
          </>
        )}

        {statutTerrain === "certificat-foncier" && (
          <>
            {["num_karatany", "adresse", "fokotany", "canton", "superficie", "longitude", "latitude"].map(renderInputField)}
          </>
        )}
      </div>
    </div>
  );
};

export default Step4Terrain;
