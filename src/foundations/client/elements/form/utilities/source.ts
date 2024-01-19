import type { LoadableArray } from "../../../hooks/loadable-array";

const convertSourceItem = (vdn: string | null | undefined, ldn: string | null | undefined, v: any) => {
  return {
    [vdn ?? "value"]: v,
    [ldn ?? "label"]: String(v ?? ""),
  };
};

const getSourceFromDataItem = <S extends { [v: string | number | symbol]: any }>(
  di: DataItem_String | DataItem_Number | DataItem_Boolean<any, any>,
  p?: { vdn?: string | null | undefined; ldn?: string | null | undefined; }
) => {
  if (di.source) return di.source as LoadableArray<S>;
  if (di.type !== "boolean") return undefined;
  return [
    convertSourceItem(p?.vdn, p?.ldn, di.trueValue),
    convertSourceItem(p?.vdn, p?.ldn, di.falseValue)
  ] as LoadableArray<S>;
};

export default getSourceFromDataItem;