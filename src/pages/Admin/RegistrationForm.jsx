import { useEffect, useState } from "react";
import { territoireService } from "../../services/api";
import { useNavigate } from "react-router-dom";
import axios from "axios";

/* ===== Service d'inscription ===== */
const authService = {
  registerUser: async (data) => {
    try {
      const formData = new FormData();

      // Infos citoyen
      formData.append("citizen_name", data.citizen_name);
      formData.append("citizen_lastname", data.citizen_lastname);
      formData.append("citizen_national_card_number", data.citizen_national_card_number);
      formData.append("citizen_adress", data.citizen_adress);
      formData.append("citizen_national_card_location", data.citizen_national_card_location);
      formData.append("citizen_national_card_date", data.citizen_national_card_date);
      formData.append("fokotany_formatted_id", data.fokotany_formatted_id);
      formData.append("municipality_id", data.municipality_id);

      // Utilisateur
      formData.append("user_pseudo", data.user_pseudo);
      formData.append("user_email", data.user_email);
      formData.append("user_password", data.user_password);
      formData.append("user_phone", data.user_phone);

      // Photo
      if (data.citizen_photo) {
        formData.append("citizen_photo", data.citizen_photo);
      }

      // Rôle(s)
      // ✅ Important : envoyer les rôles un par un, pas en JSON.stringify
      if (data.role_ids && data.role_ids.length > 0) {
        data.role_ids.forEach((id) => {
          formData.append("role_ids", id);
        });
      } else {
        formData.append("role_ids[]", 27);
 // rôle citoyen par défaut
      }

      // Requête API
      const response = await axios.post(
        `${import.meta.env.VITE_API_SERVICEAUTH}/users/register-with-citizen-short-role`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      return response.data;
    } catch (error) {
      console.error("❌ Erreur lors de l'inscription :", error.response?.data || error);
      throw error.response?.data || error;
    }
  },
};

/* ===== Composant principal ===== */
export default function RegistrationForm({ cin }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    citizen_name: "",
    citizen_lastname: "",
    citizen_national_card_number: cin || "",
    citizen_adress: "",
    citizen_national_card_location: "",
    citizen_national_card_date: "",
    fokotany_formatted_id: "",
    user_pseudo: "",
    user_email: "",
    user_password: "",
    user_phone: "",
    municipality_id: "",
    citizen_photo: null,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [communes, setCommunes] = useState([]);

  // Charger les communes
  useEffect(() => {
    territoireService.getCommunes().then((data) => setCommunes(data));
  }, []);

  // Gérer les changements
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Fichier photo
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      citizen_photo: file,
    }));
  };

  // Validation
  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      "citizen_name",
      "citizen_lastname",
      "citizen_national_card_number",
      "citizen_adress",
      "citizen_national_card_location",
      "citizen_national_card_date",
      "fokotany_formatted_id",
      "user_pseudo",
      "user_email",
      "user_password",
      "user_phone",
      "municipality_id",
    ];

    requiredFields.forEach((field) => {
      if (!formData[field] || formData[field].toString().trim() === "") {
        newErrors[field] = "Ce champ est requis";
      }
    });

    if (formData.user_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.user_email)) {
      newErrors.user_email = "Format d'email invalide";
    }

    if (formData.user_password.length < 6) {
      newErrors.user_password = "6 caractères minimum";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Soumission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);

      const payload = {
        ...formData,
        role_ids: [27], // 👈 Forcer le rôle citoyen par défaut
      };

      const result = await authService.registerUser(payload);
      console.log("Inscription OK :", result);
      alert("✅ Inscription réussie !");
      navigate("/login", { replace: true });
    } catch (err) {
      console.error("Erreur lors de l'inscription:", err);
      const msg = err?.message || err?.error || "Erreur serveur";
      alert(`❌ Échec de l'inscription: ${msg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center p-0">
      <div className="bg-white rounded-lg w-full max-w-full px-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">Nouvelle inscription</h1>
        <p className="text-gray-600 text-sm mb-4">
          Veuillez remplir tous les champs pour créer votre compte
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* === INFOS PERSONNELLES === */}
          <div className="p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Informations personnelles</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nom */}
              <div>
                <label>Nom *</label>
                <input
                  type="text"
                  name="citizen_name"
                  value={formData.citizen_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
                {errors.citizen_name && (
                  <p className="text-red-500 text-xs">{errors.citizen_name}</p>
                )}
              </div>

              {/* Prénom */}
              <div>
                <label>Prénom *</label>
                <input
                  type="text"
                  name="citizen_lastname"
                  value={formData.citizen_lastname}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
                {errors.citizen_lastname && (
                  <p className="text-red-500 text-xs">{errors.citizen_lastname}</p>
                )}
              </div>

              {/* CIN */}
              <div>
                <label>Numéro CIN *</label>
                <input
                  type="text"
                  name="citizen_national_card_number"
                  value={formData.citizen_national_card_number}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div>
                <label>Date de délivrance CIN *</label>
                <input
                  type="date"
                  name="citizen_national_card_date"
                  value={formData.citizen_national_card_date}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div className="md:col-span-2">
                <label>Lieu de délivrance CIN *</label>
                <input
                  type="text"
                  name="citizen_national_card_location"
                  value={formData.citizen_national_card_location}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div className="md:col-span-2">
                <label>Adresse *</label>
                <textarea
                  name="citizen_adress"
                  value={formData.citizen_adress}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              {/* Commune */}
              <div>
                <label>Commune *</label>
                <select
                  name="municipality_id"
                  value={formData.municipality_id}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="">-- Sélectionner une commune --</option>
                  {communes.map((c, i) => (
                    <option key={i} value={c.commune_id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Fokotany */}
              <div>
                <label>Fokotany *</label>
                <select
                  name="fokotany_formatted_id"
                  value={formData.fokotany_formatted_id}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="">-- Sélectionner un fokontany --</option>
                  {communes
                    .find((c) => c.commune_id === formData.municipality_id)
                    ?.fokotanys.map((f, i) => (
                      <option key={i} value={f.fokotany_id}>
                        {f.name}
                      </option>
                    ))}
                </select>
              </div>

              {/* Photo */}
              <div className="md:col-span-2">
                <label>Photo du citoyen (optionnelle)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            </div>
          </div>

          {/* === COMPTE UTILISATEUR === */}
          <div className="p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Informations du compte</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label>Pseudo *</label>
                <input
                  type="text"
                  name="user_pseudo"
                  value={formData.user_pseudo}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div>
                <label>Email *</label>
                <input
                  type="email"
                  name="user_email"
                  value={formData.user_email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div>
                <label>Mot de passe *</label>
                <input
                  type="password"
                  name="user_password"
                  value={formData.user_password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div>
                <label>Téléphone *</label>
                <input
                  type="tel"
                  name="user_phone"
                  value={formData.user_phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            </div>
          </div>

          {/* === BOUTON === */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {isSubmitting ? "Inscription en cours..." : "S'inscrire →"}
          </button>
        </form>
      </div>
    </div>
  );
}
