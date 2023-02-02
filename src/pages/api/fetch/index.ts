/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { arrayItem, booleanItem, numberItem, stringItem, structItem } from "@/data-items/data-item-wrapper";
import notification_body from "@/data-items/notification/body";
import notification_releaseDate from "@/data-items/notification/release-date";
import notification_title from "@/data-items/notification/title";
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
      number: numberItem({
        label: "年齢",
        // strict: true,
        required: true,
      }),
      boolean: booleanItem({
        // strict: true,
        required: true,
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
    return {
      update: true,
    };
  },
});