
import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  color?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "", size = 40, color = "currentColor" }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* The Circle (Head) */}
      <circle cx="50" cy="22" r="14" fill={color} />
      {/* The V-Shape (Body/Shield) */}
      <path 
        d="M5 45L50 85L95 45L78 30L50 55L22 30L5 45Z" 
        fill={color} 
      />
    </svg>
  );
};

export default Logo;
