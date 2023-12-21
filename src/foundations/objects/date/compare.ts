const dRad = 86400000;

export const isBeforeDatetime = (base: Date, date: Date) => {
  return base.getTime() > date.getTime();
};

export const isAfterDatetime = (base: Date, date: Date) => {
  return base.getTime() < date.getTime();
};

export const isBeforeDate = (base: Date, date: Date) => {
  return Math.floor(base.getTime() / dRad) > Math.floor(date.getTime() / dRad);
};

export const isAfterDate = (base: Date, date: Date) => {
  return Math.floor(base.getTime() / dRad) < Math.floor(date.getTime() / dRad);
};

export const getDaysDiff = (before: Date | null | undefined, after: Date | null | undefined) => {
  if (before == null || after == null) return 0;
  return Math.floor(after.getTime() / dRad) - Math.floor(before.getTime() / dRad);
};