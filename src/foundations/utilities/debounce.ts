const debounce = <T extends Array<any>>(func: (...args: T) => void, delay = 0) => {
  let t: NodeJS.Timeout | null = null;
  return (...args: T) => {
    if (t) clearTimeout(t);
    t = setTimeout(() => {
      func(...args);
      t = null;
    }, delay);
  };
};

export default debounce;
