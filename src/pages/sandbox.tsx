import { NextPage } from "next";
import Link from "next/link";
import Button from "@/components/elements/button";
import { VscCloudDownload } from "react-icons/vsc";
import Form from "@/components/elements/form";

const Page: NextPage = () => {
  return (
    <div className="flex-box">
      <span>sandbox</span>
      <Link href="/">index</Link>
      <Form
        // $disabled
        onSubmit={async () => {
          await new Promise<void>(resolve => {
            setTimeout(resolve, 2000);
          })
        }}
      >
        <Button
          className="mt-1 ml-2"
          type="submit"
          $round
          $outline
          $icon={<VscCloudDownload />}
          $iconPosition="left"
        >
          BUTTON
        </Button>
      </Form>
    </div>
  );
};

export default Page;