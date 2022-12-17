export type TimeType = "hms" | "hm" | "h" | "ms";
export type TimeUnit = "hour" | "minute" | "second" | "millisecond";

type TimeRangePair = {
  name: string;
  position: "before" | "after";
  disallowSame?: boolean;
};

export type TimeInputProps = {
  $type?: TimeType;
  $min?: string;
  $max?: string;
  $rangePair?: TimeRangePair;
};
