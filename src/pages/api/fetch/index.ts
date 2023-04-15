/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import arrayItem from "@/data-items/_base/array";
import booleanItem from "@/data-items/_base/boolean";
import dateItem from "@/data-items/_base/date";
import numberItem from "@/data-items/_base/number";
import { sample_boolean, sample_date, sample_month, sample_number, sample_string, sample_time, sample_year } from "@/data-items/sample/item";
import stringItem from "@/data-items/_base/string";
import structItem from "@/data-items/_base/struct";
import timeItem from "@/data-items/_base/time";
import apiHandler, { type NextApiConfig } from "@/utilities/api-handler";

export const config: NextApiConfig = {
  api: {
    // bodyParser: {
    //   sizeLimit: "10mb",
    // }
    bodyParser: false,
  },
};

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
      date_date: dateItem({
        typeof: "date",
        // min: "2023-02-16",
      }),
      date_str: dateItem({
        typeof: "string",
        // min: "2023-02-16",
      }),
      date_num: dateItem({
        typeof: "number",
        // min: "2023-02-16",
      }),
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
      time_num: timeItem({
        typeof: "number",
      }),
      time_str: timeItem({
        typeof: "string",
      }),
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