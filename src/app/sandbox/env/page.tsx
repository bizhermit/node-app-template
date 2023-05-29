import Divider from "#/components/elements/divider";
import EnvClient from "@/sandbox/env/client";
import EnvServer from "@/sandbox/env/server";

const Page = () => {
  return (
    <div className="flex-stretch p-2 gap-2">
      <EnvServer />
      <Divider />
      <EnvClient />
    </div>
  );
};

export default Page;