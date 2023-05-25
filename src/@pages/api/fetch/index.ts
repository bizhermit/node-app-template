/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import arrayItem from "#/data-items/array";
import booleanItem from "#/data-items/boolean";
import dateItem from "#/data-items/date";
import numberItem from "#/data-items/number";
import { sample_boolean, sample_date, sample_month, sample_number, sample_string, sample_time, sample_year } from "#/data-items/sample/item";
import stringItem from "#/data-items/string";
import structItem from "#/data-items/struct";
import timeItem from "#/data-items/time";
import apiHandler, { type NextApiConfig } from "#/utilities/api-handler/page-api";

export const config: NextApiConfig = {
  api: {
    // bodyParser: {
    //   sizeLimit: "10mb",
    // }
    bodyParser: false,
  },
};

const id = stringItem({
  name: "id",
  required: true,
});

export default apiHandler({
  $get: {
    // id: id,
    [id.name]: id,
    // id: stringItem({
    //   name: "id",
    //   required: true,
    // }),
    // id: sample_string,
  },
  get: async (ctx) => {
    const data = ctx.getData();
    return data;
    // return {
    //   hoge: 1,
    // };
  },
  $post: {
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