export const addDay = (date: Date, add: number) => {
  date.setDate(date.getDate() + add);
  return date;
};

export const addMonth = (date: Date, add: number) => {
  date.setMonth(date.getMonth() + add);
  return date;
};

export const addYear = (date: Date, add: number) => {
  date.setFullYear(date.getFullYear() + add);
  return date;
};

export const getFirstDateAtMonth = (date = new Date()) => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

export const getLastDateAtMonth = (date = new Date()) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
};

export const getFirstDateAtYear = (date = new Date()) => {
  return new Date(date.getFullYear(), 0, 1);
};

export const getLastDateAtYear = (date = new Date()) => {
  return new Date(date.getFullYear(), 11, 31);
};

export const getPrevDate = (date = new Date()) => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1);
};

export const getNextDate = (date = new Date()) => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
};

export const getPrevWeekDate = (date = new Date()) => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() - 7);
};

export const getNextWeekDate = (date = new Date()) => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 7);
};

export const getPrevMonthDate = (date = new Date(), fixedYM = false) => {
  const d = new Date(date.getFullYear(), date.getMonth() - 1, date.getDate());
  if (fixedYM === true && d.getDate() !== date.getDate()) d.setDate(0);
  return d;
};

export const getNextMonthDate = (date = new Date(), fixedYM = false) => {
  const d = new Date(date.getFullYear(), date.getMonth() + 1, date.getDate());
  if (fixedYM === true && d.getDate() !== date.getDate()) d.setDate(0);
  return d;
};

export const getPrevYearDate = (date = new Date(), fixedYM = false) => {
  const d = new Date(date.getFullYear() - 1, date.getMonth(), date.getDate());
  if (fixedYM === true && d.getDate() !== date.getDate()) d.setDate(0);
  return d;
};

export const getNextYearDate = (date = new Date(), fixedYM = false) => {
  const d = new Date(date.getFullYear() + 1, date.getMonth(), date.getDate());
  if (fixedYM === true && d.getDate() !== date.getDate()) d.setDate(0);
  return d;
};