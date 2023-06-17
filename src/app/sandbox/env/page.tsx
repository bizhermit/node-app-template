import Divider from "#/components/elements/divider";
import EnvClient from "@/sandbox/env/_components/client";
import EnvServer from "@/sandbox/env/_components/server";

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