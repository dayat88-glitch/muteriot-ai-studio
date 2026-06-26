'use client';

import { motion } from 'framer-motion';
import { Music, Plus, Folder } from 'lucide-react';
import { Song } from '@/types';
import Link from 'next/link';

interface SongCardProps {
  song: Song;
  onDelete?: (id: string) => void;
}

export function SongCard({ song, onDelete }: SongCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="group card-glass rounded-xl overflow-hidden cursor-pointer transition-all"
    >
      <Link href={`/workspace/songs/${song.id}`} className="block">
        {/* Cover */}
        <div className="relative h-40 bg-gradient-to-br from-orange-500/20 to-red-600/20 flex items-center justify-center overflow-hidden">
          {song.cover_url ? (
            <img
              src={song.cover_url}
              alt={song.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
          ) : (
            <Music className="w-12 h-12 text-orange-500/50" />
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-1 truncate">{song.title}</h3>
          <p className="text-white/50 text-sm mb-4 line-clamp-2">
            {song.description || 'No description'}
          </p>

          <div className="flex items-center justify-between text-xs text-white/40">
            <span>
              {new Date(song.created_at).toLocaleDateString()}
            </span>
            {song.duration && <span>{Math.round(song.duration / 60)}:00</span>}
          </div>
        </div>
      </Link>

      {/* Actions */}
      {onDelete && (
        <div className="px-4 pb-4 flex gap-2">
          <button
            onClick={(e) => {
              e.preventDefault();
              onDelete(song.id);
            }}
            className="flex-1 text-xs btn-ghost"
          >
            Delete
          </button>
        </div>
      )}
    </motion.div>
  );
}

export function CreateSongCard({
  onClick,
}: {
  onClick?: () => void;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      onClick={onClick}
      className="card-glass rounded-xl h-64 flex flex-col items-center justify-center gap-4 hover:bg-white/15 transition-all"
    >
      <div className="p-4 rounded-lg bg-orange-500/20">
        <Plus className="w-8 h-8 text-orange-500" />
      </div>
      <span className="font-semibold">Create New Song</span>
    </motion.button>
  );
}
