'use client';

import { useState, useEffect } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StationCard from "@/components/StationCard";
import { useRadioStore } from '@/lib/radio-store';
import { Search, Radio as RadioIcon, Loader2, Sparkles, Activity } from 'lucide-react';

interface Station {
  changeuuid: string;
  name: string;
  url_resolved: string;
  favicon: string;
  tags: string;
  clickcount: number;
}

export default function RadioPage() {
  const { currentStation, setCurrentStation } = useRadioStore();
  const [stations, setStations] = useState<Station[]>([]);
  const [filteredStations, setFilteredStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInputValue, setSearchInputValue] = useState('');
  const [activeSearchQuery, setActiveSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(10);

  useEffect(() => {
    async function fetchStations() {
      try {
        setLoading(true);
        const apiUrl = process.env.NEXT_PUBLIC_RADIO_API_URL!;

        const response = await fetch(apiUrl, {
          headers: {
            'User-Agent': 'InkAuthRadio/1.0'
          }
        });
        const data = await response.json();

        const priorityNames = ['93.5', 'Mirchi', 'Red FM', 'Friends FM'];
        const sorted = data.sort((a: Station, b: Station) => {
          const aPriority = priorityNames.some(p => a.name.toLowerCase().includes(p.toLowerCase())) ? 1 : 0;
          const bPriority = priorityNames.some(p => b.name.toLowerCase().includes(p.toLowerCase())) ? 1 : 0;
          if (aPriority !== bPriority) return bPriority - aPriority;
          return b.clickcount - a.clickcount;
        });

        setStations(sorted);
        setFilteredStations(sorted);
      } catch (error) {
        console.error('Error fetching stations:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchStations();
  }, []);

  useEffect(() => {
    const query = activeSearchQuery.toLowerCase();
    const filtered = stations.filter(s =>
      s.name.toLowerCase().includes(query) ||
      s.tags.toLowerCase().includes(query)
    );
    setFilteredStations(filtered);
    setVisibleCount(10);
  }, [activeSearchQuery, stations]);

  const handleSearch = () => {
    setActiveSearchQuery(searchInputValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };


  const handlePlay = (station: Station) => {
    setCurrentStation(station);
  };

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 10);
  };

  const displayedStations = filteredStations.slice(0, visibleCount);

  return (
    <main className="min-h-screen bg-background transition-colors duration-500 mesh-gradient noise-bg">
      <Navbar />

      <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header content */}
        <div className="relative mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-[0.2em] mb-6 animate-gentle-bounce">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            {/* <Activity className="w-3 h-3 opacity-50" /> */}
            Live Radio India
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground mb-6">
            Global <span className="text-amber-500 italic">Streaming</span>
          </h1>
          <p className="max-w-2xl mx-auto text-foreground/40 font-medium text-lg italic leading-relaxed px-4">
            "Your favorite Indian airwaves, crystal clear and always live. Stay connected with the soul of India."
          </p>

          {/* Optimized Search Bar for Mobile */}
          <div className="mt-12 relative max-w-2xl mx-auto group px-4 sm:px-0">
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-[2rem] blur opacity-20 group-focus-within:opacity-40 transition duration-500"></div>
            <div className="relative flex items-center bg-card/50 backdrop-blur-xl border border-foreground/5 rounded-full p-1.5 sm:p-2 transition-all group-focus-within:border-amber-500/50 shadow-2xl">
              <div className="pl-4 pr-3 text-foreground/30 hidden sm:block">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                placeholder="Search stations..."
                className="flex-1 bg-transparent border-none outline-none text-foreground py-3 sm:py-4 px-4 sm:px-0 font-bold placeholder:text-foreground/20 text-sm sm:text-base min-w-0"
                value={searchInputValue}
                onChange={(e) => setSearchInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button
                onClick={handleSearch}
                className="bg-foreground text-background w-12 h-12 sm:w-auto sm:px-10 sm:py-4 rounded-full font-black text-[10px] sm:text-xs uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-xl hover:shadow-foreground/20 flex items-center justify-center gap-2 flex-shrink-0"
              >
                <span className="hidden sm:inline">Search</span>
                <Search className="w-5 h-5 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Stations Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
            <p className="text-foreground/40 font-black uppercase tracking-widest text-xs">Tuning into frequencies...</p>
          </div>
        ) : filteredStations.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-8">
              {displayedStations.map((station) => (
                <StationCard
                  key={station.changeuuid}
                  station={station}
                  onPlay={handlePlay}
                  isActive={currentStation?.changeuuid === station.changeuuid}
                />
              ))}
            </div>

            {visibleCount < filteredStations.length && (
              <div className="mt-16 flex justify-center">
                <button
                  onClick={handleLoadMore}
                  className="group relative px-10 py-4 bg-foreground text-background rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all hover:scale-105 active:scale-95 shadow-xl hover:shadow-foreground/10 overflow-hidden"
                >
                  <span className="relative z-10">Load More Stations</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-32">
            <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-6 text-foreground/20">
              <RadioIcon className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">No stations found</h3>
            <p className="text-foreground/40 italic">Try searching for something else, like "Bollywood" or "News".</p>
          </div>
        )}
      </div>


      <Footer />
    </main>
  );
}
