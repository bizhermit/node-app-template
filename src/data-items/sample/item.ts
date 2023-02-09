import booleanItem from "@/data-items/boolean";
import dateItem, { monthItem } from "@/data-items/date";
import numberItem from "@/data-items/number";
import stringItem from "@/data-items/string";

export const sample_string = stringItem({
  name: "sample_text",
  required: true,
  // minLength: 5,
  // maxLength: 5,
  length: 5,
  charType: "alpha",
  width: "20rem",
  validations: [
    (v) => {
      if (v === "hoge") return "not allow hoge!";
      return undefined;
    },
    (v) => {
      if (v === "fuga") return { body: "not allow fuga" };
      return undefined;
    },
  ],
});

export const sample_number = numberItem({
  name: "sample_number",
  width: "20rem",
  validations: [
    (v) => {
      if (v === 10) return "not allow ten!";
      return undefined;
    }
  ],
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