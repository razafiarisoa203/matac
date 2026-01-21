import React from 'react';

const PermisRemblai = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        {/* Loading Spinner */}
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500 mb-8"></div>

        {/* Text */}
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
          Permis de remblai
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Cette page est encore en cours de développement.
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
          Veuillez revenir plus tard.
        </p>
      </div>
    </div>
  );
};

export default PermisRemblai;