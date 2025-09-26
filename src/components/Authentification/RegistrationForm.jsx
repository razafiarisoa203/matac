import { useEffect, useState } from "react";
import { territoireService } from "../../services/api";
import { useSelector } from "react-redux";
import { citoyenService } from '../../services/api';
import { useTranslation } from "react-i18next";

export default function RegistrationForm() {
  const { t } = useTranslation();
  const userCin = useSelector((state) => state.user.cin);
  const [formData, setFormData] = useState({
    citizen_name: "",
    citizen_lastname: "",
    citizen_national_card_number: userCin || "",
    citizen_adress: "",
    citizen_national_card_location: "",
    citizen_national_card_date: "",
    fokotany_id: "",
    user_pseudo: "",
    user_email: "",
    user_password: "",
    user_phone: "",
    municipality_id: "",
    citizen_photo: null,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [communes, setCommunes] = useState();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      citizen_photo: file,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields validation
    const requiredFields = [
      "citizen_name",
      "citizen_lastname",
      "citizen_national_card_number",
      "citizen_adress",
      "citizen_national_card_location",
      "citizen_national_card_date",
      "fokotany_id",
      "user_pseudo",
      "user_email",
      "user_password",
      "user_phone",
      "municipality_id",
    ];

    requiredFields.forEach((field) => {
      if (!formData[field] || formData[field].toString().trim() === "") {
        newErrors[field] = t('registrationForm.errors.required');
      }
    });

    // Email validation
    if (
      formData.user_email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.user_email)
    ) {
      newErrors.user_email = t('registrationForm.errors.invalidEmail');
    }

    // Password validation
    if (formData.user_password && formData.user_password.length < 6) {
      newErrors.user_password = t('registrationForm.errors.passwordLength');
    }

    // Phone validation
    if (formData.user_phone && !/^[0-9+\-\s()]+$/.test(formData.user_phone)) {
      newErrors.user_phone = t('registrationForm.errors.invalidPhone');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);

      // Créer un objet FormData pour gérer les fichiers et les données
      const formDataToSend = new FormData();
      
      // Ajouter tous les champs texte au FormData
      formDataToSend.append('citizen_name', formData.citizen_name);
      formDataToSend.append('citizen_lastname', formData.citizen_lastname);
      formDataToSend.append('citizen_national_card_number', formData.citizen_national_card_number);
      formDataToSend.append('citizen_adress', formData.citizen_adress);
      formDataToSend.append('citizen_national_card_location', formData.citizen_national_card_location);
      formDataToSend.append('citizen_national_card_date', formData.citizen_national_card_date);
      formDataToSend.append('fokotany_id', formData.fokotany_id);
      formDataToSend.append('user_pseudo', formData.user_pseudo);
      formDataToSend.append('user_email', formData.user_email);
      formDataToSend.append('user_password', formData.user_password);
      formDataToSend.append('user_phone', formData.user_phone);
      formDataToSend.append('municipality_id', formData.municipality_id);
      
      // Ajouter le fichier photo s'il existe
      if (formData.citizen_photo) {
        formDataToSend.append('citizen_photo', formData.citizen_photo);
      }

      const formDataObj = {};
      for (let [key, value] of formDataToSend.entries()) {
        formDataObj[key] = value;
      }
      console.log("FormData as object:", formDataObj);
      
      // Envoyer les données avec FormData
      const res = await citoyenService.createCitizen(formDataToSend);
      console.log("Response:", res);
      
      alert(t('registrationForm.successMessage'));
      setIsSubmitting(false);
    
    } catch (error) {
      console.error("Erreur lors de l'inscription: ", error);
      setIsSubmitting(false);
      alert(t('registrationForm.errors.registrationFailed'));
    }
  };

  useEffect(() => {
    territoireService.getCommunes().then((data) => {
      setCommunes(data);
    });
  }, []);

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center p-0">
      <div className="bg-white rounded-lg w-full max-w-full px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mb-4">
            <div className="text-xs text-gray-600">
              MINISTÈRE DE L'AMÉNAGEMENT DU TERRITOIRE
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-6">{t('registrationForm.title')}</h1>
          <p className="text-gray-600 text-sm">
            {t('registrationForm.subtitle')}
          </p>
        </div>

        <div className="space-y-6">
          {/* Section Informations personnelles */}
          <div className="p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">{t('registrationForm.personalInfo')}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('registrationForm.fields.lastName')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="citizen_name"
                  value={formData.citizen_name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.citizen_name ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder={t('registrationForm.fields.lastName')}
                />
                {errors.citizen_name && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.citizen_name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('registrationForm.fields.firstName')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="citizen_lastname"
                  value={formData.citizen_lastname}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.citizen_lastname ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder={t('registrationForm.fields.firstName')}
                />
                {errors.citizen_lastname && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.citizen_lastname}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('registrationForm.fields.cinNumber')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="citizen_national_card_number"
                  value={formData.citizen_national_card_number}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.citizen_national_card_number ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder={t('registrationForm.fields.cinNumber')}
                />
                {errors.citizen_national_card_number && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.citizen_national_card_number}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('registrationForm.fields.cinIssueDate')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="citizen_national_card_date"
                  value={formData.citizen_national_card_date}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.citizen_national_card_date ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.citizen_national_card_date && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.citizen_national_card_date}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('registrationForm.fields.cinIssuePlace')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="citizen_national_card_location"
                  value={formData.citizen_national_card_location}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.citizen_national_card_location ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder={t('registrationForm.fields.cinIssuePlace')}
                />
                {errors.citizen_national_card_location && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.citizen_national_card_location}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('registrationForm.fields.address')} <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="citizen_adress"
                  value={formData.citizen_adress}
                  onChange={handleInputChange}
                  rows="2"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.citizen_adress ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder={t('registrationForm.fields.address')}
                />
                {errors.citizen_adress && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.citizen_adress}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('registrationForm.fields.municipality')} <span className="text-red-500">*</span>
                </label>
                <select
                  name="municipality_id"
                  value={formData.municipality_id}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.municipality_id ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Commune"
                >
                  <option value="">{t('registrationForm.selectPlaceholder')}</option>
                  {communes &&
                    communes.map((c, i) => (
                      <option value={c.commune_id} key={i}>
                        {c.name}
                      </option>
                    ))}
                </select>
                {errors.municipality_id && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.municipality_id}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('registrationForm.fields.fokotany')} <span className="text-red-500">*</span>
                </label>
                <select
                  name="fokotany_id"
                  value={formData.fokotany_id}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.fokotany_id ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="ID Fokotany"
                >
                  <option value="">{t('registrationForm.selectPlaceholder')}</option>
                  {communes ? (
                    communes
                      .find((c) => c.commune_id == formData.municipality_id)
                      ?.fokotanys.map((f, i) => (
                        <option value={f.fokotany_id} key={i}>
                          {f.name}
                        </option>
                      ))
                  ) : (
                    <></>
                  )}
                </select>
                {errors.fokotany_id && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.fokotany_id}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('registrationForm.fields.photo')}
                </label>
                <input
                  type="file"
                  name="citizen_photo"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          </div>

          {/* Section Compte utilisateur */}
          <div className="p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4 mt-8">{t('registrationForm.accountInfo')}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('registrationForm.fields.pseudo')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="user_pseudo"
                  value={formData.user_pseudo}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.user_pseudo ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder={t('registrationForm.fields.username')}
                />
                {errors.user_pseudo && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.user_pseudo}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('registrationForm.fields.email')} <span className="text-red-500">{t('registrationForm.requiredField')}</span>
                </label>
                <input
                  type="email"
                  name="user_email"
                  value={formData.user_email}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.user_email ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder={t('registrationForm.fields.email')}
                />
                {errors.user_email && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.user_email}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('registrationForm.fields.password')} <span className="text-red-500">{t('registrationForm.requiredField')}</span>
                </label>
                <input
                  type="password"
                  name="user_password"
                  value={formData.user_password}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.user_password ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder={t('registrationForm.fields.password')}
                />
                {errors.user_password && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.user_password}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('registrationForm.fields.phone')} <span className="text-red-500">{t('registrationForm.requiredField')}</span>
                </label>
                <input
                  type="tel"
                  name="user_phone"
                  value={formData.user_phone}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.user_phone ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder={t('registrationForm.fields.phone')}
                />
                {errors.user_phone && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.user_phone}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {t('registrationForm.submitting')}
              </span>
            ) : (
              `${t('registrationForm.submitButton')} →`
            )}
          </button>

          {/* Footer Links */}
        </div>
      </div>
    </div>
  );
}
