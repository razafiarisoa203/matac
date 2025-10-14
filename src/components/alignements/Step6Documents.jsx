import { Trash2 } from "lucide-react";
import { useTranslation } from 'react-i18next';
const Step6Documents = ({ files, isUploadingFile, fileInputRef, handleFileUpload, setFiles }) => {
  const handleRemoveFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };
   const { t } = useTranslation();

  return (
    <>
      <h3 className="text-xl font-medium text-gray-800 mb-8">{t('alignment.documents_administratifs')}</h3>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <label className="w-64 text-sm font-medium text-gray-700">{t('alignment.piece_justifiant_droit_propriete')}</label>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".pdf,.jpg,.png,.jpeg,.doc,.docx"
            onChange={async (e) => {
              if (e.target.files[0]) {
                const newFile = e.target.files[0];
                await handleFileUpload(newFile);
              }
              e.target.value = "";
            }}
          />
              <button
        className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => fileInputRef.current.click()}
        disabled={isUploadingFile}
      >
        {isUploadingFile 
          ? t('alignment.chargement')
          :  t('alignment.ajouter_fichier')
        }
      </button>
        </div>
        <div className="mt-4">
          {files.length > 0 ? (
            <ul className="space-y-2">
              {files.map((file, index) => (
                <li key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                  <span className="text-sm text-gray-700">{file.name}</span>
                  <button
                    onClick={() => handleRemoveFile(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">{t('alignment.aucun_fichier_selectionne')}</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Step6Documents;