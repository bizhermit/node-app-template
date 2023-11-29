export const toFullWidth = (str: string | null | undefined) => {
  return str?.replace(/[A-Za-z0-9]/g, c => String.fromCharCode(c.charCodeAt(0) + 0xFEE0));
};

export const toHalfWidth = (str: string | null | undefined) => {
  return str?.replace(/[Ａ-Ｚａ-ｚ０-９]/g, c => String.fromCharCode(c.charCodeAt(0) - 0xFEE0));
};

export const toHiragana = (str: string | null | undefined) => {
  return str?.replace(/[\u30a1-\u30f6]/g, c => String.fromCharCode(c.charCodeAt(0) - 0x60));
};

export const toKatakana = (str: string | null | undefined) => {
  return str?.replace(/[\u3041-\u3096]/g, c => String.fromCharCode(c.charCodeAt(0) + 0x60));
};