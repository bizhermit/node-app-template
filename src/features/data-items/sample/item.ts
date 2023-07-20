/* eslint-disable no-console */
import booleanItem from "#/data-items/boolean";
import dateItem, { monthItem, yearItem } from "#/data-items/date";
import fileItem from "#/data-items/file";
import numberItem from "#/data-items/number";
import stringItem from "#/data-items/string";
import timeItem from "#/data-items/time";

export const sample_string = stringItem({
  name: "s_string",
  // required: true,
  minLength: 5,
  // maxLength: 5,
  // length: 5,
  // charType: "alpha",
  width: "20rem",
  source: [
    { value: "hoge", label: "hoge" },
    { value: "fuga", label: "fuga" },
    { value: "piyo", label: "piyo" },
  ],
  validations: [
    (...args) => {
      console.log(args);
      return undefined;
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
  name: "s_number",
  width: "20rem",
  source: [
    { value: 1, label: "item 1" },
    { value: 2, label: "item 2" },
    { value: 3, label: "item 3" },
  ],
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
  name: "s_boolean",
  required: true,
  // strict: true,
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
  name: "s_boolean_num",
  trueValue: 1,
  falseValue: 0,
  required: true,
});

export const sample_boolean_str = booleanItem({
  name: "s_boolean_str",
  trueValue: "1",
  falseValue: "9",
  source: [
    { value: "1", label: "selected" },
    { value: "9", label: "unselected" },
  ],
  required: true,
});

export const sample_date = dateItem({
  name: "sample_date",
  // typeof: "string",
  typeof: "date",
  // typeof: "number",
  required: true,
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