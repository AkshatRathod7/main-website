import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'custom';
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-3xl',
    lg: 'text-5xl',
    xl: 'text-7xl',
    custom: '',
  };

  return (
    <div className={`font-display font-bold tracking-tight inline-flex items-center ${sizeClasses[size]} ${className}`}>
      <span className="text-white">Dream</span>
      <span className="text-gold">SV</span>
      <span className="text-white">in</span>
    </div>
  );
};

export default Logo;
