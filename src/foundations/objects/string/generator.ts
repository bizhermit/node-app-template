export const generateUuidV4 = () => {
  const c = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".split("");
  for (let i = 0, il = c.length; i < il; i++) {
    switch (c[i]) {
      case "x":
        c[i] = Math.floor(Math.random() * 16).toString(16);
        break;
      case "y":
        c[i] = (Math.floor(Math.random() * 4) + 8).toString(16);
        break;
      default:
        break;
    }
  }
  return c.join("");
};