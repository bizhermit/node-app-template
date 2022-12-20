import apiHandler from "@/utilities/api-handler";

export default apiHandler({
  get: async (ctx) => {
    const query = ctx.getQuery<{ id: string; }>();
    const id = query.id;
    return {
      id,
    };
  },
})