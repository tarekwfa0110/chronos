import React from 'react';

export default function Spinner({ size = 48, className = '' }: { size?: number; className?: string }) {
  return (
    <span className={`inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg
        className="animate-spin"
        width={size}
        height={size}
        viewBox="0 0 50 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          className="opacity-20"
          cx="25"
          cy="25"
          r="20"
          stroke="currentColor"
          strokeWidth="6"
        />
        <path
          d="M45 25c0-11.046-8.954-20-20-20"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          className="text-red-500"
        />
      </svg>
    </span>
  );
} 