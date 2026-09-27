import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {authService} from "../../services/api/authService";
import {citoyenService} from "../../services/api/citoyenService";
import { AuthContext } from "../../context/AuthContext";

const hasValue = (value) =>
  value !== null &&
  value !== undefined &&
  String(value).trim() !== "";

const formatDateForInput = (value) => {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value).slice(0, 10);
  }

  return date.toISOString().slice(0, 10);
};

const RegisterComplete = () => {
  const navigate = useNavigate();
  const { refreshUser } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [userProfile, setUserProfile] = useState(null);

  const [communes, setCommunes] = useState([]);
  const [fokotanys, setFokotanys] = useState([]);

  const [loadingCommunes, setLoadingCommunes] = useState(false);
  const [loadingFokotanys, setLoadingFokotanys] = useState(false);

  const [photoFile, setPhotoFile] = useState(null);

  const [formData, setFormData] = useState({
    citizen_national_card_number: "",
    municipality_id: "",
    fokotany_formatted_id: "",
    citizen_work: "",
    citizen_prise_service: "",

    citizen_national_card_location: "",
    citizen_national_card_date: "",
    citizen_adress: "",
  });

  /**
   * --------------------------------------------------------------------------
   * Identité affichée en lecture seule
   * --------------------------------------------------------------------------
   *
   * Les données peuvent provenir :
   * - de Keycloak via authService.getUserInfo()
   * - du profil ServiceAuth
   *
   * On ne les envoie PAS dans les champs éditables.
   */
  const identity = useMemo(() => {
    const tokenUser = authService.getUserInfo() || {};
    const profile = userProfile || {};

    const citizen = profile.citizen || {};

    return {
      lastName:
        tokenUser.family_name ||
        tokenUser.last_name ||
        profile.user_lastname ||
        profile.last_name ||
        citizen.citizen_lastname ||
        "",

      firstName:
        tokenUser.given_name ||
        tokenUser.first_name ||
        profile.user_firstname ||
        profile.first_name ||
        citizen.citizen_name ||
        "",

      email:
        tokenUser.email ||
        profile.user_email ||
        profile.email ||
        citizen.citizen_mail ||
        "",

      phone:
        tokenUser.phone_number ||
        tokenUser.phone ||
        profile.user_phone ||
        profile.phone ||
        "",
    };
  }, [userProfile]);

  /**
   * --------------------------------------------------------------------------
   * Chargement du profil actuel
   * --------------------------------------------------------------------------
   */
  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const profile = await authService.getUserProfile();

      if (!profile) {
        throw new Error(
          "Impossible de récupérer votre profil utilisateur."
        );
      }

      setUserProfile(profile);

      /**
       * Si le profil est déjà complet, cette page n'a normalement
       * plus aucune raison d'être affichée.
       */
      const citizen = profile.citizen;

      const isComplete =
        hasValue(profile.municipality_id) &&
        hasValue(citizen?.citizen_national_card_number) &&
        hasValue(citizen?.fokotany_formatted_id) &&
        hasValue(citizen?.citizen_work) &&
        hasValue(citizen?.citizen_prise_service);

      if (isComplete) {
        navigate("/dashboard", { replace: true });
        return;
      }

      /**
       * Si une partie du profil existe déjà, on la préremplit.
       */
      setFormData({
        citizen_national_card_number:
          citizen?.citizen_national_card_number ?? "",

        municipality_id:
          profile.municipality_id ?? "",

        fokotany_formatted_id:
          citizen?.fokotany_formatted_id ?? "",

        citizen_work:
          citizen?.citizen_work ?? "",

        citizen_prise_service:
          formatDateForInput(citizen?.citizen_prise_service),

        citizen_national_card_location:
          citizen?.citizen_national_card_location ?? "",

        citizen_national_card_date:
          formatDateForInput(citizen?.citizen_national_card_date),

        citizen_adress:
          citizen?.citizen_adress ?? "",
      });
    } catch (err) {
      console.error(
        "[RegisterComplete] Erreur chargement profil:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Impossible de charger votre profil."
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * --------------------------------------------------------------------------
   * Chargement des communes
   * --------------------------------------------------------------------------
   */
  const loadCommunes = async () => {
    try {
      setLoadingCommunes(true);

      const response = await citoyenService.getCommunesOptions();

      setCommunes(Array.isArray(response) ? response : []);
    } catch (err) {
      console.error(
        "[RegisterComplete] Erreur chargement communes:",
        err
      );

      setError(
        "Impossible de charger la liste des communes."
      );
    } finally {
      setLoadingCommunes(false);
    }
  };

  /**
   * --------------------------------------------------------------------------
   * Chargement des fokontany
   * --------------------------------------------------------------------------
   */
  const loadFokotanys = async (municipalityId) => {
    if (!municipalityId) {
      setFokotanys([]);
      return;
    }

    try {
      setLoadingFokotanys(true);

      const response =
        await citoyenService.getFokotanyOptions(municipalityId);

      setFokotanys(Array.isArray(response) ? response : []);
    } catch (err) {
      console.error(
        "[RegisterComplete] Erreur chargement fokontanys:",
        err
      );

      setFokotanys([]);

      setError(
        "Impossible de charger la liste des fokontanys."
      );
    } finally {
      setLoadingFokotanys(false);
    }
  };

  /**
   * --------------------------------------------------------------------------
   * Initialisation
   * --------------------------------------------------------------------------
   */
  useEffect(() => {
    loadProfile();
    loadCommunes();
  }, []);

  /**
   * --------------------------------------------------------------------------
   * Rechargement des fokontanys quand la commune change
   * --------------------------------------------------------------------------
   */
  useEffect(() => {
    if (formData.municipality_id) {
      loadFokotanys(formData.municipality_id);
    } else {
      setFokotanys([]);
    }
  }, [formData.municipality_id]);

  /**
   * --------------------------------------------------------------------------
   * Modification du formulaire
   * --------------------------------------------------------------------------
   */
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");

    /**
     * Si la commune change, le fokontany sélectionné précédemment
     * ne doit plus être conservé.
     */
    if (name === "municipality_id") {
      setFormData((previous) => ({
        ...previous,
        municipality_id: value,
        fokotany_formatted_id: "",
      }));
    }
  };

  /**
   * --------------------------------------------------------------------------
   * Photo
   * --------------------------------------------------------------------------
   */
  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0] || null;

    setPhotoFile(file);
  };

  /**
   * --------------------------------------------------------------------------
   * Validation
   * --------------------------------------------------------------------------
   */
  const validateForm = () => {
    if (!hasValue(formData.citizen_national_card_number)) {
      return "Le numéro CIN est obligatoire.";
    }

    if (!hasValue(formData.municipality_id)) {
      return "La commune est obligatoire.";
    }

    if (!hasValue(formData.fokotany_formatted_id)) {
      return "Le fokontany est obligatoire.";
    }

    if (!hasValue(formData.citizen_work)) {
      return "La fonction est obligatoire.";
    }

    if (!hasValue(formData.citizen_prise_service)) {
      return "La date de prise de service est obligatoire.";
    }

    return null;
  };

  /**
   * --------------------------------------------------------------------------
   * Création du Citizen + association avec l'utilisateur existant
   * --------------------------------------------------------------------------
   */
  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    if (!userProfile?.user_id) {
      setError(
        "Impossible d'identifier votre compte utilisateur."
      );
      return;
    }

    try {
      setSaving(true);

      /**
       * ----------------------------------------------------------------------
       * ÉTAPE 1
       * Créer le Citizen dans ServiceCitoyen
       * ----------------------------------------------------------------------
       *
       * Le backend génère id_citizen.
       */
      const citizenPayload = new FormData();

      /**
       * Identité issue de Keycloak / profil existant.
       *
       * Elles sont utilisées pour créer le Citizen mais ne sont pas
       * modifiables par l'utilisateur dans cette page.
       */
      citizenPayload.append(
        "citizen_name",
        identity.firstName || ""
      );

      citizenPayload.append(
        "citizen_lastname",
        identity.lastName || ""
      );

      citizenPayload.append(
        "citizen_national_card_number",
        String(formData.citizen_national_card_number).trim()
      );

      citizenPayload.append(
        "fokotany_formatted_id",
        formData.fokotany_formatted_id
      );

      citizenPayload.append(
        "citizen_work",
        formData.citizen_work.trim()
      );

      citizenPayload.append(
        "citizen_prise_service",
        formData.citizen_prise_service
      );

      if (hasValue(formData.citizen_national_card_location)) {
        citizenPayload.append(
          "citizen_national_card_location",
          formData.citizen_national_card_location.trim()
        );
      }

      if (hasValue(formData.citizen_national_card_date)) {
        citizenPayload.append(
          "citizen_national_card_date",
          formData.citizen_national_card_date
        );
      }

      if (hasValue(formData.citizen_adress)) {
        citizenPayload.append(
          "citizen_adress",
          formData.citizen_adress.trim()
        );
      }

      if (photoFile) {
        citizenPayload.append(
          "citizen_photo",
          photoFile
        );
      }

      const citizenResponse =
        await citoyenService.createCitizen(citizenPayload);

      /**
       * Les APIs peuvent retourner :
       * response.data
       * response.data.citizen
       * ou directement le Citizen.
       */
      const createdCitizen =
        citizenResponse?.citizen ||
        citizenResponse?.data?.citizen ||
        citizenResponse?.data ||
        citizenResponse;

      const citizenId =
        createdCitizen?.id_citizen;

      if (!citizenId) {
        console.error(
          "[RegisterComplete] Réponse création citizen:",
          citizenResponse
        );

        throw new Error(
          "Le citoyen a peut-être été créé, mais son identifiant n'a pas été retourné par le service citoyen."
        );
      }

      console.log(
        "[RegisterComplete] Citizen créé:",
        citizenId
      );

      /**
       * ----------------------------------------------------------------------
       * ÉTAPE 2
       * Associer le Citizen à l'utilisateur ServiceAuth existant
       * ----------------------------------------------------------------------
       */
      await authService.updateUserById(
        userProfile.user_id,
        {
          municipality_id: formData.municipality_id,
          id_citizen: citizenId,
        }
      );

      /**
       * ----------------------------------------------------------------------
       * ÉTAPE 3
       * Recharger le profil depuis ServiceAuth
       * ----------------------------------------------------------------------
       */
      const updatedProfile =
        await authService.getUserProfile();

      setUserProfile(updatedProfile);
      await refreshUser();

      /**
       * ----------------------------------------------------------------------
       * ÉTAPE 4
       * Vérifier que le profil est réellement complet
       * ----------------------------------------------------------------------
       */
      const updatedCitizen =
        updatedProfile?.citizen;

      const isComplete =
        hasValue(updatedProfile?.id_citizen) &&
        hasValue(updatedCitizen?.citizen_national_card_number);

      if (!isComplete) {
        throw new Error(
          "Votre profil a été enregistré, mais certaines informations obligatoires sont encore absentes."
        );
      }

      setSuccess(
        "Votre profil a été complété avec succès."
      );

      /**
       * ----------------------------------------------------------------------
       * ÉTAPE 5
       * Dashboard
       * ----------------------------------------------------------------------
       */
      setTimeout(() => {
        navigate("/dashboard", {
          replace: true,
        });
      }, 500);
    } catch (err) {
      console.error(
        "[RegisterComplete] Erreur enregistrement:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Une erreur est survenue lors de l'enregistrement."
      );
    } finally {
      setSaving(false);
    }
  };

  /**
   * --------------------------------------------------------------------------
   * Loading
   * --------------------------------------------------------------------------
   */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-current border-t-transparent rounded-full mx-auto mb-4" />
          <p>Chargement de votre profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-6 md:p-8">

        {/* ---------------------------------------------------------------- */}
        {/* HEADER                                                           */}
        {/* ---------------------------------------------------------------- */}

        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Compléter votre profil
          </h1>

          <p className="mt-2 text-gray-600">
            Certaines informations sont nécessaires avant
            d'accéder à votre espace.
          </p>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* MESSAGES                                                         */}
        {/* ---------------------------------------------------------------- */}

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {success}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-8"
        >

          {/* ---------------------------------------------------------------- */}
          {/* IDENTITÉ                                                         */}
          {/* ---------------------------------------------------------------- */}

          <section>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Identité
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Ces informations proviennent de votre compte
                d'authentification et sont en lecture seule.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* Nom */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom
                </label>

                <input
                  type="text"
                  value={identity.lastName}
                  readOnly
                  className="w-full rounded-lg border border-gray-200 bg-gray-100 px-4 py-3 text-gray-600 cursor-not-allowed"
                />
              </div>

              {/* Prénom */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prénom
                </label>

                <input
                  type="text"
                  value={identity.firstName}
                  readOnly
                  className="w-full rounded-lg border border-gray-200 bg-gray-100 px-4 py-3 text-gray-600 cursor-not-allowed"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>

                <input
                  type="email"
                  value={identity.email}
                  readOnly
                  className="w-full rounded-lg border border-gray-200 bg-gray-100 px-4 py-3 text-gray-600 cursor-not-allowed"
                />
              </div>

              {/* Téléphone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone
                </label>

                <input
                  type="text"
                  value={identity.phone}
                  readOnly
                  className="w-full rounded-lg border border-gray-200 bg-gray-100 px-4 py-3 text-gray-600 cursor-not-allowed"
                />
              </div>

            </div>
          </section>

          {/* ---------------------------------------------------------------- */}
          {/* INFORMATIONS PROFESSIONNELLES ET ADMINISTRATIVES                 */}
          {/* ---------------------------------------------------------------- */}

          <section>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Informations administratives
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Les champs marqués d'un * sont obligatoires.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* CIN */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Numéro CIN *
                </label>

                <input
                  type="number"
                  name="citizen_national_card_number"
                  value={
                    formData.citizen_national_card_number
                  }
                  onChange={handleChange}
                  required
                  placeholder="Ex : 101211254422"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Commune */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Commune *
                </label>

                <select
                  name="municipality_id"
                  value={formData.municipality_id}
                  onChange={handleChange}
                  required
                  disabled={loadingCommunes}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">
                    {loadingCommunes
                      ? "Chargement..."
                      : "Sélectionner une commune"}
                  </option>

                  {communes.map((commune) => (
                    <option
                      key={
                        commune.value ||
                        commune.municipality_id ||
                        commune.id
                      }
                      value={
                        commune.value ||
                        commune.municipality_id ||
                        commune.id
                      }
                    >
                      {commune.label ||
                        commune.name ||
                        commune.municipality_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Fokontany */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fokontany *
                </label>

                <select
                  name="fokotany_formatted_id"
                  value={formData.fokotany_formatted_id}
                  onChange={handleChange}
                  required
                  disabled={
                    !formData.municipality_id ||
                    loadingFokotanys
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">
                    {loadingFokotanys
                      ? "Chargement..."
                      : !formData.municipality_id
                      ? "Sélectionner d'abord une commune"
                      : "Sélectionner un fokontany"}
                  </option>

                  {fokotanys.map((fokotany) => (
                    <option
                      key={
                        fokotany.value ||
                        fokotany.fokotany_formatted_id ||
                        fokotany.id
                      }
                      value={
                        fokotany.value ||
                        fokotany.fokotany_formatted_id ||
                        fokotany.id
                      }
                    >
                      {fokotany.label ||
                        fokotany.name ||
                        fokotany.fokotany_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Fonction */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fonction *
                </label>

                <input
                  type="text"
                  name="citizen_work"
                  value={formData.citizen_work}
                  onChange={handleChange}
                  required
                  placeholder="Ex : Développeur"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Prise de service */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date de prise de service *
                </label>

                <input
                  type="date"
                  name="citizen_prise_service"
                  value={formData.citizen_prise_service}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Lieu CIN */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lieu de délivrance de la CIN
                </label>

                <input
                  type="text"
                  name="citizen_national_card_location"
                  value={
                    formData.citizen_national_card_location
                  }
                  onChange={handleChange}
                  placeholder="Ex : Isotry"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Date CIN */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date de délivrance de la CIN
                </label>

                <input
                  type="date"
                  name="citizen_national_card_date"
                  value={
                    formData.citizen_national_card_date
                  }
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Adresse */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse
                </label>

                <textarea
                  name="citizen_adress"
                  value={formData.citizen_adress}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Votre adresse"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Photo */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Photo
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 bg-white"
                />

                {photoFile && (
                  <p className="mt-2 text-sm text-gray-500">
                    Fichier sélectionné : {photoFile.name}
                  </p>
                )}
              </div>

            </div>
          </section>

          {/* ---------------------------------------------------------------- */}
          {/* ACTION                                                           */}
          {/* ---------------------------------------------------------------- */}

          <div className="flex justify-end pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving
                ? "Enregistrement..."
                : "Enregistrer et continuer"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default RegisterComplete;