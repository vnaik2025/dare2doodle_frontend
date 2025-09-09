// src/components/common/Input.tsx
import type { InputHTMLAttributes } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  register?: UseFormRegisterReturn;
  error?: string;
}

const Input = ({ register, error, className = "", ...props }: InputProps) => (
  <div className="w-full mb-2">
    <input
      {...register}
      {...props}
      className={`
        w-full
        p-2 sm:p-3
        text-sm sm:text-base
        border
        rounded-lg
        bg-black
        text-white
        border-gray-700
        focus:bg-black/10
        focus:outline-none
        focus:ring-2 focus:ring-blue-500
        ${error ? "border-red-500" : ""}
        ${className}
      `}
    />
    {error && <p className="text-red-500 text-xs sm:text-sm mt-1">{error}</p>}
  </div>
);

export default Input;
