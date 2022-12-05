import Badge from "@/components/elements/badge";
import { NextPage } from "next";

const Page: NextPage = () => {
  return (
    <div className="flex-box flex-start p-1 w-100 h-100">
      <div className="c-primary" style={{ height: 300, width: 300, position: "relative" }}>
        <Badge>0</Badge>
      </div>
    </div>
  )
};

export default Page;