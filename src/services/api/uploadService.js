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
