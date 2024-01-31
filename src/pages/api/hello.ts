import $str from "#/data-items/string";
import apiHandler from "#/server/api-handler/page-api";

const hello = $str({
  name: "hello",
  required: true,
});

export default apiHandler({
  $get: [
    hello,
  ],
  get: async () => {
    return {
      hello: "hello",
    };
  },
});