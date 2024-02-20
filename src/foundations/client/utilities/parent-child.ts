export const includeElement = (parent: Element | null | undefined, child: Element | null | undefined) => {
  if (parent == null || child == null) return false;
  let elem = child;
  while (elem != null) {
    if (elem === parent) return true;
    elem = elem?.parentElement!;
  }
  return false;
};
