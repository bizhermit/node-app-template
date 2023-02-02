/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { arrayItem, booleanItem, stringItem, structItem } from "@/data-items/data-item-wrapper";
import notification_body from "@/data-items/notification/body";
import notification_releaseDate from "@/data-items/notification/release-date";
import notification_title from "@/data-items/notification/title";
import apiHandler from "@/utilities/api-handler";

const handler = apiHandler({
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
    return {
      update: true,
    };
  },
});

export default handler;