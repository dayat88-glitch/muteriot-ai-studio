'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/lib/supabase/auth';
import { motion } from 'framer-motion';
import { Music, Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error: authError } = await authService.signInWithEmail(
        email,
        password
      );
      if (authError) throw authError;
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const { error } = await authService.signInWithGoogle();
    if (error) setError(error.message);
  };

  const handleGithubLogin = async () => {
    setLoading(true);
    const { error } = await authService.signInWithGithub();
    if (error) setError(error.message);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-black via-black to-orange-950/20 flex items-center justify-center px-4 py-12"
    >
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-glass rounded-2xl p-8"
        >
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="bg-gradient-to-r from-orange-500 to-red-600 p-3 rounded-lg">
              <Music className="w-8 h-8" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-center mb-2">Welcome Back</h1>
          <p className="text-center text-white/60 mb-8">
            Sign in to your MuteRiot workspace
          </p>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg mb-6"
            >
              {error}
            </motion.div>
          )}

          {/* Email/Password Form */}
          <form onSubmit={handleLogin} className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-10 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-white/10"></div>
            <span className="text-white/50 text-sm">or</span>
            <div className="flex-1 h-px bg-white/10"></div>
          </div>

          {/* OAuth Buttons */}
          <div className="space-y-3 mb-6">
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-3 rounded-lg border border-white/20 transition-all disabled:opacity-50"
            >
              Sign in with Google
            </button>
            <button
              onClick={handleGithubLogin}
              disabled={loading}
              className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-3 rounded-lg border border-white/20 transition-all disabled:opacity-50"
            >
              Sign in with GitHub
            </button>
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-white/60">
            Don't have an account?{' '}
            <Link href="/auth/signup" className="text-orange-500 hover:text-orange-400">
              Sign up
            </Link>
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
