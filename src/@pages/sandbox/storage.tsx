import Button from "#/components/elements/button";
import Divider from "#/components/elements/divider";
import ToggleBox from "#/components/elements/form-items/toggle-box";
import Text from "#/components/elements/text";
import Row from "#/components/elements/row";
import { useLocalState, useSessionState } from "#/hooks/storage";
import type { NextPage } from "next";
import { useState } from "react";

const Page: NextPage = () => {
  const [autoSave, setAutoSave] = useState(true);
  const session = useSessionState("session", () => 3, { autoSave });
  const local = useLocalState("local", () => 3);

  return (
    <div className="flex-stretch p-1">
      <Row>
        <ToggleBox
          $value={autoSave}
          $onChange={v => setAutoSave(v!)}
        >
          Auto save
        </ToggleBox>
      </Row>
      <Divider className="my-1" />
      <Row className="gap-1">
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