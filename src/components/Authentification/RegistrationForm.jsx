import { useEffect, useState } from "react";
import { territoireService } from "../../services/api/territoireService";
import { useTranslation } from "react-i18next";
import { authService } from "../../services/api/authService";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


export default function RegistrationForm({ cin }) {
  const { t } = useTranslation();
  const navigate = useNavigate(); 

  const [formData, setFormData] = useState({
    citizen_name: "",
    citizen_lastname: "",
    citizen_national_card_number: cin || "",
    citizen_photo: undefined, // Pas de photo par défaut
    citizen_adress: "",
    citizen_national_card_location: "",
    citizen_national_card_date: "",
    fokotany_id: "",
    fokotany_formatted_id: "", // Add this field to the initial state
    user_pseudo: "",
    user_email: "",
    user_password: "",
    user_phone: "",
    municipality_id: "",
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [communes, setCommunes] = useState([]);
  const [fokotanys, setFokotanys] = useState([]);
  const [isLoading, setIsLoading] = useState({
    communes: false,
    fokotanys: false
  });
  const [errors, setErrors] = useState({});
  const [apiError,setApiError] = useState(null);

  const validateCinField = (cinValue) => {
    const numericValue = (cinValue || '').replace(/\D/g, '');
    apiError
    
    if (numericValue.length > 0 && numericValue.length !== 12) {
      setErrors(prev => ({
        ...prev,
        citizen_national_card_number: t('registrationForm.errors.cinLength')
      }));
      return false;
    } else if (errors.citizen_national_card_number) {
      // Clear error if validation passes
      const newErrors = { ...errors };
      delete newErrors.citizen_national_card_number;
      setErrors(newErrors);
    }
    return numericValue.length === 12;
  };

  const handleInputChange = async (e) => {
    const { name, value } = e.target;

    // Clear any previous API errors
    setApiError(null);
    
    // For CIN field - only allow digits and exactly 12 characters
    if (name === 'citizen_national_card_number') {
      // Only allow digits and limit to 12 characters
      const numericValue = value.replace(/\D/g, '').slice(0, 12);
      
      // Update the input value (only digits)
      e.target.value = numericValue;
      
      // Update form data with the numeric value
      setFormData(prev => ({
        ...prev,
        [name]: numericValue
      }));
      
      // Validate CIN length
      validateCinField(numericValue);
      
      // Don't proceed with other validations for CIN field
      return;
    }
    
    if (name === "user_phone") {
      // Supprimer tout ce qui n'est pas un chiffre et limiter à 10 caractères
      const numericValue = value.replace(/\D/g, "").slice(0, 10);
    
      setFormData((prev) => ({
        ...prev,
        [name]: numericValue,
      }));
    
      // Clear error si présent
      if (errors[name]) {
        setErrors((prev) => ({
          ...prev,
          [name]: "",
        }));
      }
    
      return; // ne pas continuer avec les autres validations
    }

    // Si la commune change, on réinitialise le fokotany sélectionné
    if (name === 'municipality_id' && value) {
      // Ici, 'value' DOIT être le formatted_id de la commune
      const communeFormattedId = value;
      
      setFormData(prev => ({
        ...prev,
        municipality_id: communeFormattedId,
        fokotany_id: '', // Réinitialiser la sélection du fokotany
        fokotany_formatted_id: '' // Réinitialiser également le formatted_id
      }));
      
      // Charger les fokotanys pour la commune sélectionnée
      try {
        setIsLoading(prev => ({ ...prev, fokotanys: true }));
        setFokotanys([]); // Réinitialiser la liste pendant le chargement
        setApiError(null); // Réinitialiser les erreurs précédentes
        
        console.log(`Chargement des fokotanys pour la commune ${communeFormattedId} (ID: ${value})...`);
        const fokotanysData = await territoireService.getFokotanys(communeFormattedId);
        
        if (!fokotanysData || fokotanysData.length === 0) {
          console.warn(`Aucun fokotany trouvé pour la commune ${communeFormattedId}`);
          setApiError('Aucun fokotany disponible pour cette commune');
        } else {
          // Dédupliquer par formatted_id (ou fallback id) pour éviter les clés dupliquées
          const seen = new Set();
          const uniqueFks = [];
          for (const f of fokotanysData) {
            const key = String(f.formatted_id || f.fokotany_id || f.id || '');
            if (!seen.has(key)) {
              seen.add(key);
              uniqueFks.push(f);
            }
          }
          console.log(`${uniqueFks.length} fokotanys uniques chargés pour la commune ${communeFormattedId}`, uniqueFks);
          setFokotanys(uniqueFks);
          
          // Si un seul fokotany est disponible, le sélectionner automatiquement
          if (fokotanysData.length === 1) {
            const singleFokotany = fokotanysData[0];
            const fokotanyId = singleFokotany.id || singleFokotany.fokotany_id;
            const fokotanyFormattedId = singleFokotany.formatted_id || fokotanyId;
            
            console.log(`Sélection automatique du fokotany unique:`, {
              id: fokotanyId,
              formatted_id: fokotanyFormattedId
            });
            
            setFormData(prev => ({
              ...prev,
              fokotany_id: fokotanyId.toString(),
              fokotany_formatted_id: fokotanyFormattedId.toString()
            }));
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement des fokotanys:', error);
        setApiError(error.message || 'Erreur lors du chargement des fokotanys. Veuillez réessayer.');
        setFokotanys([]);
      } finally {
        setIsLoading(prev => ({ ...prev, fokotanys: false }));
      }
    } else if (name === 'fokotany_id' && value) {
      // Mettre à jour le fokotany_id et le fokotany_formatted_id lors de la sélection manuelle
      const selectedFokotany = fokotanys.find(f => {
        const valStr = value?.toString();
        return (
          f.formatted_id?.toString() === valStr ||
          f.fokotany_id?.toString() === valStr ||
          f.id?.toString() === valStr
        );
      });
      
      if (!selectedFokotany) {
        console.error('Aucun fokotany trouvé avec l\'ID:', value);
        return;
      }
      
      // Utiliser le formatted_id du fokotany sélectionné
      const fokotanyFormattedId = selectedFokotany.formatted_id || selectedFokotany.fokotany_id || selectedFokotany.id || value;
      
      console.log('Fokotany sélectionné:', {
        id: value,
        formatted_id: fokotanyFormattedId,
        selectedFokotany
      });
      
      setFormData(prev => ({
        ...prev,
        fokotany_id: value,
        fokotany_formatted_id: fokotanyFormattedId
      }));
    } else {
      // Pour tous les autres champs
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

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
    if (file) {
      console.log('Fichier sélectionné:', {
        name: file.name,
        type: file.type,
        size: file.size,
        isFile: file instanceof File
      });
      setFormData((prev) => ({
        ...prev,
        citizen_photo: file,
      }));
    } else {
      console.log('Aucun fichier sélectionné');
      setFormData((prev) => ({
        ...prev,
        citizen_photo: undefined, // Utiliser undefined au lieu de null
      }));
    }
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
      "fokotany_id", // Ce champ est toujours utilisé dans le state du formulaire
      "fokotany_formatted_id", // Add this field to required validation
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

    // CIN validation - must be exactly 12 digits and required
    if (!formData.citizen_national_card_number || formData.citizen_national_card_number.trim() === '') {
      newErrors.citizen_national_card_number = t('registrationForm.errors.required');
    } else {
      const cin = formData.citizen_national_card_number.replace(/\D/g, '');
      if (cin.length !== 12) {
        newErrors.citizen_national_card_number = t('registrationForm.errors.cinLength');
      }
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

      // Construire la payload pour authService.registerUser
      const userData = {
        user_pseudo: formData.user_pseudo,
        user_email: formData.user_email,
        user_password: formData.user_password,
        user_phone: formData.user_phone,
        municipality_id: formData.municipality_id,
        citizenData: {
          citizen_name: formData.citizen_name,
          citizen_lastname: formData.citizen_lastname,
          citizen_national_card_number: formData.citizen_national_card_number,
          citizen_adress: formData.citizen_adress,
          citizen_national_card_location: formData.citizen_national_card_location,
          citizen_national_card_date: formData.citizen_national_card_date,
          fokotany_formatted_id: formData.fokotany_formatted_id || formData.fokotany_id,
          // Send the photo file directly if available, otherwise don't include the field
          ...(formData.citizen_photo && { citizen_photo: formData.citizen_photo }),
        },
      };

      // 2) Inscription (citoyen + utilisateur) via endpoint multipart
      const registerRes = await authService.registerUser(userData);
      console.log('Inscription réussie:', registerRes);
      toast.success(t('registrationForm.successMessage'));


      setTimeout(() => {
        navigate("/login");
      }, 1500);
      // Réinitialiser le formulaire après succès
      setFormData({
        citizen_name: "",
        citizen_lastname: "",
        citizen_national_card_number: "",
        citizen_photo: undefined, // Réinitialiser à undefined
        citizen_adress: "",
        citizen_national_card_location: "",
        citizen_national_card_date: "",
        fokotany_id: "",
        fokotany_formatted_id: "", // Add this field to the reset
        user_pseudo: "",
        user_email: "",
        user_password: "",
        user_phone: "",
        municipality_id: ""
      });

      setIsSubmitting(false);

      // 2) Assigner le rôle par défaut (client = 27)
      try {
        if (registerRes.user_id) {
          await authService.assignUserRoles(registerRes.user_id, [27]);
          console.log('Rôle client assigné avec succès');
        }
      } catch (roleError) {
        console.warn('Erreur lors de l\'assignation du rôle:', roleError?.message || roleError);
        // Ne pas bloquer le processus d'inscription si l'assignation du rôle échoue
      }

      // 3) Auto-login
      try {
        await authService.login(formData.user_email, formData.user_password);
        console.log('Connexion automatique réussie');
      } catch (loginErr) {
        console.warn('Connexion automatique échouée:', loginErr?.message || loginErr);
      }
    
    } catch (error) {
      console.error("Erreur lors de l'inscription: ", {
        message: error.message,
        stack: error.stack,
        response: error.response?.data
      });
      toast.error("Erreur lors de l'inscription");
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(prev => ({ ...prev, communes: true }));
        const communesData = await territoireService.getCommunes();
        setCommunes(communesData);
      } catch (error) {
        console.error('Erreur lors du chargement des communes:', error);
      } finally {
        setIsLoading(prev => ({ ...prev, communes: false }));
      }
    };

    loadData();
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
          <h1 className="text-2xl font-bold text-gray-900 mb-6">{t('registrationForm.titles')}</h1>
          <p className="text-gray-600 text-sm">
            {t('registrationForm.contactInfo')}
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
                  maxLength={12}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.citizen_national_card_number ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder={t('registrationForm.fields.cinNumber')}
                  title={t('registrationForm.errors.cinLength')}
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
                  max={new Date().toISOString().split("T")[0]}
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
    {t("registrationForm.fields.municipality")}{" "}
    <span className="text-red-500">*</span>
  </label>

  <Select
    name="municipality_id"
    value={
      communes
        .map((c) => ({
          value: c.formatted_id || c.commune_id,
          label: c.name || c.nom || `Commune ${c.formatted_id}`,
        }))
        .find((opt) => opt.value === formData.municipality_id) || null
    }
    onChange={(selectedOption) =>
      handleInputChange({
        target: {
          name: "municipality_id",
          value: selectedOption?.value || "",
        },
      })
    }
    options={communes.map((c) => ({
      value: c.formatted_id || c.commune_id,
      label: c.name || c.nom || `Commune ${c.formatted_id}`,
    }))}
    isLoading={isLoading.communes}
    isDisabled={isLoading.communes}
    placeholder={
      isLoading.communes
        ? t("registrationForm.loading")
        : t("registrationForm.selectPlaceholder")
    }
    className="react-select-container"
    classNamePrefix="react-select"
    filterOption={(option, inputValue) =>
      option.label
        .toLowerCase()
        .startsWith(inputValue.toLowerCase()) // 🔍 Recherche par initiale
    }
  />

  {errors.municipality_id && (
    <p className="text-red-500 text-xs mt-1">{errors.municipality_id}</p>
  )}
</div>


<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    {t("registrationForm.fields.fokotany")}{" "}
    <span className="text-red-500">*</span>
  </label>

  <Select
    name="fokotany_id"
    value={
      fokotanys
        .map((f) => ({
          value: f.formatted_id || f.fokotany_id || f.id,
          label: f.name || f.nom || `Fokotany ${f.id}`,
        }))
        .find((opt) => opt.value === formData.fokotany_id) || null
    }
    onChange={(selectedOption) =>
      handleInputChange({
        target: {
          name: "fokotany_id",
          value: selectedOption?.value || "",
        },
      })
    }
    options={fokotanys.map((f) => ({
      value: f.formatted_id || f.fokotany_id || f.id,
      label: f.name || f.nom || `Fokotany ${f.id}`,
    }))}
    isLoading={isLoading.fokotanys}
    isDisabled={!formData.municipality_id || isLoading.fokotanys}
    placeholder={
      !formData.municipality_id
        ? t("registrationForm.selectCommuneFirst")
        : t("registrationForm.selectFokotany")
    }
    className="react-select-container"
    classNamePrefix="react-select"
    filterOption={(option, inputValue) =>
      option.label
        .toLowerCase()
        .startsWith(inputValue.toLowerCase()) // 🔍 Recherche alphabétique
    }
  />

  {errors.fokotany_id && (
    <p className="text-red-500 text-xs mt-1">{errors.fokotany_id}</p>
  )}
</div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('registrationForm.fields.photos')}
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

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('registrationForm.fields.password')} <span className="text-red-500">{t('registrationForm.requiredField')}</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="user_password"
                    value={formData.user_password}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      errors.user_password ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder={t('registrationForm.fields.password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
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
                  maxLength={10}
                  inputMode="numeric"
                 pattern="[0-9]*"
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

          {/* Submit button */}
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

        </div>
      </div>
    </div>
  );
}
