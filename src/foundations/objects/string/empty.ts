export const isEmpty = <T extends string = string>(str: T | null | undefined): str is null | undefined => {
  return str == null || str === "";
};

export const isNotEmpty = <T extends string = string>(str: T | null | undefined): str is Exclude<T, null | undefined> => {
  return str != null && str !== "";
};
