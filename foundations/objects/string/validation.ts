export const isHWNumeric = (str: string | null | undefined) => {
  return str != null && /^[0-9]+$/.test(str);
};

export const isFWNumeric = (str: string | null | undefined) => {
  return str != null && /^[０-９]+$/.test(str);
};

export const isNumeric = (str: string | null | undefined) => {
  return str != null && /^[0-9０-９]+$/.test(str);
};

export const isHWAlphabet = (str: string | null | undefined) => {
  return str != null && /^[a-zA-Z]+$/.test(str);
};

export const isFWAlphabet = (str: string | null | undefined) => {
  return str != null && /^[ａ-ｚＡ-Ｚ]+$/.test(str);
};

export const isAlphabet = (str: string | null | undefined) => {
  return str != null && /^[a-zA-Zａ-ｚＡ-Ｚ]+$/.test(str);
};

export const isHalfWidthSymbols = (str: string | null | undefined) => {
  return str != null && /^[!-/:-@¥[-`{-~]+$/.test(str);
};

export const isHWAlphanumeric = (str: string | null | undefined) => {
  return str != null && /^[a-zA-Z0-9]+$/.test(str);
};

export const isFWAlphanumeric = (str: string | null | undefined) => {
  return str != null && /^[ａ-ｚＡ-Ｚ０-９]+$/.test(str);
};

export const isAlphanumeric = (str: string | null | undefined) => {
  return str != null && /^[a-zA-Z0-9ａ-ｚＡ-Ｚ０-９]+$/.test(str);
};

export const isHWAlphanumericAndSymbols = (str: string | null | undefined) => {
  return str != null && /^[a-zA-Z0-9!-/:-@¥[-`{-~]+$/.test(str);
};

export const isHWKatakana = (str: string | null | undefined) => {
  return str != null && /^[｡-ﾟ+]+$/.test(str);
};

export const isFWKatakana = (str: string | null | undefined) => {
  return str != null && /^[ァ-ヶー]+$/.test(str);
};

export const isKatakana = (str: string | null | undefined) => {
  return str != null && /^[｡-ﾟ+ァ-ヶー]+$/.test(str);
};

export const isHiragana = (str: string | null | undefined) => {
  return str != null && /^[ぁ-ゞー]+$/.test(str);
};

export const isFullWidth = (str: string | null | undefined) => {
  return str != null && str != null && /^[^\x01-\x7E\uFF61-\uFF9F]*$/.test(str);
};

export const isInteger = (str: string | null | undefined) => {
  return str != null && /^[+-]?(0|[1-9]\d*)$/.test(str);
};

export const isPhoneNumber = (str: string | null | undefined) => {
  return str != null && (
    /^0\d-\d{4}-\d{4}$/.test(str)
    || /^0\d{3}-\d{2}-\d{4}$/.test(str)
    || /^0\d{2}-\d{3}-\d{4}$/.test(str)
    || /^0(7|8|9)0-\d{4}-\d{4}$/.test(str)
    || /^050-\d{4}-\d{4}$/.test(str)
    || /^\(0\d\)\d{4}-\d{4}$/.test(str)
    || /^\(0\d{3}\)\d{2}-\d{4}$/.test(str)
    || /^0120-\d{3}-\d{3}$/.test(str)
  );
};

export const isPostalCode = (str: string | null | undefined) => {
  return str != null && (/^[0-9]{3}-[0-9]{4}$/.test(str) || /^[0-9]{7}$/.test(str));
};

export const isMailAddress = (str: string | null | undefined) => {
  return str != null && /^[A-Za-z0-9][a-zA-Z0-9_.+-]*@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]+$/.test(str);
};

export const isUrl = (str: string | null | undefined): str is `http${string}` => {
  return str != null && /^https?:\/\/[a-zA-Z0-9!-/:-@¥[-`{-~]+/.test(str);
};

export const isIpv4Address = (str: string | null | undefined) => {
  if (str == null) return false;
  const s = str.split(".");
  if (s.length !== 4) return false;
  for (const numStr of s) {
    if (!/^(0|[1-9]\d{0,2})/.test(numStr)) return false;
    const num = Number(numStr);
    if (num < 0 || num > 255) return false;
  }
  return true;
};

export const isIpv6Address = (str: string | null | undefined) => {
  return str != null && /(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))/.test(str);
};

export const isUuidV4 = (str: string | null | undefined) => {
  return str != null && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(str);
};