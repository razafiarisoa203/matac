import React from 'react';

const InputField = ({ label, value, onChange, type='text', placeholder, options, readonly, required, error }) => {
  if (options) {
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}{required && <span className="text-red-500">*</span>}
        </label>
        <select
          value={value || ''}
          onChange={onChange}
          className={`w-full p-2 border rounded-lg ${error ? 'border-red-400' : 'border-gray-300'}`}
        >
          <option value="">-- Choisir --</option>
          {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>
    );
  }

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}{required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        value={value || ''}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readonly}
        className={`w-full p-2 border rounded-lg focus:ring-1 focus:ring-green-600 ${error ? 'border-red-400' : 'border-gray-300'}`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default InputField;