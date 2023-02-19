/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import apiHandler, { NextApiConfig } from "@/utilities/api-handler";

export const config: NextApiConfig = {
  api: {
    // bodyParser: {
    //   sizeLimit: "10mb",
    // }
    bodyParser: false,
  },
};

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