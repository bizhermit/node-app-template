import { isAfterDate, isBeforeDate } from "../../objects/date/compare";
import { equalDate } from "../../objects/date/equal";
import parseDate from "../../objects/date/parse";
import DateItemUtils from "./utilities";

namespace DateValidation {

  const defaultItemName = "値";

  export const required = (v: Nullable<Date>, itemName?: string) => {
    if (v == null) return `${itemName || defaultItemName}を入力してください。`;
    return undefined;
  };

  export const min = (
    v: Nullable<Date>,
    min: DateValue,
    type: DateType = "date",
    itemName?: string,
    formattedMin?: string
  ) => {
    if (v == null) return undefined;
    const minDate = DateItemUtils.dateAsFirst(min, type);
    if (minDate == null || v.getTime() >= minDate.getTime()) return undefined;
    return `${itemName || defaultItemName}は${formattedMin || DateItemUtils.format(minDate, type)}以降で入力してください。`;
  };

  export const max = (
    v: Nullable<Date>,
    max: DateValue,
    type: DateType = "date",
    itemName?: string,
    formattedMax?: string
  ) => {
    if (v == null) return undefined;
    const maxDate = DateItemUtils.dateAsLast(max, type);
    if (maxDate == null || v.getTime() <= maxDate.getTime()) return undefined;
    return `${itemName || defaultItemName}は${formattedMax || DateItemUtils.format(maxDate, type)}以前で入力してください。`;
  };

  export const range = (
    v: Nullable<Date>,
    min: DateValue,
    max: DateValue,
    type: DateType = "date",
    itemName?: string,
    formattedMin?: string,
    formattedMax?: string
  ) => {
    if (v == null) return undefined;
    const minDate = DateItemUtils.dateAsFirst(min, type);
    const maxDate = DateItemUtils.dateAsLast(max, type);
    if (minDate == null || maxDate == null || (minDate.getTime() <= v.getTime() && v.getTime() <= maxDate.getTime())) return undefined;
    return `${itemName || defaultItemName}は${formattedMin || DateItemUtils.format(minDate, type)}～${formattedMax || DateItemUtils.format(maxDate, type)}の範囲で入力してください。`;
  };

  export const context = (
    v: Nullable<Date>,
    rangePair: DateRangePair,
    data: { [key: string]: any } | null | undefined,
    type: DateType = "date",
    itemName?: string,
    pairItemName?: string
  ) => {
    if (v == null) return undefined;
    const pairDate = (() => {
      const pv = data?.[rangePair.name];
      if (pv == null || Array.isArray(pv)) return undefined;
      return parseDate(pv);
    })();
    if (pairDate == null) return undefined;
    if (rangePair.disallowSame !== true && equalDate(v, pairDate)) return undefined;
    if (rangePair.position === "before") {
      if (isAfterDate(pairDate, v)) return undefined;
      return `日付の前後関係が不適切です。${itemName || defaultItemName}は${pairItemName || rangePair.label || rangePair.name}[${DateItemUtils.format(pairDate, type)}]以降で入力してください。`;
    }
    if (isBeforeDate(pairDate, v)) return undefined;
    return `日付の前後関係が不適切です。${itemName || defaultItemName}は${pairItemName || rangePair.label || rangePair.name}[${DateItemUtils.format(pairDate, type)}]以前で入力してください。`;
  };

}

export default DateValidation;