/* eslint-disable no-console */
import apiHandler from "@/utilities/api-handler";

export default apiHandler({
  common: async (ctx) => {
    console.log(ctx.req.method);
  },
  get: async (ctx) => {
    console.log("- query");
    console.log(ctx.getQuery());
    console.log("- body");
    console.log(ctx.getBody());
    ctx.setStatus(204);
  },
  post: async (ctx) => {
    console.log("- query");
    console.log(ctx.getQuery());
    console.log("- body");
    console.log(ctx.getBody());
    // console.log(ctx.getBody().textbox)
    ctx.setStatus(204);
  },
});