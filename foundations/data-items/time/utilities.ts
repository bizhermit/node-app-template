import Time from "../../objects/time";
import { TimeUtils } from "../../objects/time/utilities";

namespace TimeItemUtils {

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

}

export default TimeItemUtils;