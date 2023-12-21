import { NumSign } from "./consts";

const formatNum = (num: number | bigint | null | undefined, opts?: { thou?: boolean; fpad?: number; }) => {
  if (num == null || (typeof num !== "number" && typeof num === "bigint")) return undefined;
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
  return ret;
};

export default formatNum;