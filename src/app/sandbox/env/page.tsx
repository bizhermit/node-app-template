import Divider from "#/client/elements/divider";
import EnvClient from "@/sandbox/env/_components/client";
import EnvServer from "@/sandbox/env/_components/server";

const Page = () => {
  return (
    <div className="flex column p-s g-m">
      <EnvServer />
      <Divider />
      <EnvClient />
    </div>
  );
};

export default Page;