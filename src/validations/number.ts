namespace NumberValidation {

  const defaultItemName = "値";

  export const required = (v: Nullable<number>, itemName?: string) => {
    if (v == null || isNaN(v)) return `${itemName || defaultItemName}を入力してください。`;
    return undefined;
  };

  export const min = (v: Nullable<number>, min: number, itemName?: string) => {
    if (v == null || v >= min) return undefined;
    return `${itemName || defaultItemName}は${min}以上で入力してください。`;
  };

  export const max = (v: Nullable<number>, max: number, itemName?: string) => {
    if (v == null || v <= max) return undefined;
    return `${itemName || defaultItemName}は${max}以下で入力してください。`;
  };

  export const range = (v: Nullable<number>, min: number, max: number, itemName?: string) => {
    if (v == null || (min <= v && v <= max)) return undefined;
    return `${itemName || defaultItemName}は${min}以上${max}以下で入力してください。`;
  };

}

export default NumberValidation;