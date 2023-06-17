import Divider from "#/components/elements/divider";
import CheckBox from "#/components/elements/form/items/check-box";
import CheckBoxClient from "@/sandbox/elements/form-items/check-box/client";

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