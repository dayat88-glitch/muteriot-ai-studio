'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/store';
import { useStudio } from '@/store/studio';
import { songService, lyricsService, styleService } from '@/lib/supabase/database';
import { realtimeService } from '@/lib/supabase/realtime';
import { useAutoSave } from '@/hooks/useAutoSave';
import { Song, SongLyrics, SongStyle } from '@/types';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Clock, Users, Eye, EyeOff } from 'lucide-react';
import { LyricsEditor } from '@/components/editor/LyricsEditor';
import { StyleEngineer } from '@/components/editor/StyleEngineer';

export default function StudioPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const songId = params?.id as string;
  const { currentSong, setCurrentSong, setLyrics, setStyle, autoSaveEnabled, setAutoSaveEnabled } = useStudio();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'lyrics' | 'style' | 'audio'>('lyrics');
  const [isSaving, setIsSaving] = useState(false);

  useAutoSave(songId);

  useEffect(() => {
    if (!user || !songId) {
      router.push('/workspace/songs');
      return;
    }

    loadSongData();
  }, [songId, user]);

  const loadSongData = async () => {
    try {
      const { data: song } = await songService.getSongs('').then(async (res) => {
        // This is a simplified version - in production you'd fetch by songId
        return { data: null };
      });

      if (song) {
        setCurrentSong(song as any);
      }

      // Load lyrics
      const { data: lyrics } = await lyricsService.getLyrics(songId);
      if (lyrics) {
        setLyrics(lyrics);
      } else {
        setLyrics({
          id: '',
          song_id: songId,
          content: LYRICS_TEMPLATE,
          language: 'en',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }

      // Load style
      const { data: style } = await styleService.getStyle(songId);
      if (style) {
        setStyle(style);
      } else {
        setStyle({
          id: '',
          song_id: songId,
          genre: 'Pop',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }

      // Subscribe to realtime updates
      realtimeService.subscribeLyrics(songId, (payload) => {
        if (payload.new) {
          setLyrics(payload.new);
        }
      });
    } catch (error) {
      console.error('Failed to load song:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!currentSong) return;

    setIsSaving(true);
    try {
      // Save logic will be triggered by autoSave hook
      setIsSaving(false);
    } catch (error) {
      console.error('Failed to save:', error);
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-white/70">Loading studio...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full h-full flex flex-col bg-gradient-to-br from-black via-black to-orange-950/10"
    >
      {/* Top Bar */}
      <div className="glass-dark border-b border-white/10 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="btn-ghost p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Untitled Song</h1>
            <p className="text-white/50 text-sm">Production Studio</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-white/60">
            <Clock className="w-4 h-4" />
            <span className="text-sm">Auto-save</span>
            <button
              onClick={() => setAutoSaveEnabled(!autoSaveEnabled)}
              className={`p-1 rounded transition-colors ${
                autoSaveEnabled
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-orange-500/20 text-orange-400'
              }`}
            >
              {autoSaveEnabled ? (
                <Eye className="w-4 h-4" />
              ) : (
                <EyeOff className="w-4 h-4" />
              )}
            </button>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="btn-primary flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="glass-dark border-b border-white/10 px-8 flex gap-8">
        {(['lyrics', 'style', 'audio'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-4 px-2 border-b-2 transition-colors capitalize ${
              activeTab === tab
                ? 'border-orange-500 text-orange-400'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'lyrics' && <LyricsEditor songId={songId} />}
          {activeTab === 'style' && <StyleEngineer songId={songId} />}
          {activeTab === 'audio' && (
            <div className="card-glass rounded-xl p-8">
              <h2 className="text-2xl font-bold mb-4">Audio Analysis</h2>
              <p className="text-white/60">Coming Soon: BPM detection, key analysis, and waveform visualization</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

const LYRICS_TEMPLATE = `[Verse 1]


[Pre-Chorus]


[Chorus]


[Verse 2]


[Pre-Chorus]


[Chorus]


[Bridge]


[Outro]
`;
