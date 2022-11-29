import Button from "@/components/elements/button";
import LoadingBar, { ScreenLoadingBar, useLoadingBar } from "@/components/elements/loading-bar";
import Row from "@/components/elements/row";
import { colors } from "@/utilities/sandbox";
import { NextPage } from "next";

const Page: NextPage = () => {
  const loadingBar = useLoadingBar();

  return (
    <div className="flex-box flex-stretch w-100 p-1">
      <h1>LoadingBar</h1>
      <section>
        <h2>position</h2>
        {/* <ScreenLoadingBar /> */}
        <Row className="gap-1">
          <Button
            $onClick={() => {
              loadingBar.show();
            }}
          >
            show
          </Button>
          <Button
            $onClick={() => {
              loadingBar.hide();
            }}
          >
            hide
          </Button>
          <span>{loadingBar.showed}</span>
        </Row>
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