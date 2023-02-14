/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import arrayItem from "@/data-items/array";
import booleanItem from "@/data-items/boolean";
import dateItem from "@/data-items/date";
import numberItem from "@/data-items/number";
import { sample_boolean, sample_date, sample_month, sample_number, sample_string, sample_time, sample_year } from "@/data-items/sample/item";
import stringItem from "@/data-items/string";
import structItem from "@/data-items/struct";
import timeItem from "@/data-items/time";
import apiHandler from "@/utilities/api-handler";

export default apiHandler({
  $get: {
    req: {
      id: stringItem({
        required: true,
      })
    },
  },
  get: async (ctx) => {
    const data = ctx.getData();
    return data;
  },
  $post: {
    req: {
      sample_string: sample_string,
      string: stringItem(),
      sample_number: sample_number,
      number: numberItem(),
      sample_boolean: sample_boolean,
      boolean: booleanItem(),
      boolean_num: booleanItem({
        trueValue: 1,
        falseValue: 0,
      }),
      boolean_str: booleanItem({
        trueValue: "1",
        falseValue: "9",
      }),
      sample_date: sample_date,
      sample_month: sample_month,
      sample_year: sample_year,
      date1: dateItem({
        required: true,
        label: "日付From",
        rangePair: {
          name: "date2",
          position: "after",
        },
      }),
      date2: dateItem({
        required: true,
        label: "日付To",
        rangePair: {
          name: "date1",
          position: "before",
        },
      }),
      sample_time: sample_time,
      time1: timeItem({
        required: true,
        // min: "9:00",
        // max: "23:00",
        unit: "millisecond",
        rangePair: {
          name: "time2",
          position: "after",
        },
      }),
      time2: timeItem({
        // required: true,
        // max: "17:00",
        unit: "second",
        rangePair: {
          name: "time1",
          position: "before",
        },
      }),
      array: arrayItem({
        item: sample_string,
        required: true,
      }),
      arrayStruct: arrayItem({
        item: {
          sample_string: sample_string,
          sample_number: sample_number,
          sample_boolean: sample_boolean,
        },
      }),
      struct: {
        sample_string: sample_string,
        sample_number: sample_number,
        sample_boolean: sample_boolean,
      },
      structItem: structItem({
        item: {
          sample_string: sample_string,
          sample_number: sample_number,
          sample_boolean: sample_boolean,
        },
        required: true,
      })
    },
    res: {
      update: booleanItem(),
    }
  },
  post: async (ctx) => {
    const data = ctx.getData();
    console.log("----------------");
    console.log(data);
    console.log("----------------");
    return {
      update: true,
    };
  },
});