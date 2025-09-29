import type { InputHTMLAttributes } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  register?: UseFormRegisterReturn;
  error?: string;
  className?: string;
  isComment?: boolean;
}

const Input = ({
  register,
  error,
  className = "",
  isComment = false,
  ...props
}: InputProps) => (
  <div className={`w-full ${isComment ? "!mb-0" : "mb-2"}`}>
    <input
      {...register}
      {...props}
      className={`
        w-full
        ${isComment ? "p-1.5 sm:p-2 text-sm" : "p-2 sm:p-3 text-sm sm:text-base"}
        text-white
        ${isComment
          ? "!border-b !border-gray-600 !bg-transparent !rounded-none !mb-0 focus:!outline-none focus:!ring-0"
          : "!border !rounded-lg !bg-black !border-gray-700 focus:!outline-none focus:!ring-2 focus:!ring-blue-500"
        }
        overflow-x-auto
        whitespace-nowrap
        min-w-0
        ${error ? "!border-red-500" : ""}
        ${className}
      `}
    />
    {error && <p className="text-red-500 text-xs sm:text-sm mt-1">{error}</p>}
  </div>
);

export default Input;
