import { dateDefaultTypeof } from ".";
import type { FormItemValidation } from "../../client/elements/form/$types";
import generateArray from "../../objects/array/generator";
import formatDate from "../../objects/date/format";
import parseDate from "../../objects/date/parse";
import { withoutTime } from "../../objects/date/without-time";
import DateItemUtils from "./utilities";
import DateValidation from "./validations";

namespace DateInput {

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

  export const getMinDate = (min: FCPorps["$min"]) => {
    return withoutTime(parseDate(min) ?? new Date(1900, 0, 1))!;
  };

  export const getMaxDate = (max: FCPorps["$max"]) => {
    return withoutTime(parseDate(max) ?? new Date(2100, 0, 0))!;
  };

  export const getInitValue = (initValue: FCPorps["$initValue"]) => {
    return withoutTime(parseDate(initValue) || new Date())!;
  };

  export const selectableValidation = (validDays: FCPorps["$validDays"], validDaysMode: FCPorps["$validDaysMode"]): ((date: Date) => boolean) => {
    if (validDays == null) return () => true;
    const validModeIsAllow = validDaysMode !== "disallow";
    if (typeof validDays === "function") return validDays;
    if (Array.isArray(validDays)) {
      const map: { [v: string]: boolean } = {};
      validDays.forEach(day => {
        if (typeof day === "object") {
          const { date, valid } = (day as { date: DateValue; valid?: boolean; });
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
    if ((validModeIsAllow && validDays === "weekday") || (!validModeIsAllow && validDays === "holiday")) {
      return (date: Date) => !(date.getDay() === 0 || date.getDay() === 6);
    }
    if ((validModeIsAllow && validDays === "holiday") || validDays === "weekday") {
      return (date: Date) => date.getDay() === 0 || date.getDay() === 6;
    }
    if (validDays.length !== 7) return () => true;
    const validWeeks = generateArray(7, index => {
      if ((validDays as string)[index] !== "1") {
        return validModeIsAllow ? undefined : index;
      }
      return validModeIsAllow ? index : undefined;
    }).filter(v => v != null);
    return (date) => validWeeks.indexOf(date.getDay()) >= 0;
  };

  export const rangeValidation = (min: Date, max: Date, type: DateType, itemName?: string) => {
    const minDateStr = DateItemUtils.format(min, type);
    const maxDateStr = DateItemUtils.format(max, type);
    return (v: any) => DateValidation.range(parseDate(v), min, max, type, itemName, minDateStr, maxDateStr);
  };

  export const minValidation = (min: Date, type: DateType, itemName?: string) => {
    const minDateStr = DateItemUtils.format(min, type);
    return (v: any) => DateValidation.min(parseDate(v), min, type, itemName, minDateStr);
  };

  export const maxValidation = (max: Date, type: DateType, itemName?: string) => {
    const maxDateStr = DateItemUtils.format(max, type);
    return (v: any) => DateValidation.max(parseDate(v), max, type, itemName, maxDateStr);
  };

  export const contextValidation = (rangePair: DateRangePair, type: DateType, itemName?: string) => {
    const compare = (value: DateValue | any, pairDate: Date) =>
      DateValidation.context(parseDate(value), rangePair, { [rangePair.name]: pairDate }, type, itemName, undefined);
    const getPairDate = (data: { [v: string | number | symbol]: any }) => {
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

export default DateInput;