import React from 'react';
import { motion } from 'framer-motion';

// Example of theme-aware button component
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export const ThemeButton: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  disabled = false,
  className = ''
}) => {
  const baseClasses = 'font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background';
  
  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary-dark shadow-theme-md hover:shadow-theme-lg',
    secondary: 'bg-surface text-text-primary border border-border hover:bg-surface-secondary',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white'
  };
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };
  
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
    >
      {children}
    </motion.button>
  );
};

// Example of theme-aware card component
interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const ThemeCard: React.FC<CardProps> = ({
  children,
  className = '',
  hover = true
}) => {
  return (
    <motion.div
      className={`bg-surface border border-border rounded-2xl p-6 shadow-theme-md ${
        hover ? 'hover:shadow-theme-lg' : ''
      } ${className}`}
      whileHover={hover ? { y: -5 } : {}}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

// Example of theme-aware input component
interface InputProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  label?: string;
  error?: string;
}

export const ThemeInput: React.FC<InputProps> = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  className = '',
  label,
  error
}) => {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-text-primary mb-2">
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`
          w-full px-4 py-3 bg-surface border border-border rounded-xl
          text-text-primary placeholder-text-tertiary
          focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
          transition-all duration-300
          ${error ? 'border-error focus:ring-error' : ''}
        `}
      />
      {error && (
        <p className="mt-1 text-sm text-error">{error}</p>
      )}
    </div>
  );
};

// Example usage component
export const ThemeExamples: React.FC = () => {
  return (
    <div className="space-y-6 p-6">
      <ThemeCard>
        <h3 className="text-xl font-bold text-text-primary mb-4">Theme-Aware Components</h3>
        
        <div className="space-y-4">
          <div className="flex space-x-4">
            <ThemeButton variant="primary">Primary Button</ThemeButton>
            <ThemeButton variant="secondary">Secondary Button</ThemeButton>
            <ThemeButton variant="outline">Outline Button</ThemeButton>
          </div>
          
          <ThemeInput
            label="Email"
            type="email"
            placeholder="Enter your email"
          />
          
          <ThemeInput
            label="Password"
            type="password"
            placeholder="Enter your password"
            error="Password is required"
          />
        </div>
      </ThemeCard>
    </div>
  );
};