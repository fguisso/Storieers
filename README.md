## PeerTube Stories (SPA React)

Single-page app that plays public videos from a single PeerTube instance/user as vertical "stories" with auto-advance, tap/swipe navigation, HLS via hls.js, and MP4 fallback.

### Setup

1. Create `.env` at the project root (already provided):

```
VITE_INSTANCE=https://peertube.lhc.net.br
VITE_START_VIDEO=https://peertube.lhc.net.br/w/u1B3VoNay6dLgsGVnCfPbb
VITE_MAX_DURATION=120
VITE_PAGE_COUNT=20
```

2. Install deps and run dev server:

```
npm install
npm run dev
```

Open the printed URL in a mobile browser or emulator.

### Features

- Mobile-first: fullscreen, playsinline, muted autoplay
- Tap right/left to next/prev; swipe left/right
- Auto-advance on end; segmented progress bar
- Mute toggle; overlay title and author; "Ver no PeerTube" link
- HLS via `hls.js` with MP4 fallback when HLS fails or lacks CORS

### Limitations

- Frontend-only; no backend or login
- Single instance (`VITE_INSTANCE`) and single user/channel (resolved from `VITE_START_VIDEO`)
- No WebTorrent/P2P; no iframes/embed API
