import Divider from "#/client/elements/divider";
import CheckBox from "#/client/elements/form/items/check-box";
import CheckBoxClient from "./_components/client";

const Page = () => {
  return (
    <>
      <CheckBox>client</CheckBox>
      <Divider />
      <CheckBoxClient />
    </>
  );
};

export default Page;