import StructView from "#/components/elements/struct-view";
import type { NextPage } from "next";

const Page: NextPage = (props) => {
  return (
    <div className="flex-stretch">
      <StructView
        $value={props}
      />
    </div>
  );
};

Page.getInitialProps = async (ctx) => {
  return process.env;
};

export default Page;