import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
}

const Button = ({ variant = 'primary', children, className = '', ...props }: ButtonProps) => {
  const base = 'px-4 py-2 rounded font-medium transition-colors';
  const variants = {
    outline: 'border border-primary text-primary hover:bg-primary hover:text-white',
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;