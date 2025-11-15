import React from 'react';
import { Avatar as UIAvatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface AvatarProps {
  src?: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg';
  isOnline?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({ src, alt, size = 'md', isOnline }) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="relative">
      <UIAvatar className={sizeClasses[size]}>
        <AvatarImage src={src} alt={alt} />
        <AvatarFallback className="bg-muted text-muted-foreground">
          {getInitials(alt)}
        </AvatarFallback>
      </UIAvatar>
      {isOnline !== undefined && (
        <span
          className={`absolute bottom-0 right-0 block h-3 w-3 rounded-full border-2 border-background ${
            isOnline ? 'bg-[hsl(var(--online))]' : 'bg-muted-foreground'
          }`}
        />
      )}
    </div>
  );
};