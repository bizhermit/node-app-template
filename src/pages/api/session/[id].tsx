import apiHandler from "@/utilities/api-handler";

export default apiHandler({
  get: async (ctx) => {
    const query = ctx.getQuery();
    const id = query.id;
    return {
      id,
    };
  },
})