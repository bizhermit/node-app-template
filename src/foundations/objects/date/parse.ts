import { Month } from "./consts";

const parseDate = (date: string | number | Date | null | undefined) => {
  if (date == null) return undefined;
  if (typeof date === "string") {
    let ctx = date.match(/^(\d{4})(\d{2}|$)(\d{2}|$)(\d{2}|$)(\d{2}|$)(\d{2}|$)(\d{3}|$)/);
    if (!ctx) ctx = date.match(/^(\d+)?(?:-|\/|年|$)(\d+)?(?:-|\/|月|$)(\d+)?(?:\s*|日\s*|T|$)(\d+)?(?::|時|$)(\d+)?(?::|分|$)(\d+)?(?:.|秒|$)(\d+)?(?:.*|$)/);
    if (ctx) return new Date(Number(ctx[1]), Number(ctx[2] || 1) - 1, Number(ctx[3] || 1), Number(ctx[4] || 0), Number(ctx[5] || 0), Number([ctx[6] || 0]), Number(ctx[7] || 0));
    ctx = date.match(/^(?:\w+)?\s(\w+)?\s(\d+)?\s(\d+)?\s(\d+)?:(\d+)?:(\d+)?/);
    if (ctx) {
      const re = new RegExp(`^${ctx[1]}`, "i");
      return new Date(Number(ctx[3]), Math.max(Month.en.findIndex(v => re.exec(v)), 0), Number(ctx[2]), Number(ctx[4]), Number(ctx[5]), Number(ctx[6]));
    }
    return undefined;
  }
  if (typeof date === "number") return new Date(date);
  return new Date(date.getTime());
};

export default parseDate;