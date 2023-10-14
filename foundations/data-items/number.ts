import NumberUtils from "@bizhermit/basic-utils/dist/number-utils";
import { dataItemKey } from ".";

const numberItem = <
  V extends number,
  C extends Omit<DataItem_Number<V>, DataItemKey | "type">
>(ctx?: Readonly<C>) => {
  return Object.freeze<C & {
    [dataItemKey]: V;
    type: "number";
  }>({
    ...(ctx as any),
    [dataItemKey]: undefined,
    type: "number",
  });
};

export namespace NumberData {

  const defaultItemName = "値";

  export const requiredValidation = (v: Nullable<number>, itemName?: string) => {
    if (v == null || isNaN(v)) return `${itemName || defaultItemName}を入力してください。`;
    return undefined;
  };

  export const minValidation = (v: Nullable<number>, min: number, itemName?: string) => {
    if (v == null || v >= min) return undefined;
    return `${itemName || defaultItemName}は${min}以上で入力してください。`;
  };

  export const maxValidation = (v: Nullable<number>, max: number, itemName?: string) => {
    if (v == null || v <= max) return undefined;
    return `${itemName || defaultItemName}は${max}以下で入力してください。`;
  };

  export const rangeValidation = (v: Nullable<number>, min: number, max: number, itemName?: string) => {
    if (v == null || (min <= v && v <= max)) return undefined;
    return `${itemName || defaultItemName}は${min}以上${max}以下で入力してください。`;
  };

  export const floatValidation = (v: number | null | undefined, float: number, itemName?: string) => {
    if (v == null || NumberUtils.getFloatPosition(v) <= float) return undefined;
    return `${itemName || defaultItemName}は小数第${float}位までで入力してください。`;
  };

}

export default numberItem;