import arrayItem from "@/data-items/_base/array";
import dataItem from "@/data-items/_base";
import numberItem from "@/data-items/_base/number";
import stringItem from "@/data-items/_base/string";
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