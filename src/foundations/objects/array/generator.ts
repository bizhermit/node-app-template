const generateArray = <T = any>(len: number, init?: T | ((index: number) => T)) => {
  const arr: Array<T> = [];
  const iterator = (func: (i: number) => T) => {
    for (let i = 0; i < len; i++) arr.push(func(i));
  };
  if (typeof init === "function") {
    iterator(i => (init as (index: number) => T)(i));
    return arr;
  }
  iterator(() => init as T);
  return arr;
};

export default generateArray;
