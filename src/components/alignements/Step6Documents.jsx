import { useRef, useState } from "react";
import { Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

const Step6Documents = ({ files, setFiles, handleFileUpload }) => {
  const fileRefs = {
    propriete: useRef(null),
    plan: useRef(null),
    certificat: useRef(null),
  };

  const [loading, setLoading] = useState({
    propriete: false,
    plan: false,
    certificat: false,
  });

    const { t } = useTranslation();

  const handleChangeFile = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(prev => ({ ...prev, [type]: true }));
    try {
      // Ajouter dans state avec type + conversion dataURL
      const reader = new FileReader();
      reader.onload = async (event) => {
        const dataURL = event.target.result;
        const name = `${type.toUpperCase()}-${Date.now()}.${file.name.split('.').pop()}`;
        const newFile = { type, name, dataURL };

        // Mettre à jour la liste
        setFiles(prev => [...prev.filter(f => f.type !== type), newFile]);

        // Upload vers le serveur
        await handleFileUpload(newFile);
      };
      reader.readAsDataURL(file);
    } finally {
      setLoading(prev => ({ ...prev, [type]: false }));
      e.target.value = "";
    }
  };

  const handleRemoveFile = (type) => {
    setFiles(prev => prev.filter(f => f.type !== type));
  };

  return (
    <>
      <h3 className="text-xl font-medium text-gray-800 mb-8">Documents administratifs</h3>

      <div className="space-y-6">
        {["propriete", "plan", "certificat"].map((type) => (
          <div className="flex items-center gap-3" key={type}>
            <label className="w-64 text-sm font-medium text-gray-700">
              {type === "propriete" ? "Pièce justifiant le droit de propriété"
                : type === "plan" ? "Plan officiel" : "Certificat situation juridique"}
            </label>
            <input
              type="file"
              ref={fileRefs[type]}
              className="hidden"
              accept=".pdf,.jpg,.png,.jpeg,.doc,.docx"
              onChange={(e) => handleChangeFile(e, type)}
            />
            <button
              onClick={() => fileRefs[type].current.click()}
              disabled={loading[type]}
              className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading[type] ? "Chargement..." : "Ajouter un fichier"}
            </button>
          </div>
        ))}

        {/* Liste des fichiers */}
        <div className="mt-4">
          {files.length > 0 ? (
            <ul className="space-y-2">
              {files.map((file) => (
                <li key={file.type} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                  <span className="text-sm text-gray-700">{file.name}</span>
                  <button
                    onClick={() => handleRemoveFile(file.type)}
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
