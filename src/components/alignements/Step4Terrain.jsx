import { useState, useCallback } from "react";
import { alignmentService } from "../../services/api/alignmentService";
import { useTranslation } from 'react-i18next';

const Step4Terrain = ({
  statutTerrain,
  setStatutTerrain,
  formData,
  setFormData,
  handleInputChange,
  
}) => {
  const [verificationMessage, setVerificationMessage] = useState("");
  const [terrainVisible, setTerrainVisible] = useState(false); // contrôle d'affichage
  const num_titre = formData.num_titre;
  const { t } = useTranslation();

  // Vérification manuelle (seulement pour statut "titre")
  const handleVerifyTerrain = useCallback(async () => {
    try {
      if (statutTerrain !== "titre") {
        //Si ce n’est pas un titre → vider et masquer
        setFormData((prev) => ({
          ...prev,
          id_terrain: "",
          num_titre: "",
          indice: "",
          nom_proprietaire: "",
          adresse: "",
          superficie: "",
          num_parcelle: "",
          section_dite: "",
          canton: "",
          num_karatany: "",
          fokotany: "",
          longitude: "",
          latitude: "",
        }));
        setTerrainVisible(false);
        setVerificationMessage("La vérification ne s’applique qu’au statut 'titre' ");
        return;
      }

      const terrain = await alignmentService.getTerrainByTitre(num_titre);
      console.log("Terrain récupéré :", terrain);

      if (!terrain) {
        setVerificationMessage("Terrain introuvable");
        setTerrainVisible(false); //cacher les champs
        return;
      }

      // Remplir automatiquement si trouvé
      setFormData((prev) => ({
        ...prev,
        id_terrain: terrain.id_terrain || "",
        num_titre: terrain.num_titre || "",
        indice: terrain.indice || "",
        nom_proprietaire: terrain.nom_proprietaire || "",
        adresse: terrain.adresse || "",
        superficie: terrain.superficie || "",
        num_parcelle: terrain.num_parcelle || "",
        section_dite: terrain.section_dite || "",
        canton: terrain.canton || "",
        num_karatany: terrain.num_karatany || "",
        fokotany: terrain.fokotany || "",
        longitude: terrain.longitude || "",
        latitude: terrain.latitude || "",
        statut_terrain: terrain.statut_terrain || "titre",
      }));

      setStatutTerrain("titre");
      setVerificationMessage("Terrain trouvé");
      setTerrainVisible(true); // afficher les champs
    } catch (error) {
      console.error("Erreur lors du chargement du terrain :", error);
      setVerificationMessage("Erreur lors de la vérification");
      setTerrainVisible(false);
    }
  }, [num_titre, statutTerrain, setFormData, setStatutTerrain]);

  // Fonction d'affichage d'un champ
  const renderInputField = (field) => (
    <div key={field} className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
         {t(`alignment.${field}`)}
      </label>
      <input
        type={field === "superficie" ? "number" : "text"}
        name={field}
        value={formData[field] || ""}
        onChange={handleInputChange}
        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
      />
    </div>
  );

  return (
    <div>
      <h3 className="text-xl font-bold text-gray-800 mb-6">
       {t('alignment.identite_terrain')}
      </h3>

      {/*Choix du statut du terrain */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 p-6 bg-white border border-gray-200 rounded-lg">
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
              onChange={(e) => {
                setStatutTerrain(e.target.value);
                setTerrainVisible(false); // cacher quand on change de statut
              }}
              className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300"
            />
            <span className="ml-3 text-sm text-gray-700 font-medium capitalize">
              {t(`alignment.${status.replace("-", "_")}`)}
            </span>
          </label>
        ))}
      </div>

      {/* Champ num_titre + bouton aligné horizontalement */}
      {statutTerrain === "titre" && (
        <div className="flex flex-col sm:flex-row items-end gap-4 mb-6">
          <div className="flex-1">{renderInputField("num_titre")}</div>
          <button
            onClick={handleVerifyTerrain}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md font-medium h-fit"
          >
            {t('alignment.verifier_terrain')}
          </button>
        </div>
      )}

      {/* Champs du formulaire selon le statut */}
      <div className="space-y-6">
        {statutTerrain === "titre" && terrainVisible && (
          <>
            {["nom_proprietaire", "adresse"].map(renderInputField)}
          </>
        )}

        {statutTerrain === "cadastre" && (
          <>
            {[
                "num_parcelle",
                "section_dite",
                "canton",
                "adresse",
                "num_karatany",
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

      {/*Message de vérification */}
      {verificationMessage && (
        <p className="mt-3 text-sm font-medium text-gray-800">{verificationMessage}</p>
      )}
    </div>
  );
};

export default Step4Terrain;
