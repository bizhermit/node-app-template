import Divider from "#/client/elements/divider";
import TextBox from "#/client/elements/form/items/text-box";
import TextBoxClient from "./_components/client";

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