const hasValue = (value) =>
  value !== null &&
  value !== undefined &&
  String(value).trim() !== "";

const REQUIRED_CITIZEN_FIELDS = [
  "citizen_national_card_number",
  "fokotany_formatted_id",
];

export const getProfileCompletion = (profile) => {
  const citizen = profile?.citizen;
  const missingFields = [];

  if (!hasValue(profile?.municipality_id)) {
    missingFields.push("municipality_id");
  }

  for (const field of REQUIRED_CITIZEN_FIELDS) {
    if (!hasValue(citizen?.[field])) {
      missingFields.push(field);
    }
  }

  return {
    user_id: profile?.user_id || null,
    id_citizen: profile?.id_citizen || null,
    complete: missingFields.length === 0,
    missingFields,
  };
};

export const isProfileComplete = (profile) =>
  getProfileCompletion(profile).complete;