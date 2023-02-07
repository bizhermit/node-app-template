import { FormItemValidation } from "@/components/elements/form";
import TimeValidation from "@/validations/time";
import Time, { TimeUtils } from "@bizhermit/time";

export type TimeInputProps = {
  $type?: TimeMode;
  $unit?: TimeUnit;
  $min?: string;
  $max?: string;
  $rangePair?: TimeRangePair;
  $hourInterval?: number;
  $minuteInterval?: number;
  $secondInterval?: number;
};

export const getUnit = (props: TimeInputProps, mode: TimeMode) => {
  if (props.$unit) return props.$unit;
  switch (mode) {
    case "h":
      return "hour";
    case "hm":
      return "minute";
    case "hms":
    case "ms":
      return "second";
    default:
      return "minute";
  }
};

export const convertTimeToValue = (value: number | undefined, unit: TimeUnit, mode: TimeMode, $typeof?: "number" | "string") => {
  if ($typeof === "string") {
    return new Time(value).format((() => {
      switch (mode) {
        case "h":
          return "h";
        case "hm":
          return "hh:mm";
        default:
          return "hh:mm:ss";
      }
    })());
  }
  return TimeUtils.convertMillisecondsToUnit(value, unit);
};

export const getMinTime = (props: TimeInputProps, unit: TimeUnit) => {
  return TimeValidation.convertTime(props.$min, unit) ?? 0;
};

const max24 = (23 * 3600 + 59 * 60 + 59) * 1000;
export const getMaxTime = (props: TimeInputProps, unit: TimeUnit) => {
  return TimeValidation.convertTime(props.$max, unit) ?? max24;
};

export const formatByTimeMode = (time: number, mode: TimeMode) => {
  if (time == null) return "";
  const t = new Time(time);
  switch (mode) {
    case "h":
      return t.format("h時");
    case "hm":
      return t.format("h:mm");
    case "hms":
      return t.format("h:mm:ss");
    case "ms":
      return t.format("m:ss");
    default:
      return t.format();
  }
};

export const rangeTimeValidation = (minTime: number, maxTime: number, mode: TimeMode, unit: TimeUnit) => {
  const maxTimeStr = formatByTimeMode(maxTime, mode);
  const minTimeStr = formatByTimeMode(minTime, mode);
  return (v: any) => TimeValidation.range(v, minTime, maxTime, mode, unit, undefined, minTimeStr, maxTimeStr);
};

export const minTimeValidation = (minTime: number, mode: TimeMode, unit: TimeUnit) => {
  const minTimeStr = formatByTimeMode(minTime, mode);
  return (v: any) => TimeValidation.min(v, minTime, mode, unit, undefined, minTimeStr);
};

export const maxTimeValidation = (maxTime: number, mode: TimeMode, unit: TimeUnit) => {
  const maxTimeStr = formatByTimeMode(maxTime, mode);
  return (v: any) => TimeValidation.max(v, maxTime, mode, unit, undefined, maxTimeStr);
};

export const timeContextValidation = (rangePair: TimeRangePair, mode: TimeMode, unit: TimeUnit) => {
  const pairTimeUnit = rangePair.unit ?? "minute";
  const compare = (value: TimeValue, pairTime: number) =>
    TimeValidation.context(TimeValidation.convertTime(value, unit), rangePair, {[rangePair.name]: pairTime}, mode, unit, undefined, undefined, undefined);
  const getPairTime = (data: Struct) => {
    if (data == null) return undefined;
    const pairValue = data[rangePair.name];
    if (pairValue == null || Array.isArray(pairValue)) return undefined;
    return TimeValidation.convertTime(pairValue, pairTimeUnit);
  };
  const validation: FormItemValidation<any> = (v, t) => {
    if (t == null) return "";
    const pairTime = getPairTime(t);
    if (pairTime == null) return "";
    return compare(v, pairTime);
  };
  return { compare, getPairTime, validation };
};