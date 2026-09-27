import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { citoyenService, uploadService } from '../services/api';

const useUserRegisterForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Fonction de validation du formulaire
  const validateForm = useCallback(() => {
    const newErrors = {};
    
    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom est requis';
    }
    
    if (!formData.prenom.trim()) {
      newErrors.prenom = 'Le prénom est requis';
    }
    
    if (!formData.email) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'L\'email est invalide';
    }
    
    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }
    
    if (!agreeTerms) {
      newErrors.agreeTerms = 'Vous devez accepter les conditions d\'utilisation';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, agreeTerms]);

  // Gestion des changements dans les champs du formulaire
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setAgreeTerms(checked);
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Effacer l'erreur du champ quand l'utilisateur commence à taper
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Gestion du téléchargement de la photo
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Vérifier le type de fichier
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setErrors(prev => ({
        ...prev,
        photo: 'Format de fichier non supporté. Veuillez télécharger une image (JPEG, PNG ou GIF).'
      }));
      return;
    }

    // Vérifier la taille du fichier (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setErrors(prev => ({
        ...prev,
        photo: 'La taille du fichier ne doit pas dépasser 2MB.'
      }));
      return;
    }

    // Créer un aperçu de la photo
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Mettre à jour l'état de la photo
    setPhoto(file);

    // Effacer les erreurs précédentes
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.photo;
      return newErrors;
    });
  };

  // Suppression de la photo
  const onRemovePhoto = () => {
    setPhotoPreview(null);
    setPhoto(null);
    
    // Réinitialiser l'input de fichier
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    // Effacer les erreurs liées à la photo
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.photo;
      return newErrors;
    });
  };

  // Gestion de la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation du formulaire
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Préparer les données à envoyer
      const userData = {
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        password: formData.password,
      };
      
      // Si une photo a été téléchargée, l'uploader d'abord
      let photoUrl = null;
      if (photo) {
        const uploadResponse = await uploadService.uploadCitizenPhoto(photo);
        photoUrl = uploadResponse.url;
      }
      
      // Ajouter la photo aux données utilisateur si elle existe
      if (photoUrl) {
        userData.photo_url = photoUrl;
      }
      
      // Envoyer les données d'inscription
      const response = await citoyenService.createCitizen(userData);
      
      // Rediriger vers la page de connexion avec un message de succès
      navigate('/', {
        state: { 
          success: 'Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter.' 
        } 
      });
      
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      
      // Gérer les erreurs d'API
      if (error.response) {
        if (error.response.status === 400) {
          setErrors({
            ...errors,
            email: 'Un compte avec cet email existe déjà',
          });
        } else if (error.response.status === 422) {
          // Erreurs de validation du serveur
          const serverErrors = error.response.data.errors || {};
          const formattedErrors = {};
          
          Object.keys(serverErrors).forEach(key => {
            formattedErrors[key] = serverErrors[key][0];
          });
          
          setErrors({
            ...errors,
            ...formattedErrors,
          });
        } else {
          setErrors({
            ...errors,
            form: 'Une erreur est survenue lors de l\'inscription. Veuillez réessayer.'
          });
        }
      } else {
        setErrors({
          ...errors,
          form: 'Impossible de se connecter au serveur. Veuillez vérifier votre connexion.'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    photo,
    photoPreview,
    loading,
    errors,
    agreeTerms,
    handleChange,
    handlePhotoChange,
    onRemovePhoto,
    handleSubmit,
  };
};

export default useUserRegisterForm;