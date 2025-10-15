import { useState, useRef } from 'react';
import { uploadFile as uploadFileService } from '../services/api/uploadService';
import { dataURLtoFile } from '../utils/uploadUtils';

export const useFileUpload = () => {
  const [files, setFiles] = useState([]); // liste des fichiers { type, name, dataURL }
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const fileInputRef = useRef(null);

  // Ajouter un fichier unique par type
  const handleFileChange = (file, type) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataURL = e.target.result;
      const name = `${type.toUpperCase()}-${Date.now()}.${file.name.split('.').pop()}`;

      setFiles(prev => {
        // supprimer l'ancien fichier du même type
        const filtered = prev.filter(f => f.type !== type);
        return [...filtered, { type, name, dataURL }];
      });
    };
    reader.readAsDataURL(file);
  };

  const uploadFile = async (file) => {
    setIsUploadingFile(true);
    try {
      // Convertir dataURL en File si besoin
      let fileToUpload = file;
      if (file.dataURL) {
        fileToUpload = dataURLtoFile(file.dataURL, file.name);
      }
      const result = await uploadFileService(fileToUpload);
      return result;
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      throw error;
    } finally {
      setIsUploadingFile(false);
    }
  };

  const removeFileByType = (type) => {
    setFiles(prev => prev.filter(f => f.type !== type));
  };

  const clearFiles = () => setFiles([]);

  return {
    files,
    isUploadingFile,
    fileInputRef,
    handleFileChange,
    uploadFile,
    removeFileByType,
    clearFiles,
    setFiles
  };
};
