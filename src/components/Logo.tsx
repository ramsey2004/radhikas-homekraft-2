'use client';

import Link from 'next/link';
import { ROUTES, STORE_NAME } from '@/lib/constants';

/**
 * Logo Component
 * Bright cyan/teal-leaning blue with Hanken Grotesque font
 */
export function Logo() {
  return (
    <Link href={ROUTES.HOME} className="flex items-center gap-2 transition-all hover:opacity-80">
      {/* Logo Badge - Cyan/Teal Circle */}
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 shadow-md hover:shadow-lg transition-shadow">
        <span 
          className="text-xl font-bold text-white drop-shadow-md"
          style={{ fontFamily: 'Hanken Grotesque, sans-serif' }}
        >
          RH
        </span>
      </div>
      
      {/* Logo Text - Hidden on mobile */}
      <div className="hidden flex-col sm:flex">
        <span 
          className="text-lg font-bold text-gray-900 leading-none"
          style={{ fontFamily: 'Hanken Grotesque, sans-serif' }}
        >
          {STORE_NAME}
        </span>
        <span 
          className="text-xs text-cyan-600 font-semibold leading-none"
          style={{ fontFamily: 'Hanken Grotesque, sans-serif' }}
        >
          Handcrafted
        </span>
      </div>
    </Link>
  );
}
