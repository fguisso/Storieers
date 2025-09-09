// src/utils/gesturePlay.ts
let lastGestureAt = 0;

export function markUserGesture() {
  lastGestureAt = performance.now();
}

export function isWithinGestureWindow(ms = 1500) {
  return performance.now() - lastGestureAt < ms;
}