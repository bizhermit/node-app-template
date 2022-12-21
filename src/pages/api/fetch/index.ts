/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import apiHandler from "@/utilities/api-handler";

export default apiHandler({
  common: async (ctx) => {
    // console.log("common");
  },
  get: async (ctx) => {
    console.log("get");
    console.log(ctx.getQuery());
    const session = ctx.getSession();
    session.count = (session?.count ?? 0) + 1;
    // return {
    //   count: session.count,
    // };
  },
  post: async (ctx) => {
    console.log("post");
    const body = ctx.getBody<{ hoge: number }>();
    console.log(body);
    return {
      updated: true,
      body,
    };
  },
  delete: async (ctx) => {
    console.log("delete");
    return {
      deleted: true,
    };
  },
});