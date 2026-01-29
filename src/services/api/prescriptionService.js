import axiosConfig from "./axios.config";

export default async function getPrescription(lng, lat) {
    try {

        const response = await axiosConfig.get(
            `/servicecarto/prescription?x=${lng}&y=${lat}`
        );
        
        // Si c'est un tableau, prendre le premier élément
        const data = Array.isArray(response.data) ? response.data[0] : response.data;
        
        return data || {};
    } catch (error) {
        console.error('Erreur lors de la récupération des prescriptions:', error);
        throw error;
    }
}