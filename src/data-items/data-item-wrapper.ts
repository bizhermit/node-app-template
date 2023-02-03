export const dataItemKey: DataItemKey = "$$";

const dataItem = <C extends Omit<DataItem, DataItemKey>>(ctx: C): Readonly<C & { $$: any }> => {
  return Object.freeze({ ...ctx, [dataItemKey]: undefined });
};

export const stringItem = <C extends Omit<DataItem_String, DataItemKey | "type">>(ctx?: C): Readonly<C extends (undefined | null) ? DataItem_String : C & DataItem_String> => {
  return Object.freeze({ ...(ctx as any), [dataItemKey]: undefined, type: "string" });
};

export const numberItem = <C extends Omit<DataItem_Number, DataItemKey | "type">>(ctx?: C): Readonly<C extends (undefined | null) ? DataItem_Number : C & DataItem_Number> => {
  return Object.freeze({ ...(ctx as any), [dataItemKey]: undefined, type: "number" });
};

export const booleanItem = <C extends Omit<DataItem_Boolean, DataItemKey | "type" | "trueValue" | "falseValue"> & Partial<Pick<DataItem_Boolean, "trueValue" | "falseValue">>>(ctx?: C): Readonly<C extends (undefined | null) ? DataItem_Boolean : C & DataItem_Boolean> => {
  return Object.freeze({ ...(ctx as any), [dataItemKey]: undefined, type: "boolean" });
};

export const dateItem = <C extends Omit<DataItem_Date, DataItemKey | "type">>(ctx?: C): Readonly<C extends (undefined | null) ? DataItem_Date : C & DataItem_Date> => {
  return Object.freeze({ ...(ctx as any), [dataItemKey]: undefined, type: "date" });
};

export const monthItem = <C extends Omit<DataItem_Date, DataItemKey | "type">>(ctx?: C): Readonly<C extends (undefined | null) ? DataItem_Date : C & DataItem_Date> => {
  return Object.freeze({ ...(ctx as any), [dataItemKey]: undefined, type: "month" });
};

export const arrayItem = <C extends Omit<DataItem_Array, DataItemKey | "type">>(ctx?: C): Readonly<C extends (undefined | null) ? DataItem_Array : C & DataItem_Array> => {
  return Object.freeze({ ...(ctx as any), [dataItemKey]: undefined, type: "array" });
};

export const structItem = <C extends Omit<DataItem_Struct, DataItemKey | "type">>(ctx?: C): Readonly<C extends (undefined | null) ? DataItem_Struct : C & DataItem_Struct> => {
  return Object.freeze({ ...(ctx as any), [dataItemKey]: undefined, type: "struct" });
};

export default dataItem;