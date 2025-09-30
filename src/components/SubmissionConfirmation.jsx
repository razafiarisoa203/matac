// components/SubmissionConfirmation.jsx
import React from 'react';

const SubmissionConfirmation = ({ submissionData, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Dossier soumis avec succès !</h2>
          
          <p className="text-gray-600 mb-4">
            Votre demande de permis de construction a été enregistrée.
          </p>
          
          {submissionData.submissionId && (
            <div className="bg-gray-50 rounded p-3 mb-4">
              <p className="text-sm text-gray-600">Numéro de référence</p>
              <p className="font-mono text-lg font-bold text-gray-900">
                {submissionData.submissionId}
              </p>
            </div>
          )}
          
          <button
            onClick={onClose}
            className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmissionConfirmation;