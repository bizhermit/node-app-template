namespace NumberValidation {

  const defaultItemName = "値";

  export const required = (v: Nullable<number>, itemName?: string) => {
    if (v == null || isNaN(v)) return `${itemName || defaultItemName}を入力してください。`;
    return undefined;
  };

}

export default NumberValidation;