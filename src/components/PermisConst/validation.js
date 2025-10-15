// ...existing code...
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

  // Helpers pour validation de nom/prénoms (accepte lettres accentuées, -, ', espaces)
  const normalize = (s) => String(s).normalize('NFC').trim();
  const hasDigits = (s) => /[0-9]/.test(s);
  const isAllUpper = (s) => {
    const n = normalize(s);
    const cleaned = n.replace(/[\s'’\-]/g, '');
    if (!cleaned) return false;
    if (hasDigits(cleaned)) return false;
    return cleaned === cleaned.toUpperCase();
  };
  const isCapitalizedWord = (w) => {
    const n = normalize(w);
    if (!n) return false;
    if (hasDigits(n)) return false;
    const first = n.charAt(0);
    const rest = n.slice(1);
    return first === first.toUpperCase() && rest === rest.toLowerCase();
  };

  // Validation spéciale pour nomProprietaire :
  // - Cas 1 (plusieurs mots) : premier élément = NOM (TOUTES MAJUSCULES), suivants = Prénom(s) (Majuscule initiale + minuscules)
  // - Cas 2 (un seul mot) : accepte soit NOM (TOUTES MAJUSCULES) soit Prénom (Majuscule initiale + minuscules)
  if (name === 'nomProprietaire' || name === 'nomAuteur' && value) {
    const raw = normalize(value);
    const parts = raw.split(/\s+/).filter(Boolean);

    if (parts.length === 0) {
      return 'Format attendu : NOM Prénom ou Prénom';
    }

    if (parts.length === 1) {
      const token = parts[0];
      if (isAllUpper(token) || isCapitalizedWord(token)) {
        // accepté (soit NOM tout en majuscules, soit prénom capitalisé)
      } else {
        return 'Entrez le nom en MAJUSCULES ou le prénom avec une Majuscule suivie de minuscules';
      }
    } else {
      const family = parts[0];
      const given = parts.slice(1);

      if (!isAllUpper(family)) {
        return 'Le nom de famille doit être en MAJUSCULES';
      }
      for (const gn of given) {
        if (!isCapitalizedWord(gn)) {
          return 'Chaque prénom doit commencer par une majuscule suivie de minuscules';
        }
      }
    }
  }

  if (field.type === 'text' && value && field.pattern) {
    const regex = new RegExp(field.pattern);
    if (!regex.test(value)) {
      return 'Format texte invalide';
    }
    if (field.pattern === '^[A-Za-z0-9]+$') {
      const alphaNum = /^[A-Za-z0-9]+$/;
      if (!alphaNum.test(value)) {
        return 'Valeur alphanumérique requise';
      }
    }
  }

  return null;
};
// ...existing