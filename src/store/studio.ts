import { create } from 'zustand';
import { Song, SongLyrics, SongStyle } from '@/types';

interface StudioStore {
  currentSong: Song | null;
  lyrics: SongLyrics | null;
  style: SongStyle | null;
  isLoading: boolean;
  autoSaveEnabled: boolean;
  setCurrentSong: (song: Song | null) => void;
  setLyrics: (lyrics: SongLyrics | null) => void;
  setStyle: (style: SongStyle | null) => void;
  setIsLoading: (loading: boolean) => void;
  setAutoSaveEnabled: (enabled: boolean) => void;
}

export const useStudio = create<StudioStore>((set) => ({
  currentSong: null,
  lyrics: null,
  style: null,
  isLoading: false,
  autoSaveEnabled: true,
  setCurrentSong: (song) => set({ currentSong: song }),
  setLyrics: (lyrics) => set({ lyrics }),
  setStyle: (style) => set({ style }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setAutoSaveEnabled: (enabled) => set({ autoSaveEnabled: enabled }),
}));
