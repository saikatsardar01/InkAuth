import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface Station {
  changeuuid: string;
  name: string;
  url_resolved: string;
  favicon: string;
  tags: string;
}

interface RadioState {
  currentStation: Station | null;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  isPlayerVisible: boolean;
  setCurrentStation: (station: Station | null) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setVolume: (volume: number) => void;
  setIsMuted: (isMuted: boolean) => void;
  setIsPlayerVisible: (visible: boolean) => void;
  togglePlayerVisible: () => void;
  stopRadio: () => void;
}

export const useRadioStore = create<RadioState>()(
  persist(
    (set) => ({
      currentStation: null,
      isPlaying: false,
      volume: 0.8,
      isMuted: false,
      isPlayerVisible: false,
      setCurrentStation: (station) => set({ 
        currentStation: station, 
        isPlaying: !!station, 
        isPlayerVisible: false 
      }),
      setIsPlaying: (isPlaying) => set({ isPlaying }),
      setVolume: (volume) => set({ volume }),
      setIsMuted: (isMuted) => set({ isMuted }),
      setIsPlayerVisible: (isPlayerVisible) => set({ isPlayerVisible }),
      togglePlayerVisible: () => set((state) => ({ isPlayerVisible: !state.isPlayerVisible })),
      stopRadio: () => set({ currentStation: null, isPlaying: false, isPlayerVisible: false }),
    }),
    {
      name: 'radio-storage',
      storage: createJSONStorage(() => localStorage),
      // Only persist these fields
      partialize: (state) => ({ 
        currentStation: state.currentStation, 
        volume: state.volume, 
        isMuted: state.isMuted 
      }),
    }
  )
);
