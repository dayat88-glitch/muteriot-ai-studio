import { supabase } from './client';

export const realtimeService = {
  subscribeLyrics: (songId: string, callback: (payload: any) => void) => {
    return supabase
      .channel(`lyrics:${songId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'song_lyrics',
          filter: `song_id=eq.${songId}`,
        },
        callback
      )
      .subscribe();
  },

  subscribeStyle: (songId: string, callback: (payload: any) => void) => {
    return supabase
      .channel(`style:${songId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'song_styles',
          filter: `song_id=eq.${songId}`,
        },
        callback
      )
      .subscribe();
  },

  subscribeComments: (songId: string, callback: (payload: any) => void) => {
    return supabase
      .channel(`comments:${songId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'comments',
          filter: `song_id=eq.${songId}`,
        },
        callback
      )
      .subscribe();
  },

  unsubscribe: (channel: any) => {
    return supabase.removeChannel(channel);
  },
};
