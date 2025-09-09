import React from 'react';
import { Loader2 } from 'lucide-react';

export default function ActionButton({
  type = 'button',
  onClick,
  className = '',
  text,
  icon,
  isLoading = false,
  disabled = false,
  ...props
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200 ${className} ${
        (disabled || isLoading) ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90'
      }`}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
          {text}
        </>
      ) : (
        <>
          {icon && <span className="mr-2">{icon}</span>}
          {text}
        </>
      )}
    </button>
  );
}
