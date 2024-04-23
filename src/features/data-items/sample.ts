/* eslint-disable no-console */
import $bool from "#/data-items/boolean";
import $date, { $month, $year } from "#/data-items/date";
import $file from "#/data-items/file";
import $num from "#/data-items/number";
import $str from "#/data-items/string";
import $time from "#/data-items/time";

export const sample_string = $str({
  name: "s_string",
  label: "テキスト",
  // strict: true,
  required: true,
  minLength: 5,
  maxLength: 16,
  // length: 5,
  // charType: "alpha",
  width: "20rem",
  source: [
    { value: "hoge", label: "hoge" },
    { value: "fuga", label: "fuga" },
    { value: "piyo", label: "piyo" },
  ],
  validations: [
    // (...args) => {
    //   console.log(args);
    //   return undefined;
    // },
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
      if (v === "fuga") return { body: "not allow fuga", type: "error" };
      return undefined;
    },
  ],
});

export const sample_number = $num({
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

export const sample_boolean = $bool({
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

export const sample_boolean_num = $bool({
  name: "s_boolean_num",
  trueValue: 1,
  falseValue: 0,
  required: true,
});

export const sample_boolean_str = $bool({
  name: "s_boolean_str",
  trueValue: "1",
  falseValue: "9",
  source: [
    { value: "1", label: "selected" },
    { value: "9", label: "unselected" },
  ],
  required: true,
});

export const sample_date = $date({
  name: "sample_date",
  typeof: "string",
  // typeof: "date",
  // typeof: "number",
  required: true,
  // validations: [
  //   (v) => {
  //     console.log("date validation: ", typeof v, v);
  //     if (v == null) return undefined;
  //     if (v instanceof Date) return undefined;
  //     return "not typeof date";
  //   },
  // ],
});

export const sample_month = $month({
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

export const sample_year = $year({
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

export const sample_time = $time({
  name: "sample_time",
  validations: [
    (v) => {
      console.log("time validation: ", typeof v, v);
      return undefined;
    },
  ],
});

export const sample_file = $file({
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
