import Button from "@/components/elements/button";
import RadioButtons from "@/components/elements/form-items/radio-buttons";
import Loading, { ScreenLoading, useLoading } from "@/components/elements/loading";
import Row from "@/components/elements/row";
import { colors } from "@/utilities/sandbox";
import { NextPage } from "next";
import { useState } from "react";

const Page: NextPage = () => {
  const loading = useLoading();
  const [appearance, setAppearance] = useState<"bar" | "circle">("circle");

  return (
    <div className="flex-stretch w-100 p-1">
      <h1>Loading</h1>
      <section>
        <h2>appearance</h2>
        <RadioButtons
          $value={appearance}
          $onChange={v => setAppearance(v!)}
          $source={[
            { value: "bar", label: "Bar" },
            { value: "circle", label: "Circle" },
          ]}
        />
      </section>
      <section>
        <h2>position</h2>
        {/* <ScreenLoadingBar /> */}
        <Row className="gap-1">
          <Button
            $onClick={() => {
              loading.show();
            }}
          >
            show
          </Button>
          <Button
            $onClick={() => {
              loading.hide();
            }}
          >
            hide
          </Button>
          <span>{loading.loading}</span>
        </Row>
      </section>
      <Loading
        $appearance={appearance}
        $color="main"
      />
      <section>
        <h2>color</h2>
        {colors.map(color => {
          return (
            <div key={color} style={{ height: "10rem" }}>
              <Row className="p-1 mt-1">
                <Loading $color={color} $appearance={appearance} />
                <span>{color}</span>
              </Row>
              <Row className={`p-1 c-${color}`}>
                <Loading $color={color} $reverseColor $appearance={appearance} />
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