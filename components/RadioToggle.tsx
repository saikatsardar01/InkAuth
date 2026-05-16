'use client';

import { useRadioStore } from '@/lib/radio-store';
import { usePathname } from 'next/navigation';

export default function RadioToggle() {
  const pathname = usePathname();
  const { currentStation, togglePlayerVisible, isPlayerVisible } = useRadioStore();

  const isRadioPage = pathname === '/radio';

  // Hide if no station is playing OR if we are already on the radio page
  if (!currentStation || isRadioPage) return null;

  return (
    <button
      onClick={togglePlayerVisible}
      className={`fixed right-6 sm:right-8 z-[60] flex items-center gap-3 group transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-1 active:scale-90 ${isPlayerVisible
        ? 'bottom-[200px] sm:bottom-8' // Sit exactly 8px above the card on mobile
        : 'bottom-8'
        }`}
      style={{ animation: 'mac-entry 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
      aria-label="Toggle Radio Player"
    >
      {/* Mac Style Label */}
      <div className={`bg-background/40 backdrop-blur-xl border border-foreground/5 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-2xl translate-x-4 group-hover:translate-x-0 ${isPlayerVisible ? 'hidden' : ''
        }`}>
        Atmosphere
      </div>

      {/* Premium Blinking Green Dot Container */}
      <div className={`relative flex h-14 w-14 items-center justify-center bg-background/40 backdrop-blur-2xl rounded-2xl border shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden transition-all duration-500 ${isPlayerVisible ? 'border-green-500/50 bg-green-500/10' : 'border-foreground/5'
        }`}>
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* The Blinking Core */}
        <span className="relative flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-40"></span>
          <span className="animate-[pulse_2s_infinite] absolute inline-flex h-full w-full rounded-full bg-green-500/50 blur-[4px]"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.8)] border border-white/20"></span>
        </span>
      </div>

      <style jsx>{`
        @keyframes mac-entry {
          0% { transform: scale(0.5) translateY(100px); opacity: 0; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
      `}</style>
    </button>
  );
}
