import arrayItem from "#/data-items/array";
import numberItem from "#/data-items/number";
import stringItem from "#/data-items/string";
import apiHandler from "#/utilities/api-handler/page-api";

export default apiHandler({
  $get: {
    id: numberItem(),
    hoge: stringItem(),
    fuga: arrayItem({
      item: stringItem(),
    }),
  },
  get: async (ctx) => {
    const data = ctx.getData();
    return {
      requestData: data,
    };
  },
});