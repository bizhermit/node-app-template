"use client";

import Button from "#/client/elements/button";
import Text from "#/client/elements/text";
import useWindow from "#/client/hooks/window-open";
import { windowOpen } from "#/client/utilities/window-open";
import { useState } from "react";

const Page = () => {
  const [count, setCount] = useState(0);

  return (
    <div className="flex g-m p-m">
      <div className="flex row middle g-m">
        <Button
          $onClick={() => {
            setCount(c => c + 1);
          }}
        >
          update component
        </Button>
        <Text>{count}</Text>
      </div>
      <Component key={count} />
    </div>
  );
};

const Component = () => {
  const win = useWindow();

  return (
    <div className="flex g-m p-m">
      <Button
        $onClick={() => {
          const w = windowOpen("/sandbox");
          setTimeout(() => {
            w.replace("/sandbox/window");
          }, 3000);
        }}
      >
        open (scope)
      </Button>
      <div className="flex row g-m">
        <Button
          $onClick={() => {
            const w = win.open("/sandbox?mode=hook");
            setTimeout(() => {
              w.window.replace("/sandbox/window?mode=hook");
            }, 3000);
          }}
        >
          open (hook)
        </Button>
        <Button
          $onClick={() => {
            win.open("/sandbox?mode=unmount", { closeWhenUnmount: true });
          }}
        >
          open (hook-unmount)
        </Button>
        <Button
          $onClick={() => {
            win.open("/sandbox?mode=tab", { closeWhenTabClose: true });
          }}
        >
          open (hook-tab)
        </Button>
      </div>
      <div className="flex row g-m">
        <Button
          $onClick={() => {
            win.close();
          }}
        >
          close
        </Button>
        <Button
          $onClick={() => {
            win.close("unmount");
          }}
        >
          close (hook-unmount)
        </Button>
        <Button
          $onClick={() => {
            win.close("tab");
          }}
        >
          close (hook-tab)
        </Button>
        <Button
          $onClick={() => {
            win.close("all");
          }}
        >
          close all
        </Button>
      </div>
    </div>
  );
};

export default Page;