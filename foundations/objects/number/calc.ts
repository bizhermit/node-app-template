import { getFloatPosition } from "./float";

export const add = (num1: number | null | undefined, num2: number | null | undefined) => {
  if (num2 == null) return num1 ?? 0;
  if (num1 == null) return num2 ?? 0;
  const dotPos1 = getFloatPosition(num1), dotPos2 = getFloatPosition(num2);
  const maxDotPos = Math.max(dotPos1, dotPos2);
  return (Number((String(num1) + "0".repeat(maxDotPos - dotPos1)).replace(".", "")) + Number((String(num2) + "0".repeat(maxDotPos - dotPos2)).replace(".", ""))) / Math.pow(10, maxDotPos);
};

export const adds = (...nums: Array<number | null | undefined>) => {
  if (nums.length === 0) return 0;
  if (nums.length === 1) return nums[0] ?? 0;
  let ret = nums[0] ?? 0;
  for (let i = 1, il = nums.length; i < il; i++) ret = add(ret, nums[i]);
  return ret;
};

export const minus = (num1: number | null | undefined, num2: number | null | undefined) => {
  if (num2 == null) return num1 ?? 0;
  if (num1 == null) return -num2 ?? 0;
  const dotPos1 = getFloatPosition(num1), dotPos2 = getFloatPosition(num2);
  const maxDotPos = Math.max(dotPos1, dotPos2);
  return (Number((String(num1) + "0".repeat(maxDotPos - dotPos1)).replace(".", "")) - Number((String(num2) + "0".repeat(maxDotPos - dotPos2)).replace(".", ""))) / Math.pow(10, maxDotPos);
};

export const average = (...nums: Array<number | null | undefined>) => {
  let sum = 0, denom = 0;
  nums.forEach(v => {
    if (v == null) return;
    sum = add(sum, v);
    denom++;
  });
  return sum / denom;
};