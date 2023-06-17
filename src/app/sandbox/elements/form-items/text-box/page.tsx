import Divider from "#/components/elements/divider";
import TextBox from "#/components/elements/form/items/text-box";
import TextBoxClient from "@/sandbox/elements/form-items/text-box/client";

const Page = () => {
  return (
    <>
      <TextBox />
      <Divider />
      <TextBoxClient />
    </>
  );
};

export default Page;