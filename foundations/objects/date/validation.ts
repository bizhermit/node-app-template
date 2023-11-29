import { getDaysDiff } from "./compare";

export const validDateContext = (before: Date | null | undefined, after: Date | null | undefined) => {
  if (before == null || after == null) return true;
  return getDaysDiff(before, after) >= 0;
};
