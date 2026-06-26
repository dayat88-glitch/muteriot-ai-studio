'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Music } from 'lucide-react';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      // Supabase will handle the OAuth callback
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push('/');
      }, 1000);
    };

    handleCallback();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black via-black to-orange-950/20">
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="mb-4"
        >
          <Music className="w-12 h-12 mx-auto text-orange-500" />
        </motion.div>
        <p className="text-white/70">Completing sign in...</p>
      </div>
    </div>
  );
}
