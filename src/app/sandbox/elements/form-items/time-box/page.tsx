import Divider from "#/client/elements/divider";
import TimeBox from "#/client/elements/form/items/time-box";
import TimeBoxClient from "./_components/client";

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