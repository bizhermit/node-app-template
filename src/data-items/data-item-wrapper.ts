export const dataItemKey: DataItemKey = "$$";

const dataItem = <T extends Omit<DataItem, DataItemKey>>(d: T): Readonly<T & { $$: any }> => {
  return Object.freeze({ ...d, [dataItemKey]: undefined });
};

export const stringItem = <T extends Omit<DataItem_String, DataItemKey | "type">>(a?: T): Readonly<T extends (undefined | null) ? DataItem_String : T & DataItem_String> => {
  return Object.freeze({ ...(a as any), [dataItemKey]: undefined, type: "string" });
};

export const numberItem = <T extends Omit<DataItem_Number, DataItemKey | "type">>(a?: T): Readonly<T extends (undefined | null) ? DataItem_Number : T & DataItem_Number> => {
  return Object.freeze({ ...(a as any), [dataItemKey]: undefined, type: "number" });
};

export const booleanItem = <T extends Omit<DataItem_Boolean, DataItemKey | "type">>(a?: T): Readonly<T extends (undefined | null) ? DataItem_Boolean : T & DataItem_Boolean> => {
  return Object.freeze({ required: false, ...(a as any), [dataItemKey]: undefined, type: "boolean" });
};

export const dateItem = <T extends Omit<DataItem_Date, DataItemKey | "type">>(a?: T): Readonly<T extends (undefined | null) ? DataItem_Date : T & DataItem_Date> => {
  return Object.freeze({ ...(a as any), [dataItemKey]: undefined, type: "date" });
};

export const monthItem = <T extends Omit<DataItem_Date, DataItemKey | "type">>(a?: T): Readonly<T extends (undefined | null) ? DataItem_Date : T & DataItem_Date> => {
  return Object.freeze({ ...(a as any), [dataItemKey]: undefined, type: "month" });
};

export const arrayItem = <T extends Omit<DataItem_Array, DataItemKey | "type">>(a?: T): Readonly<T extends (undefined | null) ? DataItem_Array : T & DataItem_Array> => {
  return Object.freeze({ ...(a as any), [dataItemKey]: undefined, type: "array" });
};

export const structItem = <T extends Omit<DataItem_Struct, DataItemKey | "type">>(a?: T): Readonly<T extends (undefined | null) ? DataItem_Struct : T & DataItem_Struct> => {
  return Object.freeze({ ...(a as any), [dataItemKey]: undefined, type: "struct" });
};

export default dataItem;