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
      data: dataItem(),
    },
  },
  get: async (ctx) => {
    const data = ctx.getData();
    return {
      data: data,
    };
  },
});