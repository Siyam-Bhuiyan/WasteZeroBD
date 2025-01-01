// components/ui/avatar.tsx
import React from 'react';

interface AvatarProps {
  className?: string;
  children?: React.ReactNode;
}

export const Avatar: React.FC<AvatarProps> = ({ className = '', children }) => (
  <div className={`relative inline-flex items-center justify-center overflow-hidden rounded-full ${className}`}>
    {children}
  </div>
);

interface AvatarImageProps {
  src: string;
  alt?: string;
  className?: string;
}

export const AvatarImage: React.FC<AvatarImageProps> = ({ src, alt = '', className = '' }) => (
  <img src={src} alt={alt} className={`object-cover ${className}`} />
);

interface AvatarFallbackProps {
  className?: string;
  children?: React.ReactNode;
}

export const AvatarFallback: React.FC<AvatarFallbackProps> = ({ className = '', children }) => (
  <div className={`flex items-center justify-center ${className}`}>
    {children}
  </div>
);