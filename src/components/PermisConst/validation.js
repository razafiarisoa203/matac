// components/PermisConst/validation.js
export const validateField = (name, value, field) => {
  if (field.required && (!value || value.toString().trim() === '')) {
    return `${field.label} est requis`;
  }
  if (field.type === 'email' && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return 'Format email invalide';
  }
  if (field.type === 'tel' && value) {
    const telRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    if (!telRegex.test(value)) return 'Format téléphone invalide';
  }
  if (field.type === 'number' && value && isNaN(value)) {
    return 'Valeur numérique requise';
  }
  return null;
};
