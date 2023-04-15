import { dataItemKey } from "@/data-items/_base";

const booleanItem = <
  T extends boolean | number | string = boolean | number | string,
  F extends boolean | number | string = boolean | number | string,
  C extends Omit<DataItem_Boolean, DataItemKey | "type" | "trueValue" | "falseValue"> & { trueValue?: T; falseValue?: F; } = Omit<DataItem_Boolean, DataItemKey | "type" | "trueValue" | "falseValue"> & { trueValue?: T; falseValue?: F; }
>(ctx?: C): Readonly<C extends (undefined | null) ? DataItem_Boolean<true, false> : Omit<C, "trueValue" | "falseValue"> & { trueValue: C extends { trueValue: infer CT} ? CT : true; falseValue: C extends { falseValue: infer CF } ? CF : false} & DataItem_Boolean<T, F>> => {
  return Object.freeze({
    trueValue: true,
    falseValue: false,
    ...(ctx as any),
    [dataItemKey]: undefined,
    type: "boolean",
  });
};

export default booleanItem;