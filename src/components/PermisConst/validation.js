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
  if (field.type === 'number' && value) {
    if (isNaN(value)) {
        return 'Valeur numérique requise';
    }
    if (Number(value) < 0) {
        return 'La valeur doit être un nombre positif';
    }
}
  if (field.type === 'text' && value && field.pattern) {
    const regex = new RegExp(field.pattern);
    if (!regex.test(value)) {
        return 'Format texte invalide';
    }
  if (field.type === 'text' && value && field.pattern === '^[A-Za-z0-9]+$') {
    const regex = /^[A-Za-z0-9]+$/;
    if (!regex.test(value)) {
        return 'Valeur alphanumérique requise';
    }
}
}
  return null;
};
