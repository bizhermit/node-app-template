/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import dataItem, { arrayItem, numberItem } from "@/data-items/data-item-wrapper";
import notification_body from "@/data-items/notification/body";
import notification_releaseDate from "@/data-items/notification/release-date";
import notification_title from "@/data-items/notification/title";
import apiHandler from "@/utilities/api-handler";

const pathname = "/fetch";

export const GetReq = {
  hoge: numberItem({
    required: true,
  }),
  fuga: arrayItem({
    required: true,
    item: dataItem({
      type: "number",
    }),
  }),
};
export type GetRes = {
  updated: boolean;
  hoge: number;
};

export const PostReq = {
  title: notification_title,
  [notification_body.name]: notification_body,
  [notification_releaseDate.name]: notification_releaseDate,
  array: arrayItem({
    item: notification_title,
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
};

export default apiHandler<typeof pathname>({
  preaction: async (ctx) => {
    // console.log("common");
    const body = ctx.getArgs();
    console.log(body);
    return;
  },
  get: async (ctx) => {
    console.log("get");
    const session = ctx.getSession();
    session.count = (session?.count ?? 0) + 1;
    // return {
    //   count: session.count,
    // };
    // return null;
  },
  post: async (ctx) => {
    console.log("post");
    const args = ctx.getArgs();
    console.log(args);
    return {
    };
  },
  delete: async (ctx) => {
    console.log("delete");
    const args = ctx.getArgs();
    console.log(args);
    return {
      deleted: true,
    };
  },
});