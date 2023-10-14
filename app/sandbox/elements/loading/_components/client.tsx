"use client";

import Button from "#/client/elements/button";
import RadioButtons from "#/client/elements/form/items/radio-buttons";
import Loading from "#/client/elements/loading";
import useLoading from "#/client/elements/loading/context";
import Row from "#/client/elements/row";
import { useState } from "react";

const LoadingClient = () => {
  const loading = useLoading();
  const [appearance, setAppearance] = useState<"bar" | "circle">("bar");
  const [show, setShow] = useState(false);

  return (
    <div className="flex-top w-100 p-xs">
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
        <h2>provider</h2>
        {/* <ScreenLoadingBar /> */}
        <Row className="g-s">
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
      <section>
        <h2>show mask loading</h2>
        <Button $onClick={() => setShow(true)}>show</Button>
        {show &&
          <Loading
            $appearance={appearance}
            $color="main"
            $mask
          >
            <div className="flex column center middle h-100">
              <Button $onClick={() => setShow(false)}>hide</Button>
            </div>
          </Loading>
        }
      </section>
      {/* <section>
        <h2>color</h2>
        {colors.map(color => {
          return (
            <div key={color} style={{ height: "10rem" }}>
              <Row className="p-xs mt-xs">
                <Loading $color={color} $appearance={appearance} />
                <span>{color}</span>
              </Row>
              <Row className={`p-xs c-${color}`}>
                <Loading $color={color} $reverseColor $appearance={appearance} />
                <span>{color} reverse</span>
              </Row>
            </div>
          );
        })}
      </section> */}
    </div>
  );
};

export default LoadingClient;