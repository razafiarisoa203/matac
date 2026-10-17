// src/utils/dateUtils.js
export const APP_TIMEZONE = "Indian/Antananarivo"; // UTC+3

export function formatDateTime(dateString) {
  if (!dateString) return "N/A";
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return "N/A";

  return d
    .toLocaleString("fr-FR", {
      timeZone: APP_TIMEZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
    .replace(",", "");
}

export function formatDate(dateString) {
  if (!dateString) return "N/A";
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return "N/A";

  return d.toLocaleDateString("fr-FR", {
    timeZone: APP_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}