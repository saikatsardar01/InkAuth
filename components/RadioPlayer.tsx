'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Radio as RadioIcon, X } from 'lucide-react';

interface Station {
  changeuuid: string;
  name: string;
  url_resolved: string;
  favicon: string;
  tags: string;
}

interface RadioPlayerProps {
  currentStation: Station | null;
  onClose?: () => void;
}

export default function RadioPlayer({ currentStation, onClose }: RadioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (currentStation && audioRef.current) {
      audioRef.current.src = currentStation.url_resolved;
      audioRef.current.play().catch(err => console.error("Playback failed:", err));
      setIsPlaying(true);
    }
  }, [currentStation]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(err => console.error("Playback failed:", err));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setVolume(value);
    if (audioRef.current) {
      audioRef.current.volume = value;
    }
    if (value === 0) setIsMuted(true);
    else setIsMuted(false);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      const newMuted = !isMuted;
      setIsMuted(newMuted);
      audioRef.current.volume = newMuted ? 0 : volume;
    }
  };

  if (!currentStation) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[95%] max-w-2xl z-50 animate-in fade-in slide-in-from-bottom-10 duration-700">
      {/* Moving Colorful Border Wrapper */}
      <div className="relative p-[1px] rounded-[2.1rem] overflow-hidden group">
        {/* Rotating Gradient Background */}
        <div className="absolute inset-[-50%] bg-[conic-gradient(from_0deg,#4f46e5,#7c3aed,#db2777,#f59e0b,#10b981,#4f46e5)] animate-[spin_4s_linear_infinite] opacity-50 group-hover:opacity-100 transition-opacity"></div>

        <div className="relative glass-card rounded-[2rem] p-3 sm:p-5 shadow-2xl border border-white/10 flex flex-col gap-4 bg-background/80 backdrop-blur-2xl">
          {/* Audio Element */}
          <audio ref={audioRef} autoPlay />

          {/* Top Info Bar */}
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500">Live Broadcast</span>
            </div>

            {/* Improved Dancing Bars */}
            <div className="flex items-end gap-0.5 h-4">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className={`w-0.5 rounded-full transition-all duration-300 ${isPlaying
                      ? 'bg-gradient-to-t from-amber-500 to-orange-400 animate-[bounce_1s_infinite]'
                      : 'bg-foreground/10 h-1'
                    }`}
                  style={{
                    height: isPlaying ? `${Math.random() * 100 + 20}%` : '20%',
                    animationDelay: `${i * 100}ms`,
                    animationDuration: `${0.5 + Math.random()}s`
                  }}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Station Avatar */}
            <div className="relative group flex-shrink-0">
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden bg-accent flex items-center justify-center border border-white/10 shadow-inner">
                {currentStation.favicon && currentStation.favicon !== 'null' ? (
                  <img
                    src={currentStation.favicon}
                    alt={currentStation.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '';
                    }}
                  />
                ) : (
                  <RadioIcon className="w-8 h-8 text-foreground/20" />
                )}
              </div>
            </div>

            {/* Station Info */}
            <div className="min-w-0 flex-1">
              <h4 className="text-base sm:text-xl font-black text-foreground truncate tracking-tight uppercase leading-none mb-1">
                {currentStation.name}
              </h4>
              <div className="flex items-center gap-2">
                <p className="text-[9px] text-foreground/40 uppercase tracking-[0.15em] font-black truncate bg-foreground/5 px-2 py-0.5 rounded">
                  {currentStation.tags ? currentStation.tags.split(',')[0] : 'Streaming Now'}
                </p>
              </div>
            </div>

            {/* Main Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                className="w-14 h-14 rounded-2xl bg-foreground text-background flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl group/btn overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 opacity-0 group-hover/btn:opacity-10 transition-opacity" />
                {isPlaying ? <Pause className="w-7 h-7 fill-current" /> : <Play className="w-7 h-7 fill-current ml-1" />}
              </button>

              <button
                onClick={onClose}
                className="p-3 text-foreground/20 hover:text-foreground transition-colors rounded-xl hover:bg-foreground/5"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Volume Bar */}
          <div className="flex items-center gap-4 px-2 pt-2 border-t border-white/5">
            <button onClick={toggleMute} className="text-foreground/40 hover:text-foreground transition-colors">
              {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <div className="flex-1 relative group h-6 flex items-center">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-full h-1 bg-foreground/10 rounded-full appearance-none cursor-pointer accent-amber-500"
              />
            </div>
            <span className="text-[9px] font-black text-foreground/30 tabular-nums w-8">
              {Math.round((isMuted ? 0 : volume) * 100)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
