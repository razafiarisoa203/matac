import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import Header from "../../components/Header";
import { territoireService } from "../../services/api/territoireService";
import { completeCitizenRegistration } from "../../auth/ssoFlow";
import keycloak from "../../auth/keycloak";
import bgImage from "../../assets/image/construction-bg.jpeg";

const initialForm = {
  citizen_national_card_number: "",
  municipality_id: "",
  fokotany_formatted_id: "",
  citizen_work: "",
  citizen_prise_service: "",
  citizen_adress: "",
  citizen_national_card_location: "",
  citizen_national_card_date: "",
  user_phone: "",
};

export default function RegisterComplete() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialForm);
  const [communes, setCommunes] = useState([]);
  const [fokotanys, setFokotanys] = useState([]);
  const [isLoading, setIsLoading] = useState({ communes: false, fokotanys: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    const loadCommunes = async () => {
      setIsLoading((p) => ({ ...p, communes: true }));
      try {
        const data = await territoireService.getCommunes();
        setCommunes(Array.isArray(data) ? data : []);
      } catch (err) {
        setApiError(err.message || "Impossible de charger les communes.");
      } finally {
        setIsLoading((p) => ({ ...p, communes: false }));
      }
    };
    loadCommunes();
  }, []);

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setApiError("");

    if (name === "citizen_national_card_number") {
      const numeric = value.replace(/\D/g, "").slice(0, 12);
      setFormData((p) => ({ ...p, [name]: numeric }));
      return;
    }

    if (name === "user_phone") {
      const numeric = value.replace(/\D/g, "").slice(0, 10);
      setFormData((p) => ({ ...p, [name]: numeric }));
      return;
    }

    if (name === "municipality_id" && value) {
      setFormData((p) => ({
        ...p,
        municipality_id: value,
        fokotany_formatted_id: "",
      }));
      setFokotanys([]);
      try {
        setIsLoading((p) => ({ ...p, fokotanys: true }));
        const data = await territoireService.getFokotanys(value);
        setFokotanys(Array.isArray(data) ? data : []);
      } catch (err) {
        setApiError(err.message || "Erreur lors du chargement des fokotanys.");
        setFokotanys([]);
      } finally {
        setIsLoading((p) => ({ ...p, fokotanys: false }));
      }
      return;
    }

    setFormData((p) => ({ ...p, [name]: value }));
  };

  const validate = () => {
    const errs = {};
    if (!/^\d{12}$/.test(formData.citizen_national_card_number)) {
      errs.citizen_national_card_number = "Le numéro CIN doit contenir exactement 12 chiffres.";
    }
    if (!formData.municipality_id) errs.municipality_id = "Veuillez sélectionner une commune.";
    if (!formData.fokotany_formatted_id) errs.fokotany_formatted_id = "Veuillez sélectionner un fokotany.";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setApiError("");

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setIsSubmitting(true);
    try {
      if (!keycloak.token) {
        setApiError("Session expirée. Veuillez vous reconnecter.");
        setIsSubmitting(false);
        return;
      }

      const payload = {
        citizen_national_card_number: formData.citizen_national_card_number,
        fokotany_formatted_id: formData.fokotany_formatted_id,
        municipality_id: formData.municipality_id,
        citizen_work: formData.citizen_work || undefined,
        citizen_prise_service: formData.citizen_prise_service || undefined,
        citizen_adress: formData.citizen_adress || undefined,
        citizen_national_card_location:
          formData.citizen_national_card_location || undefined,
        citizen_national_card_date:
          formData.citizen_national_card_date || undefined,
        user_phone: formData.user_phone || undefined,
      };

      const result = await completeCitizenRegistration(keycloak.token, payload);
      if (result.loggedIn) {
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      setApiError(err.message || "Une erreur est survenue lors de l'inscription.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (name) =>
    `mt-1 block w-full rounded-lg border ${
      errors[name] ? "border-red-500" : "border-gray-300"
    } bg-white text-gray-900 shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 p-2.5 text-sm`;

  const communeOptions = communes.map((c) => ({
    value: c.formatted_id || c.commune_id || c.id,
    label: c.name || c.nom || `Commune ${c.formatted_id || c.id}`,
  }));

  const fokotanyOptions = fokotanys.map((f) => ({
    value: f.formatted_id || f.fokotany_id || f.id,
    label: f.name || f.nom || `Fokotany ${f.formatted_id || f.id}`,
  }));

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed flex flex-col"
      style={{
        backgroundImage: `linear-gradient(rgba(15,23,42,0.7), rgba(15,23,42,0.7)), url(${bgImage})`,
      }}
    >
      <div className="fixed top-0 left-0 right-0 z-50 bg-white">
        <Header />
      </div>

      <div className="flex-1 flex items-center justify-center mt-40 px-4 py-10 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200">
            <div className="px-8 py-10">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900">
                  Compléter votre inscription
                </h1>
                <p className="text-gray-500 text-sm mt-2">
                  Pour finaliser votre compte, veuillez renseigner les informations
                  de votre dossier citoyen.
                </p>
              </div>

              {apiError && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
                  {apiError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Numéro CIN <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="citizen_national_card_number"
                    type="text"
                    inputMode="numeric"
                    value={formData.citizen_national_card_number}
                    onChange={handleInputChange}
                    className={inputClass("citizen_national_card_number")}
                    placeholder="12 chiffres"
                  />
                  {errors.citizen_national_card_number && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.citizen_national_card_number}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Commune <span className="text-red-500">*</span>
                  </label>
                  <Select
                    name="municipality_id"
                    value={
                      communeOptions.find(
                        (o) => o.value === formData.municipality_id
                      ) || null
                    }
                    onChange={(o) =>
                      handleInputChange({
                        target: { name: "municipality_id", value: o?.value || "" },
                      })
                    }
                    options={communeOptions}
                    isLoading={isLoading.communes}
                    isDisabled={isLoading.communes}
                    placeholder="Sélectionnez une commune"
                    className="react-select-container"
                    classNamePrefix="react-select"
                    filterOption={(option, input) =>
                      option.label.toLowerCase().startsWith(input.toLowerCase())
                    }
                  />
                  {errors.municipality_id && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.municipality_id}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fokotany <span className="text-red-500">*</span>
                  </label>
                  <Select
                    name="fokotany_formatted_id"
                    value={
                      fokotanyOptions.find(
                        (o) => o.value === formData.fokotany_formatted_id
                      ) || null
                    }
                    onChange={(o) =>
                      handleInputChange({
                        target: {
                          name: "fokotany_formatted_id",
                          value: o?.value || "",
                        },
                      })
                    }
                    options={fokotanyOptions}
                    isLoading={isLoading.fokotanys}
                    isDisabled={!formData.municipality_id || isLoading.fokotanys}
                    placeholder={
                      !formData.municipality_id
                        ? "Sélectionnez d'abord une commune"
                        : "Sélectionnez un fokotany"
                    }
                    className="react-select-container"
                    classNamePrefix="react-select"
                    filterOption={(option, input) =>
                      option.label.toLowerCase().startsWith(input.toLowerCase())
                    }
                  />
                  {errors.fokotany_formatted_id && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.fokotany_formatted_id}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Profession
                    </label>
                    <input
                      name="citizen_work"
                      value={formData.citizen_work}
                      onChange={handleInputChange}
                      className={inputClass("citizen_work")}
                      placeholder="Ex : Ingénieur"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date de prise de service
                    </label>
                    <input
                      name="citizen_prise_service"
                      type="date"
                      value={formData.citizen_prise_service}
                      onChange={handleInputChange}
                      className={inputClass("citizen_prise_service")}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Adresse
                  </label>
                  <textarea
                    name="citizen_adress"
                    value={formData.citizen_adress}
                    onChange={handleInputChange}
                    rows="2"
                    className={inputClass("citizen_adress")}
                    placeholder="Ex : Lot 123, Andohatapenaka"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Lieu de délivrance du CIN
                    </label>
                    <input
                      name="citizen_national_card_location"
                      value={formData.citizen_national_card_location}
                      onChange={handleInputChange}
                      className={inputClass("citizen_national_card_location")}
                      placeholder="Ex : Commissariat Central Antanimena"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date de délivrance du CIN
                    </label>
                    <input
                      name="citizen_national_card_date"
                      type="date"
                      value={formData.citizen_national_card_date}
                      onChange={handleInputChange}
                      className={inputClass("citizen_national_card_date")}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Téléphone
                  </label>
                  <input
                    name="user_phone"
                    type="text"
                    inputMode="numeric"
                    value={formData.user_phone}
                    onChange={handleInputChange}
                    className={inputClass("user_phone")}
                    placeholder="Ex : 0341234567"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center items-center py-2.5 px-4 rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Enregistrement..." : "Finaliser l'inscription"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
