/* eslint-disable no-console */
import apiHandler from "@/utilities/api-handler";

export default apiHandler({
  get: async (ctx) => {
    console.log("--get--");
    console.log(ctx.getData());
  },
  post: async (ctx) => {
    console.log("--post--");
    console.log(ctx.getData());
  },
});