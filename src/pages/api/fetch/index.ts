/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { arrayItem, booleanItem, dateItem, numberItem, stringItem, structItem } from "@/data-items/data-item-wrapper";
import notification_body from "@/data-items/notification/body";
import notification_releaseDate from "@/data-items/notification/release-date";
import notification_title from "@/data-items/notification/title";
import apiHandler from "@/utilities/api-handler";
import DatetimeUtils from "@bizhermit/basic-utils/dist/datetime-utils";

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
      number: numberItem({
        label: "年齢",
        // strict: true,
        required: true,
      }),
      boolean: booleanItem({
        // strict: true,
        // required: true,
      }),
      boolean01: booleanItem({
        // required: true,
        trueValue: 1,
        falseValue: 0,
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
    console.log(JSON.stringify(data, null, 2));
    data.boolean;
    data.boolean01;
    const date = data[notification_releaseDate.name];
    console.log(DatetimeUtils.format(date));
    return {
      update: true,
    };
  },
});