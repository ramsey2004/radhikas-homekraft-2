'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Custom Cursor Component
 * Provides luxury brand micro-interaction with cursor following
 * Changes shape and color on interactive elements
 */

interface CursorState {
  x: number;
  y: number;
  isActive: boolean;
  isHovering: boolean;
}

export function CustomCursor() {
  const [cursor, setCursor] = useState<CursorState>({
    x: 0,
    y: 0,
    isActive: false,
    isHovering: false,
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursor((prev) => ({
        ...prev,
        x: e.clientX,
        y: e.clientY,
      }));
    };

    const handleMouseDown = () => {
      setCursor((prev) => ({
        ...prev,
        isActive: true,
      }));
    };

    const handleMouseUp = () => {
      setCursor((prev) => ({
        ...prev,
        isActive: false,
      }));
    };

    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target;
      
      // Type guard: ensure target is an Element
      if (!(target instanceof Element)) return;
      
      const isInteractive =
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('button') ||
        target.closest('a') ||
        target.classList.contains('interactive');

      if (isInteractive) {
        setCursor((prev) => ({
          ...prev,
          isHovering: true,
        }));
      }
    };

    const handleMouseLeave = () => {
      setCursor((prev) => ({
        ...prev,
        isHovering: false,
      }));
    };

    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseenter', handleMouseEnter, true);
    document.addEventListener('mouseleave', handleMouseLeave, true);

    // Add hover detection to all interactive elements
    const interactiveElements = document.querySelectorAll(
      'a, button, input, textarea, select, [role="button"]'
    );

    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', handleMouseEnter as EventListener);
      el.addEventListener('mouseleave', handleMouseLeave as EventListener);
    });

    // Hide default cursor
    document.body.style.cursor = 'none';

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseenter', handleMouseEnter, true);
      document.removeEventListener('mouseleave', handleMouseLeave, true);
      document.body.style.cursor = 'auto';

      interactiveElements.forEach((el) => {
        el.removeEventListener('mouseenter', handleMouseEnter as EventListener);
        el.removeEventListener('mouseleave', handleMouseLeave as EventListener);
      });
    };
  }, []);

  return (
    <>
      {/* Main cursor dot */}
      <motion.div
        className="fixed top-0 left-0 w-3 h-3 bg-primary-600 rounded-full pointer-events-none z-50 mix-blend-multiply"
        animate={{
          x: cursor.x - 6,
          y: cursor.y - 6,
          scale: cursor.isActive ? 0.8 : cursor.isHovering ? 1.5 : 1,
        }}
        transition={{
          type: 'tween',
          duration: 0,
        }}
      />

      {/* Trailing ring */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 border-2 border-primary-600 rounded-full pointer-events-none z-50 mix-blend-multiply"
        animate={{
          x: cursor.x - 16,
          y: cursor.y - 16,
          scale: cursor.isHovering ? 1.5 : 1,
          opacity: cursor.isHovering ? 1 : 0.5,
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 28,
        }}
      />

      {/* Hover expansion effect */}
      {cursor.isHovering && (
        <motion.div
          className="fixed top-0 left-0 w-12 h-12 border border-primary-300 rounded-full pointer-events-none z-40"
          animate={{
            x: cursor.x - 24,
            y: cursor.y - 24,
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 20,
          }}
          style={{
            opacity: 0.3,
          }}
        />
      )}
    </>
  );
}

/**
 * Hook to add interactive class to elements
 * Usage: const ref = useInteractive(); then <div ref={ref}>...</div>
 */
export function useInteractive() {
  const ref = (element: HTMLElement | null) => {
    if (element) {
      element.classList.add('interactive');
    }
  };
  return ref;
}
