import { dataItemKey } from ".";
import type { FormItemValidation } from "../client/elements/form/$types";
import generateArray from "../objects/array/generator";
import { getFirstDateAtMonth, getFirstDateAtYear, getLastDateAtMonth, getLastDateAtYear } from "../objects/date/calc";
import { isAfterDate, isBeforeDate } from "../objects/date/compare";
import { equalDate } from "../objects/date/equal";
import formatDate from "../objects/date/format";
import parseDate from "../objects/date/parse";
import { withoutTime } from "../objects/date/without-time";

const dateDefaultTypeof: DateValueType = "string";

const dateItem = <
  C extends Omit<DataItem_Date, DataItemKey | "type">
>(ctx?: Readonly<C>) => {
  return Object.freeze<C & {
    [dataItemKey]: undefined;
    type: "date";
    typeof: C extends { typeof: infer TypeOf } ? TypeOf : typeof dateDefaultTypeof;
  }>({
    typeof: dateDefaultTypeof,
    ...(ctx as any),
    [dataItemKey]: undefined,
    type: "date",
  });
};

export const monthItem = <
  C extends Omit<DataItem_Date, DataItemKey | "type">
>(ctx?: Readonly<C>) => {
  return Object.freeze<C & {
    [dataItemKey]: undefined;
    type: "month";
    typeof: C extends { typeof: infer TypeOf } ? TypeOf : typeof dateDefaultTypeof;
  }>({
    typeof: dateDefaultTypeof,
    ...(ctx as any),
    [dataItemKey]: undefined,
    type: "month",
  });
};

export const yearItem = <
  C extends Omit<DataItem_Date, DataItemKey | "type">
>(ctx?: Readonly<C>) => {
  return Object.freeze<C & {
    [dataItemKey]: undefined;
    type: "year";
    typeof: C extends { typeof: infer TypeOf } ? TypeOf : typeof dateDefaultTypeof;
  }>({
    typeof: dateDefaultTypeof,
    ...(ctx as any),
    [dataItemKey]: undefined,
    type: "year",
  });
};

export namespace DateData {

  const defaultItemName = "値";

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

  export const requiredValidation = (v: Nullable<Date>, itemName?: string) => {
    if (v == null) return `${itemName || defaultItemName}を入力してください。`;
    return undefined;
  };

  export const minValidation = (
    v: Nullable<Date>,
    min: DateValue,
    type: DateType = "date",
    itemName?: string,
    formattedMin?: string
  ) => {
    if (v == null) return undefined;
    const minDate = dateAsFirst(min, type);
    if (minDate == null || v.getTime() >= minDate.getTime()) return undefined;
    return `${itemName || defaultItemName}は${formattedMin || format(minDate, type)}以降で入力してください。`;
  };

  export const maxValidation = (
    v: Nullable<Date>,
    max: DateValue,
    type: DateType = "date",
    itemName?: string,
    formattedMax?: string
  ) => {
    if (v == null) return undefined;
    const maxDate = dateAsLast(max, type);
    if (maxDate == null || v.getTime() <= maxDate.getTime()) return undefined;
    return `${itemName || defaultItemName}は${formattedMax || format(maxDate, type)}以前で入力してください。`;
  };

  export const rangeValidation = (
    v: Nullable<Date>,
    min: DateValue,
    max: DateValue,
    type: DateType = "date",
    itemName?: string,
    formattedMin?: string,
    formattedMax?: string
  ) => {
    if (v == null) return undefined;
    const minDate = dateAsFirst(min, type);
    const maxDate = dateAsLast(max, type);
    if (minDate == null || maxDate == null || (minDate.getTime() <= v.getTime() && v.getTime() <= maxDate.getTime())) return undefined;
    return `${itemName || defaultItemName}は${formattedMin || format(minDate, type)}～${formattedMax || format(maxDate, type)}の範囲で入力してください。`;
  };

  export const contextValidation = (
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
      return `日付の前後関係が不適切です。${itemName || defaultItemName}は${pairItemName || rangePair.label || rangePair.name}[${format(pairDate, type)}]以降で入力してください。`;
    }
    if (isBeforeDate(pairDate, v)) return undefined;
    return `日付の前後関係が不適切です。${itemName || defaultItemName}は${pairItemName || rangePair.label || rangePair.name}[${format(pairDate, type)}]以前で入力してください。`;
  };

}

