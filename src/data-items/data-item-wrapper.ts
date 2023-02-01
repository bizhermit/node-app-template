const dataItem = <T extends Omit<DataItem, "$$">>(d: T): Readonly<T & { $$: any }> => {
  return Object.freeze({ ...d, $$: undefined });
};

export const stringItem = <T extends Omit<DataItem_String, "$$" | "type">>(a: T): Readonly<T & DataItem_String> => {
  return Object.freeze({ ...a, $$: undefined, type: "string" });
};

export const numberItem = <T extends Omit<DataItem_Number, "$$" | "type">>(a: T): Readonly<T & DataItem_Number> => {
  return Object.freeze({ ...a, $$: undefined, type: "number" });
};

export const dateItem = <T extends Omit<DataItem_Date, "$$" | "type">>(a: T): Readonly<T & DataItem_Date> => {
  return Object.freeze({ ...a, $$: undefined, type: "date" });
};

export const monthItem = <T extends Omit<DataItem_Date, "$$" | "type">>(a: T): Readonly<T & DataItem_Date> => {
  return Object.freeze({ ...a, $$: undefined, type: "month" });
};

export const arrayItem = <T extends Omit<DataItem_Array, "$$" | "type">>(a: T): Readonly<T & DataItem_Array> => {
  return Object.freeze({ ...a, $$: undefined, type: "array" });
};

export default dataItem;