import React from 'react';

const RegisterInputField = ({ input, value, onChange, options, error, checked }) => {
  const { type, name, label, placeholder, required } = input;

  const renderInput = () => {
    switch (type) {
      case 'select':
        return (
          <select
            id={name}
            name={name}
            value={value || ''}
            onChange={onChange}
            className={`mt-1 block w-full rounded-lg border ${
              error ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
            } bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 p-2.5 text-sm`}
            required={required}
          >
            <option value="">{placeholder || 'Sélectionnez une option'}</option>
            {options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'checkbox':
        return (
          <div className="flex items-center">
            <input
              id={name}
              name={name}
              type="checkbox"
              checked={checked}
              onChange={onChange}
              className={`h-4 w-4 rounded ${
                error ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
              } text-green-600 focus:ring-green-500`}
              required={required}
            />
            <label
              htmlFor={name}
              className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
              dangerouslySetInnerHTML={{ __html: label }}
            />
          </div>
        );

      case 'date':
        return (
          <input
            type="date"
            id={name}
            name={name}
            value={value || ''}
            onChange={onChange}
            className={`mt-1 block w-full rounded-lg border ${
              error ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
            } bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 p-2.5 text-sm`}
            required={required}
            placeholder={placeholder}
          />
        );

      default:
        return (
          <input
            type={type || 'text'}
            id={name}
            name={name}
            value={value || ''}
            onChange={onChange}
            className={`mt-1 block w-full rounded-lg border ${
              error ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
            } bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 p-2.5 text-sm`}
            required={required}
            placeholder={placeholder}
          />
        );
    }
  };

  return (
    <div className="space-y-1">
      {type !== 'checkbox' && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {renderInput()}
      {error && (
        <p className="text-red-500 dark:text-red-400 text-sm mt-1 ml-1">
          {error}
        </p>
      )}
    </div>
  );
};

export default RegisterInputField;