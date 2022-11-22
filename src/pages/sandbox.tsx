import { NextPage } from "next";
import Link from "next/link";

const Page: NextPage = () => {
  return (
    <div className="flex-box">
      <span>sandbox</span>
      <Link href="/">index</Link>
    </div>
  );
};

export default Page;