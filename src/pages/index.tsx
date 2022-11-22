import { NextPage } from "next";
import Link from "next/link";

const Page: NextPage = () => {
  return (
    <div className="flex-box">
      <div className="p-1">index</div>
      <Link href="/sandbox">sandbox</Link>
    </div>
  );
};

export default Page;