/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import apiHandler from "@/utilities/api-handler";

export default apiHandler<"/fetch">({
  preaction: async (ctx) => {
    // console.log("common");
    const body = ctx.getBody();
    console.log(body);
  },
  get: async (ctx) => {
    console.log("get");
    const query = ctx.getQuery();
    console.log(query);
    const body = ctx.getBody();
    console.log(body);
    const session = ctx.getSession();
    session.count = (session?.count ?? 0) + 1;
    // return {
    //   count: session.count,
    // };
  },
  post: async (ctx) => {
    console.log("post");
    const body = ctx.getBody();
    console.log(body);
    return {
      // updated: true,
      // body,
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