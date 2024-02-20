type ConvertedString<T extends string | null | undefined> = T extends null | undefined ? undefined : string;

export const toFullWidth = <
  T extends string | null | undefined = string | null | undefined
>(str: T) => {
  return str?.replace(/[A-Za-z0-9]/g, c => String.fromCharCode(c.charCodeAt(0) + 0xFEE0)) as ConvertedString<T>;
};

export const toHalfWidth = <
  T extends string | null | undefined = string | null | undefined
>(str: T) => {
  return str?.replace(/[Ａ-Ｚａ-ｚ０-９]/g, c => String.fromCharCode(c.charCodeAt(0) - 0xFEE0)) as ConvertedString<T>;
};

export const toHiragana = <
  T extends string | null | undefined = string | null | undefined
>(str: T) => {
  return str?.replace(/[\u30a1-\u30f6]/g, c => String.fromCharCode(c.charCodeAt(0) - 0x60)) as ConvertedString<T>;
};

export const toKatakana = <
  T extends string | null | undefined = string | null | undefined
>(str: T) => {
  return str?.replace(/[\u3041-\u3096]/g, c => String.fromCharCode(c.charCodeAt(0) + 0x60)) as ConvertedString<T>;
};
