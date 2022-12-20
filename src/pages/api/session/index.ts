import apiHandler from "@/utilities/api-handler";

export default apiHandler({
  common: async (ctx) => {
    // console.log("common");
  },
  get: async (ctx) => {
    console.log("get");
    return {
      count: 1,
    };
  },
  post: async (ctx) => {
    console.log("post");
    const body = ctx.getBody<{ hoge: number }>();
    console.log(body);
    return {
      updated: true,
    };
  },
  delete: async (ctx) => {
    console.log("delete");
    return {
      deleted: true,
    };
  },
});