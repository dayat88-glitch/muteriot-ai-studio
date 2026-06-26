-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Workspaces table
CREATE TABLE IF NOT EXISTS public.workspaces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  avatar_url TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Songs table
CREATE TABLE IF NOT EXISTS public.songs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  cover_url TEXT,
  duration INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Song versions table
CREATE TABLE IF NOT EXISTS public.song_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  song_id UUID NOT NULL REFERENCES public.songs(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Song lyrics table
CREATE TABLE IF NOT EXISTS public.song_lyrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  song_id UUID NOT NULL REFERENCES public.songs(id) ON DELETE CASCADE,
  content TEXT,
  language TEXT DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(song_id)
);

-- Song styles table
CREATE TABLE IF NOT EXISTS public.song_styles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  song_id UUID NOT NULL REFERENCES public.songs(id) ON DELETE CASCADE,
  genre TEXT,
  subgenre TEXT,
  bpm INTEGER,
  key TEXT,
  mood TEXT[] DEFAULT '{}',
  instruments TEXT[] DEFAULT '{}',
  production_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(song_id)
);

-- Saved styles table (reusable templates)
CREATE TABLE IF NOT EXISTS public.saved_styles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  genre TEXT NOT NULL,
  subgenre TEXT,
  bpm INTEGER,
  key TEXT,
  mood TEXT[] DEFAULT '{}',
  instruments TEXT[] DEFAULT '{}',
  production_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Audio analysis results
CREATE TABLE IF NOT EXISTS public.audio_analysis (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  song_id UUID NOT NULL REFERENCES public.songs(id) ON DELETE CASCADE,
  bpm DECIMAL(6,2),
  key TEXT,
  energy DECIMAL(3,2),
  tempo DECIMAL(6,2),
  chord_progression TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(song_id)
);

-- Audio references (uploaded files)
CREATE TABLE IF NOT EXISTS public.audio_references (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  song_id UUID NOT NULL REFERENCES public.songs(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_type TEXT CHECK (file_type IN ('mp3', 'wav', 'flac', 'ogg')),
  duration INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Collaborators table
CREATE TABLE IF NOT EXISTS public.collaborators (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  invited_email TEXT,
  role TEXT CHECK (role IN ('admin', 'editor', 'viewer')) DEFAULT 'viewer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Comments table
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  song_id UUID NOT NULL REFERENCES public.songs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Activity logs table
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  target_id UUID,
  target_type TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_workspaces_user_id ON public.workspaces(user_id);
CREATE INDEX IF NOT EXISTS idx_songs_workspace_id ON public.songs(workspace_id);
CREATE INDEX IF NOT EXISTS idx_song_lyrics_song_id ON public.song_lyrics(song_id);
CREATE INDEX IF NOT EXISTS idx_song_styles_song_id ON public.song_styles(song_id);
CREATE INDEX IF NOT EXISTS idx_saved_styles_workspace_id ON public.saved_styles(workspace_id);
CREATE INDEX IF NOT EXISTS idx_audio_analysis_song_id ON public.audio_analysis(song_id);
CREATE INDEX IF NOT EXISTS idx_audio_references_song_id ON public.audio_references(song_id);
CREATE INDEX IF NOT EXISTS idx_collaborators_workspace_id ON public.collaborators(workspace_id);
CREATE INDEX IF NOT EXISTS idx_comments_song_id ON public.comments(song_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_workspace_id ON public.activity_logs(workspace_id);

-- Row Level Security (RLS) Policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.song_lyrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.song_styles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_styles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audio_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audio_references ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Users can read/update their own profile
CREATE POLICY "users_can_read_own_profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "users_can_update_own_profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Workspaces: User can CRUD own workspace
CREATE POLICY "workspaces_owner_full_access" ON public.workspaces
  FOR ALL USING (auth.uid() = user_id);

-- Workspaces: Collaborators can read
CREATE POLICY "workspaces_collaborators_read" ON public.workspaces
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.collaborators
      WHERE collaborators.workspace_id = workspaces.id
      AND collaborators.user_id = auth.uid()
    )
  );

-- Songs: User can manage songs in own workspace
CREATE POLICY "songs_user_access" ON public.songs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.workspaces
      WHERE workspaces.id = songs.workspace_id
      AND workspaces.user_id = auth.uid()
    )
  );

-- Song lyrics: Collaborators can access
CREATE POLICY "song_lyrics_access" ON public.song_lyrics
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.songs
      JOIN public.workspaces ON workspaces.id = songs.workspace_id
      WHERE songs.id = song_lyrics.song_id
      AND workspaces.user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM public.songs
      JOIN public.collaborators ON collaborators.workspace_id = (SELECT workspace_id FROM songs WHERE id = song_lyrics.song_id)
      WHERE songs.id = song_lyrics.song_id
      AND collaborators.user_id = auth.uid()
    )
  );

-- Similar policies for other tables...
CREATE POLICY "song_styles_access" ON public.song_styles FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.songs
    JOIN public.workspaces ON workspaces.id = songs.workspace_id
    WHERE songs.id = song_styles.song_id
    AND workspaces.user_id = auth.uid()
  )
);

CREATE POLICY "saved_styles_access" ON public.saved_styles FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.workspaces
    WHERE workspaces.id = saved_styles.workspace_id
    AND workspaces.user_id = auth.uid()
  )
);

CREATE POLICY "comments_access" ON public.comments FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.songs
    JOIN public.workspaces ON workspaces.id = songs.workspace_id
    WHERE songs.id = comments.song_id
    AND workspaces.user_id = auth.uid()
  )
);

CREATE POLICY "activity_logs_access" ON public.activity_logs FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.workspaces
    WHERE workspaces.id = activity_logs.workspace_id
    AND workspaces.user_id = auth.uid()
  )
);
