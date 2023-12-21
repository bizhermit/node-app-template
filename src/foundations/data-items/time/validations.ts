import { TimeUtils } from "../../objects/time/utilities";
import TimeItemUtils from "./utilities";

namespace TimeValidation {

  const defaultItemName = "値";

  export const required = (v: number | null | undefined, itemName?: string) => {
    if (v == null) return `${itemName || defaultItemName}を入力してください。`;
    return undefined;
  };

  export const min = (
    v: number | null | undefined,
    min: TimeValue,
    mode: TimeMode,
    unit: TimeUnit,
    itemName?: string,
    formattedMin?: string
  ) => {
    if (v == null || min == null) return undefined;
    const minTime = TimeItemUtils.convertTime(min, unit);
    const minUnitTime = TimeUtils.convertMillisecondsToUnit(minTime, unit);
    if (minUnitTime == null || v >= minUnitTime) return undefined;
    return `${itemName || defaultItemName}は${formattedMin || TimeItemUtils.format(minTime, mode)}以降で入力してください。`;
  };

  export const max = (
    v: number | null | undefined,
    max: TimeValue,
    mode: TimeMode,
    unit: TimeUnit,
    itemName?: string,
    formattedMax?: string
  ) => {
    if (v == null || max == null) return undefined;
    const maxTime = TimeItemUtils.convertTime(max, unit);
    const maxUnitTime = TimeUtils.convertMillisecondsToUnit(maxTime, unit);
    if (maxUnitTime == null || v <= maxUnitTime) return undefined;
    return `${itemName || defaultItemName}は${formattedMax || TimeItemUtils.format(maxTime, mode)}以前で入力してください。`;
  };

  export const range = (
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
    const minTime = TimeItemUtils.convertTime(min, unit);
    const minUnitTime = TimeUtils.convertMillisecondsToUnit(minTime, unit);
    const maxTime = TimeItemUtils.convertTime(max, unit);
    const maxUnitTime = TimeUtils.convertMillisecondsToUnit(maxTime, unit);
    if (minUnitTime == null || maxUnitTime == null || (minUnitTime <= v && v <= maxUnitTime)) return undefined;
    return `${itemName || defaultItemName}は${formattedMin || TimeItemUtils.format(minTime, mode)}～${formattedMax || TimeItemUtils.format(maxTime, mode)}の範囲で入力してください。`;
  };

  export const context = (
    v: number | null | undefined,
    rangePair: TimeRangePair,
    data: { [v: string]: any } | null | undefined,
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
      const time = TimeItemUtils.convertTime(pv, pairUnit || rangePair.unit || unit);
      return {
        pairTime: time,
        pairUnitTime: TimeUtils.convertMillisecondsToUnit(time, unit),
      };
    })();
    if (pairUnitTime == null) return undefined;
    if (rangePair.disallowSame !== true && v === pairUnitTime) return undefined;
    if (rangePair.position === "before") {
      if (v >= pairUnitTime) return undefined;
      return `時間の前後関係が不適切です。${itemName || defaultItemName}は${pairItemName || rangePair.label || rangePair.name}[${TimeItemUtils.format(pairTime, mode)}]以降で入力してください。`;
    }
    if (v <= pairUnitTime) return undefined;
    return `時間の前後関係が不適切です。${itemName || defaultItemName}は${pairItemName || rangePair.label || rangePair.name}[${TimeItemUtils.format(pairTime, mode)}]以前で入力してください。`;
  };
}

export default TimeValidation;