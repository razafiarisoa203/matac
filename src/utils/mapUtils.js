// src/utils/mapUtils.js
export const getBoundsFromGeoJSON = (feature) => {
  if (!feature?.geometry) return null;

  let coords = [];
  if (feature.geometry.type === "Polygon") {
    coords = feature.geometry.coordinates[0].map((c) => [c[1], c[0]]);
  } else if (feature.geometry.type === "MultiPolygon") {
    coords = feature.geometry.coordinates[0][0].map((c) => [c[1], c[0]]);
  }

  return coords.length > 0 ? L.latLngBounds(coords) : null;
};