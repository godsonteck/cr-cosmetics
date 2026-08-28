'use client';

import React, { ReactNode, ButtonHTMLAttributes } from 'react';
import Link from 'next/link';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  href?: string;
  onClick?: (e?: any) => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  className?: string;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  href,
  onClick,
  disabled = false,
  type = 'button',
  icon,
  iconPosition = 'left',
  className = '',
  ...props
}: ButtonProps) {
  const baseClasses = `btn btn-${variant} btn-${size} ${fullWidth ? 'btn-full' : ''} ${className}`;

  if (href) {
    return (
      <Link href={href} className={baseClasses}>
        {icon && iconPosition === 'left' && <span className="btn-icon">{icon}</span>}
        <span>{children}</span>
        {icon && iconPosition === 'right' && <span className="btn-icon">{icon}</span>}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={baseClasses}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className="btn-icon">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === 'right' && <span className="btn-icon">{icon}</span>}
    </button>
  );
}
