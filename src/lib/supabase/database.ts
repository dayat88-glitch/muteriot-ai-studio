import { supabase } from './client';
import { Workspace, Song, SongLyrics, SongStyle } from '@/types';

export const workspaceService = {
  getWorkspaces: async (userId: string) => {
    const { data, error } = await supabase
      .from('workspaces')
      .select('*')
      .eq('user_id', userId);
    return { data, error };
  },

  createWorkspace: async (userId: string, workspace: Partial<Workspace>) => {
    const { data, error } = await supabase
      .from('workspaces')
      .insert([{ ...workspace, user_id: userId }])
      .select()
      .single();
    return { data, error };
  },

  updateWorkspace: async (id: string, updates: Partial<Workspace>) => {
    const { data, error } = await supabase
      .from('workspaces')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  deleteWorkspace: async (id: string) => {
    const { error } = await supabase
      .from('workspaces')
      .delete()
      .eq('id', id);
    return { error };
  },
};

export const songService = {
  getSongs: async (workspaceId: string) => {
    const { data, error } = await supabase
      .from('songs')
      .select('*')
      .eq('workspace_id', workspaceId);
    return { data, error };
  },

  createSong: async (workspaceId: string, song: Partial<Song>) => {
    const { data, error } = await supabase
      .from('songs')
      .insert([{ ...song, workspace_id: workspaceId }])
      .select()
      .single();
    return { data, error };
  },

  updateSong: async (id: string, updates: Partial<Song>) => {
    const { data, error } = await supabase
      .from('songs')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  deleteSong: async (id: string) => {
    const { error } = await supabase.from('songs').delete().eq('id', id);
    return { error };
  },
};

export const lyricsService = {
  getLyrics: async (songId: string) => {
    const { data, error } = await supabase
      .from('song_lyrics')
      .select('*')
      .eq('song_id', songId)
      .single();
    return { data, error };
  },

  updateLyrics: async (songId: string, content: string) => {
    const { data, error } = await supabase
      .from('song_lyrics')
      .upsert({ song_id: songId, content, language: 'en' })
      .select()
      .single();
    return { data, error };
  },
};

export const styleService = {
  getStyle: async (songId: string) => {
    const { data, error } = await supabase
      .from('song_styles')
      .select('*')
      .eq('song_id', songId)
      .single();
    return { data, error };
  },

  updateStyle: async (songId: string, style: Partial<SongStyle>) => {
    const { data, error } = await supabase
      .from('song_styles')
      .upsert({ ...style, song_id: songId })
      .select()
      .single();
    return { data, error };
  },
};
