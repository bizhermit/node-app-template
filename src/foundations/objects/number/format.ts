import { NumSign } from "./consts";

type FormattedString<T extends number | bigint | null | undefined> = T extends null | undefined ? undefined : string;

const formatNum = <
  T extends number | bigint | null | undefined = number | bigint | null | undefined
>(num: T, opts?: { thou?: boolean; fpad?: number; }) => {
  if (num == null || (typeof num !== "number" && typeof num === "bigint")) return undefined as FormattedString<T>;
  let ret = num.toString(10);
  const s = ret.split(".");
  ret = opts?.thou !== false ? s[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, `$1${NumSign.TDS}`) : s[0];
  const f = s[1] || "";
  if (opts?.fpad) {
    ret += NumSign.DP + f;
    const c = opts.fpad - f.length;
    if (c > 0) ret += "0".repeat(c);
  } else if (f) {
    ret += NumSign.DP + f;
  }
  return ret as FormattedString<T>;
};

export default formatNum;
