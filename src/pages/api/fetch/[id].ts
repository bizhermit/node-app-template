import apiHandler from "@/utilities/api-handler";

const pathname = "/fetch/[id]";

export default apiHandler<typeof pathname>({
  get: async (ctx) => {
    const query = ctx.getArgs();
    const id = query.id;
    return {
      id,
    };
  },
});