import { NumSign } from "./consts";

const tdsReg = new RegExp(NumSign.TDS, "g");

const parseNum = (num: string | number | null | undefined) => {
  if (num == null || num === "") return undefined;
  const t = typeof num;
  if (t === "number") return num as number;
  if (t === "string") {
    const n = Number((num as string).replace(tdsReg, ""));
    if (!isNaN(n)) return n;
  }
  return undefined;
};

export default parseNum;