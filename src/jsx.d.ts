/// <reference types="react" />

declare global {
  namespace JSX {
      interface IntrinsicElements {
        [elemName: string]: unknown;
      }
  }
}

export {};