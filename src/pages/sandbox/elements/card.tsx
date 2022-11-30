import Card from "@/components/elements/card";
import Divider from "@/components/elements/divider";
import ToggleBox from "@/components/elements/form-items/toggle-box";
import { NextPage } from "next";
import { useState } from "react";

const Page: NextPage = () => {
  const [disabled, setDisabled] = useState(false);

  return (
    <div className="flex-box flex-start p-1 w-100 h-100 gap-1">
      <div>
        <ToggleBox
          $tag="disabled"
          $value={disabled}
          $onChange={v => setDisabled(v!)}
        />
      </div>
      <Divider className="py-1" />
      <Card
        className="w-100"
        $accordion
        $disabled={disabled}
        $color="main"
        // $iconPosition="end"
        // $headerAlign="center"
        // $footerAlign="center"
        $toggleTriger="h&f"
      >
        Header
        <div className="p-3">
          Content
        </div>
        Footer
      </Card>
      <Card
        className="flex-1"
        $color="main"
        $accordion
        $disabled={disabled}
        $direction="horizontal"
      >
        Header
        <div className="p-3">
          Content
        </div>
        Footer
      </Card>
    </div>
  );
};

export default Page;