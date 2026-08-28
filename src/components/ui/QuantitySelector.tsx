'use client';

import React from 'react';

export interface QuantitySelectorProps {
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
  disabled = false,
  size = 'md',
}: QuantitySelectorProps) {
  const handleDecrement = () => {
    if (value > min && !disabled) onChange(value - 1);
  };

  const handleIncrement = () => {
    if (value < max && !disabled) onChange(value + 1);
  };

  return (
    <div className={`qty-selector size-${size} ${disabled ? 'is-disabled' : ''}`}>
      <button
        type="button"
        className="qty-btn"
        onClick={handleDecrement}
        disabled={disabled || value <= min}
        aria-label="Decrease quantity"
      >
        −
      </button>
      <span className="qty-val">{value}</span>
      <button
        type="button"
        className="qty-btn"
        onClick={handleIncrement}
        disabled={disabled || value >= max}
        aria-label="Increase quantity"
      >
        +
      </button>

      <style jsx>{`
        .qty-selector {
          display: inline-flex;
          align-items: center;
          border: 1.5px solid #E7E2DA;
          border-radius: 6px;
          background: #FFFFFF;
          height: 36px;
        }
        .size-sm {
          height: 30px;
        }
        .size-lg {
          height: 44px;
        }
        .qty-btn {
          width: 32px;
          height: 100%;
          background: none;
          border: none;
          font-size: 1rem;
          font-weight: 700;
          color: #2D1820;
          cursor: pointer;
          display: grid;
          place-items: center;
        }
        .qty-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
        .qty-val {
          min-width: 32px;
          text-align: center;
          font-size: 0.88rem;
          font-weight: 700;
          color: #1C1917;
        }
      `}</style>
    </div>
  );
}
