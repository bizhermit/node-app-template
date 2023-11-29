import { Week } from "./consts";
import parseDate from "./parse";

const formatDate = (date?: string | number | Date | null | undefined, pattern = "yyyy-MM-dd", week?: Array<string>) => {
  const d = parseDate(date);
  if (d == null) return undefined;
  return pattern
    .replace(/yyyy/g, String(d.getFullYear()))
    .replace(/yy/g, `00${d.getFullYear()}`.slice(-2))
    .replace(/MM/g, `0${d.getMonth() + 1}`.slice(-2))
    .replace(/M/g, String(d.getMonth() + 1))
    .replace(/dd/g, `0${d.getDate()}`.slice(-2))
    .replace(/d/g, String(d.getDate()))
    .replace(/hh/g, `0${d.getHours()}`.slice(-2))
    .replace(/h/g, String(d.getHours()))
    .replace(/mm/g, `0${d.getMinutes()}`.slice(-2))
    .replace(/m/g, String(d.getMinutes()))
    .replace(/ss/g, `0${d.getSeconds()}`.slice(-2))
    .replace(/s/g, String(d.getSeconds()))
    .replace(/SSS/g, `00${d.getMilliseconds()}`.slice(-3))
    .replace(/SS/g, `00${d.getMilliseconds()}`.slice(-3).slice(2))
    .replace(/S/g, String(d.getMilliseconds()))
    .replace(/w/g, (week ?? Week.ja_s)[d.getDay()]);
};

export default formatDate;