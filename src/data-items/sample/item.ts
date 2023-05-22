/* eslint-disable no-console */
import booleanItem from "@/data-items/_base/boolean";
import dateItem, { monthItem, yearItem } from "@/data-items/_base/date";
import fileItem from "@/data-items/_base/file";
import numberItem from "@/data-items/_base/number";
import stringItem from "@/data-items/_base/string";
import timeItem from "@/data-items/_base/time";

export const sample_string = stringItem({
  name: "sample_string",
  required: true,
  minLength: 5,
  // maxLength: 5,
  // length: 5,
  // charType: "alpha",
  width: "20rem",
  validations: [
    (...args) => {
      console.log(args);
      return "";
    },
    (v) => {
      console.log("string validation: ", typeof v, v);
      if (v == null) return undefined;
      if (typeof v === "string") return undefined;
      return "not typeof string";
    },
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
      console.log("number validation: ", typeof v, v);
      if (v == null) return undefined;
      if (typeof v === "number") return undefined;
      return "not typeof number";
    },
    (v) => {
      if (v === 10) return "not allow ten!";
      return undefined;
    },
  ],
});

export const sample_boolean = booleanItem({
  name: "sample_boolean",
  validations: [
    (v) => {
      console.log("boolean validation: ", typeof v, v);
      if (v == null) return undefined;
      if (typeof v === "boolean") return undefined;
      return "not typeof boolean";
    },
  ]
});

export const sample_boolean_num = booleanItem({
  name: "sample_boolean_num",
  trueValue: 1,
  falseValue: 0,
});

export const sample_boolean_str = booleanItem({
  name: "sample_boolean_str",
  trueValue: "1",
  falseValue: "9",
});

export const sample_date = dateItem({
  name: "sample_date",
  typeof: "string",
  validations: [
    (v) => {
      console.log("date validation: ", typeof v, v);
      if (v == null) return undefined;
      if (v instanceof Date) return undefined;
      return "not typeof date";
    },
  ],
});

export const sample_month = monthItem({
  name: "sample_month",
  validations: [
    (v) => {
      console.log("month validation: ", typeof v, v);
      if (v == null) return undefined;
      if (v instanceof Date) return undefined;
      return "not typeof date";
    },
  ],
});

export const sample_year = yearItem({
  name: "sample_year",
  validations: [
    (v) => {
      console.log("year validation: ", typeof v, v);
      if (v == null) return undefined;
      if (v instanceof Date) return undefined;
      return "not typeof date";
    },
  ],
});

export const sample_time = timeItem({
  name: "sample_time",
  validations: [
    (v) => {
      console.log("time validation: ", typeof v, v);
      return undefined;
    },
  ],
});

export const sample_file = fileItem({
  name: "sample_file",
  // accept: "image/*",
  multiple: true,
  // multiple: false,
  validations: [
    (v) => {
      console.log("file validation: ", typeof v, v);
      return undefined;
    },
  ],
});