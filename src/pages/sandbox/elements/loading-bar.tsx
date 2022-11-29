import LoadingBar from "@/components/elements/loading-bar";
import Row from "@/components/elements/row";
import { colors } from "@/utilities/sandbox";
import { NextPage } from "next";

const Page: NextPage = () => {
  return (
    <div className="flex-box flex-start">
      <h1>LoadingBar</h1>
      <section>
        <h2>color</h2>
        {colors.map(color => {
          return (
            <Row key={color} className="p-1">
              <LoadingBar $color={color} />
              <span>{color}</span>
            </Row>
          );
        })}
      </section>
    </div>
  );
};

export default Page;