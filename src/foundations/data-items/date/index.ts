import { dataItemKey } from "..";

export const dateDefaultTypeof: DateValueType = "string";

const dateItem = <
  C extends Omit<DataItem_Date, DI.Key | "type">
>(ctx?: Readonly<C>) => {
  return Object.freeze<C & {
    [dataItemKey]: undefined;
    type: "date";
    typeof: C extends { typeof: infer TypeOf } ? TypeOf : typeof dateDefaultTypeof;
  }>({
    typeof: dateDefaultTypeof,
    ...(ctx as any),
    [dataItemKey]: undefined,
    type: "date",
  });
};

export const monthItem = <
  C extends Omit<DataItem_Date, DI.Key | "type">
>(ctx?: Readonly<C>) => {
  return Object.freeze<C & {
    [dataItemKey]: undefined;
    type: "month";
    typeof: C extends { typeof: infer TypeOf } ? TypeOf : typeof dateDefaultTypeof;
  }>({
    typeof: dateDefaultTypeof,
    ...(ctx as any),
    [dataItemKey]: undefined,
    type: "month",
  });
};

export const yearItem = <
  C extends Omit<DataItem_Date, DI.Key | "type">
>(ctx?: Readonly<C>) => {
  return Object.freeze<C & {
    [dataItemKey]: undefined;
    type: "year";
    typeof: C extends { typeof: infer TypeOf } ? TypeOf : typeof dateDefaultTypeof;
  }>({
    typeof: dateDefaultTypeof,
    ...(ctx as any),
    [dataItemKey]: undefined,
    type: "year",
  });
};

export default dateItem;