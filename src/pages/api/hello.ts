import stringItem from "#/data-items/string";
import apiHandler from "#/utilities/api-handler/page-api";

const hello = stringItem({
  name: "hello",
  required: true,
});

export default apiHandler({
  $get: {
    hello,
  },
  get: async () => {
    return {
      hello: "hello",
    };
  },
});