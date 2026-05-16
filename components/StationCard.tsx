'use client';

import { Radio as RadioIcon, Play, Activity } from 'lucide-react';

interface Station {
  changeuuid: string;
  name: string;
  url_resolved: string;
  favicon: string;
  tags: string;
  clickcount: number;
}

interface StationCardProps {
  station: Station;
  onPlay: (station: Station) => void;
  isActive: boolean;
}

export default function StationCard({ station, onPlay, isActive }: StationCardProps) {
  return (
    <div
      className={`group relative perspective-1000 cursor-pointer h-full`}
      onClick={() => onPlay(station)}
    >
      <div className={`card-3d glass-card rounded-2xl sm:rounded-3xl p-3 sm:p-5 border transition-all duration-500 h-full flex flex-col shadow-lg hover:shadow-2xl ${isActive ? 'border-amber-500 bg-amber-500/10' : 'border-foreground/5 hover:border-foreground/20'
        }`}>
        <div className="relative mb-3 sm:mb-4 aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-accent flex items-center justify-center">
          {station.favicon && station.favicon !== 'null' && station.favicon.startsWith('http') ? (
            <img
              src={station.favicon}
              alt={station.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              onError={(e) => {
                (e.target as HTMLImageElement).src = ''; // Fallback
              }}
            />
          ) : (
            <RadioIcon className="w-8 h-8 sm:w-12 sm:h-12 text-foreground/20" />
          )}

          <div className={`absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isActive ? 'opacity-100' : ''}`}>
            {isActive ? (
              <div className="flex gap-0.5 sm:gap-1 items-end h-6 sm:h-8">
                <div className="w-1 sm:w-1.5 bg-amber-400 animate-[bounce_1s_infinite_0ms]" />
                <div className="w-1 sm:w-1.5 bg-amber-400 animate-[bounce_1s_infinite_200ms]" />
                <div className="w-1 sm:w-1.5 bg-amber-400 animate-[bounce_1s_infinite_400ms]" />
              </div>
            ) : (
              <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-white flex items-center justify-center shadow-2xl scale-90 group-hover:scale-100 transition-transform">
                <Play className="w-4 h-4 sm:w-6 sm:h-6 text-black fill-current" />
              </div>
            )}
          </div>

          {/* Solid Stats Badge */}
          <div className="absolute top-2 right-2 flex gap-1">
            {station.clickcount > 5000 && (
              <div className="bg-amber-500 text-white text-[8px] sm:text-[10px] font-black px-2 py-1 rounded-lg shadow-lg flex items-center gap-1">
                <Activity className="w-2 sm:w-3 h-2 sm:h-3" />
                HOT
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-col gap-1 mb-2">
            <h3 className="font-black text-foreground text-sm sm:text-xl leading-tight truncate group-hover:text-amber-500 transition-colors uppercase tracking-tight">
              {station.name}
            </h3>
            <p className="text-[10px] sm:text-xs text-foreground/50 font-bold line-clamp-1 italic bg-foreground/5 px-2 py-0.5 rounded-md inline-block self-start">
              {station.tags ? station.tags.split(',').slice(0, 2).join(', ') : 'Direct Stream'}
            </p>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-foreground/5 flex items-center justify-between">
          <div className="bg-foreground text-background px-2.5 py-1 rounded-full text-[8px] sm:text-[10px] font-black uppercase tracking-widest shadow-md">
            {station.clickcount.toLocaleString()} Clicks
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[8px] font-black text-green-500 uppercase">Online</span>
            <div className="relative flex h-3 w-3">
              <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></div>
              <div className="relative inline-flex rounded-full h-3 w-3 bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
