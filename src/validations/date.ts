import DatetimeUtils, { dateFormat, convertDate } from "@bizhermit/basic-utils/dist/datetime-utils";

namespace DateValidation {

  const defaultItemName = "値";

  export const format = (v?: DateValue, type?: DateType) => {
    if (v == null) return "";
    if (type === "year") return dateFormat(v, "yyyy年");
    if (type === "month") return dateFormat(v, "yyyy/MM");
    return dateFormat(v, "yyyy/MM/dd");
  };

  export const dateAsFirst = (v?: DateValue, type: DateType = "date") => {
    if (v == null) return undefined;
    switch (type) {
      case "year":
        return DatetimeUtils.getFirstDateAtYear(convertDate(v));
      case "month":
        return DatetimeUtils.getFirstDateAtMonth(convertDate(v));
      default:
        return convertDate(v);
    }
  };

  export const dateAsLast = (v?: DateValue, type: DateType = "date") => {
    if (v == null) return undefined;
    switch (type) {
      case "year":
        return DatetimeUtils.getLastDateAtYear(convertDate(v));
      case "month":
        return DatetimeUtils.getLastDateAtMonth(convertDate(v));
      default:
        return convertDate(v);
    }
  };

  export const required = (v: Nullable<Date>, itemName?: string) => {
    if (v == null) return `${itemName || defaultItemName}を入力してください。`;
    return undefined;
  };

  export const min = (v: Nullable<Date>, min: DateValue, type: DateType = "date", itemName?: string, formattedMin?: string) => {
    if (v == null) return undefined;
    const minDate = dateAsFirst(min, type);
    if (minDate == null || v.getTime() >= minDate.getTime()) return undefined;
    return `${itemName || defaultItemName}は${formattedMin || format(minDate, type)}以降で入力してください。`;
  };

  export const max = (v: Nullable<Date>, max: DateValue, type: DateType = "date", itemName?: string, formattedMax?: string) => {
    if (v == null) return undefined;
    const maxDate = dateAsLast(max, type);
    if (maxDate == null || v.getTime() <= maxDate.getTime()) return undefined;
    return `${itemName || defaultItemName}は${formattedMax || format(maxDate, type)}以前で入力してください。`;
  };

  export const range = (v: Nullable<Date>, min: DateValue, max: DateValue, type: DateType = "date", itemName?: string, formattedMin?: string, formattedMax?: string) => {
    if (v == null) return undefined;
    const minDate = dateAsFirst(min, type);
    const maxDate = dateAsLast(max, type);
    if (minDate == null || maxDate == null || (minDate.getTime() <= v.getTime() && v.getTime() <= maxDate.getTime())) return undefined;
    return `${itemName || defaultItemName}は${formattedMin || format(minDate, type)}～${formattedMax || format(maxDate, type)}の範囲で入力してください。`;
  };

  export const context = (v: Nullable<Date>, rangePair: DateRangePair, data: Struct | undefined, type: DateType = "date", itemName?: string, pairItemName?: string) => {
    if (v == null) return undefined;
    const pairDate = (() => {
      const pv = data?.[rangePair.name];
      if (pv == null || Array.isArray(pv)) return undefined;
      return convertDate(pv);
    })();
    if (pairDate == null) return undefined;
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