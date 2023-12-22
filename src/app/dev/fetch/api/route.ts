import arrayItem from "#/data-items/array";
import booleanItem from "#/data-items/boolean";
import numberItem from "#/data-items/number";
import stringItem from "#/data-items/string";
import structItem from "#/data-items/struct";
import apiMethodHandler from "#/server/api-handler/app-api";
import { sample_string } from "$/data-items/sample";

export const GET = apiMethodHandler([
  stringItem({
    name: "text",
    // strict: true,
    source: [
      { value: "hoge", label: "HOGE" },
      { value: "fuga", label: "FUGA" },
      { value: "piyo", label: "PIYO" },
    ]
  }),
  numberItem({
    name: "num",
    // strict: true,
    source: [
      { value: 1, label: "1" },
      { value: 2, label: "1" },
      { value: 3, label: "1" },
    ],
  }),
  booleanItem({
    name: "flag",
    // strict: true,
    trueValue: 1,
    falseValue: 9,
  }),
], async (ctx) => {
  // console.log("get");
  const data = ctx.getData();
  // console.log(data);
  return {
    ...data,
  };
});

export const POST = apiMethodHandler([
  stringItem({
    name: "text",
    strict: true,
    source: [
      { value: "hoge", label: "HOGE" },
      { value: "piyo", label: "PIYO" },
      { value: "fuga", label: "FUGA" },
    ]
  }),
  numberItem({
    name: "num",
    strict: true,
    source: [
      { value: 1, label: "1" },
      { value: 2, label: "1" },
      { value: 3, label: "1" },
    ],
  }),
  booleanItem({
    name: "flag",
    // strict: true,
    trueValue: 1,
    falseValue: 9,
  }),
  arrayItem({
    name: "list-str",
    item: stringItem({
      name: "text",
    }),
  }),
  arrayItem({
    name: "list-struct",
    item: [
      stringItem({
        name: "text",
      })
    ]
  }),
  structItem({
    name: "struct",
    item: [
      stringItem({
        name: "text",
      }),
    ]
  }),
] as const, async (ctx) => {
  // console.log("post");
  const data = ctx.getData();
  // console.log(data);
  return {
    ...data,
  };
});

export const PUT = apiMethodHandler([
  sample_string
], async (ctx) => {
  // console.log("post");
  const data = ctx.getData();
  // console.log(data);
  return {
    ...data,
  };
});