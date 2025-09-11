/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_INSTANCE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module '*.css' {
  const content: string;
  export default content;
}

declare module 'react-swipeable' {
  export interface SwipeableHandlers {
    onTouchStartOrOnMouseDown?: (event: unknown) => void;
  }
  export interface SwipeableOptions {
    onSwipedLeft?: () => void;
    onSwipedRight?: () => void;
    trackTouch?: boolean;
    delta?: number;
  }
  export function useSwipeable(options: SwipeableOptions): SwipeableHandlers;
}
