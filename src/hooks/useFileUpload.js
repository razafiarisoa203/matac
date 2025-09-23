import { useState, useRef } from 'react';
import { uploadFile as uploadFileService } from '../services/api/uploadService';

// Hook personnalisé pour gérer l'upload de fichiers
export const useFileUpload = () => {
  const [files, setFiles] = useState([]);
  const [uploadedPieceJointes, setUploadedPieceJointes] = useState([]);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  const uploadFile = async (file) => {
    setIsUploadingFile(true);
    
    try {
      const result = await uploadFileService(file);
      
      // Ajouter le fichier à la liste avec les informations d'upload
      const fileWithUploadInfo = {
        name: file.name,
        size: file.size,
        type: file.type,
        uploaded: true,
        url: result.url || URL.createObjectURL(file),
        filename: result.filename || file.name,
        uploadResult: result
      };
      
      setFiles(prev => [...prev, fileWithUploadInfo]);
      setUploadedPieceJointes(prev => [...prev, result]);
      return fileWithUploadInfo;
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      throw error;
    } finally {
      setIsUploadingFile(false);
    }
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeUploadedFile = (index) => {
    setUploadedPieceJointes(prev => prev.filter((_, i) => i !== index));
  };

  const clearFiles = () => {
    setFiles([]);
    setUploadedPieceJointes([]);
  };

  return {
    files,
    uploadedPieceJointes,
    isUploadingFile,
    fileInputRef,
    handleFileChange,
    uploadFile,
    removeFile,
    removeUploadedFile,
    clearFiles,
    setFiles,
    setUploadedPieceJointes
  };
};
