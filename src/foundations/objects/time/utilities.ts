import Time from ".";
import { TimeRadix as R } from "./consts";

export namespace TimeUtils {

  export const max = (...times: Array<Time | null | undefined>) => {
    let max: number | undefined;
    times.forEach(time => {
      if (time == null) return;
      if (max == null) {
        max = time.getTime();
        return;
      }
      max = Math.max(max, time.getTime());
    });
    return new Time(max);
  };

  export const min = (...times: Array<Time | null | undefined>) => {
    let min: number | undefined = undefined;
    times.forEach(time => {
      if (time == null) return;
      if (min == null) {
        min = time.getTime();
        return;
      }
      min = Math.min(min, time.getTime());
    });
    return new Time(min);
  };

  export const average = (...times: Array<Time | null | undefined>) => {
    const time = TimeUtils.adds(...times);
    return new Time(Math.round(time.getTime() / Math.max(1, times.length)));
  };

  export const add = (time1: Time | null | undefined, time2: Time | null | undefined) => {
    if (time1 == null) return new Time(time2);
    if (time2 == null) return new Time(time1);
    return new Time(time1.getTime() + time2.getTime());
  };

  export const adds = (...times: Array<Time | null |undefined>) => {
    let t = 0;
    times.forEach(time => {
      if (time == null) return;
      t += time.getTime();
    });
    return new Time(t);
  };

  export const minus = (time1: Time | null | undefined, time2: Time | null | undefined) => {
    if (time1 == null) return new Time((time2?.getTime() ?? 0) * -1);
    if (time2 == null) return new Time(time1.getTime());
    return new Time(time1.getTime() - time2.getTime());
  };

  export const validContext = (before: Time | null | undefined, after: Time | null | undefined) => {
    if (before == null || after == null) return true;
    return after.getTime() - before.getTime() >= 0;
  };

  export const convertMillisecondsToUnit = (milliseconds: number | null | undefined, returnUnit: "hour" | "minute" | "second" | "millisecond", mode: "floor" | "ceil" | "round" = "round") => {
    if (milliseconds == null) return undefined;
    const impl = (denom: number) => {
      if (mode === "ceil") {
        if (milliseconds < 0) Math.floor(milliseconds / denom);
        return Math.ceil(milliseconds / denom);
      }
      if (mode === "floor") {
        if (milliseconds < 0) Math.ceil(milliseconds / denom);
        return Math.floor(milliseconds / denom);
      }
      return Math.round(milliseconds / denom);
    };
    if (returnUnit === "hour") return impl(R.H);
    if (returnUnit === "minute") return impl(R.M);
    if (returnUnit === "second") return impl(R.S);
    return milliseconds;
  };

  export const convertUnitToMilliseconds = (value: number | null | undefined, argUnit: "hour" | "minute" | "second" | "millisecond") => {
    if (value == null) return undefined;
    if (argUnit === "hour") return value * R.H;
    if (argUnit === "minute") return value * R.M;
    if (argUnit === "second") return value * R.S;
    return value;
  };

  export const format = (millisecond: number, pattern?: string) => {
    return new Time(millisecond).format(pattern);
  };

}
