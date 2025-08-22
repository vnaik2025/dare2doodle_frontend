import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

const Card = ({ children, className = '' }: CardProps) => (
  <div className={`bg-transperent shadow-md rounded-lg p-6 ${className}`}>
    {children}
  </div>
);

export default Card;