import Row from "@/components/templates/row";
import ArrayUtils from "@bizhermit/basic-utils/dist/array-utils";
import { NextPage } from "next";
import Link from "next/link";

const Page: NextPage = () => {
  return (
    <div className="flex-box">
      <div className="p-1">index</div>
      <Link href="/sandbox">sandbox</Link>
      {ArrayUtils.generateArray(100, idx => {
        return <Row key={idx}>{idx}</Row>
      })}
    </div>
  );
};

export default Page;