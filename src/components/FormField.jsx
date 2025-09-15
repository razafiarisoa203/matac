import React from 'react';

export default function FormField({
  type = 'text',
  name,
  placeholder,
  value,
  onChange,
  error,
  icon,
  className = '',
  ...props
}) {
  return (
    <div className={`mb-4 ${className}`}>
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <input
          type={type}
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`block w-full rounded-lg border ${
            error 
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
              : 'border-gray-300 dark:border-gray-600 focus:ring-green-500 focus:border-green-500'
          } bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm pl-10 pr-4 py-3 text-sm`}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
