/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import $file from "#/data-items/file";
import apiHandler, { type NextApiConfig } from "#/server/api-handler/page-api";

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
  $post: [
    $file({
      name: "filedrop",
      multiple: true,
    }),
    $file({
      name: "filebutton",
      multiple: false,
    }),
  ],
  post: async (ctx) => {
    console.log("--post--");
    const data = ctx.getData();
    console.log(data);
    // data.filedrop;
    // data.filebutton;
  },
});