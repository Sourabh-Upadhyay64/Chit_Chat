# ChitChat - WhatsApp-like Real-Time Messaging App

A complete, production-ready full-stack chat application with real-time messaging, WebRTC audio/video calls, and a clean WhatsApp-inspired UI.

## Features

### Core Functionality
- ✅ **Authentication**: Email/password signup and login with persistent sessions
- ✅ **Real-time Messaging**: Instant 1:1 text chat with read receipts
- ✅ **Media Support**: Send images and files within conversations
- ✅ **Contact Management**: Add contacts by email and start conversations
- ✅ **Presence**: Online/offline status indicators
- ✅ **Message Status**: Sent, delivered, and read indicators
- ✅ **Audio/Video Calls**: WebRTC-based voice and video calling with STUN servers
- ✅ **Responsive Design**: Mobile-first, fully responsive layout
- ✅ **Dark Mode Ready**: Theme system with light/dark mode support

### Technical Stack
- **Frontend**: React 18 + Vite + TypeScript
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Shadcn/ui (Radix UI primitives)
- **Database**: IndexedDB for local persistence
- **Real-time**: localStorage events for cross-tab communication
- **WebRTC**: Peer-to-peer audio/video with Google STUN servers
- **Icons**: Lucide React

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd chitchat
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   - Navigate to `http://localhost:8080`
   - The app will be running on port 8080

### Testing the App

1. **Create first user**
   - Click "Sign up" 
   - Enter email (e.g., `alice@example.com`), display name, and password
   - You'll be automatically logged in

2. **Create second user (for testing)**
   - Open a new browser window or incognito tab
   - Navigate to `http://localhost:8080`
   - Sign up with a different email (e.g., `bob@example.com`)

3. **Start chatting**
   - In Alice's window, click the "+" button
   - Enter Bob's email (`bob@example.com`)
   - Click "Add Contact"
   - Start sending messages

4. **Test real-time sync**
   - Messages appear instantly in both windows
   - Online status updates in real-time
   - Read receipts show when messages are viewed

5. **Test calls**
   - Click the phone or video icon in the chat header
   - Accept the call in the other window
   - Use controls to mute/unmute, toggle video, or end call

## Architecture

### Local Storage & Persistence

**IndexedDB Stores:**
- `users`: User profiles and authentication data
- `contacts`: User contact relationships
- `conversations`: Chat metadata (participants, last message time)
- `messages`: All messages with status and media

**Real-time Sync:**
- Uses localStorage events for cross-tab communication
- Simulates WebSocket behavior for local development
- Messages broadcast to all open tabs/windows

### WebRTC Implementation

**Signaling:**
- localStorage-based signaling for local development
- Messages: offer, answer, ICE candidates, end-call

**STUN Servers (configured):**
- `stun:stun.l.google.com:19302`
- `stun:stun1.l.google.com:19302`

**Call Features:**
- Audio-only or video calls
- Mute/unmute microphone
- Toggle video on/off
- Automatic reconnection handling

## Design System

The app uses a semantic token-based design system defined in `src/index.css`:

```css
/* Primary brand color - WhatsApp green */
--primary: 142 70% 45%

/* Message bubbles */
--message-incoming: 0 0% 100%    /* White */
--message-outgoing: 142 70% 95%  /* Light green */

/* Status indicators */
--online: 142 70% 45%    /* Green */
--delivered: 200 18% 46% /* Blue */
--read: 142 70% 45%      /* Green */
```

All components use these semantic tokens for consistent theming.

## Project Structure

```
src/
├── components/
│   ├── ui/              # Shadcn UI components
│   ├── Avatar.tsx       # User avatar with online status
│   ├── CallBar.tsx      # Call controls UI
│   ├── ChatListItem.tsx # Conversation list item
│   ├── Composer.tsx     # Message input with attachments
│   └── MessageBubble.tsx # Message display with receipts
├── contexts/
│   └── AuthContext.tsx  # Authentication state management
├── hooks/
│   ├── useRealtime.ts   # Real-time messaging hook
│   └── useWebRTC.ts     # WebRTC call management
├── lib/
│   ├── db.ts           # IndexedDB wrapper
│   └── utils.ts        # Utility functions
├── pages/
│   ├── Chat.tsx        # Main chat interface
│   ├── Login.tsx       # Login page
│   ├── Signup.tsx      # Signup page
│   └── NotFound.tsx    # 404 page
├── App.tsx             # Root component with routing
└── index.css           # Design system tokens
```

## Available Scripts

```bash
# Development
npm run dev          # Start dev server on port 8080

# Build
npm run build        # Build for production

# Preview production build
npm run preview      # Preview production build locally

# Type checking
npm run type-check   # Run TypeScript compiler checks
```

## Deployment

### Frontend (Vercel/Netlify)

1. **Build the app**
   ```bash
   npm run build
   ```

2. **Deploy dist folder**
   - The build output is in the `dist/` folder
   - Deploy to Vercel, Netlify, or any static host

### Environment Variables
No environment variables needed for local development. All data is stored client-side.

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

**WebRTC Requirements:**
- HTTPS required for production (except localhost)
- Camera/microphone permissions needed for calls
- WebRTC support required (all modern browsers)

## Limitations & Future Enhancements

### Current Limitations
- **No backend**: Data only persists in browser localStorage/IndexedDB
- **Single device**: Can't sync across different devices
- **No E2E encryption**: Messages stored unencrypted locally
- **TURN server**: Only STUN configured (NAT traversal may fail in some networks)

### Recommended Enhancements for Production

1. **Add Real Backend**
   - Replace IndexedDB with PostgreSQL/MongoDB
   - Use WebSockets (Socket.IO) for real-time sync
   - Deploy signaling server for WebRTC
   - Add TURN server for NAT traversal

2. **Security**
   - Implement proper JWT authentication
   - Add rate limiting
   - Enable E2E encryption for messages
   - Validate file uploads (size, type)

3. **Features**
   - Group messaging (already structured for it)
   - Voice messages
   - Message search
   - Push notifications
   - Typing indicators
   - Message reactions
   - Forward/delete messages

4. **Performance**
   - Message pagination
   - Image compression before upload
   - CDN for media files
   - Service worker for offline support

## Testing

### Manual Testing Checklist

**Authentication:**
- [ ] Sign up new user
- [ ] Log in existing user
- [ ] Log out
- [ ] Session persistence across page refresh

**Messaging:**
- [ ] Send text message
- [ ] Send image
- [ ] Message appears in both windows
- [ ] Read receipts update correctly
- [ ] Timestamps display correctly

**Calls:**
- [ ] Start audio call
- [ ] Start video call
- [ ] Accept incoming call
- [ ] Mute/unmute works
- [ ] Video on/off works
- [ ] End call properly cleans up

**UI/UX:**
- [ ] Responsive on mobile (375px)
- [ ] Responsive on tablet (768px)
- [ ] Works on desktop (1024px+)
- [ ] Keyboard navigation
- [ ] Touch targets >= 44px

## Troubleshooting

### Messages not syncing between tabs
- Clear localStorage: `localStorage.clear()`
- Refresh both tabs
- Check browser console for errors

### WebRTC call not connecting
- Ensure HTTPS (or localhost)
- Check camera/microphone permissions
- Open browser console to see ICE candidate logs
- Network may require TURN server (not configured)

### Database errors
- Clear IndexedDB: Open DevTools > Application > IndexedDB > Delete
- Refresh page to reinitialize

## License

MIT

## Contributing

Contributions welcome! Please open an issue or PR.

---

**Built with Lovable** - A modern web app development platform.