/**
 * Professional SVG Icon Library
 * Replaces emoji with scalable, professional icons
 */

interface IconProps {
  className?: string;
  size?: number;
}

// Trust & Feature Icons
export function ShippingIcon({ className = 'w-8 h-8', size: _size = 24 }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
      <path d="M21 15a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2.5a1 1 0 0 1-.8-.4l-1.9-2.3a1 1 0 0 0-.8-.3H9" />
    </svg>
  );
}

export function ShieldIcon({ className = 'w-8 h-8', size: _size = 24 }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

export function ReturnIcon({ className = 'w-8 h-8', size: _size = 24 }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

export function VerifiedIcon({ className = 'w-8 h-8', size: _size = 24 }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c6.627 0 12 5.373 12 12s-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0zm6.066 9.645l-6.717 6.717-3.528-3.529a.75.75 0 1 0-1.06 1.06l4.058 4.058a.75.75 0 0 0 1.06 0l7.247-7.247a.75.75 0 1 0-1.06-1.06z" />
    </svg>
  );
}

export function TruckIcon({ className = 'w-8 h-8' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="1" y="6" width="22" height="12" rx="2" />
      <path d="M17 10v2" />
      <path d="M7 15h10" />
      <circle cx="5.5" cy="15.5" r="2.5" />
      <circle cx="18.5" cy="15.5" r="2.5" />
    </svg>
  );
}

export function CheckIcon({ className = 'w-6 h-6' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
    </svg>
  );
}

// Category Icons
export function BedsheetIcon({ className = 'w-12 h-12' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 5v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5" />
      <path d="M3 7h18" />
      <path d="M8 7v10M16 7v10" />
    </svg>
  );
}

export function RugIcon({ className = 'w-12 h-12' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M5 9h14M5 13h14M5 17h14" />
      <circle cx="8" cy="9" r="1" fill="currentColor" />
      <circle cx="16" cy="9" r="1" fill="currentColor" />
    </svg>
  );
}

export function ArtIcon({ className = 'w-12 h-12' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      <line x1="9" y1="9" x2="9.01" y2="9" />
      <line x1="15" y1="9" x2="15.01" y2="9" />
    </svg>
  );
}

export function CushionIcon({ className = 'w-12 h-12' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 3h12a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3z" />
      <circle cx="10" cy="10" r="1.5" fill="currentColor" />
      <circle cx="14" cy="10" r="1.5" fill="currentColor" />
      <circle cx="10" cy="14" r="1.5" fill="currentColor" />
      <circle cx="14" cy="14" r="1.5" fill="currentColor" />
    </svg>
  );
}

export function TablewareIcon({ className = 'w-12 h-12' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="8" />
      <path d="M12 4v16M4 12h16" />
      <circle cx="12" cy="12" r="3" fill="currentColor" />
    </svg>
  );
}

// Utility icon getter
export function getCategoryIcon(iconKey: string, className = 'w-12 h-12') {
  const iconMap: { [key: string]: React.ReactNode } = {
    bedsheet: <BedsheetIcon className={className} />,
    rug: <RugIcon className={className} />,
    art: <ArtIcon className={className} />,
    cushion: <CushionIcon className={className} />,
    tableware: <TablewareIcon className={className} />,
  };
  return iconMap[iconKey] || <ArtIcon className={className} />;
}

export function getFeatureIcon(iconKey: string, className = 'w-8 h-8') {
  const iconMap: { [key: string]: React.ReactNode } = {
    shipping: <ShippingIcon className={className} />,
    shield: <ShieldIcon className={className} />,
    return: <ReturnIcon className={className} />,
    verified: <VerifiedIcon className={className} />,
  };
  return iconMap[iconKey] || <ShieldIcon className={className} />;
}
