// Remove this when findLast is added to TypeScript

export {};

declare global {
  interface Array<T> {
    findLastIndex(
      callbackFn: (value: T, index: number, obj: T[]) => unknown
    ): number;
    findLast(
      callbackFn: (value: T, index: number, obj: T[]) => unknown
    ): T | undefined;
  }
}