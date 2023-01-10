/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import notification_body from "@/data-items/notification/body";
import notification_releaseDate from "@/data-items/notification/release-date";
import notification_title from "@/data-items/notification/title";
import apiHandler from "@/utilities/api-handler";

const params = [
  notification_title,
  notification_body,
  notification_releaseDate,
] as const;
export declare type GetRequest = DataItemStruct<typeof params>;

export default apiHandler<"/fetch">({
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