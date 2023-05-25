import type { NextPage } from "next";
import ArrayUtils from "@bizhermit/basic-utils/dist/array-utils";

const Page: NextPage = () => {
  return (
    <div className="flex-start">
      <div className="p-1">index</div>
      <NextLink href="/sandbox">sandbox</NextLink>
      {ArrayUtils.generateArray(100, idx => {
        return <Row key={idx}>{idx}</Row>;
      })}
    </div>
  );
};

export default Page;