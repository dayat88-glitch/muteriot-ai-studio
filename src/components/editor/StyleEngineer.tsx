'use client';

import { useStudio } from '@/store/studio';
import { useState, useEffect } from 'react';
import { styleService } from '@/lib/supabase/database';
import { motion } from 'framer-motion';
import { Palette, Plus, X } from 'lucide-react';

const GLOBAL_GENRES = [
  'Pop',
  'Rock',
  'Hip-Hop',
  'Electronic',
  'R&B',
  'Jazz',
  'Classical',
  'Country',
];

const NUSANTARA_GENRES = [
  'Dangdut',
  'Jaipongan',
  'Minangkabau',
  'Keroncong',
  'Campursari',
  'Taskuban',
  'Galuh',
  'Sundanese',
];

const MOODS = [
  'Energetic',
  'Melancholic',
  'Uplifting',
  'Dark',
  'Romantic',
  'Aggressive',
  'Ambient',
  'Playful',
];

const INSTRUMENTS = [
  'Guitar',
  'Piano',
  'Drums',
  'Bass',
  'Strings',
  'Brass',
  'Synth',
  'Ukulele',
  'Gamelan',
  'Sitar',
];

interface StyleEngineerProps {
  songId: string;
}

export function StyleEngineer({ songId }: StyleEngineerProps) {
  const { style, setStyle } = useStudio();
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [selectedInstruments, setSelectedInstruments] = useState<string[]>([]);

  useEffect(() => {
    if (style) {
      setSelectedMoods(style.mood || []);
      setSelectedInstruments(style.instruments || []);
    }
  }, [style]);

  const handleGenreChange = (genre: string) => {
    if (!style) return;
    setStyle({
      ...style,
      genre,
      updated_at: new Date().toISOString(),
    });
  };

  const handleBPMChange = (bpm: number) => {
    if (!style) return;
    setStyle({
      ...style,
      bpm,
      updated_at: new Date().toISOString(),
    });
  };

  const handleKeyChange = (key: string) => {
    if (!style) return;
    setStyle({
      ...style,
      key,
      updated_at: new Date().toISOString(),
    });
  };

  const toggleMood = (mood: string) => {
    const updated = selectedMoods.includes(mood)
      ? selectedMoods.filter((m) => m !== mood)
      : [...selectedMoods, mood];
    setSelectedMoods(updated);
    if (style) {
      setStyle({
        ...style,
        mood: updated,
        updated_at: new Date().toISOString(),
      });
    }
  };

  const toggleInstrument = (instrument: string) => {
    const updated = selectedInstruments.includes(instrument)
      ? selectedInstruments.filter((i) => i !== instrument)
      : [...selectedInstruments, instrument];
    setSelectedInstruments(updated);
    if (style) {
      setStyle({
        ...style,
        instruments: updated,
        updated_at: new Date().toISOString(),
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-lg bg-blue-500/20">
          <Palette className="w-6 h-6 text-blue-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Style Engineering</h2>
          <p className="text-white/60 text-sm">Define your sound with production parameters</p>
        </div>
      </div>

      {/* Global Genres */}
      <div className="card-glass rounded-xl p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
          Global Genres
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {GLOBAL_GENRES.map((genre) => (
            <button
              key={genre}
              onClick={() => handleGenreChange(genre)}
              className={`px-3 py-2 rounded-lg transition-all ${
                style?.genre === genre
                  ? 'bg-orange-500 text-black font-semibold'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      {/* Nusantara Genres */}
      <div className="card-glass rounded-xl p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
          Nusantara Genres
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {NUSANTARA_GENRES.map((genre) => (
            <button
              key={genre}
              onClick={() => handleGenreChange(genre)}
              className={`px-3 py-2 rounded-lg transition-all text-sm ${
                style?.genre === genre
                  ? 'bg-blue-500 text-white font-semibold'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      {/* Production Parameters */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* BPM */}
        <div className="card-glass rounded-xl p-6">
          <label className="block font-semibold mb-4">BPM (Beats Per Minute)</label>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <input
                type="range"
                min="60"
                max="200"
                value={style?.bpm || 120}
                onChange={(e) => handleBPMChange(parseInt(e.target.value))}
                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
              <div className="flex justify-between text-xs text-white/40 mt-2">
                <span>60</span>
                <span>200</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-orange-400 min-w-16 text-center">
              {style?.bpm || 120}
            </div>
          </div>
        </div>

        {/* Key */}
        <div className="card-glass rounded-xl p-6">
          <label className="block font-semibold mb-4">Musical Key</label>
          <div className="grid grid-cols-4 gap-2">
            {['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'].map(
              (key) => (
                <button
                  key={key}
                  onClick={() => handleKeyChange(key)}
                  className={`py-2 rounded-lg text-sm font-semibold transition-all ${
                    style?.key === key
                      ? 'bg-orange-500 text-black'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {key}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* Mood/Vibe */}
      <div className="card-glass rounded-xl p-6">
        <h3 className="font-semibold mb-4">Mood/Vibe (Multi-select)</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {MOODS.map((mood) => (
            <button
              key={mood}
              onClick={() => toggleMood(mood)}
              className={`px-3 py-2 rounded-lg transition-all text-sm ${
                selectedMoods.includes(mood)
                  ? 'bg-blue-500 text-white border border-blue-400'
                  : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
              }`}
            >
              {mood}
            </button>
          ))}
        </div>
      </div>

      {/* Instruments */}
      <div className="card-glass rounded-xl p-6">
        <h3 className="font-semibold mb-4">Primary Instruments</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {INSTRUMENTS.map((instrument) => (
            <button
              key={instrument}
              onClick={() => toggleInstrument(instrument)}
              className={`px-3 py-2 rounded-lg transition-all text-sm ${
                selectedInstruments.includes(instrument)
                  ? 'bg-green-500 text-white border border-green-400'
                  : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
              }`}
            >
              {instrument}
            </button>
          ))}
        </div>
      </div>

      {/* Production Notes */}
      <div className="card-glass rounded-xl p-6">
        <label className="block font-semibold mb-3">Production Notes</label>
        <textarea
          value={style?.production_notes || ''}
          onChange={(e) => {
            if (style) {
              setStyle({
                ...style,
                production_notes: e.target.value,
                updated_at: new Date().toISOString(),
              });
            }
          }}
          placeholder="Add production notes, mixing ideas, or any special instructions"
          className="w-full h-32 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
        />
      </div>

      {/* Summary */}
      <div className="card-glass rounded-xl p-6 border-l-4 border-orange-500">
        <h3 className="font-semibold mb-3">Your Style</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-white/60">Genre:</span>
            <p className="text-white font-semibold">{style?.genre || 'Not selected'}</p>
          </div>
          <div>
            <span className="text-white/60">BPM:</span>
            <p className="text-white font-semibold">{style?.bpm || 120} bpm</p>
          </div>
          <div>
            <span className="text-white/60">Key:</span>
            <p className="text-white font-semibold">{style?.key || 'Not selected'}</p>
          </div>
          <div>
            <span className="text-white/60">Moods:</span>
            <p className="text-white font-semibold">
              {selectedMoods.length > 0 ? selectedMoods.join(', ') : 'Not selected'}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
