import Divider from "#/components/elements/divider";
import TimeBox from "#/components/elements/form/items/time-box";
import TimeBoxClient from "@/sandbox/elements/form-items/time-box/client";

const Page = () => {
  return (
    <>
      <TimeBox />
      <Divider />
      <TimeBoxClient />
    </>
  );
};

export default Page;