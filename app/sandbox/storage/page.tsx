"use client";

import Button from "#/client/elements/button";
import Divider from "#/client/elements/divider";
import ToggleBox from "#/client/elements/form/items/toggle-box";
import Row from "#/client/elements/row";
import Text from "#/client/elements/text";
import { useLocalState, useSessionState } from "#/client/hooks/storage";
import { useState } from "react";

const Page = () => {
  const [autoSave, setAutoSave] = useState(true);
  const session = useSessionState("session", () => 3, { autoSave });
  const local = useLocalState("local", () => 3);

  return (
    <div className="flex column p-xs">
      <Row>
        <ToggleBox
          $value={autoSave}
          $onChange={v => setAutoSave(v!)}
        >
          Auto save
        </ToggleBox>
      </Row>
      <Divider className="my-xs" />
      <Row className="g-s">
        <Button
          $onClick={() => {
            console.log("count up");
            session[1]((cur) => {
              return cur + 1;
            });
            local[1]((cur) => cur + 1);
          }}
        >
          <Text>
            count up {session[0]}/{local[0]}
          </Text>
        </Button>
        <Button
          $onClick={() => {
            console.log("reset");
            session[1](0);
            local[1](0);
          }}
        >
          reset
        </Button>
        <Button
          $onClick={() => {
            console.log("save");
            session[2].save();
            local[2].save();
          }}
        >
          save
        </Button>
        <Button
          $onClick={() => {
            console.log("clear");
            session[2].clear();
            local[2].clear();
          }}
        >
          clear
        </Button>
      </Row>
    </div>
  );
};

export default Page;