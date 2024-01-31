import arrayItem from "#/data-items/array";
import $bool from "#/data-items/boolean";
import $num from "#/data-items/number";
import $str from "#/data-items/string";
import $struct from "#/data-items/struct";
import apiMethodHandler from "#/server/api-handler/app-api";
import { sample_date, sample_number, sample_string } from "$/data-items/sample";

export const GET = apiMethodHandler({
  dataItems: [
    sample_string,
    sample_number,
    sample_date,
  ],
  process: async (ctx) => {
    // console.log("get");
    const data = ctx.getData();
    // console.log(data);
    return {
      ...data,
    };
  },
});

export const POST = apiMethodHandler({
  dataItems: [
    $str({
      name: "text",
      strict: true,
      source: [
        { value: "hoge", label: "HOGE" },
        { value: "piyo", label: "PIYO" },
        { value: "fuga", label: "FUGA" },
      ]
    }),
    $num({
      name: "num",
      strict: true,
      source: [
        { value: 1, label: "1" },
        { value: 2, label: "1" },
        { value: 3, label: "1" },
      ],
    }),
    $bool({
      name: "flag",
      // strict: true,
      trueValue: 1,
      falseValue: 9,
    }),
    arrayItem({
      name: "list-str",
      item: $str({
        name: "text",
      }),
    }),
    arrayItem({
      name: "list-struct",
      item: [
        $str({
          name: "text",
        })
      ]
    }),
    $struct({
      name: "struct",
      item: [
        $str({
          name: "text",
        }),
      ]
    }),
  ],
  process: async (ctx) => {
    // console.log("post");
    const data = ctx.getData();
    // console.log(data);
    return {
      ...data,
    };
  },
});

export const PUT = apiMethodHandler({
  dataItems: [
    sample_string
  ],
  process: async (ctx) => {
    // console.log("post");
    const data = ctx.getData();
    // console.log(data);
    return {
      ...data,
    };
  },
});