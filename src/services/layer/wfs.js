// Récupération des variables d'environnement
const GEOSERVER_URL = import.meta.env.VITE_GEOSERVER_URL;
const WORKSPACE = import.meta.env.VITE_WORKSPACE;

// Fonction fetch WMS
export const fetchFeatureInfo = async (layer, map, latlng) => {
  const size = map.getSize();
  const point = map.latLngToContainerPoint(latlng);
  const bounds = map.getBounds();

  const baseUrl = layer._url;
  const params = new URLSearchParams({
    request: "GetFeatureInfo",
    service: "WMS",
    version: "1.1.1",
    layers: layer.wmsParams.layers,
    query_layers: layer.wmsParams.layers,
    styles: "",
    bbox: `${bounds.getWest()},${bounds.getSouth()},${bounds.getEast()},${bounds.getNorth()}`,
    width: size.x.toString(),
    height: size.y.toString(),
    x: Math.floor(point.x).toString(),
    y: Math.floor(point.y).toString(),
    srs: "EPSG:4326",
    info_format: "application/json",
    feature_count: "10",
  });

  const url = `${baseUrl}?${params.toString()}`;

  try {
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (!res.ok) return null;
    const data = await res.json();
    return data.features?.[0]?.properties || null;
  } catch (err) {
    return null;
  }
};

// URL de base WFS (alignée avec VITE_GEOSERVER_URL)
const WFS_URL = `${GEOSERVER_URL}/wfs?`;

// Récupérer tous les noms des fokontany
export const fetchFokontanyNames = async () => {
  const url =
    WFS_URL +
    new URLSearchParams({
      service: "WFS",
      version: "1.0.0",
      request: "GetFeature",
      typeName: `${WORKSPACE}:fokontany`,
      outputFormat: "application/json",
    }).toString();

  try {
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error(`Erreur HTTP : ${res.status}`);
    const data = await res.json();

    return [...new Set(data.features.map((f) => f.properties.fokontany))]
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b, "fr", { sensitivity: "base" }));
  } catch (err) {
    console.error("Erreur fetchFokontanyNames:", err);
    return [];
  }
};

// Récupérer un fokontany spécifique pour zoom
export const fetchFokontanyByName = async (nom) => {
  const url =
    WFS_URL +
    new URLSearchParams({
      service: "WFS",
      version: "1.0.0",
      request: "GetFeature",
      typeName: `${WORKSPACE}:fokontany`,
      outputFormat: "application/json",
      CQL_FILTER: `fokontany='${nom}'`,
      srsName: "EPSG:4326",
    }).toString();

  try {
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (!res.ok) return null;
    const data = await res.json();
    return data.features?.[0] || null;
  } catch (err) {
    return null;
  }
};