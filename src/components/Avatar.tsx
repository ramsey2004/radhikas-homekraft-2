'use client';

interface AvatarProps {
  initials: string;
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
};

const backgroundColors = [
  'bg-blue-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-green-500',
  'bg-orange-500',
  'bg-red-500',
  'bg-indigo-500',
  'bg-teal-500',
];

export default function Avatar({ initials, name, size = 'md', className = '' }: AvatarProps) {
  // Deterministic color selection based on name
  const colorIndex = name.charCodeAt(0) % backgroundColors.length;
  const bgColor = backgroundColors[colorIndex];

  return (
    <div
      className={`${sizeClasses[size]} ${bgColor} rounded-full flex items-center justify-center font-semibold text-white shadow-sm ${className}`}
      title={name}
    >
      {initials.toUpperCase()}
    </div>
  );
}
