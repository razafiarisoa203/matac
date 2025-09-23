import { useState, useCallback } from 'react';

// Hook personnalisé pour gérer les données de formulaire
export const useFormData = (initialData = {}) => {
  const [formData, setFormData] = useState(initialData);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const updateFormData = useCallback((updates) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  }, []);

  const resetFormData = useCallback(() => {
    setFormData(initialData);
  }, [initialData]);

  return {
    formData,
    setFormData,
    handleInputChange,
    updateFormData,
    resetFormData
  };
};
