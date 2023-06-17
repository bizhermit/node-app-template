import type { FormItemValidation } from "#/components/elements/form/$types";
import { dataItemKey } from "#/data-items";
import Time, { TimeUtils } from "@bizhermit/time";

const timeDefaultTypeof: TimeValueType = "number";

const timeItem = <
  C extends Omit<DataItem_Time, DataItemKey | "type" | "mode" | "unit"> & Partial<Pick<DataItem_Time, "mode" | "unit">>
>(ctx?: Readonly<C>) => {
  return Object.freeze<C & {
    [dataItemKey]: undefined;
    type: "time";
    mode: C extends { mode: infer Mode } ? Mode : "hm";
    unit: C extends { unit: infer Unit } ? Unit : "minute";
    typeof: C extends { typeof: infer TypeOf } ? TypeOf : typeof timeDefaultTypeof;
  }>({
    mode: "hm",
    unit: "minute",
    typeof: timeDefaultTypeof,
    ...(ctx as any),
    [dataItemKey]: undefined,
    type: "time",
  });
};

export namespace TimeData {

  const defaultItemName = "値";

  export const convertTime = (value: TimeValue | null | undefined, unit: TimeUnit) => {
    if (value == null) return undefined;
    if (typeof value === "number") {
      return new Time(TimeUtils.convertUnitToMilliseconds(value, unit)).getTime();
    }
    return (new Time(value)).getTime();
  };

  export const format = (v: TimeValue | null | undefined, mode: TimeMode) => {
    if (v == null) return undefined;
    return new Time(v).format((() => {
      switch (mode) {
        case "h":
          return "hh";
        case "hm":
          return "hh:mm";
        case "hms":
          return "hh:mm:ss";
        case "ms":
          return "hh:mm:ss";
        default:
          return "hh:mm:ss.SSS";
      }
    })());
  };

  export const requiredValidation = (v: number | null | undefined, itemName?: string) => {
    if (v == null) return `${itemName || defaultItemName}を入力してください。`;
    return undefined;
  };

  export const minValidation = (
    v: number | null | undefined,
    min: TimeValue,
    mode: TimeMode,
    unit: TimeUnit,
    itemName?: string,
    formattedMin?: string
  ) => {
    if (v == null || min == null) return undefined;
    const minTime = convertTime(min, unit);
    const minUnitTime = TimeUtils.convertMillisecondsToUnit(minTime, unit);
    if (minUnitTime == null || v >= minUnitTime) return undefined;
    return `${itemName || defaultItemName}は${formattedMin || format(minTime, mode)}以降で入力してください。`;
  };

  export const maxValidation = (
    v: number | null | undefined,
    max: TimeValue,
    mode: TimeMode,
    unit: TimeUnit,
    itemName?: string,
    formattedMax?: string
  ) => {
    if (v == null || max == null) return undefined;
    const maxTime = convertTime(max, unit);
    const maxUnitTime = TimeUtils.convertMillisecondsToUnit(maxTime, unit);
    if (maxUnitTime == null || v <= maxUnitTime) return undefined;
    return `${itemName || defaultItemName}は${formattedMax || format(maxTime, mode)}以前で入力してください。`;
  };

  export const rangeValidation = (
    v: number | null | undefined,
    min: TimeValue,
    max: TimeValue,
    mode: TimeMode,
    unit: TimeUnit,
    itemName?: string,
    formattedMin?: string,
    formattedMax?: string
  ) => {
    if (v == null || max == null || min == null) return undefined;
    const minTime = convertTime(min, unit);
    const minUnitTime = TimeUtils.convertMillisecondsToUnit(minTime, unit);
    const maxTime = convertTime(max, unit);
    const maxUnitTime = TimeUtils.convertMillisecondsToUnit(maxTime, unit);
    if (minUnitTime == null || maxUnitTime == null || (minUnitTime <= v && v <= maxUnitTime)) return undefined;
    return `${itemName || defaultItemName}は${formattedMin || format(minTime, mode)}～${formattedMax || format(maxTime, mode)}の範囲で入力してください。`;
  };

