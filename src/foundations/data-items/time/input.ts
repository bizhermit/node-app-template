import Time from "../../objects/time";
import { TimeUtils } from "../../objects/time/utilities";
import TimeItemUtils from "./utilities";
import TimeValidation from "./validations";

namespace TimeInput {

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

  export const getUnit = (unit: FCProps["$unit"], mode: TimeMode) => {
    if (unit) return unit;
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

  export const getMinTime = (min: FCProps["$min"], unit: TimeUnit) => {
    return TimeItemUtils.convertTime(min, unit) ?? 0;
  };

  const max24 = (23 * 3600 + 59 * 60 + 59) * 1000;
  export const getMaxTime = (max: FCProps["$max"], unit: TimeUnit) => {
    return TimeItemUtils.convertTime(max, unit) ?? max24;
  };

  export const rangeValidation = (minTime: number, maxTime: number, mode: TimeMode, unit: TimeUnit, itemName?: string) => {
    const maxTimeStr = formatByTimeMode(maxTime, mode);
    const minTimeStr = formatByTimeMode(minTime, mode);
    return (v: any) => TimeValidation.range(
      TimeItemUtils.convertTime(v, unit),
      minTime,
      maxTime,
      mode,
      "millisecond",
      itemName,
      minTimeStr,
      maxTimeStr
    );
  };

  export const minValidation = (minTime: number, mode: TimeMode, unit: TimeUnit, itemName?: string) => {
    const minTimeStr = formatByTimeMode(minTime, mode);
    return (v: any) => TimeValidation.min(
      TimeItemUtils.convertTime(v, unit),
      minTime,
      mode,
      "millisecond",
      itemName,
      minTimeStr
    );
  };

  export const maxValidation = (maxTime: number, mode: TimeMode, unit: TimeUnit, itemName?: string) => {
    const maxTimeStr = formatByTimeMode(maxTime, mode);
    return (v: any) => TimeValidation.max(
      TimeItemUtils.convertTime(v, unit),
      maxTime,
      mode,
      "millisecond",
      itemName,
      maxTimeStr
    );
  };

  export const contextValidation = (rangePair: TimeRangePair, mode: TimeMode, unit: TimeUnit, itemName?: string) => {
    const pairTimeUnit = rangePair.unit ?? "minute";
    const compare = (value: TimeValue, pairTime: number) =>
      TimeValidation.context(
        TimeItemUtils.convertTime(value, unit),
        rangePair,
        { [rangePair.name]: pairTime },
        mode,
        "millisecond",
        itemName,
        undefined,
        undefined
      );
    const getPairTime = (data: { [v: string | number | symbol]: any }) => {
      if (data == null) return undefined;
      const pairValue = data[rangePair.name];
      if (pairValue == null || Array.isArray(pairValue)) return undefined;
      return TimeItemUtils.convertTime(pairValue, pairTimeUnit);
    };
    const validation: F.Validation<any> = (v, t) => {
      if (t == null) return undefined;
      const pairTime = getPairTime(t);
      if (pairTime == null) return undefined;
      return compare(v, pairTime);
    };
    return { compare, getPairTime, validation };
  };

}

export default TimeInput;
