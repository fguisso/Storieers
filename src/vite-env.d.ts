/// <reference types="vite/client" />

declare module '*.css' {
  const content: string;
  export default content;
}

declare module 'react-swipeable' {
  export interface SwipeableHandlers {
    onTouchStartOrOnMouseDown?: (event: any) => void;
  }
  export interface SwipeableOptions {
    onSwipedLeft?: () => void;
    onSwipedRight?: () => void;
    trackTouch?: boolean;
    delta?: number;
  }
  export function useSwipeable(options: SwipeableOptions): SwipeableHandlers;
}

/// <reference types="vite/client" />
