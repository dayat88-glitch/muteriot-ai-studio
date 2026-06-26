import { supabase } from './client';

export const storageService = {
  uploadAudio: async (file: File, songId: string) => {
    const filename = `${songId}/${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from('audio-files')
      .upload(filename, file);
    return { data, error };
  },

  getAudioUrl: (path: string) => {
    return supabase.storage
      .from('audio-files')
      .getPublicUrl(path);
  },

  deleteAudio: async (path: string) => {
    const { error } = await supabase.storage
      .from('audio-files')
      .remove([path]);
    return { error };
  },

  uploadCover: async (file: File, songId: string) => {
    const filename = `covers/${songId}.jpg`;
    const { data, error } = await supabase.storage
      .from('covers')
      .upload(filename, file, { upsert: true });
    return { data, error };
  },

  getCoverUrl: (path: string) => {
    return supabase.storage
      .from('covers')
      .getPublicUrl(path);
  },
};
