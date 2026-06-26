import { useEffect } from 'react';
import { useStudio } from '@/store/studio';
import { realtimeService } from '@/lib/supabase/realtime';

export const useRealtimeSubscription = (songId: string, type: 'lyrics' | 'style' | 'comments') => {
  const { setLyrics, setStyle } = useStudio();

  useEffect(() => {
    if (!songId) return;

    let subscription;

    if (type === 'lyrics') {
      subscription = realtimeService.subscribeLyrics(songId, (payload) => {
        if (payload.new) {
          setLyrics(payload.new);
        }
      });
    } else if (type === 'style') {
      subscription = realtimeService.subscribeStyle(songId, (payload) => {
        if (payload.new) {
          setStyle(payload.new);
        }
      });
    }

    return () => {
      if (subscription) {
        realtimeService.unsubscribe(subscription);
      }
    };
  }, [songId, type, setLyrics, setStyle]);
};
