import Time from "@bizhermit/time";

export type TimeType = "hms" | "hm" | "h" | "ms";
export type TimeUnit = "hour" | "minute" | "second" | "millisecond";
export type TimeValue = string | number | Time;

type TimeRangePair = {
  name: string;
  position: "before" | "after";
  disallowSame?: boolean;
};

export type TimeInputProps = {
  $type?: TimeType;
  $unit?: TimeUnit;
  $min?: string;
  $max?: string;
  $rangePair?: TimeRangePair;
};

export const convertTime = (value?: TimeValue, unit?: TimeUnit) => {
  return new Time();
};