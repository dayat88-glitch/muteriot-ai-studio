'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/store';
import { useWorkspace } from '@/store';
import { songService, workspaceService } from '@/lib/supabase/database';
import { Song } from '@/types';
import { SongCard, CreateSongCard } from '@/components/songs/SongCard';
import { CreateSongModal } from '@/components/songs/CreateSongModal';
import { motion } from 'framer-motion';
import { Music, Plus, Loader } from 'lucide-react';

export default function SongsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { currentWorkspace } = useWorkspace();
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);

  // Get or create default workspace
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
      return;
    }

    if (!authLoading && user && !workspaceId) {
      loadOrCreateWorkspace();
    }
  }, [user, authLoading, workspaceId]);

  const loadOrCreateWorkspace = async () => {
    if (!user) return;

    try {
      const { data: workspaces } = await workspaceService.getWorkspaces(user.id);
      if (workspaces && workspaces.length > 0) {
        setWorkspaceId(workspaces[0].id);
        loadSongs(workspaces[0].id);
      } else {
        // Create default workspace
        const { data: newWorkspace } = await workspaceService.createWorkspace(
          user.id,
          {
            name: 'My Workspace',
            description: 'My first music production workspace',
          }
        );
        if (newWorkspace) {
          setWorkspaceId(newWorkspace.id);
          setSongs([]);
          setLoading(false);
        }
      }
    } catch (error) {
      console.error('Failed to load workspace:', error);
      setLoading(false);
    }
  };

  const loadSongs = async (wsId: string) => {
    try {
      const { data, error } = await songService.getSongs(wsId);
      if (error) throw error;
      setSongs(data || []);
    } catch (error) {
      console.error('Failed to load songs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSong = async (data: { title: string; description: string }) => {
    if (!workspaceId) return;

    try {
      const { data: newSong, error } = await songService.createSong(workspaceId, {
        title: data.title,
        description: data.description,
      });
      if (error) throw error;
      if (newSong) {
        setSongs([...songs, newSong]);
        router.push(`/workspace/songs/${newSong.id}`);
      }
    } catch (error) {
      console.error('Failed to create song:', error);
    }
  };

  const handleDeleteSong = async (songId: string) => {
    if (!confirm('Are you sure you want to delete this song?')) return;

    try {
      const { error } = await songService.deleteSong(songId);
      if (error) throw error;
      setSongs(songs.filter((s) => s.id !== songId));
    } catch (error) {
      console.error('Failed to delete song:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-orange-500" />
          <p className="text-white/70">Loading songs...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full min-h-screen bg-gradient-to-br from-black via-black to-orange-950/10 p-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-orange-500/20">
              <Music className="w-6 h-6 text-orange-500" />
            </div>
            <h1 className="text-4xl font-bold">My Songs</h1>
          </div>
          <p className="text-white/60 ml-11">Create and manage your music compositions</p>
        </div>

        {/* Songs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <CreateSongCard onClick={() => setIsCreateModalOpen(true)} />
          {songs.map((song) => (
            <SongCard
              key={song.id}
              song={song}
              onDelete={handleDeleteSong}
            />
          ))}
        </div>

        {/* Empty State */}
        {songs.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <Music className="w-16 h-16 mx-auto text-white/20 mb-4" />
            <h2 className="text-2xl font-semibold text-white/60 mb-2">No songs yet</h2>
            <p className="text-white/40 mb-6">Create your first song to get started</p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="btn-primary"
            >
              <Plus className="w-5 h-5 inline mr-2" />
              Create Song
            </button>
          </motion.div>
        )}
      </div>

      {/* Create Modal */}
      <CreateSongModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateSong={handleCreateSong}
      />
    </motion.div>
  );
}
