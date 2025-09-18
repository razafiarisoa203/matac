import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_SERVICEUPLOAD || 'http://localhost:3000';

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post(`${API_BASE_URL}/file/save`, formData, {
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
