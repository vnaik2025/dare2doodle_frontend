import type { InputHTMLAttributes } from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  register?: UseFormRegisterReturn;
  error?: string;
}

const Input = ({ register, error, className = '', ...props }: InputProps) => (
  <div className="mb-0">
    <input
      className={`w-full p-2 border rounded bg-black text-white border-gray-700 focus:bg-black/10 focus:outline-none focus:ring-2 focus:ring-primary ${error ? 'border-error' : ''} ${className}`}
      {...register}
      {...props}
    />
    {error && <p className="text-error text-sm mt-1">{error}</p>}
  </div>
);

export default Input;