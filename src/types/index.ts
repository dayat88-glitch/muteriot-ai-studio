export type UserRole = 'admin' | 'editor' | 'viewer';

export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Workspace {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  avatar_url?: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface Song {
  id: string;
  workspace_id: string;
  title: string;
  description?: string;
  cover_url?: string;
  duration?: number;
  created_at: string;
  updated_at: string;
}

export interface SongVersion {
  id: string;
  song_id: string;
  version_number: number;
  created_at: string;
  updated_at: string;
}

export interface SongLyrics {
  id: string;
  song_id: string;
  content: string;
  language: string;
  created_at: string;
  updated_at: string;
}

export interface SongStyle {
  id: string;
  song_id: string;
  genre: string;
  subgenre?: string;
  bpm?: number;
  key?: string;
  mood?: string[];
  instruments?: string[];
  production_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface SavedStyle {
  id: string;
  workspace_id: string;
  name: string;
  genre: string;
  subgenre?: string;
  bpm?: number;
  key?: string;
  mood?: string[];
  instruments?: string[];
  production_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface AudioAnalysis {
  id: string;
  song_id: string;
  bpm?: number;
  key?: string;
  energy?: number;
  tempo?: number;
  chord_progression?: string;
  created_at: string;
  updated_at: string;
}

export interface AudioReference {
  id: string;
  song_id: string;
  file_url: string;
  file_type: 'mp3' | 'wav' | 'flac' | 'ogg';
  duration?: number;
  created_at: string;
  updated_at: string;
}

export interface Collaborator {
  id: string;
  workspace_id: string;
  user_id: string;
  role: UserRole;
  invited_email?: string;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: string;
  song_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface ActivityLog {
  id: string;
  workspace_id: string;
  user_id: string;
  action: string;
  target_id?: string;
  target_type?: string;
  metadata?: Record<string, any>;
  created_at: string;
}
