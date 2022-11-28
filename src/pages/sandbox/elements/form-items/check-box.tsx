import CheckBox from "@/components/elements/form-items/check-box";
import { NextPage } from "next";

const Page: NextPage = () => {
  return (
    <div className="flex-box flex-start p-1">
      <CheckBox
        // $messageDisplayMode="bottom"
      />
      <CheckBox
        $placeholder="CheckBox"
      />
    </div>
  );
};

export default Page;