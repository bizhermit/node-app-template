import { getFirstDateAtMonth, getFirstDateAtYear, getLastDateAtMonth, getLastDateAtYear } from "../../objects/date/calc";
import formatDate from "../../objects/date/format";
import parseDate from "../../objects/date/parse";

namespace DateItemUtils {

  export const format = (v?: DateValue, type?: DateType) => {
    if (v == null) return "";
    if (type === "year") return formatDate(v, "yyyy年");
    if (type === "month") return formatDate(v, "yyyy/MM");
    return formatDate(v, "yyyy/MM/dd");
  };

  export const dateAsFirst = (v?: DateValue, type: DateType = "date") => {
    if (v == null) return undefined;
    switch (type) {
      case "year":
        return getFirstDateAtYear(parseDate(v));
      case "month":
        return getFirstDateAtMonth(parseDate(v));
      default:
        return parseDate(v);
    }
  };

  export const dateAsLast = (v?: DateValue, type: DateType = "date") => {
    if (v == null) return undefined;
    switch (type) {
      case "year":
        return getLastDateAtYear(parseDate(v));
      case "month":
        return getLastDateAtMonth(parseDate(v));
      default:
        return parseDate(v);
    }
  };

}

export default DateItemUtils;