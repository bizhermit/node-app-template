"use client";

import Button from "#/client/elements/button";
import RadioButtons from "#/client/elements/form/items/radio-buttons";
import SelectBox from "#/client/elements/form/items/select-box";
import ToggleBox from "#/client/elements/form/items/toggle-box";
import Loading from "#/client/elements/loading";
import useLoading from "#/client/elements/loading/context";
import { colors } from "#/utilities/sandbox";
import BaseLayout, { BaseRow } from "@/dev/_components/base-layout";
import ControlLayout, { ControlItem } from "@/dev/_components/control-layout";
import { useState } from "react";

const Page = () => {
  const loading = useLoading();
  const [appearance, setAppearance] = useState<"bar" | "circle">();
  const [show, setShow] = useState(false);
  const [mask, setMask] = useState(false);
  const [color, setColor] = useState<Color>();
  const [absolute, setAbsolute] = useState(false);

  return (
    <BaseLayout title="Loading">
      <ControlLayout>
        <ControlItem caption="layout">
          <RadioButtons
            $allowNull
            $unselectable
            $value={appearance}
            $onChange={v => setAppearance(v!)}
            $source={[
              { value: "bar", label: "Bar" },
              { value: "circle", label: "Circle" },
            ]}
          />
        </ControlItem>
        <ControlItem caption="mask">
          <ToggleBox
            $value={mask}
            $onChange={v => {
              setMask(v!);
              if (v) setShow(false);
            }}
          />
        </ControlItem>
        <ControlItem caption="absolute">
          <ToggleBox
            $value={absolute}
            $onChange={v => {
              setAbsolute(v!);
              if (v) setShow(false);
            }}
          />
        </ControlItem>
        <ControlItem caption="color">
          <SelectBox
            style={{ width: "20rem" }}
            $value={color}
            $onChange={v => setColor(v!)}
            $source={colors.map(color => {
              return { value: color, label: color };
            })}
          />
        </ControlItem>
        <ControlItem caption="toggle">
          <BaseRow>
            <Button
              $fitContent
              onClick={() => {
                setShow(true);
                if (mask) {
                  setTimeout(() => {
                    setShow(false);
                  }, 5000);
                }
              }}
            >
              show
            </Button>
            <Button
              $fitContent
              onClick={() => setShow(false)}
            >
              hide
            </Button>
          </BaseRow>
        </ControlItem>
        <ControlItem caption="hook">
          <BaseRow>
            <Button
              $fitContent
              onClick={() => {
                loading.show();
              }}
            >
              show
            </Button>
            <Button
              $fitContent
              onClick={() => {
                loading.hide();
              }}
            >
              hide
            </Button>
          </BaseRow>
        </ControlItem>
      </ControlLayout>
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "200vh",
          background: "linear-gradient(-225deg, var(--c-primary) 0%, var(--c-tertiary) 100%)",
        }}
      >
        {show &&
          <Loading
            $appearance={appearance}
            $mask={mask}
            $color={color}
            $absolute={absolute}
          />
        }
      </div>
    </BaseLayout>
  );
};

export default Page;