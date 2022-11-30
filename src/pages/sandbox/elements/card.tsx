import Card from "@/components/elements/card";
import { NextPage } from "next";

const Page: NextPage = () => {
  return (
    <div className="flex-box flex-stretch p-1">
      <Card
        $accordion
      >
        <div>Header</div>
        <div className="p-1">
          Content
        </div>
        <div>Footer</div>
      </Card>
    </div>
  );
};

export default Page;