import arrayItem from "@/data-items/array";
import dataItem from "@/data-items/data-item";
import numberItem from "@/data-items/number";
import stringItem from "@/data-items/string";
import apiHandler from "@/utilities/api-handler";

export default apiHandler({
  $get: {
    req: {
      id: numberItem(),
      hoge: stringItem(),
      fuga: arrayItem({
        item: stringItem(),
      }),
    },
    res: {
      requestData: dataItem(),
    },
  },
  get: async (ctx) => {
    const data = ctx.getData();
    return {
      requestData: data,
    };
  },
});