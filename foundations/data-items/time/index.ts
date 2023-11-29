import { dataItemKey } from "..";

export const timeDefaultTypeof: TimeValueType = "number";

const timeItem = <
  C extends Omit<DataItem_Time, DataItemKey | "type" | "mode" | "unit"> & Partial<Pick<DataItem_Time, "mode" | "unit">>
>(ctx?: Readonly<C>) => {
  return Object.freeze<C & {
    [dataItemKey]: undefined;
    type: "time";
    mode: C extends { mode: infer Mode } ? Mode : "hm";
    unit: C extends { unit: infer Unit } ? Unit : "minute";
    typeof: C extends { typeof: infer TypeOf } ? TypeOf : typeof timeDefaultTypeof;
  }>({
    mode: "hm",
    unit: "minute",
    typeof: timeDefaultTypeof,
    ...(ctx as any),
    [dataItemKey]: undefined,
    type: "time",
  });
};

export default timeItem;