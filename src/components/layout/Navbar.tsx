'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/supabase/auth';
import { useAuth } from '@/store';
import { motion } from 'framer-motion';
import { Music } from 'lucide-react';

export function Navbar() {
  const router = useRouter();
  const { user } = useAuth();

  const handleSignOut = async () => {
    await authService.signOut();
    router.push('/auth/login');
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-dark sticky top-0 z-50 px-6 py-4 border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <div className="bg-gradient-to-r from-orange-500 to-red-600 p-2 rounded-lg">
            <Music className="w-5 h-5" />
          </div>
          <span className="bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
            MuteRiot
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {user && (
            <>
              <span className="text-white/70 text-sm">{user.email}</span>
              <button
                onClick={handleSignOut}
                className="btn-ghost text-sm"
              >
                Sign Out
              </button>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
