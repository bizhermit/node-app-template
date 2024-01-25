export const withoutTime = <
  T extends Date | null | undefined = Date | null | undefined
>(date: T): T => {
  if (date == null) return date;
  date.setHours(0, 0, 0, 0);
  return date;
};