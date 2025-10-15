// ...existing code...
import React from 'react';

const InputField = ({label,name,value,onChange,type = 'text',placeholder,options,readonly,required,error,inputMode,rows = 3
}) => {
  const id = name || (label ? label.replace(/\s+/g, '_').toLowerCase() : `input_${Math.random().toString(36).slice(2, 8)}`);

  const renderOption = (opt) => {
    if (opt == null) return null;
    if (typeof opt === 'object') return { value: opt.value ?? opt.label, label: opt.label ?? opt.value };
    return { value: opt, label: opt };
  };

  const labelClasses = 'block text-sm font-medium text-gray-700 mb-1 sm:mb-0 sm:w-40';
  const controlWrapper = 'sm:flex-1';
  const baseInputClasses = `w-full p-2 border rounded-lg focus:ring-1 focus:ring-green-600
    ${error ? 'border-red-400' : 'border-gray-300'}`;

  if (options && (type === 'radio' || type === 'radios')) {
    return (
      <div className="mb-4 sm:flex sm:items-start">
        <label htmlFor={id} className={labelClasses}>
          {label}{required && <span className="text-red-500"> *</span>}
        </label>
        <div className={controlWrapper + ' flex flex-wrap gap-3 mt-2 sm:mt-0'}>
          {options.map((opt, idx) => {
            const { value: optValue, label: optLabel } = renderOption(opt);
            const radioId = `${id}_${idx}`;
            return (
              <label key={radioId} htmlFor={radioId} className="inline-flex items-center cursor-pointer">
                <input
                  id={radioId}
                  name={id}
                  type="radio"
                  value={optValue}
                  checked={String(value) === String(optValue)}
                  onChange={onChange}
                  className="form-radio text-[#269745] h-4 w-4"
                  disabled={readonly}
                />
                <span className="ml-2 text-sm text-gray-700">{optLabel}</span>
              </label>
            );
          })}
          {error && <p className="w-full text-red-500 text-xs mt-1">{error}</p>}
        </div>
      </div>
    );
  }

  if (options && (type === 'select' || type === 'dropdown' || !['radio','radios'].includes(type) && options.length)) {
    return (
      <div className="mb-4 sm:flex sm:items-center">
        <label htmlFor={id} className={labelClasses}>
          {label}{required && <span className="text-red-500"> *</span>}
        </label>
        <div className={controlWrapper}>
          <select
            id={id}
            name={id}
            value={value ?? ''}
            onChange={onChange}
            className={`${baseInputClasses} appearance-none bg-white`}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
            disabled={readonly}
          >
            <option value="">{placeholder ?? '-- Choisir --'}</option>
            {options.map((opt, idx) => {
              const { value: optValue, label: optLabel } = renderOption(opt);
              return <option key={idx} value={optValue}>{optLabel}</option>;
            })}
          </select>
          {error && <p id={`${id}-error`} className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
      </div>
    );
  }

  if (type === 'textarea') {
    return (
      <div className="mb-4 sm:flex sm:items-start">
        <label htmlFor={id} className={labelClasses}>
          {label}{required && <span className="text-red-500"> *</span>}
        </label>
        <div className={controlWrapper}>
          <textarea
            id={id}
            name={id}
            value={value ?? ''}
            onChange={onChange}
            placeholder={placeholder}
            readOnly={readonly}
            rows={rows}
            className={`${baseInputClasses} resize-vertical`}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
          />
          {error && <p id={`${id}-error`} className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4 sm:flex sm:items-center">
      <label htmlFor={id} className={labelClasses}>
        {label}{required && <span className="text-red-500"> *</span>}
      </label>
      <div className={controlWrapper}>
        <input
          id={id}
          name={id}
          type={type}
          value={value ?? ''}
          onChange={onChange}
          placeholder={placeholder}
          readOnly={readonly}
          inputMode={inputMode}
          className={baseInputClasses}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          min={type === 'number' ? 0 : undefined}
        />
        {error && <p id={`${id}-error`} className="text-red-500 text-xs mt-1">{error}</p>}
      </div>
    </div>
  );
};

export default InputField;
// ...existing code...