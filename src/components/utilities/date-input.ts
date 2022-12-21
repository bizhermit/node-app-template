import { FormItemValidation } from "@/components/elements/form";
import ArrayUtils from "@bizhermit/basic-utils/dist/array-utils";
import DatetimeUtils from "@bizhermit/basic-utils/dist/datetime-utils";
import { convertDate } from "@bizhermit/basic-utils/dist/datetime-utils";
import { dateFormat } from "@bizhermit/basic-utils/dist/datetime-utils";

export type DateType = "date" | "month" | "year";
export type DateValue = string | number | Date;

type RangePair = {
  name: string;
  position: "before" | "after";
  disallowSame?: boolean;
};

type ValidDays = "weekday" | "holiday" | string
  | Array<DateValue | { date: DateValue; valid?: boolean; }>
  | ((date: Date) => boolean);
type ValidDaysMode = "allow" | "disallow";

export type DateInputPorps = {
  $type?: DateType;
  $min?: DateValue;
  $max?: DateValue;
  $rangePair?: RangePair;
  $validDays?: ValidDays;
  $validDaysMode?: ValidDaysMode;
};

export const convertDateToValue = (date: Date, $typeof: "string" | "number" | "date" | undefined) => {
  switch ($typeof) {
    case "date":
      return date;
    case "number":
      return date?.getTime();
    default:
      return dateFormat(date);
  }
};

export const formatByDateType = (time?: number, type?: DateType) => {
  if (time == null) return "";
  if (type === "year") return dateFormat(time, "yyyy年");
  if (type === "month") return dateFormat(time, "yyyy/MM");
  return dateFormat(time, "yyyy/MM/dd");
};

export const getMinDate = (props: DateInputPorps) => {
  return convertDate(props.$min) ?? new Date(1900, 0, 1);
};

export const convertToMinTime = (minDate: Date, type: DateType) => {
  switch (type) {
    case "year":
      return DatetimeUtils.getFirstDateAtYear(minDate)?.getTime();
    case "month":
      return DatetimeUtils.getFirstDateAtMonth(minDate)?.getTime();
    default:
      return minDate?.getTime();
  }
};

export const getMaxDate = (props: DateInputPorps) => {
  return convertDate(props.$max) ?? new Date(2100, 0, 0);
};

export const convertToMaxTime = (maxDate: Date, type: DateType) => {
  switch (type) {
    case "year":
      return DatetimeUtils.getLastDateAtYear(maxDate)?.getTime();
    case "month":
      return DatetimeUtils.getLastDateAtMonth(maxDate)?.getTime();
    default:
      return maxDate?.getTime();
  }
};

export const getJudgeValidDateFunc = (props: DateInputPorps): ((date: Date) => boolean) => {
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

export const rangeDateValidation = (minTime: number, maxTime: number, type: DateType) => {
  const maxDateStr = formatByDateType(maxTime, type);
  const minDateStr = formatByDateType(minTime, type);
  return (v: any) => {
    const time = convertDate(v)?.getTime();
    if (time == null) return "";
    if (time < minTime || maxTime < time) return `${minDateStr}～${maxDateStr}の範囲で入力してください。`;
    return "";
  };
};

export const minDateValidation = (minTime: number, type: DateType) => {
  const minDateStr = formatByDateType(minTime, type);
  return (v: any) => {
    const time = convertDate(v)?.getTime();
    if (time == null) return "";
    if (time < minTime) return `${minDateStr}以降で入力してください。`;
    return "";
  };
};

export const maxDateValidation = (maxTime: number, type: DateType) => {
  const maxDateStr = formatByDateType(maxTime, type);
  return (v: any) => {
    const time = convertDate(v)?.getTime();
    if (time == null) return "";
    if (time > maxTime) return `${maxDateStr}以前で入力してください。`;
    return "";
  };
};

export const dateContextValidation = (rangePair: RangePair) => {
  const compare = (value: DateValue | any, pairDate: Date) => {
    const date = convertDate(value);
    if (date == null) return "";
    if (rangePair.disallowSame !== true && DatetimeUtils.equalDate(date, pairDate)) {
      return "";
    }
    if (rangePair.position === "before") {
      if (!DatetimeUtils.isBeforeDate(date, pairDate)) return "日付の前後関係が不適切です。";
      return "";
    }
    if (!DatetimeUtils.isAfterDate(date, pairDate)) return "日付の前後関係が不適切です。";
    return "";
  };
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