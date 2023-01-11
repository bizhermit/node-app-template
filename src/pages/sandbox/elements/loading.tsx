import Button from "@/components/elements/button";
import Loading, { ScreenLoading, useLoadingBar } from "@/components/elements/loading";
import Row from "@/components/elements/row";
import { colors } from "@/utilities/sandbox";
import { NextPage } from "next";

const Page: NextPage = () => {
  const loadingBar = useLoadingBar();

  return (
    <div className="flex-stretch w-100 p-1">
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
            <div key={color}>
              <Row className="p-1 mt-1">
                <Loading $color={color} />
                <span>{color}</span>
              </Row>
              <Row className={`p-1 c-${color}`}>
                <Loading $color={color} $reverseColor />
                <span>{color} reverse</span>
              </Row>
            </div>
          );
        })}
      </section>
    </div>
  );
};

export default Page;