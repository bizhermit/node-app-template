"use client";

import Button from "#/client/elements/button";
import Popup from "#/client/elements/popup";
import BaseLayout, { BaseSheet } from "@/dev/_components/base-layout";
import ControlLayout from "@/dev/_components/control-layout";
import { useRef, useState } from "react";

const Page = () => {
  const [show, setShow] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null!);

  return (
    <BaseLayout title="Popup">
      <ControlLayout>

      </ControlLayout>
      <BaseSheet>
        <div>
          <Button
            // ref={anchorRef}
            $onClick={() => {
              setShow(true);
            }}
          >
            show
          </Button>
        </div>
        <Popup
          $show={show}
          $onToggle={setShow}
          $mask
          $closeWhenClick
        >
          <div
            style={{
              background: "var(--c-pure)",
              height: "20rem",
              width: "20rem",
            }}
          >
            Popup
          </div>
        </Popup>
        <div
          style={{
            background: "var(--c-main)",
            height: "100vh",
            width: "100%",
          }}
        />
        <div>
          <Button
            // ref={anchorRef}
            $onClick={() => {
              setShow(true);
            }}
          >
            show
          </Button>
        </div>
      </BaseSheet>
    </BaseLayout>
  );
};

export default Page;