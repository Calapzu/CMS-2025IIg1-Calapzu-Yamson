import React from "react";

export default function Input({ 
  label, 
  hint, 
  error, 
  className = "", 
  ...props 
}) {
  return (
    <label className="block space-y-2">
      {label && (
        <span className="block text-sm font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">
          {label}
        </span>
      )}
      
      <input
        className={`
          w-full px-5 py-4 rounded-xl border-2 text-lg font-medium
          bg-white dark:bg-gray-900 text-gray-900 dark:text-white
          placeholder-gray-400 dark:placeholder-gray-500
          transition-all duration-300 outline-none
          focus:ring-4 focus:ring-red-500/20
          ${error 
            ? "border-red-600 focus:border-red-700 shake" 
            : "border-gray-300 dark:border-gray-700 focus:border-red-600"
          }
          ${className}
        `}
        {...props}
      />
      
      {(hint || error) && (
        <span className={`block text-sm font-medium ${error ? "text-red-600" : "text-gray-500"}`}>
          {error || hint}
        </span>
      )}
    </label>
  );
}