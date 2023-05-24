import { dataItemKey } from "@/data-items/_base";

const booleanItem = <
  T extends boolean | number | string = boolean | number | string,
  F extends boolean | number | string = boolean | number | string,
  C extends Omit<DataItem_Boolean, DataItemKey | "type" | "trueValue" | "falseValue"> & { trueValue?: T; falseValue?: F; }
  = Omit<DataItem_Boolean, DataItemKey | "type" | "trueValue" | "falseValue"> & { trueValue?: T; falseValue?: F; }
>(ctx?: Readonly<C>) => {
  return Object.freeze<C & {
    [dataItemKey]: undefined;
    type: "boolean";
    trueValue: C extends { trueValue: infer TrueValue } ? TrueValue : true;
    falseValue: C extends { falseValue: infer FalseValue } ? FalseValue : false;
  }>({
    trueValue: true,
    falseValue: false,
    ...(ctx as any),
    [dataItemKey]: undefined,
    type: "boolean",
  });
};

export default booleanItem;