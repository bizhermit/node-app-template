type ConvertedSizeStr<
  T extends string | number | null | undefined,
  N extends string | null | undefined = string | null | undefined
> = T extends number ? string : T extends string ? string : N;

export const convertSizeNumToStr = <
  T extends string | number | null | undefined = string | number | null | undefined,
  N extends string | null | undefined = string | null | undefined
>(value?: T, nullValue?: N) => {
  if (value == null) return nullValue ?? undefined as ConvertedSizeStr<T, N>;
  if (typeof value === "string") return value as unknown as ConvertedSizeStr<T, N>;
  return `${convertPxToRemNum(value)!}rem` as ConvertedSizeStr<T, N>;
};

const pxPerRem = () => {
  if (typeof window === "undefined") return 10;
  return Number(parseFloat(getComputedStyle(document.documentElement).fontSize));
};

export const convertPxToRemNum = (value?: number) => {
  if (value == null) return undefined;
  return value / pxPerRem();
};

export const convertRemToPxNum = (value?: number) => {
  if (value == null) return undefined;
  return value * pxPerRem();
};
