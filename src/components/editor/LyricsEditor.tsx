'use client';

import { useStudio } from '@/store/studio';
import { useState, useEffect } from 'react';
import { lyricsService } from '@/lib/supabase/database';
import { motion } from 'framer-motion';
import { FileText, Copy, Check } from 'lucide-react';

interface LyricsEditorProps {
  songId: string;
}

export function LyricsEditor({ songId }: LyricsEditorProps) {
  const { lyrics, setLyrics } = useStudio();
  const [copied, setCopied] = useState(false);
  const [wordCount, setWordCount] = useState(0);

  useEffect(() => {
    if (lyrics) {
      setWordCount(lyrics.content.split(/\s+/).filter((w) => w).length);
    }
  }, [lyrics]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!lyrics) return;
    setLyrics({
      ...lyrics,
      content: e.target.value,
      updated_at: new Date().toISOString(),
    });
  };

  const handleCopy = () => {
    if (lyrics) {
      navigator.clipboard.writeText(lyrics.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-orange-500/20">
            <FileText className="w-6 h-6 text-orange-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Lyrics</h2>
            <p className="text-white/60 text-sm">{wordCount} words</p>
          </div>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 btn-secondary"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy
            </>
          )}
        </button>
      </div>

      {/* Editor */}
      <div className="card-glass rounded-xl p-6 min-h-96">
        <textarea
          value={lyrics?.content || ''}
          onChange={handleContentChange}
          placeholder="Write your lyrics here... Use [Verse], [Chorus], [Bridge] tags to structure your song"
          className="w-full h-96 bg-transparent text-white placeholder-white/30 focus:outline-none font-mono resize-none"
        />
      </div>

      {/* Tips */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="card-glass rounded-lg p-4">
          <h3 className="font-semibold mb-2">Song Structure Tips</h3>
          <ul className="text-sm text-white/60 space-y-1">
            <li>✓ Start with [Verse] for main storytelling</li>
            <li>✓ Use [Chorus] for catchy hooks</li>
            <li>✓ Add [Bridge] for variation</li>
            <li>✓ End with [Outro] for closure</li>
          </ul>
        </div>
        <div className="card-glass rounded-lg p-4">
          <h3 className="font-semibold mb-2">Writing Tips</h3>
          <ul className="text-sm text-white/60 space-y-1">
            <li>✓ Keep lines concise and impactful</li>
            <li>✓ Use rhymes strategically</li>
            <li>✓ Make lyrics memorable</li>
            <li>✓ Version control is automatic</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
