/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import fileItem from "@/data-items/file";
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
  $post: {
    req: {
      filedrop: fileItem({
        // fileSize: 10000,
        // multiple: true,
        multiple: true,
      }),
      filebutton: fileItem({
        // multiple: false,
        // multiple: false,
      }),
    }
  },
  post: async (ctx) => {
    console.log("--post--");
    const data = ctx.getData();
    // console.log(data);
    data.filedrop;
    data.filebutton;
  },
});