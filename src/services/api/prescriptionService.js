import axiosConfig from "./axios.config";

export default async function getPrescription(lng, lat) {
    try {
        console.log("Coords envoyées :", { lng, lat });

        const response = await axiosConfig.get(
            `/servicecarto/prescription?x=${lng}&y=${lat}`
        );

        console.log("Réponse API :", response.data);
        
        // Si c'est un tableau, prendre le premier élément
        const data = Array.isArray(response.data) ? response.data[0] : response.data;
        
        console.log("Données retournées :", data);
        
        return data || {};
    } catch (error) {
        console.error('Erreur lors de la récupération des prescriptions:', error);
        throw error;
    }
}