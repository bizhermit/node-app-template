import { dataItemKey } from ".";
import { isEmpty } from "../objects/string/empty";
import strLen from "../objects/string/length";
import { isAlphabet, isFWAlphabet, isFWKatakana, isFWNumeric, isHWAlphabet, isHWAlphanumeric, isHWAlphanumericAndSymbols, isHWKatakana, isHWNumeric, isInteger, isKatakana, isMailAddress, isNumeric, isPhoneNumber, isUrl } from "../objects/string/validation";

const stringItem = <
  V extends string,
  C extends Omit<DataItem_String<V>, DataItemKey | "type">
>(ctx?: Readonly<C>) => {
  return Object.freeze<C & {
    [dataItemKey]: V;
    type: "string";
  }>({
    ...(ctx as any),
    [dataItemKey]: undefined,
    type: "string",
  });
};

export namespace StringData {

  const defaultItemName = "値";

  export const requiredValidation = (v: Nullable<string>, itemName?: string) => {
    if (isEmpty(v)) return `${itemName || defaultItemName}を入力してください。`;
    return undefined;
  };

  export const lengthValidation = (v: Nullable<string>, length: number, itemName?: string) => {
    if (strLen(v) === length) return undefined;
    return `${itemName || defaultItemName}は${length}文字で入力してください。`;
  };

  export const minLengthValidation = (v: Nullable<string>, minLength: number, itemName?: string) => {
    if (v != null && strLen(v) >= minLength) return undefined;
    return `${itemName || defaultItemName}は${minLength}文字以上で入力してください。`;
  };

  export const maxLengthValidation = (v: Nullable<string>, maxLength: number, itemName?: string) => {
    if (isEmpty(v) || strLen(v) <= maxLength) return undefined;
    return `${itemName || defaultItemName}は${maxLength}文字以下で入力してください。`;
  };

  export const halfWidthNumericValidation = (v: Nullable<string>, itemName?: string) => {
    if (isEmpty(v) || isHWNumeric(v)) return undefined;
    return `${itemName || defaultItemName}は半角数字で入力してください。`;
  };

  export const fullWidthNumericValidation = (v: Nullable<string>, itemName?: string) => {
    if (isEmpty(v) || isFWNumeric(v)) return undefined;
    return `${itemName || defaultItemName}は全角数字で入力してください。`;
  };

  export const numericValidation = (v: Nullable<string>, itemName?: string) => {
    if (isEmpty(v) || isNumeric(v)) return undefined;
    return `${itemName || defaultItemName}は数字で入力してください。`;
  };

  export const halfWidthAlphabetValidation = (v: Nullable<string>, itemName?: string) => {
    if (isEmpty(v) || isHWAlphabet(v)) return undefined;
    return `${itemName || defaultItemName}は半角英字で入力してください。`;
  };

  export const fullWidthAlphabetValidation = (v: Nullable<string>, itemName?: string) => {
    if (isEmpty(v) || isFWAlphabet(v)) return undefined;
    return `${itemName || defaultItemName}は全角英字で入力してください。`;
  };

  export const alphabetValidation = (v: Nullable<string>, itemName?: string) => {
    if (isEmpty(v) || isAlphabet(v)) return undefined;
    return `${itemName || defaultItemName}は英字で入力してください。`;
  };

  export const halfWidthAlphaNumericValidation = (v: Nullable<string>, itemName?: string) => {
    if (isEmpty(v) || isHWAlphanumeric(v)) return undefined;
    return `${itemName || defaultItemName}は半角英数字で入力してください。`;
  };

  export const halfWidthAlphaNumericAndSymbolsValidation = (v: Nullable<string>, itemName?: string) => {
    if (isEmpty(v) || isHWAlphanumericAndSymbols(v)) return undefined;
    return `${itemName || defaultItemName}は半角英数字記号で入力してください。`;
  };

  export const integerValidation = (v: Nullable<string>, itemName?: string) => {
    if (isEmpty(v) || isInteger(v)) return undefined;
    return `${itemName || defaultItemName}は数値で入力してください。`;
  };

  export const halfWidthKatakanaValidation = (v: Nullable<string>, itemName?: string) => {
    if (isEmpty(v) || isHWKatakana(v)) return undefined;
    return `${itemName || defaultItemName}は半角カタカナで入力してください。`;
  };

  export const fullWidthKatakanaValidation = (v: Nullable<string>, itemName?: string) => {
    if (isEmpty(v) || isFWKatakana(v)) return undefined;
    return `${itemName || defaultItemName}は全角カタカナで入力してください。`;
  };

  export const katakanaValidation = (v: Nullable<string>, itemName?: string) => {
    if (isEmpty(v) || isKatakana(v)) return undefined;
    return `${itemName || defaultItemName}はカタカナで入力してください。`;
  };

  export const mailAddressValidation = (v: Nullable<string>, itemName?: string) => {
    if (isEmpty(v) || isMailAddress(v)) return undefined;
    return `${itemName || defaultItemName}はメールアドレスで入力してください。`;
  };

  export const telValidation = (v: Nullable<string>, itemName?: string) => {
    if (isEmpty(v) || isPhoneNumber(v)) return undefined;
    return `${itemName || defaultItemName}は電話番号で入力してください。`;
  };

  export const urlValidation = (v: Nullable<string>, itemName?: string) => {
    if (isEmpty(v) || isUrl(v)) return undefined;
    return `${itemName || defaultItemName}はURLで入力してください。`;
  };

}

export default stringItem;