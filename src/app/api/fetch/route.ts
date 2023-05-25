import fileItem from "@/data-items/_base/file";
import stringItem from "@/data-items/_base/string";
import apiMethodHandler from "@/utilities/api-handler/app-api";

export const GET = apiMethodHandler({
}, async (ctx) => {
  console.log("get");
  const data = ctx.getData();
  console.log(data);
  return {
    hoge: 1,
    fuga: 2,
  };
});

const blobFile = fileItem({ required: true });
export const POST = apiMethodHandler({
  fetch: stringItem(),
  file: blobFile,
}, async (ctx) => {
  console.log("post");
  const data = ctx.getData();
  console.log(data);
  return {
    hoge: 1,
  };
});