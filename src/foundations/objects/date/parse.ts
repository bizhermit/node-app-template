import { Month } from "./consts";

type ParsedDate<T extends string | number | Date | null | undefined> = T extends null | undefined ? undefined : T extends Date ? Date : Date | undefined;

const parseDate = <
  T extends string | number | Date | null | undefined = string | number | Date | null | undefined
>(date: T) => {
  if (date == null) return undefined as ParsedDate<T>;
  if (typeof date === "string") {
    let ctx = date.match(/^(\d{4})(\d{2}|$)(\d{2}|$)(\d{2}|$)(\d{2}|$)(\d{2}|$)(\d{3}|$)/);
    if (!ctx) ctx = date.match(/^(\d+)?(?:-|\/|年|$)(\d+)?(?:-|\/|月|$)(\d+)?(?:\s*|日\s*|T|$)(\d+)?(?::|時|$)(\d+)?(?::|分|$)(\d+)?(?:.|秒|$)(\d+)?(?:.*|$)/);
    if (ctx) return new Date(Number(ctx[1]), Number(ctx[2] || 1) - 1, Number(ctx[3] || 1), Number(ctx[4] || 0), Number(ctx[5] || 0), Number([ctx[6] || 0]), Number(ctx[7] || 0)) as ParsedDate<T>;
    ctx = date.match(/^(?:\w+)?\s(\w+)?\s(\d+)?\s(\d+)?\s(\d+)?:(\d+)?:(\d+)?/);
    if (ctx) {
      const re = new RegExp(`^${ctx[1]}`, "i");
      return new Date(Number(ctx[3]), Math.max(Month.en.findIndex(v => re.exec(v)), 0), Number(ctx[2]), Number(ctx[4]), Number(ctx[5]), Number(ctx[6])) as ParsedDate<T>;
    }
    return undefined as ParsedDate<T>;
  }
  if (typeof date === "number") return new Date(date) as ParsedDate<T>;
  return new Date(date.getTime()) as ParsedDate<T>;
};

export default parseDate;