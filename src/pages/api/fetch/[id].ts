import { arrayItem, numberItem, stringItem } from "@/data-items/data-item-wrapper";
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
  },
  get: async (ctx) => {
    const data = ctx.getData();
    return data;
  },
});