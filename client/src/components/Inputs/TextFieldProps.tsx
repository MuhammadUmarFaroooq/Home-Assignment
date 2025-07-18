
import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

interface TextFieldProps {
  type?: "text" | "email" | "password";
  label: string;
  name: string;
  placeholder?: string;
  leadingIcon?: any;
  error?: string;
  disabled?: boolean;
  register?: (name: string, options?: any) => any; 
  className?: string;
  rules?: Record<string, any>; 
}

export default function TextField({
  type = "text",
  label,
  name,
  placeholder,
  leadingIcon: LeadingIcon,
  error,
  register,
  disabled,
  className = "",
  rules = {},
}: TextFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  const inputProps = register ? register(name, rules) : {};

  return (
    <div className={`mb-4 ${className}`}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative rounded-md shadow-sm">
        {LeadingIcon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <LeadingIcon className="w-5 h-5 text-gray-400" />
          </div>
        )}
        <input
          type={type === "password" ? (showPassword ? "text" : "password") : type}
          id={name}
          name={name}
          placeholder={placeholder}
          disabled={disabled}
          {...inputProps} 
          className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
            LeadingIcon ? "pl-10" : "pl-3"
          } ${
            error ? "border-red-500" : "border-gray-300"
          } py-2 pr-10 border ${className}`}
        />
        {type === "password" && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}