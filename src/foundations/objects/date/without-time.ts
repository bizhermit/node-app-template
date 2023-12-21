export const withoutTime = (date: Date | null | undefined) => {
  if (date == null) return date;
  date.setHours(0, 0, 0, 0);
  return date;
};