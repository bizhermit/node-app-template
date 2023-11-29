import { dataItemKey } from "..";

const booleanItem = <
  T extends boolean | number | string = boolean | number | string,
  F extends boolean | number | string = boolean | number | string,
  C extends Omit<DataItem_Boolean<T, F>, DataItemKey | "type" | "trueValue" | "falseValue"> & { trueValue?: T; falseValue?: F; }
  = Omit<DataItem_Boolean<T, F>, DataItemKey | "type" | "trueValue" | "falseValue"> & { trueValue?: T; falseValue?: F; }
>(ctx?: Readonly<C>) => {
  return Object.freeze<C & {
    [dataItemKey]: T | F;
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