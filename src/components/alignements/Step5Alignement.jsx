import { useEffect } from "react";

const Step5Alignement = ({ formData, setFormData }) => {

  // Met à jour formData quand un champ change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    console.log(`Champ mis à jour: ${name} = ${value}`);
  };

  // Remplit automatiquement les champs obligatoires s'ils sont vides
  const autofillMissingFields = () => {
    const requiredFields = [
      "id_mandataire",
      "status_proprietaire",
      "qualite_demandeur",
      "nif",
      "id_cert_sit_jur",
      "id_plan_off",
    ];

    setFormData((prev) => {
      const updated = { ...prev };
      requiredFields.forEach((field, index) => {
        if (!updated[field] || updated[field].trim() === "") {
          // Remplissage automatique avec un exemple simple
          updated[field] = `auto-${index + 1}`;
          console.warn(`Champ vide rempli automatiquement: ${field} = auto-${index + 1}`);
        }
      });
      return updated;
    });
  };

  // Vérifie si Step5 est complet
  const handleCheckStep5 = () => {
    autofillMissingFields(); // remplit les champs manquants
    console.log("Step 5 formData après autofill:", formData);
    console.log("Step 5 complet ! Tu peux passer à l'étape suivante.");
  };

  return (
    <>
      <h3 className="text-xl font-medium text-gray-800 mb-8">
        Informations Alignement
      </h3>

      <div className="space-y-6">
        {[
          "id_mandataire",
          "status_proprietaire",
          "qualite_demandeur",
          "nif",
          "id_cert_sit_jur",
          "id_plan_off",
        ].map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {field.replace(/_/g, " ")} *
            </label>
            <input
              type="text"
              name={field}
              value={formData[field] || ""}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            {!formData[field] && (
              <p className="text-red-500 text-xs mt-1">Ce champ est requis</p>
            )}
          </div>
        ))}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ID Terrain (optionnel)
          </label>
          <input
            type="number"
            name="id_terrain"
            value={formData.id_terrain || ""}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        <button
          type="button"
          onClick={handleCheckStep5}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md"
        >
          Vérifier Step 5 et Autofill
        </button>
      </div>
    </>
  );
};

export default Step5Alignement;
