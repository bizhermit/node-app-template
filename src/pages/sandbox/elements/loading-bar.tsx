import LoadingBar, { ScreenLoadingBar } from "@/components/elements/loading-bar";
import Row from "@/components/elements/row";
import { colors } from "@/utilities/sandbox";
import { NextPage } from "next";

const Page: NextPage = () => {
  return (
    <div className="flex-box flex-stretch w-100">
      <h1>LoadingBar</h1>
      <section>
        <h2>position</h2>
        <ScreenLoadingBar />
      </section>
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