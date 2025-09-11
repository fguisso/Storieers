# HLS.js Startup Optimisation Practices

This document collects techniques used by open source video players to reduce **time to first frame (TTFF)** when using [HLS.js](https://github.com/video-dev/hls.js).

## Common Configuration Tweaks

- **Start at the lowest rendition** using `startLevel: 0` so the first segment is small and decodes quickly.
- **Limit quality to the element size** with `capLevelToPlayerSize: true` to avoid downloading higher‑resolution segments than needed.
- **Skip the bandwidth test** by setting `testBandwidth: false`. Players measure throughput during playback instead of delaying start‑up.
- **Provide an initial bandwidth hint** via `abrEwmaDefaultEstimate`; many apps persist the last measured value in `localStorage` and reuse it on future plays.
- **Trim buffer sizes** such as `maxBufferLength: 20–30` seconds and `backBufferLength: ~90` seconds to keep memory usage predictable.

## Autoplay on Mobile

Browsers only allow autoplay with sound muted and `playsinline` enabled. Players typically:

- mark the user interaction (e.g. avatar click) and attempt to `play()` while the gesture is still recent;
- set `video.muted = true` before calling `play()` and provide a UI control to toggle sound without re‑creating the HLS instance.

## Examples in the Wild

| Project     | Licence | Notes |
|-------------|---------|-------|
| **PeerTube** | AGPL‑3.0 | Stores bandwidth estimate locally, disables `testBandwidth`, caps buffer to 30s and keeps only ~90s of back‑buffer. |
| **Clappr**   | BSD‑3‑Clause | Exposes `hlsjsConfig` to pass options like `startLevel` or `capLevelToPlayerSize`; default preload fetches the manifest immediately. |
| **Video.js** | Apache‑2.0 | Uses its VHS engine or an HLS.js plugin; recommends autoplay with `muted` and `playsinline` for mobile compatibility. |

These practices help videos begin playing almost instantly while conserving bandwidth.

