/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import notification_body from "@/data-items/notification/body";
import notification_releaseDate from "@/data-items/notification/release-date";
import notification_title from "@/data-items/notification/title";
import apiHandler from "@/utilities/api-handler";

const pathname = "/fetch";

export const GetReq = {
  hoge: 1,
  fuga: [1],
};
export const GetRes = {
  hoge: 3,
  fuga: 4,
};

export const PostReq = {
  [notification_title.name]: notification_title,
  [notification_body.name]: notification_body,
  [notification_releaseDate.name]: notification_releaseDate,
  array: {
    type: "array",
    item: notification_title,
  },
  arrayStruct: {
    type: "array",
    item: {
      [notification_title.name]: notification_title,
      [notification_body.name]: notification_body,
      [notification_releaseDate.name]: notification_releaseDate,
    },
  },
  struct: {
    [notification_title.name]: notification_title,
    [notification_body.name]: notification_body,
    [notification_releaseDate.name]: notification_releaseDate,
  },
} as const;

const params = [
  notification_title,
  notification_body,
  notification_releaseDate,
] as const;
export declare type GetRequest = DataItemStruct<typeof params>;

export default apiHandler<typeof pathname>({
  preaction: async (ctx) => {
    // console.log("common");
    const body = ctx.getBody();
    console.log(body);
    return;
  },
  get: async (ctx) => {
    console.log("get");
    const query = ctx.getQuery();
    console.log(query);
    const session = ctx.getSession();
    session.count = (session?.count ?? 0) + 1;
    // return {
    //   count: session.count,
    // };
    // return null;
  },
  post: async (ctx) => {
    console.log("post");
    const query = ctx.getQuery();
    const body = ctx.getBody(params);
    console.log(body);
    return {
      updated: true,
      body: null,
    };
  },
  delete: async (ctx) => {
    console.log("delete");
    const body = ctx.getBody();
    console.log(body);
    return {
      deleted: true,
    };
  },
});