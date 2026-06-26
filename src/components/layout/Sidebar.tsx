'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Music, Plus, Settings, LogOut } from 'lucide-react';

interface SidebarProps {
  workspaceName?: string;
}

export function Sidebar({ workspaceName = 'My Workspace' }: SidebarProps) {
  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass-dark hidden md:flex flex-col w-64 h-screen border-r border-white/10 p-6 sticky top-0"
    >
      <div className="mb-8">
        <h2 className="text-lg font-bold text-white">{workspaceName}</h2>
        <p className="text-white/50 text-sm mt-1">Workspace</p>
      </div>

      <nav className="flex-1 space-y-2">
        <Link
          href="/workspace/songs"
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors"
        >
          <Music className="w-5 h-5" />
          <span>Songs</span>
        </Link>
        <Link
          href="/workspace/styles"
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Styles</span>
        </Link>
      </nav>

      <div className="space-y-2 border-t border-white/10 pt-4">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors text-white/70 hover:text-white"
        >
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </Link>
      </div>
    </motion.aside>
  );
}
