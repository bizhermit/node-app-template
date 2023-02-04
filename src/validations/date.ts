import DatetimeUtils from "@bizhermit/basic-utils/dist/datetime-utils";
import { dateFormat } from "@bizhermit/basic-utils/dist/datetime-utils";
import { convertDate } from "@bizhermit/basic-utils/dist/datetime-utils";

namespace DateValidation {

  export type Type = "date" | "month" | "year";
  export type DateValue = string | number | Date;

  export type RangePair = {
    name: string;
    label?: string;
    position: "before" | "after";
    disallowSame?: boolean;
  }

  export type ValidDays = "weekday" | "holiday" | string
    | Array<DateValue | { date: DateValue; valid?: boolean; }>
    | ((date: Date) => boolean);
  export type ValidDaysMode = "allow" | "disallow";

  const defaultItemName = "値";

  const format = (v: Date, type: Type) => {
    if (v == null) return "";
    if (type === "year") return dateFormat(v, "yyyy年");
    if (type === "month") return dateFormat(v, "yyyy/MM");
    return dateFormat(v, "yyyy/MM/dd");
  };

  export const required = (v: Nullable<Date>, itemName?: string) => {
    if (v == null) return `${itemName || defaultItemName}を入力してください。`;
    return undefined;
  };

  export const min = (v: Nullable<Date>, min: DateValue, type: Type = "date", itemName?: string, formattedMin?: string) => {
    const minDate = convertDate(min);
    if (v == null || minDate == null || v.getTime() >= minDate.getTime()) return undefined;
    return `${itemName || defaultItemName}は${formattedMin || format(minDate, type)}以降で入力してください。`;
  };

  export const max = (v: Nullable<Date>, max: DateValue, type: Type = "date", itemName?: string, formattedMax?: string) => {
    const maxDate = convertDate(max);
    if (v == null || maxDate == null || v.getTime() <= maxDate.getTime()) return undefined;
    return `${itemName || defaultItemName}は${formattedMax || format(maxDate, type)}以前で入力してください。`;
  };

  export const range = (v: Nullable<Date>, min: DateValue, max: DateValue, type: Type = "date", itemName?: string, formattedMin?: string, formattedMax?: string) => {
    const minDate = convertDate(min);
    const maxDate = convertDate(max);
    if (v == null || minDate == null || maxDate == null || (minDate.getTime() <= v.getTime() && v.getTime() <= maxDate.getTime())) return undefined;
    return `${itemName || defaultItemName}は${formattedMin || format(minDate, type)}～${formattedMax || format(maxDate, type)}の範囲で入力してください。`;
  };

  export const context = (v: Nullable<Date>, rangePair: RangePair, data: Struct | undefined, type: Type = "date", itemName?: string, pairItemName?: string) => {
    const pairDate = convertDate(data?.[rangePair.name]);
    if (v == null || pairDate == null) return undefined;
    if (rangePair.disallowSame !== true && DatetimeUtils.equalDate(v, pairDate)) return undefined;
    if (rangePair.position === "before") {
      if (DatetimeUtils.isAfterDate(pairDate, v)) return undefined;
      return `日付の前後関係が不適切です。${itemName || defaultItemName}は${pairItemName || rangePair.label || rangePair.name}[${format(pairDate, type)}]以降で入力してください。`;
    }
    if (DatetimeUtils.isBeforeDate(pairDate, v)) return undefined;
    return `日付の前後関係が不適切です。${itemName || defaultItemName}は${pairItemName || rangePair.label || rangePair.name}[${format(pairDate, type)}]以前で入力してください。`;
  };

}

export default DateValidation;