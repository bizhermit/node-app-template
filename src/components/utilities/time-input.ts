import { FormItemValidation } from "@/components/elements/form";
import Time, { TimeUtils } from "@bizhermit/time";

export type TimeType = "hms" | "hm" | "h" | "ms";
export type TimeUnit = "hour" | "minute" | "second" | "millisecond";
export type TimeValue = string | number | Time;

type TimeRangePair = {
  name: string;
  position: "before" | "after";
  disallowSame?: boolean;
  unit?: TimeUnit;
};

export type TimeInputProps = {
  $type?: TimeType;
  $unit?: TimeUnit;
  $min?: string;
  $max?: string;
  $rangePair?: TimeRangePair;
  $hourInterval?: number;
  $minuteInterval?: number;
  $secondInterval?: number;
};

export const getUnit = (props: TimeInputProps, type: TimeType) => {
  if (props.$unit) return props.$unit;
  switch (type) {
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

export const convertTime = (value: TimeValue | null | undefined, unit: TimeUnit) => {
  if (value == null) return undefined;
  if (typeof value === "number") {
    return new Time(TimeUtils.convertUnitToMilliseconds(value, unit)).getTime();
  }
  return (new Time(value)).getTime();
};

export const convertTimeToValue = (value: number | undefined, unit: TimeUnit, type: TimeType, $typeof?: "number" | "string") => {
  if ($typeof === "string") {
    return new Time(value).format((() => {
      switch (type) {
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
  return convertTime(props.$min, unit) ?? 0;
};

const max24 = (23 * 3600 + 59 * 60 + 59) * 1000;
export const getMaxTime = (props: TimeInputProps, unit: TimeUnit) => {
  return convertTime(props.$max, unit) ?? max24;
};

export const formatByTimeType = (time: number, type: TimeType) => {
  if (time == null) return "";
  const t = new Time(time);
  switch (type) {
    case "h":
      return t.format("h???");
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

export const rangeTimeValidation = (minTime: number, maxTime: number, type: TimeType, unit: TimeUnit) => {
  const maxTimeStr = formatByTimeType(maxTime, type);
  const minTimeStr = formatByTimeType(minTime, type);
  return (v: any) => {
    const time = convertTime(v, unit);
    if (time == null) return "";
    if (time < minTime || maxTime < time) return `${minTimeStr}???${maxTimeStr}???????????????????????????????????????`;
    return "";
  };
};

export const minTimeValidation = (minTime: number, type: TimeType, unit: TimeUnit) => {
  const minTimeStr = formatByTimeType(minTime, type);
  return (v: any) => {
    const time = convertTime(v, unit);
    if (time == null) return "";
    if (time < minTime) return `${minTimeStr}????????????????????????????????????`;
    return "";
  };
};

export const maxTimeValidation = (maxTime: number, type: TimeType, unit: TimeUnit) => {
  const maxTimeStr = formatByTimeType(maxTime, type);
  return (v: any) => {
    const time = convertTime(v, unit);
    if (time == null) return "";
    if (time > maxTime) return `${maxTimeStr}????????????????????????????????????`;
    return "";
  };
};

export const timeContextValidation = (rangePair: TimeRangePair, unit: TimeUnit) => {
  const pairTimeUnit = rangePair.unit ?? "minute";
  const compare = (value: TimeValue, pairTime: number) => {
    const time = convertTime(value, unit);
    if (time == null) return "";
    if (rangePair.disallowSame !== true && time === pairTime) {
      return "";
    }
    if (rangePair.position === "before") {
      if (time <= pairTime) return "??????????????????????????????????????????";
      return "";
    }
    if (time >= pairTime) return "??????????????????????????????????????????";
    return "";
  };
  const getPairTime = (data: Struct) => {
    if (data == null) return undefined;
    const pairValue = data[rangePair.name];
    if (pairValue == null || Array.isArray(pairValue)) return undefined;
    return convertTime(pairValue, pairTimeUnit);
  };
  const validation: FormItemValidation<any> = (v, t) => {
    if (t == null) return "";
    const pairTime = getPairTime(t);
    if (pairTime == null) return "";
    return compare(v, pairTime);
  };
  return { compare, getPairTime, validation };
};