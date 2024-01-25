import { NumSign } from "./consts";

type ParsedNumber<T extends string | number | null | undefined> = T extends null | undefined ? undefined : T extends number ? number : number | undefined;

const tdsReg = new RegExp(NumSign.TDS, "g");

const parseNum = <
  T extends string | number | null | undefined = string | number | null | undefined
>(num: T) => {
  if (num == null || num === "") return undefined as ParsedNumber<T>;
  const t = typeof num;
  if (t === "number") return num as number as ParsedNumber<T>;
  if (t === "string") {
    const n = Number((num as string).replace(tdsReg, ""));
    if (!isNaN(n)) return n as ParsedNumber<T>;
  }
  return undefined as ParsedNumber<T>;
};

export default parseNum;