/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import fileItem from "#/data-items/file";
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
  $post: {
    filedrop: fileItem({
      name: "filedrop",
      multiple: true,
    }),
    filebutton: fileItem({
      name: "filebutton",
      multiple: false,
    }),
  },
  post: async (ctx) => {
    console.log("--post--");
    const data = ctx.getData();
    console.log(data);
    // data.filedrop;
    // data.filebutton;
  },
});