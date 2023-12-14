"use client";

import Button from "#/client/elements/button";
import useMessageBox from "#/client/elements/message-box";
import Popup from "#/client/elements/popup";
import BaseLayout, { BaseRow, BaseSheet } from "@/dev/_components/base-layout";
import { useRef, useState } from "react";

const Page = () => {
  const [show, setShow] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null!);
  const dialogRef = useRef<HTMLDialogElement>(null!);
  const contentRef = useRef<HTMLDivElement>(null!);
  const msgBox = useMessageBox();

  const onClick = () => {
    // setShow(true);
    dialogRef.current?.showModal();
    // msgBox.alert("hogehoge");
  };

  return (
    <BaseLayout title="Popup">
      <BaseSheet>
        <BaseRow>
          <Button
            onClick={() => {
              msgBox.alert("!hogehoge!");
            }}
          >
            alert
          </Button>
          <Button
            // ref={anchorRef}
            onClick={onClick}
          >
            show
          </Button>
        </BaseRow>
        <dialog
          ref={dialogRef}
        >
          <div
            style={{
              background: "var(--c-pure)",
              height: "20rem",
              width: "20rem",
              top: 0,
              left: 0,
            }}
          >
            Popup
          </div>
        </dialog>
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
            background: "var(--c-dull)",
            height: "100vh",
            width: "100%",
          }}
        />
        <div>
          <Button
            // ref={anchorRef}
            onClick={onClick}
          >
            show
          </Button>
          <Button
            onClick={() => {
              msgBox.alert("!hogehoge!");
            }}
          >
            alert
          </Button>
        </div>
      </BaseSheet>
    </BaseLayout>
  );
};

export default Page;