import React from 'react';

export function AppIcon({ className = "" }: { className?: string }) {
  return (
    <svg 
      className={className}
      viewBox="0 0 256 256" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Button on left */}
      <path 
        d="M60 88 L60 76 C60 71.5817 63.5817 68 68 68 L80 68 C84.4183 68 88 71.5817 88 76 L88 88" 
        stroke="currentColor" 
        strokeWidth="16" 
        strokeLinejoin="round" 
        strokeLinecap="round"
      />
      
      {/* Camera Body */}
      <path 
        d="M72 88 L94 88 L104 68 L152 68 L162 88 L184 88 C206.091 88 224 105.909 224 128 L224 192 C224 214.091 206.091 232 184 232 L72 232 C49.9086 232 32 214.091 32 192 L32 128 C32 105.909 49.9086 88 72 88 Z" 
        stroke="currentColor" 
        strokeWidth="16" 
        strokeLinejoin="round" 
        strokeLinecap="round"
      />
      
      {/* Orange Circle */}
      <circle 
        cx="128" 
        cy="154" 
        r="44" 
        stroke="#FF7A00" 
        strokeWidth="12"
      />
      
      {/* Asterisk */}
      <path 
        d="M128 126 L128 182 M100 154 L156 154 M108.196 134.196 L147.804 173.804 M108.196 173.804 L147.804 134.196" 
        stroke="#FF7A00" 
        strokeWidth="12" 
        strokeLinecap="square"
      />
    </svg>
  );
}
