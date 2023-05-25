import arrayItem from "@/data-items/_base/array";
import numberItem from "@/data-items/_base/number";
import stringItem from "@/data-items/_base/string";
import apiHandler from "@/utilities/api-handler/types";

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