import type { FormItemValidation } from "@/components/elements/form";
import { dataItemKey } from "@/data-items/_base";
import ArrayUtils from "@bizhermit/basic-utils/dist/array-utils";
import DatetimeUtils, { dateFormat, convertDate } from "@bizhermit/basic-utils/dist/datetime-utils";

const dateDefaultTypeof: DateValueType = "string";

const dateItem = <
  C extends Omit<DataItem_Date, DataItemKey | "type">
>(ctx?: Readonly<C>) => {
  return Object.freeze<C & Readonly<{
    [dataItemKey]: undefined;
    type: "date";
    typeof: C extends { typeof: infer TypeOf } ? TypeOf : typeof dateDefaultTypeof;
  }>>({
    typeof: dateDefaultTypeof,
    ...(ctx as any),
    [dataItemKey]: undefined,
    type: "date",
  });
};

export const monthItem = <
  C extends Omit<DataItem_Date, DataItemKey | "type">
>(ctx?: Readonly<C>) => {
  return Object.freeze<C & Readonly<{
    [dataItemKey]: undefined;
    type: "month";
    typeof: C extends { typeof: infer TypeOf } ? TypeOf : typeof dateDefaultTypeof;
  }>>({
    typeof: dateDefaultTypeof,
    ...(ctx as any),
    [dataItemKey]: undefined,
    type: "month",
  });
};

export const yearItem = <
  C extends Omit<DataItem_Date, DataItemKey | "type">
>(ctx?: Readonly<C>) => {
  return Object.freeze<C & Readonly<{
    [dataItemKey]: undefined;
    type: "year";
    typeof: C extends { typeof: infer TypeOf } ? TypeOf : typeof dateDefaultTypeof;
  }>>({
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
    data: Struct | undefined,
    type: DateType = "date",
    itemName?: string,
    pairItemName?: string
  ) => {
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
        return dateFormat(date);
    }
  };

  export const getMinDate = (props: FCPorps) => {
    return convertDate(props.$min) ?? new Date(1900, 0, 1);
  };

  export const getMaxDate = (props: FCPorps) => {
    return convertDate(props.$max) ?? new Date(2100, 0, 0);
  };

  export const getInitValue = (props: FCPorps) => {
    return convertDate(props.$initValue) || DatetimeUtils.removeTime(new Date());
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
          const d = convertDate(date);
          if (d == null) return;
          map[dateFormat(d)!] = valid ?? validModeIsAllow;
          return;
        }
        const d = convertDate(day);
        if (d == null) return;
        map[dateFormat(d)!] = validModeIsAllow;
      });
      return (date: Date) => {
        const valid = map[dateFormat(date)!];
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
    const validWeeks = ArrayUtils.generateArray(7, index => {
      if ((props.$validDays as string)[index] !== "1") {
        return validModeIsAllow ? undefined : index;
      }
      return validModeIsAllow ? index : undefined;
    }).filter(v => v != null);
    return (date) => validWeeks.indexOf(date.getDay()) >= 0;
  };

  export const rangeValidation = (min: Date, max: Date, type: DateType) => {
    const minDateStr = DateData.format(min, type);
    const maxDateStr = DateData.format(max, type);
    return (v: any) => DateData.rangeValidation(convertDate(v), min, max, type, undefined, minDateStr, maxDateStr);
  };

  export const minValidation = (min: Date, type: DateType) => {
    const minDateStr = DateData.format(min, type);
    return (v: any) => DateData.minValidation(convertDate(v), min, type, undefined, minDateStr);
  };

  export const maxValidation = (max: Date, type: DateType) => {
    const maxDateStr = DateData.format(max, type);
    return (v: any) => DateData.maxValidation(convertDate(v), max, type, undefined, maxDateStr);
  };

  export const contextValidation = (rangePair: DateRangePair, type: DateType) => {
    const compare = (value: DateValue | any, pairDate: Date) =>
      DateData.contextValidation(convertDate(value), rangePair, { [rangePair.name]: pairDate }, type, undefined, undefined);
    const getPairDate = (data: Struct) => {
      if (data == null) return undefined;
      const pairValue = data[rangePair.name];
      if (pairValue == null || Array.isArray(pairValue)) return undefined;
      return convertDate(pairValue);
    };
    const validation: FormItemValidation<any> = (v, d) => {
      if (d == null) return "";
      const pairDate = getPairDate(d);
      if (pairDate == null) return "";
      return compare(v, pairDate);
    };
    return { compare, getPairDate, validation };
  };

}

export default dateItem;