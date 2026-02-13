'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Hook for detecting touch/mobile interactions
 */
export function useTouchDevice() {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const checkTouch = () => {
      const isTouch =
        typeof window !== 'undefined' &&
        ('ontouchstart' in window ||
          navigator.maxTouchPoints > 0 ||
          (navigator as any).msMaxTouchPoints > 0);
      setIsTouchDevice(isTouch);
    };

    checkTouch();
    window.addEventListener('touchstart', checkTouch);
    return () => window.removeEventListener('touchstart', checkTouch);
  }, []);

  return isTouchDevice;
}

interface MobileTapIndicatorProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  haptic?: boolean;
}

/**
 * MobileTapIndicator Component
 * Shows visual feedback on touch for mobile devices
 * Optional haptic feedback (vibration)
 */
export function MobileTapIndicator({
  children,
  onClick,
  className = '',
  haptic = true,
}: MobileTapIndicatorProps) {
  const [isPressed, setIsPressed] = useState(false);
  const isTouchDevice = useTouchDevice();

  const handleTouchStart = () => {
    setIsPressed(true);
    if (haptic && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(10); // 10ms vibration
    }
  };

  const handleTouchEnd = () => {
    setIsPressed(false);
    onClick?.();
  };

  if (!isTouchDevice) {
    return <>{children}</>;
  }

  return (
    <motion.div
      className={className}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      animate={isPressed ? { scale: 0.95, opacity: 0.8 } : { scale: 1, opacity: 1 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
    >
      {children}
    </motion.div>
  );
}

interface SwipeToRevealProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  swipeThreshold?: number;
  className?: string;
}

/**
 * SwipeToReveal Component
 * Detects horizontal swipe gestures on mobile
 */
export function SwipeToReveal({
  children,
  onSwipeLeft,
  onSwipeRight,
  swipeThreshold = 50,
  className = '',
}: SwipeToRevealProps) {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setTouchEnd(e.changedTouches[0].clientX);

    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > swipeThreshold;
    const isRightSwipe = distance < -swipeThreshold;

    if (isLeftSwipe) onSwipeLeft?.();
    if (isRightSwipe) onSwipeRight?.();
  };

  return (
    <div
      className={className}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {children}
    </div>
  );
}

interface LongPressProps {
  children: React.ReactNode;
  onLongPress?: () => void;
  duration?: number;
  className?: string;
}

/**
 * LongPress Component
 * Detects long press for mobile context menus/actions
 */
export function LongPress({
  children,
  onLongPress,
  duration = 500,
  className = '',
}: LongPressProps) {
  const [isPressing, setIsPressing] = useState(false);
  let timeoutId: NodeJS.Timeout;

  const handleTouchStart = () => {
    setIsPressing(true);
    timeoutId = setTimeout(() => {
      if (isPressing) {
        onLongPress?.();
        if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
          navigator.vibrate([20, 10, 20]); // Pattern vibration
        }
      }
    }, duration);
  };

  const handleTouchEnd = () => {
    setIsPressing(false);
    clearTimeout(timeoutId);
  };

  return (
    <motion.div
      className={className}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      animate={isPressing ? { scale: 0.95 } : { scale: 1 }}
      transition={{ type: 'spring', damping: 20 }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Detect if viewport is in landscape or portrait
 */
export function useOrientation() {
  const [isLandscape, setIsLandscape] = useState(false);

  useEffect(() => {
    const handleOrientationChange = () => {
      setIsLandscape(window.matchMedia('(orientation: landscape)').matches);
    };

    handleOrientationChange();
    window.addEventListener('orientationchange', handleOrientationChange);
    return () => window.removeEventListener('orientationchange', handleOrientationChange);
  }, []);

  return isLandscape;
}

/**
 * Hook to detect safe area insets for notched devices
 */
export function useSafeAreaInsets() {
  const [insets, setInsets] = useState({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  });

  useEffect(() => {
    const updateInsets = () => {
      const style = getComputedStyle(document.documentElement);
      setInsets({
        top: parseInt(style.getPropertyValue('--safe-area-inset-top')) || 0,
        bottom: parseInt(style.getPropertyValue('--safe-area-inset-bottom')) || 0,
        left: parseInt(style.getPropertyValue('--safe-area-inset-left')) || 0,
        right: parseInt(style.getPropertyValue('--safe-area-inset-right')) || 0,
      });
    };

    updateInsets();
    window.addEventListener('resize', updateInsets);
    return () => window.removeEventListener('resize', updateInsets);
  }, []);

  return insets;
}
