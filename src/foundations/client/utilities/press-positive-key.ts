export const pressPositiveKey = <T extends HTMLElement = HTMLElement>(e: React.KeyboardEvent<T>, func: (e: React.KeyboardEvent<T>) => (void | boolean)) => {
  if (e.key === " " || e.key === "Enter") {
    if (func(e) !== true) {
      e.preventDefault();
    }
  }
};
