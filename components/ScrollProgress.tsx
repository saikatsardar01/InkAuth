'use client';

import { useEffect, useState } from 'react';

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateProgress = () => {
      const currentProgress = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        const percentage = (currentProgress / scrollHeight) * 100;
        setProgress(percentage);
        // Only show progress bar after some scrolling
        setIsVisible(currentProgress > 50);
      }
    };

    window.addEventListener('scroll', updateProgress);
    updateProgress(); // Initial check
    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  if (!isVisible) return null;

  // Calculate dynamic colors based on progress
  // Starts light watery blue, ends dark navy
  const startHue = 190; // Cyan
  const endHue = 220; // Dark Blue
  const currentHue = startHue + (progress * (endHue - startHue) / 100);
  
  const startLightness = 70; // Light
  const endLightness = 20; // Dark
  const currentLightness = startLightness - (progress * (startLightness - endLightness) / 100);

  return (
    <div className="fixed top-0 left-0 w-full h-1.5 z-[100] pointer-events-none overflow-visible">
      <div 
        className="h-full transition-all duration-75 ease-out relative backdrop-blur-[2px] overflow-visible"
        style={{ width: `${progress}%` }}
      >
        {/* Shifting Gradient Bar */}
        <div className="absolute inset-0 contribute-gradient animate-gradient-shift rounded-r-full shadow-[0_0_20px_rgba(79,70,229,0.4)]" />

        {/* The Head of the bar (glow + bubbles) */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center justify-center">
          {/* Floating Bubbles */}
          {[...Array(5)].map((_, i) => (
            <div 
              key={i}
              className="absolute w-1.5 h-1.5 bg-white/50 rounded-full blur-[0.3px] animate-bubble"
              style={{ 
                '--tx': `${(i - 2) * 20}px`, 
                animationDelay: `${i * 0.3}s`,
                top: `${((i % 3) - 1) * 8}px`,
                opacity: 0.3 + (i * 0.1)
              } as any}
            />
          ))}

          {/* Outer Glow */}
          <div className="absolute w-12 h-12 rounded-full blur-2xl opacity-60 bg-blue-500/50 animate-pulse" />
          
          {/* Progress Head Dot (Liquid drop style) */}
          <div className="relative w-2.5 h-2.5 bg-white rounded-full blur-[0.2px] shadow-[0_0_15px_#fff] after:content-[''] after:absolute after:inset-[-2px] after:border-2 after:border-white/50 after:rounded-full after:animate-ping" />
        </div>
        
        {/* Surface light effect (watery finish) */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent h-[40%] rounded-r-full" />
      </div>
    </div>
  );
}
