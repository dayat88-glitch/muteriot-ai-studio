import { useStudio } from '@/store/studio';
import { useEffect, useRef } from 'react';
import { lyricsService } from '@/lib/supabase/database';

export const useAutoSave = (songId: string) => {
  const { lyrics, autoSaveEnabled } = useStudio();
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!autoSaveEnabled || !lyrics || !songId) return;

    // Clear existing timeout
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    // Set new timeout (save after 2 seconds of inactivity)
    autoSaveTimeoutRef.current = setTimeout(async () => {
      try {
        await lyricsService.updateLyrics(songId, lyrics.content);
      } catch (error) {
        console.error('Auto-save failed:', error);
      }
    }, 2000);

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [lyrics, autoSaveEnabled, songId]);
};
