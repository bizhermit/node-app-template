import parseNum from "../../objects/number/parse";

const dialogAttrName = "data-dialog";

export const getDialogNum = () => parseNum(document.documentElement.getAttribute(dialogAttrName)) ?? 0;

export const dialogUp = () => {
  document.documentElement.setAttribute(dialogAttrName, String(getDialogNum() + 1));
};

export const dialogDown = () => {
  const num = getDialogNum();
  num < 2 ?
    document.documentElement.removeAttribute(dialogAttrName) :
    document.documentElement.setAttribute(dialogAttrName, String(num - 1));
};

