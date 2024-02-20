import { dataItemKey } from "..";

const $bool = <
  True extends boolean | number | string = boolean | number | string,
  False extends boolean | number | string = boolean | number | string,
  C extends Omit<DataItem_Boolean<True, False>, DI.Key | "type" | "trueValue" | "falseValue"> & { trueValue?: True; falseValue?: False; }
  = Omit<DataItem_Boolean<True, False>, DI.Key | "type" | "trueValue" | "falseValue"> & { trueValue?: True; falseValue?: False; }
>(ctx?: Readonly<C>) => {
  return Object.freeze<DI.Freeze<DataItem_Boolean<True, False>, C, {
    trueValue: C extends { trueValue: infer TrueValue } ? TrueValue : true;
    falseValue: C extends { falseValue: infer FalseValue } ? FalseValue : false;
  }>>({
    trueValue: true,
    falseValue: false,
    ...(ctx as any),
    [dataItemKey]: undefined,
    type: "boolean",
  });
};

export default $bool;
