import { NextPage } from "next";
import Link from "next/link";
import Button from "@/components/elements/button";
import { VscCloudDownload } from "react-icons/vsc";

const Page: NextPage = () => {
  return (
    <div className="flex-box">
      <span>sandbox</span>
      <Link href="/">index</Link>
      <Button
        className="mt-1 ml-2"
        $round
        $outline
        $icon={<VscCloudDownload />}
        $iconPosition="left"
        onClick={() => {
          console.log("click");
        }}
      >
        BUTTON
      </Button>
    </div>
  );
};

export default Page;