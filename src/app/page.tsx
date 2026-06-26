'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/store';
import { motion } from 'framer-motion';
import { Music } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="mb-4"
          >
            <Music className="w-12 h-12 mx-auto text-orange-500" />
          </motion.div>
          <p className="text-white/70">Loading MuteRiot...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-black via-black to-orange-950/20 px-6 py-12"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 bg-clip-text text-transparent">
            Welcome to MuteRiot
          </h1>
          <p className="text-xl text-white/70">
            Your Premium AI Music Production Workspace
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[
            {
              icon: '🎵',
              title: 'Create Songs',
              description: 'Compose and arrange music with professional tools',
            },
            {
              icon: '🎨',
              title: 'Style Engineering',
              description: 'Define your sound with Nusantara music intelligence',
            },
            {
              icon: '🎧',
              title: 'Audio Analysis',
              description: 'Analyze BPM, key, energy, and chord progressions',
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="card-glass"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-white/60">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <button
            onClick={() => router.push('/workspace/songs')}
            className="btn-primary text-lg px-8 py-4"
          >
            Start Creating →
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