export namespace DateInput {

  export type FCPorps = {
    $type?: DateType;
    $min?: DateValue;
    $max?: DateValue;
    $rangePair?: DateRangePair;
    $validDays?: ValidDays;
    $validDaysMode?: ValidDaysMode;
    $initValue?: DateValue;
  };

  export const convertDateToValue = (date: Date, $typeof: DateValueType | undefined) => {
    switch ($typeof || dateDefaultTypeof) {
      case "date":
        return date;
      case "number":
        return date?.getTime();
      default:
        return formatDate(date);
    }
  };

  export const getMinDate = (props: FCPorps) => {
    return withoutTime(parseDate(props.$min) ?? new Date(1900, 0, 1))!;
  };

  export const getMaxDate = (props: FCPorps) => {
    return withoutTime(parseDate(props.$max) ?? new Date(2100, 0, 0))!;
  };

  export const getInitValue = (props: FCPorps) => {
    return withoutTime(parseDate(props.$initValue) || new Date())!;
  };

  export const selectableValidation = (props: FCPorps): ((date: Date) => boolean) => {
    if (props.$validDays == null) return () => true;
    const validModeIsAllow = props.$validDaysMode !== "disallow";
    if (typeof props.$validDays === "function") return props.$validDays;
    if (Array.isArray(props.$validDays)) {
      const map: Struct<boolean> = {};
      props.$validDays.forEach(day => {
        if (typeof day === "object") {
          const { date, valid } = (day as Struct);
          const d = parseDate(date);
          if (d == null) return;
          map[formatDate(d)!] = valid ?? validModeIsAllow;
          return;
        }
        const d = parseDate(day);
        if (d == null) return;
        map[formatDate(d)!] = validModeIsAllow;
      });
      return (date: Date) => {
        const valid = map[formatDate(date)!];
        if (validModeIsAllow) return valid === true;
        return valid !== false;
      };
    }
    if ((validModeIsAllow && props.$validDays === "weekday") || (!validModeIsAllow && props.$validDays === "holiday")) {
      return (date: Date) => !(date.getDay() === 0 || date.getDay() === 6);
    }
    if ((validModeIsAllow && props.$validDays === "holiday") || props.$validDays === "weekday") {
      return (date: Date) => date.getDay() === 0 || date.getDay() === 6;
    }
    if (props.$validDays.length !== 7) return () => true;
    const validWeeks = generateArray(7, index => {
      if ((props.$validDays as string)[index] !== "1") {
        return validModeIsAllow ? undefined : index;
      }
      return validModeIsAllow ? index : undefined;
    }).filter(v => v != null);
    return (date) => validWeeks.indexOf(date.getDay()) >= 0;
  };

  export const rangeValidation = (min: Date, max: Date, type: DateType, itemName?: string) => {
    const minDateStr = DateData.format(min, type);
    const maxDateStr = DateData.format(max, type);
    return (v: any) => DateData.rangeValidation(parseDate(v), min, max, type, itemName, minDateStr, maxDateStr);
  };

  export const minValidation = (min: Date, type: DateType, itemName?: string) => {
    const minDateStr = DateData.format(min, type);
    return (v: any) => DateData.minValidation(parseDate(v), min, type, itemName, minDateStr);
  };

  export const maxValidation = (max: Date, type: DateType, itemName?: string) => {
    const maxDateStr = DateData.format(max, type);
    return (v: any) => DateData.maxValidation(parseDate(v), max, type, itemName, maxDateStr);
  };

  export const contextValidation = (rangePair: DateRangePair, type: DateType, itemName?: string) => {
    const compare = (value: DateValue | any, pairDate: Date) =>
      DateData.contextValidation(parseDate(value), rangePair, { [rangePair.name]: pairDate }, type, itemName, undefined);
    const getPairDate = (data: Struct) => {
      if (data == null) return undefined;
      const pairValue = data[rangePair.name];
      if (pairValue == null || Array.isArray(pairValue)) return undefined;
      return parseDate(pairValue);
    };
    const validation: FormItemValidation<any> = (v, d) => {
      if (d == null) return undefined;
      const pairDate = getPairDate(d);
      if (pairDate == null) return undefined;
      return compare(v, pairDate);
    };
    return { compare, getPairDate, validation };
  };

}

export default dateItem;