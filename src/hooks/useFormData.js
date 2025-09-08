import { useState } from 'react';

// Hook personnalisé pour gérer les données de formulaire
export const useFormData = (initialData = {}) => {
  const [formData, setFormData] = useState(initialData);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const updateFormData = (updates) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const resetFormData = () => {
    setFormData(initialData);
  };

  return {
    formData,
    setFormData,
    handleInputChange,
    updateFormData,
    resetFormData
  };
};
