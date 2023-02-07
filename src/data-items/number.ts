import { dataItemKey } from "@/data-items/data-item";

const numberItem = <C extends Omit<DataItem_Number, DataItemKey | "type">>(ctx?: C): Readonly<C extends (undefined | null) ? DataItem_Number : C & DataItem_Number> => {
  return Object.freeze({ ...(ctx as any), [dataItemKey]: undefined, type: "number" });
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

}

export default numberItem;