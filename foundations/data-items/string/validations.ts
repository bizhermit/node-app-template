import { isEmpty } from "../../objects/string/empty";
import strLen from "../../objects/string/length";
import { isAlphabet, isFWAlphabet, isFWKatakana, isFWNumeric, isHWAlphabet, isHWAlphanumeric, isHWAlphanumericAndSymbols, isHWKatakana, isHWNumeric, isInteger, isKatakana, isMailAddress, isNumeric, isPhoneNumber, isUrl } from "../../objects/string/validation";

namespace StringValidation {

  const defaultItemName = "値";

  export const required = (v: string | null | undefined, itemName?: string) => {
    if (isEmpty(v)) return `${itemName || defaultItemName}を入力してください。`;
    return undefined;
  };

  export const length = (v: string | null | undefined, length: number, itemName?: string) => {
    if (isEmpty(v) || strLen(v) === length) return undefined;
    return `${itemName || defaultItemName}は${length}文字で入力してください。`;
  };

  export const minLength = (v: string | null | undefined, minLength: number, itemName?: string) => {
    if (isEmpty(v) || strLen(v) >= minLength) return undefined;
    return `${itemName || defaultItemName}は${minLength}文字以上で入力してください。`;
  };

  export const maxLength = (v: string | null | undefined, maxLength: number, itemName?: string) => {
    if (isEmpty(v) || strLen(v) <= maxLength) return undefined;
    return `${itemName || defaultItemName}は${maxLength}文字以下で入力してください。`;
  };

  export const halfWidthNumeric = (v: string | null | undefined, itemName?: string) => {
    if (isEmpty(v) || isHWNumeric(v)) return undefined;
    return `${itemName || defaultItemName}は半角数字で入力してください。`;
  };

  export const fullWidthNumeric = (v: string | null | undefined, itemName?: string) => {
    if (isEmpty(v) || isFWNumeric(v)) return undefined;
    return `${itemName || defaultItemName}は全角数字で入力してください。`;
  };

  export const numeric = (v: string | null | undefined, itemName?: string) => {
    if (isEmpty(v) || isNumeric(v)) return undefined;
    return `${itemName || defaultItemName}は数字で入力してください。`;
  };

  export const halfWidthAlphabet = (v: string | null | undefined, itemName?: string) => {
    if (isEmpty(v) || isHWAlphabet(v)) return undefined;
    return `${itemName || defaultItemName}は半角英字で入力してください。`;
  };

  export const fullWidthAlphabet = (v: string | null | undefined, itemName?: string) => {
    if (isEmpty(v) || isFWAlphabet(v)) return undefined;
    return `${itemName || defaultItemName}は全角英字で入力してください。`;
  };

  export const alphabet = (v: string | null | undefined, itemName?: string) => {
    if (isEmpty(v) || isAlphabet(v)) return undefined;
    return `${itemName || defaultItemName}は英字で入力してください。`;
  };

  export const halfWidthAlphaNumeric = (v: string | null | undefined, itemName?: string) => {
    if (isEmpty(v) || isHWAlphanumeric(v)) return undefined;
    return `${itemName || defaultItemName}は半角英数字で入力してください。`;
  };

  export const halfWidthAlphaNumericAndSymbols = (v: string | null | undefined, itemName?: string) => {
    if (isEmpty(v) || isHWAlphanumericAndSymbols(v)) return undefined;
    return `${itemName || defaultItemName}は半角英数字記号で入力してください。`;
  };

  export const integer = (v: string | null | undefined, itemName?: string) => {
    if (isEmpty(v) || isInteger(v)) return undefined;
    return `${itemName || defaultItemName}は数値で入力してください。`;
  };

  export const halfWidthKatakana = (v: string | null | undefined, itemName?: string) => {
    if (isEmpty(v) || isHWKatakana(v)) return undefined;
    return `${itemName || defaultItemName}は半角カタカナで入力してください。`;
  };

  export const fullWidthKatakana = (v: string | null | undefined, itemName?: string) => {
    if (isEmpty(v) || isFWKatakana(v)) return undefined;
    return `${itemName || defaultItemName}は全角カタカナで入力してください。`;
  };

  export const katakana = (v: string | null | undefined, itemName?: string) => {
    if (isEmpty(v) || isKatakana(v)) return undefined;
    return `${itemName || defaultItemName}はカタカナで入力してください。`;
  };

  export const mailAddress = (v: string | null | undefined, itemName?: string) => {
    if (isEmpty(v) || isMailAddress(v)) return undefined;
    return `${itemName || defaultItemName}はメールアドレスで入力してください。`;
  };

  export const tel = (v: string | null | undefined, itemName?: string) => {
    if (isEmpty(v) || isPhoneNumber(v)) return undefined;
    return `${itemName || defaultItemName}は電話番号で入力してください。`;
  };

  export const url = (v: string | null | undefined, itemName?: string) => {
    if (isEmpty(v) || isUrl(v)) return undefined;
    return `${itemName || defaultItemName}はURLで入力してください。`;
  };

}

export default StringValidation;