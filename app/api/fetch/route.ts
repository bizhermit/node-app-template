import fileItem from "#/data-items/file";
import stringItem from "#/data-items/string";
import apiMethodHandler from "#/server/api-handler/app-api";
import { sample_date, sample_number, sample_string } from "$/data-items/sample/item";

const text = stringItem({ required: true });
const blobFile = fileItem({ required: true });

export const GET = apiMethodHandler({
  [sample_string.name]: sample_string,
  [sample_number.name]: sample_number,
  [sample_date.name]: sample_date,
}, async (ctx) => {
  // console.log("get");
  const data = ctx.getData();
  // console.log(data);
  return {
    ...data,
  };
});

export const POST = apiMethodHandler({
  [sample_string.name]: sample_string,
  file: blobFile,
}, async (ctx) => {
  // console.log("post");
  const data = ctx.getData();
  // console.log(data);
  return {
    ...data,
  };
});

export const PUT = apiMethodHandler({
  text,
}, async (ctx) => {
  // console.log("post");
  const data = ctx.getData();
  // console.log(data);
  return {
    ...data,
  };
});