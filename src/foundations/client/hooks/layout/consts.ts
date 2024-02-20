export const WindowSize = {
  xs: 1,
  s: 2,
  m: 3,
  l: 4,
  xl: 5,
};

export type WindowSizeValue = typeof WindowSize[keyof typeof WindowSize];
