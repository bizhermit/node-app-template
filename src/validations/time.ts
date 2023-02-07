import Time, { TimeUtils } from "@bizhermit/time";

namespace TimeValidation {

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

  export const required = (v: number | null | undefined, itemName?: string) => {
    if (v == null) return `${itemName || defaultItemName}を入力してください。`;
    return undefined;
  };

  export const min = (v: number | null | undefined, min: TimeValue, mode: TimeMode, unit: TimeUnit, itemName?: string, formattedMin?: string) => {
    if (v == null || min == null) return undefined;
    const minTime = convertTime(min, unit);
    const minUnitTime = TimeUtils.convertMillisecondsToUnit(minTime, unit);
    if (minUnitTime == null || v >= minUnitTime) return undefined;
    return `${itemName || defaultItemName}は${formattedMin || format(minTime, mode)}以降で入力してください。`;
  };

  export const max = (v: number | null | undefined, max: TimeValue, mode: TimeMode, unit: TimeUnit, itemName?: string, formattedMax?: string) => {
    if (v == null || max == null) return undefined;
    const maxTime = convertTime(max, unit);
    const maxUnitTime = TimeUtils.convertMillisecondsToUnit(maxTime, unit);
    if (maxUnitTime == null || v <= maxUnitTime) return undefined;
    return `${itemName || defaultItemName}は${formattedMax || format(maxTime, mode)}以前で入力してください。`;
  };

  export const range = (v: number | null | undefined, min: TimeValue, max: TimeValue, mode: TimeMode, unit: TimeUnit, itemName?: string, formattedMin?: string, formattedMax?: string) => {
    if (v == null || max == null || min == null) return undefined;
    const minTime = convertTime(min, unit);
    const minUnitTime = TimeUtils.convertMillisecondsToUnit(minTime, unit);
    const maxTime = convertTime(max, unit);
    const maxUnitTime = TimeUtils.convertMillisecondsToUnit(maxTime, unit);
    if (minUnitTime == null || maxUnitTime == null || (minUnitTime <= v && v <= maxUnitTime)) return undefined;
    return `${itemName || defaultItemName}は${formattedMin || format(minTime, mode)}～${formattedMax || format(maxTime, mode)}の範囲で入力してください。`;
  };

  export const context = (v: number | null | undefined, rangePair: TimeRangePair, data: Struct | undefined, mode: TimeMode, unit: TimeUnit, itemName?: string, pairUnit?: TimeUnit, pairItemName?: string) => {
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

export default TimeValidation;