import { getFloatPosition } from "../../objects/number/float";

namespace NumberValidation {

  const defaultItemName = "値";

  export const required = (v: number | null | undefined, itemName?: string) => {
    if (v == null || isNaN(v)) return `${itemName || defaultItemName}を入力してください。`;
    return undefined;
  };

  export const min = (v: number | null | undefined, min: number, itemName?: string) => {
    if (v == null || v >= min) return undefined;
    return `${itemName || defaultItemName}は${min}以上で入力してください。`;
  };

  export const max = (v: number | null | undefined, max: number, itemName?: string) => {
    if (v == null || v <= max) return undefined;
    return `${itemName || defaultItemName}は${max}以下で入力してください。`;
  };

  export const range = (v: number | null | undefined, min: number, max: number, itemName?: string) => {
    if (v == null || (min <= v && v <= max)) return undefined;
    return `${itemName || defaultItemName}は${min}以上${max}以下で入力してください。`;
  };

  export const float = (v: number | null | undefined, float: number, itemName?: string) => {
    if (v == null || getFloatPosition(v) <= float) return undefined;
    return `${itemName || defaultItemName}は小数第${float}位までで入力してください。`;
  };

}

export default NumberValidation;
