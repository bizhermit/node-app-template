export const isErrorObject = (obj: any): obj is string => !(obj == null || obj === false);

export const convertHiddenValue = (value: any) => {
  if (value == null) return "";
  const t = typeof value;
  if (t === "string" || t === "number" || t === "bigint" || t === "boolean") {
    return String(value);
  }
  return JSON.stringify(value);
};

export const multiValidationIterator = (v: any, func: (value: string | number | Date) => (string | null | undefined)) => {
  if (v == null || !Array.isArray(v)) return undefined;
  for (let i = 0, il = v.length; i < il; i++) {
    const ret = func(v[i]);
    if (ret) return ret;
  }
  return undefined;
};

export const convertDataItemValidationToFormItemValidation = <T, U, P extends F.ItemProps<T, any, any, any>, D extends DataItem, V = P["$value"]>(
  func: DI.Validation<any, any>[number],
  props: P,
  $dataItem: D,
  convertValue?: (v: F.VType<T, D, V>) => U | null | undefined
) => {
  return (v: any | null | undefined, bindData: { [v: string | number | symbol]: any } | undefined) => {
    const res = func(convertValue ? convertValue(v) : v as U | null | undefined, {
      key: props?.name || $dataItem.name!,
      dataItem: $dataItem,
      data: bindData,
      parent: undefined,
      siblings: undefined,
    });
    if (res == null) return undefined;
    if (typeof res === "string") return res;
    return res.body;
  };
};