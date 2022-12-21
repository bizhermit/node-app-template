/* eslint-disable no-console */
import apiHandler from "@/utilities/api-handler";

export default apiHandler({
  common: async (ctx) => {
    console.log(ctx.req.method);
  },
  get: async (ctx) => {
    console.log("- query");
    console.log(JSON.stringify(ctx.getQuery(), null, 2));
    console.log("- body");
    console.log(JSON.stringify(ctx.getBody(), null, 2));
    ctx.setStatus(204);
  },
  post: async (ctx) => {
    console.log("- query");
    console.log(JSON.stringify(ctx.getQuery(), null, 2));
    console.log("- body");
    console.log(JSON.stringify(ctx.getBody(), null, 2));
    ctx.setStatus(204);
  },
});