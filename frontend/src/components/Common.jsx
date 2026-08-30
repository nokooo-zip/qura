import React from "react";

export const Button = ({
  children,
  variant = "primary",
  className = "",
  ...props
}) => {
  const baseStyle =
    "py-3 px-4 rounded-md font-medium transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "w-full bg-slate-800 text-white hover:bg-slate-700",
    secondary: "w-full bg-gray-100 text-gray-800 hover:bg-gray-200",
    outline: "w-full border border-gray-300 text-gray-700 hover:bg-gray-50",
    public:
      "w-full bg-white text-green-900 shadow-sm hover:shadow-md font-semibold text-lg",
    danger: "bg-red-600 text-white hover:bg-red-700 px-3 py-2",
    ghost: "text-slate-700 hover:bg-gray-200 px-3 py-2",
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant] || variants.primary} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export const Input = ({
  label,
  type = "text",
  placeholder,
  className = "",
  error,
  ...props
}) => (
  <div className={`w-full ${className}`}>
    {label && (
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
    )}
    <input
      type={type}
      placeholder={placeholder}
      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 bg-white"
      {...props}
    />
    {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
  </div>
);

export const Logo = ({ className = "" }) => (
  <h1
    className={`font-black tracking-tighter text-slate-800 text-4xl ${className}`}
  >
    QURA
  </h1>
);

export const Spinner = ({ className = "w-6 h-6" }) => (
  <svg
    className={`animate-spin text-slate-600 ${className}`}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
    />
  </svg>
);
