import { dataItemKey } from "@/data-items/data-item";
import StringUtils from "@bizhermit/basic-utils/dist/string-utils";
import { isEmpty } from "@bizhermit/basic-utils/dist/string-utils";

const stringItem = <C extends Omit<DataItem_String, DataItemKey | "type">>(ctx?: C): Readonly<C extends (undefined | null) ? DataItem_String : C & DataItem_String> => {
  return Object.freeze({ ...(ctx as any), [dataItemKey]: undefined, type: "string" });
};

export namespace StringData {

  const defaultItemName = "値";

  export const requiredValidation = (v: Nullable<string>, itemName?: string) => {
    if (isEmpty(v)) return `${itemName || defaultItemName}を入力してください。`;
    return undefined;
  };

  export const lengthValidation = (v: Nullable<string>, length: number, itemName?: string) => {
    if (StringUtils.length(v) === length) return undefined;
    return `${itemName || defaultItemName}は${length}文字で入力してください。`;
  };

  export const minLengthValidation = (v: Nullable<string>, minLength: number, itemName?: string) => {
    if (v != null && StringUtils.length(v) >= minLength) return undefined;
    return `${itemName || defaultItemName}は${minLength}文字以上で入力してください。`;
  };

  export const maxLengthValidation = (v: Nullable<string>, maxLength: number, itemName?: string) => {
    if (isEmpty(v) || StringUtils.length(v) <= maxLength) return undefined;
    return `${itemName || defaultItemName}は${maxLength}文字以下で入力してください。`;
  };

  export const halfWidthNumericValidation = (v: Nullable<string>, itemName?: string) => {
    if (isEmpty(v) || StringUtils.isHalfWidthNumeric(v)) return undefined;
    return `${itemName || defaultItemName}は半角数字で入力してください。`;
  };

  export const fullWidthNumericValidation = (v: Nullable<string>, itemName?: string) => {
    if (isEmpty(v) || /^[０-９]+$/.test(v)) return undefined;
    return `${itemName || defaultItemName}は全角数字で入力してください。`;
  };

  export const numericValidation = (v: Nullable<string>, itemName?: string) => {
    if (isEmpty(v) || /^[0-9０-９]+$/.test(v)) return undefined;
    return `${itemName || defaultItemName}は数字で入力してください。`;
  };

  export const halfWidthAlphabetValidation = (v: Nullable<string>, itemName?: string) => {
    if (isEmpty(v) || StringUtils.isHalfWidthAlphabet(v)) return undefined;
    return `${itemName || defaultItemName}は半角英字で入力してください。`;
  };

  export const fullWidthAlphabetValidation = (v: Nullable<string>, itemName?: string) => {
    if (isEmpty(v) || /^[ａ-ｚＡ-Ｚ]+$/.test(v)) return undefined;
    return `${itemName || defaultItemName}は全角英字で入力してください。`;
  };

  export const alphabetValidation = (v: Nullable<string>, itemName?: string) => {
    if (isEmpty(v) || /^[a-zA-Zａ-ｚＡ-Ｚ]+$/.test(v)) return undefined;
    return `${itemName || defaultItemName}は英字で入力してください。`;
  };

  export const halfWidthAlphaNumericValidation = (v: Nullable<string>, itemName?: string) => {
    if (isEmpty(v) || StringUtils.isHalfWidthAlphanumeric(v)) return undefined;
    return `${itemName || defaultItemName}は半角英数字で入力してください。`;
  };

  export const halfWidthAlphaNumericAndSymbolsValidation = (v: Nullable<string>, itemName?: string) => {
    if (isEmpty(v) || StringUtils.isHalfWidthAlphanumericAndSymbols(v)) return undefined;
    return `${itemName || defaultItemName}は半角英数字記号で入力してください。`;
  };

  export const integerValidation = (v: Nullable<string>, itemName?: string) => {
    if (isEmpty(v) || StringUtils.isInteger(v)) return undefined;
    return `${itemName || defaultItemName}は数値で入力してください。`;
  };

  export const halfWidthKatakanaValidation = (v: Nullable<string>, itemName?: string) => {
    if (isEmpty(v) || StringUtils.isHalfWidthKatakana(v)) return undefined;
    return `${itemName || defaultItemName}は半角カタカナで入力してください。`;
  };

  export const fullWidthKatakanaValidation = (v: Nullable<string>, itemName?: string) => {
    if (isEmpty(v) || StringUtils.isKatakana(v)) return undefined;
    return `${itemName || defaultItemName}は全角カタカナで入力してください。`;
  };

  export const katakanaValidation = (v: Nullable<string>, itemName?: string) => {
    if (isEmpty(v) || StringUtils.isFullOrHalfWidthKatakana(v)) return undefined;
    return `${itemName || defaultItemName}はカタカナで入力してください。`;
  };

}

export default stringItem;