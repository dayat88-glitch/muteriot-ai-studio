# MuteRiot AI Studio

> Premium AI Music Production Workspace - Figma + Notion + Audio Analysis

## Overview

MuteRiot AI Studio is a collaborative music production workspace designed for:

- 🎵 Professional music creation workflow
- 🌴 Nusantara music intelligence & style engineering
- ✍️ Lyrics development with templates
- 🎨 Advanced audio analysis & visualization
- 👥 Real-time collaborative editing
- 📊 Project & workspace management

## Key Features

### Authentication
- Email login
- Google OAuth
- GitHub OAuth
- Supabase Auth integration

### Workspace Management
- Multiple workspaces per user
- Songs, lyrics, styles, audio references
- Real-time collaboration
- Activity tracking

### Music Production Tools
- **Lyrics Editor**: Rich text, templates, version history
- **Style Engineering**: Genre selection, BPM, mood/vibe tagging
- **Audio Analysis**: BPM detection, key detection, energy analysis
- **Audio Waveform**: Interactive visualization with WaveSurfer.js
- **MIDI Export**: Export detected progressions as MIDI

### Collaboration
- Real-time editing via Supabase Realtime
- Comments & discussions
- Invite collaborators via email/link
- Activity logs

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **UI Components**: Radix UI + shadcn/ui
- **State**: Zustand + TanStack Query
- **Backend**: Supabase (Auth, Database, Realtime, Storage)
- **Database**: PostgreSQL
- **Audio**: WaveSurfer.js, MIDI Writer JS

## Getting Started

### Prerequisites
- Node.js 18+
- npm or pnpm
- Supabase account

### Installation

```bash
# Clone repository
git clone https://github.com/dayat88-glitch/muteriot-ai-studio.git
cd muteriot-ai-studio

# Install dependencies
npm install

# Setup environment
cp .env.example .env.local
# Add your Supabase credentials to .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── auth/
│   ├── dashboard/
│   ├── workspace/
│   └── studio/
├── components/
│   ├── auth/
│   ├── layout/
│   ├── editor/
│   └── audio/
├── lib/
│   ├── supabase/
│   ├── audio/
│   └── utils/
├── hooks/
├── store/
└── types/
```

## Database Schema

- `users` - User accounts
- `workspaces` - User workspaces
- `workspace_folders` - Folder organization
- `songs` - Song metadata
- `song_versions` - Version history
- `song_styles` - Style configurations
- `saved_styles` - Reusable style templates
- `song_lyrics` - Lyrics content
- `song_audio` - Audio references
- `audio_references` - Analysis results
- `collaborators` - Collaboration access
- `activity_logs` - Workspace activity

## Roadmap

### Phase 1 (Current)
- ✅ Authentication
- ✅ Workspace management
- ✅ Lyrics editor
- ✅ Style engineering
- ✅ Audio analysis tools
- ✅ Collaboration features

### Phase 2
- 🔜 Voice cloning
- 🔜 Stem splitter
- 🔜 AI cover generation
- 🔜 Video export

### Phase 3
- 🔜 Suno API integration
- 🔜 ElevenLabs integration
- 🔜 Internal music generation model

## Contributing

This is an internal testing release. Contributions welcome!

## License

Proprietary - MuteRiot Inc.
