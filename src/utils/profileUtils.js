const hasValue = (value) =>
  value !== null &&
  value !== undefined &&
  String(value).trim() !== "";

export const isProfileComplete = (profile) => {
  console.log(
    "========== isProfileComplete =========="
  );

  console.log("profile :", profile);

  if (!profile) {
    console.log("❌ profile absent");
    return false;
  }

  const citizen = profile.citizen;

  if (!citizen) {
    console.log("❌ citizen absent");
    return false;
  }

  console.log(
    "municipality_id :",
    profile.municipality_id
  );

  console.log(
    "CIN :",
    citizen.citizen_national_card_number
  );

  console.log(
    "fokontany :",
    citizen.fokotany_formatted_id
  );

  console.log(
    "work :",
    citizen.citizen_work
  );

  console.log(
    "prise service :",
    citizen.citizen_prise_service
  );

  const complete =
    hasValue(profile.id_citizen) &&
    hasValue(profile.municipality_id) &&
    hasValue(citizen.citizen_national_card_number) &&
    hasValue(citizen.fokotany_formatted_id) &&
    hasValue(citizen.citizen_work) &&
    hasValue(citizen.citizen_prise_service);

  console.log(
    "✅ PROFILE COMPLET =",
    complete
  );

  return complete;
};