  export const contextValidation = (
    v: number | null | undefined,
    rangePair: TimeRangePair,
    data: Struct | undefined,
    mode: TimeMode,
    unit: TimeUnit,
    itemName?: string,
    pairUnit?: TimeUnit,
    pairItemName?: string
  ) => {
    if (v == null) return undefined;
    const { pairTime, pairUnitTime } = (() => {
      const pv = data?.[rangePair.name];
      if (pv == null || Array.isArray(pv)) {
        return {
          pairTime: undefined,
          pairUnitTime: undefined,
        };
      }
      const time = convertTime(pv, pairUnit || rangePair.unit || unit);
      return {
        pairTime: time,
        pairUnitTime: TimeUtils.convertMillisecondsToUnit(time, unit),
      };
    })();
    if (pairUnitTime == null) return undefined;
    if (rangePair.disallowSame !== true && v === pairUnitTime) return undefined;
    if (rangePair.position === "before") {
      if (v >= pairUnitTime) return undefined;
      return `時間の前後関係が不適切です。${itemName || defaultItemName}は${pairItemName || rangePair.label || rangePair.name}[${format(pairTime, mode)}]以降で入力してください。`;
    }
    if (v <= pairUnitTime) return undefined;
    return `時間の前後関係が不適切です。${itemName || defaultItemName}は${pairItemName || rangePair.label || rangePair.name}[${format(pairTime, mode)}]以前で入力してください。`;
  };
}

export namespace TimeInput {

  export type FCProps = {
    $type?: TimeMode;
    $unit?: TimeUnit;
    $min?: string;
    $max?: string;
    $rangePair?: TimeRangePair;
    $hourInterval?: number;
    $minuteInterval?: number;
    $secondInterval?: number;
  };

  export const getUnit = (props: FCProps, mode: TimeMode) => {
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

  export const convertTimeToValue = (
    value: number | undefined,
    unit: TimeUnit,
    mode: TimeMode,
    $typeof?: TimeValueType,
  ) => {
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

  export const getMinTime = (props: FCProps, unit: TimeUnit) => {
    return TimeData.convertTime(props.$min, unit) ?? 0;
  };

  const max24 = (23 * 3600 + 59 * 60 + 59) * 1000;
  export const getMaxTime = (props: FCProps, unit: TimeUnit) => {
    return TimeData.convertTime(props.$max, unit) ?? max24;
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

  export const rangeValidation = (minTime: number, maxTime: number, mode: TimeMode, unit: TimeUnit) => {
    const maxTimeStr = formatByTimeMode(maxTime, mode);
    const minTimeStr = formatByTimeMode(minTime, mode);
    return (v: any) => TimeData.rangeValidation(
      TimeData.convertTime(v, unit),
      minTime,
      maxTime,
      mode,
      "millisecond",
      undefined,
      minTimeStr,
      maxTimeStr
    );
  };

  export const minValidation = (minTime: number, mode: TimeMode, unit: TimeUnit) => {
    const minTimeStr = formatByTimeMode(minTime, mode);
    return (v: any) => TimeData.minValidation(
      TimeData.convertTime(v, unit),
      minTime,
      mode,
      "millisecond",
      undefined,
      minTimeStr
    );
  };

  export const maxValidation = (maxTime: number, mode: TimeMode, unit: TimeUnit) => {
    const maxTimeStr = formatByTimeMode(maxTime, mode);
    return (v: any) => TimeData.maxValidation(
      TimeData.convertTime(v, unit),
      maxTime,
      mode,
      "millisecond",
      undefined,
      maxTimeStr
    );
  };

  export const contextValidation = (rangePair: TimeRangePair, mode: TimeMode, unit: TimeUnit) => {
    const pairTimeUnit = rangePair.unit ?? "minute";
    const compare = (value: TimeValue, pairTime: number) =>
      TimeData.contextValidation(
        TimeData.convertTime(value, unit),
        rangePair,
        { [rangePair.name]: pairTime },
        mode,
        "millisecond",
        undefined,
        undefined,
        undefined
      );
    const getPairTime = (data: Struct) => {
      if (data == null) return undefined;
      const pairValue = data[rangePair.name];
      if (pairValue == null || Array.isArray(pairValue)) return undefined;
      return TimeData.convertTime(pairValue, pairTimeUnit);
    };
    const validation: FormItemValidation<any> = (v, t) => {
      if (t == null) return undefined;
      const pairTime = getPairTime(t);
      if (pairTime == null) return undefined;
      return compare(v, pairTime);
    };
    return { compare, getPairTime, validation };
  };

}

export default timeItem;