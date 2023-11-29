export const equalDatetime = (d1: Date | null | undefined, d2: Date | null | undefined) => {
  return d1?.getTime() === d2?.getTime();
};

export const equalDay = (d1: Date | null | undefined, d2: Date | null | undefined) => {
  return d1?.getDate() === d2?.getDate();
};

export const equalMonth = (d1: Date | null | undefined, d2: Date | null | undefined) => {
  return d1?.getMonth() === d2?.getMonth();
};

export const equalYear = (d1: Date | null | undefined, d2: Date | null | undefined) => {
  return d1?.getFullYear() === d2?.getFullYear();
};

export const equalDate = (d1: Date | null | undefined, d2: Date | null | undefined) => {
  return equalDay(d1, d2) && equalMonth(d1, d2) && equalYear(d1, d2);
};

export const equalWeek = (d1: Date | null | undefined, d2: Date | null | undefined) => {
  return d1?.getDay() === d2?.getDay();
};

export const equalMonthDay = (d1: Date | null | undefined, d2: Date | null | undefined) => {
  return equalDay(d1, d2) && equalMonth(d1, d2);
};

export const equalYearMonth = (d1: Date | null | undefined, d2: Date | null | undefined) => {
  return equalMonth(d1, d2) && equalYear(d1, d2);
};