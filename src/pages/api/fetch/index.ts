/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import arrayItem from "@/data-items/array";
import booleanItem from "@/data-items/boolean";
import dateItem from "@/data-items/date";
import notification_body from "@/data-items/notification/body";
import notification_releaseDate from "@/data-items/notification/release-date";
import notification_title from "@/data-items/notification/title";
import numberItem from "@/data-items/number";
import { sample_boolean, sample_date, sample_month, sample_number, sample_string, sample_year } from "@/data-items/sample/item";
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
      sample_number: {
        ...sample_number,
        required: true,
      },
      number: numberItem({
        label: "年齢",
        // strict: true,
        required: true,
      }),
      sample_boolean: {
        ...sample_boolean,
        required: true,
      },
      boolean: booleanItem({
        // strict: true,
        // required: true,
        // trueValue: "1",
        // falseValue: "0",
      }),
      boolean01: booleanItem({
        // required: true,
        trueValue: 1,
        falseValue: 0,
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
      title: {
        ...notification_title,
        required: true,
      },
      [notification_body.name]: notification_body,
      [notification_releaseDate.name]: notification_releaseDate,
      array: arrayItem({
        item: {
          ...notification_title,
          required: true,
        },
        required: true,
      }),
      arrayStruct: arrayItem({
        item: {
          [notification_title.name]: notification_title,
          [notification_body.name]: notification_body,
          [notification_releaseDate.name]: notification_releaseDate,
        },
      }),
      struct: {
        [notification_title.name]: notification_title,
        [notification_body.name]: notification_body,
        [notification_releaseDate.name]: notification_releaseDate,
      },
      structItem: structItem({
        item: {
          title: {
            ...notification_title,
            required: true,
          },
          [notification_body.name]: notification_body,
          [notification_releaseDate.name]: notification_releaseDate,
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
    // console.log(JSON.stringify(data, null, 2));
    data.sample_number;
    data.title;
    data.sample_boolean;
    data.sample_date;
    data.sample_month;
    data.number;
    data.boolean;
    data.boolean01;
    // const date = data[notification_releaseDate.name];
    data.time1;
    return {
      update: true,
    };
  },
});