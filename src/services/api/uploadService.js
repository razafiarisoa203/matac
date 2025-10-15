import axiosConfig from './axios.config';


export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axiosConfig.post(`/serviceupload/file/save`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

export default {
  uploadFile,
};

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const viewJoinFiles = ({ filePath }) => {
  if (!filePath || (Array.isArray(filePath) && filePath.length === 0)) {
    console.warn("Aucun fichier trouvé");
    return null;
  }

  const resolvedPath = Array.isArray(filePath) ? filePath[0] : filePath;

  // Supprimer le slash final si présent
  const base = API_BASE_URL.endsWith("/")
    ? API_BASE_URL.slice(0, -1)
    : API_BASE_URL;

  return `${base}/serviceupload/file/preview/${encodeURIComponent(resolvedPath)}`;
};


// Service Upload(photo)
export const uploadService = {
  async uploadCitizenPhoto(photoFile) {
    const formData = new FormData();
    formData.append('file', photoFile);

    const response = await axiosConfig.post(
      '/serviceupload/api/upload/citizen-photo',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data;
  },
};
