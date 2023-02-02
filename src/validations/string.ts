import StringUtils from "@bizhermit/basic-utils/dist/string-utils";

namespace StringValidation {

  const defaultItemName = "値";

  export const required = (v: Nullable<string>, itemName?: string) => {
    if (v == null || v === "") return `${itemName || defaultItemName}を入力してください。`;
    return undefined;
  };

  export const length = (v: Nullable<string>, length: number, itemName?: string) => {
    if (StringUtils.length(v) === length) return undefined;
    return `${itemName || defaultItemName}は${length}文字で入力してください。`;
  };

  export const minLength = (v: Nullable<string>, minLength: number, itemName?: string) => {
    if (v != null && StringUtils.length(v) >= minLength) return undefined;
    return `${itemName || defaultItemName}は${minLength}文字以下で入力してください。`;
  };

  export const maxLength = (v: Nullable<string>, maxLength: number, itemName?: string) => {
    if (v == null || StringUtils.length(v) <= maxLength) return undefined;
    return `${itemName || defaultItemName}は${maxLength}文字以下で入力してください。`;
  };

  export const halfWidthNumeric = (v: Nullable<string>, itemName?: string) => {
    if (v == null || StringUtils.isHalfWidthNumeric(v)) return undefined;
    return `${itemName || defaultItemName}は半角数字で入力してください。`;
  };

  export const fullWidthNumeric = (v: Nullable<string>, itemName?: string) => {
    if (v == null || /^[０-９]+$/.test(v)) return undefined;
    return `${itemName || defaultItemName}は全角数字で入力してください。`;
  };

  export const numeric = (v: Nullable<string>, itemName?: string) => {
    if (v == null || /^[0-9０-９]+$/.test(v)) return undefined;
    return `${itemName || defaultItemName}は数字で入力してください。`;
  };

  export const halfWidthAlphabet = (v: Nullable<string>, itemName?: string) => {
    if (v == null || StringUtils.isHalfWidthAlphabet(v)) return undefined;
    return `${itemName || defaultItemName}は半角英字で入力してください。`;
  };

  export const fullWidthAlphabet = (v: Nullable<string>, itemName?: string) => {
    if (v == null || /^[ａ-ｚＡ-Ｚ]+$/.test(v)) return undefined;
    return `${itemName || defaultItemName}は全角英字で入力してください。`;
  };

  export const alphabet = (v: Nullable<string>, itemName?: string) => {
    if (v == null || /^[a-zA-Zａ-ｚＡ-Ｚ]+$/.test(v)) return undefined;
    return `${itemName || defaultItemName}は英字で入力してください。`;
  };

  export const halfWidthAlphaNumeric = (v: Nullable<string>, itemName?: string) => {
    if (v == null || StringUtils.isHalfWidthAlphanumeric(v)) return undefined;
    return `${itemName || defaultItemName}は半角英数字で入力してください。`;
  };

  export const halfWidthAlphaNumericAndSymbols = (v: Nullable<string>, itemName?: string) => {
    if (v == null || StringUtils.isHalfWidthAlphanumericAndSymbols(v)) return undefined;
    return `${itemName || defaultItemName}は半角英数字記号で入力してください。`;
  };

  export const integer = (v: Nullable<string>, itemName?: string) => {
    if (v == null || StringUtils.isInteger(v)) return undefined;
    return `${itemName || defaultItemName}は数値で入力してください。`;
  };

  export const halfWidthKatakana = (v: Nullable<string>, itemName?: string) => {
    if (v == null || StringUtils.isHalfWidthKatakana(v)) return undefined;
    return `${itemName || defaultItemName}は半角カタカナで入力してください。`;
  };

  export const fullWidthKatakana = (v: Nullable<string>, itemName?: string) => {
    if (v == null || StringUtils.isKatakana(v)) return undefined;
    return `${itemName || defaultItemName}は全角カタカナで入力してください。`;
  };

  export const katakana = (v: Nullable<string>, itemName?: string) => {
    if (v == null || StringUtils.isFullOrHalfWidthKatakana(v)) return undefined;
    return `${itemName || defaultItemName}はカタカナで入力してください。`;
  };

}

export default StringValidation;