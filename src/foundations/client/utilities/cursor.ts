const cursorStyleId = "cursorStyle";

export const setCursor = (cursor: string) => {
  if (document?.body == null) return () => { };
  document.onselectstart = () => false;
  let elem = document.getElementById(cursorStyleId) as HTMLStyleElement;
  if (elem == null) {
    elem = document.createElement("style");
    elem.id = cursorStyleId;
    elem.type = "text/css";
    document.head.appendChild(elem);
  }
  elem.textContent = `*,button,a{cursor:${cursor} !important;}`;
  return () => releaseCursor();
};

export const releaseCursor = () => {
  document.onselectstart = () => true;
  try {
    const elem = document.getElementById(cursorStyleId);
    if (elem == null) return;
    document.head.removeChild(elem);
  } catch { }
};