import booleanItem from "@/data-items/boolean";
import dateItem, { monthItem } from "@/data-items/date";
import numberItem from "@/data-items/number";
import stringItem from "@/data-items/string";

export const sample_string = stringItem({
  name: "sample_text",
  minLength: 5,
  // maxLength: 5,
  // length: 5,
  // charType: "alpha",
  width: "20rem",
});

export const sample_number = numberItem({
  name: "sample_number",
});

export const sample_boolean = booleanItem({
  name: "sample_boolean",
});

export const sample_date = dateItem({
  name: "sample_date",
});

export const sample_month = monthItem({
  name: "sample_month",
});