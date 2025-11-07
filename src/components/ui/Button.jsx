import React from "react";

export default function Button({
  as: As = "button",
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}) {
  const baseClasses = "inline-flex items-center justify-center font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantClasses = {
    primary: "bg-red-600 hover:bg-red-700 text-white",
    danger: "bg-black hover:bg-gray-900 text-white",
    ghost: "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300",
    outline: "border-2 border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-950",
  };

  const sizeClasses = {
    sm: "px-5 py-2.5 text-sm",
    md: "px-8 py-3.5 text-base",
    lg: "px-12 py-5 text-lg",
  };

  return (
    <As
      className={`${baseClasses} ${variantClasses[variant] || variantClasses.primary} ${sizeClasses[size] || sizeClasses.md} ${className}`}
      {...props}
    >
      {children}
    </As>
  );
}