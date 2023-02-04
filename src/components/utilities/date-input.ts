import { FormItemValidation } from "@/components/elements/form";
import DateValidation from "@/validations/date";
import ArrayUtils from "@bizhermit/basic-utils/dist/array-utils";
import { convertDate, dateFormat } from "@bizhermit/basic-utils/dist/datetime-utils";

export type DateInputPorps = {
  $type?: DateType;
  $min?: DateValue;
  $max?: DateValue;
  $rangePair?: DateRangePair;
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

export const getMinDate = (props: DateInputPorps) => {
  return convertDate(props.$min) ?? new Date(1900, 0, 1);
};

export const convertToMinTime = DateValidation.dateAsFirst;

export const getMaxDate = (props: DateInputPorps) => {
  return convertDate(props.$max) ?? new Date(2100, 0, 0);
};

export const convertToMaxTime = DateValidation.dateAtLast;

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

export const rangeDateValidation = (min: Date, max: Date, type: DateType) => {
  const minDateStr = DateValidation.format(min, type);
  const maxDateStr = DateValidation.format(max, type);
  return (v: any) => DateValidation.range(convertDate(v), min, max, type, undefined, minDateStr, maxDateStr);
};

export const minDateValidation = (min: Date, type: DateType) => {
  const minDateStr = DateValidation.format(min, type);
  return (v: any) => DateValidation.min(convertDate(v), min, type, undefined, minDateStr);
};

export const maxDateValidation = (max: Date, type: DateType) => {
  const maxDateStr = DateValidation.format(max, type);
  return (v: any) => DateValidation.max(convertDate(v), max, type, undefined, maxDateStr);
};

export const dateContextValidation = (rangePair: DateRangePair, type: DateType) => {
  const compare = (value: DateValue | any, pairDate: Date) =>
    DateValidation.context(convertDate(value), rangePair, { [rangePair.name]: pairDate }, type, undefined, undefined);
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