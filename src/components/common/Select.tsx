import type { SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: string[];
  error?: string;
}

const Select = ({ label, options, error, className = "", ...props }: SelectProps) => (
  <div className="w-full mb-3">
    {label && <label className="block text-sm text-gray-300 mb-1">{label}</label>}
    <select
      {...props}
      className={`
        w-full p-2 sm:p-3 text-sm sm:text-base
        rounded-lg bg-zinc-900 text-white
        border border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none
        ${error ? "border-red-500" : ""}
        ${className}
      `}
    >
      <option value="">Select...</option>
      {options.map((opt) => (
        <option key={opt} value={opt} className="bg-black text-white">
          {opt}
        </option>
      ))}
    </select>
    {error && <p className="text-red-500 text-xs sm:text-sm mt-1">{error}</p>}
  </div>
);

export default Select;
