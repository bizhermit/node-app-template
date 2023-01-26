import Button from "@/components/elements/button";
import Row from "@/components/elements/row";
import { useSessionState } from "@/hooks/storage";
import { NextPage } from "next";

const Page: NextPage = () => {
  const session = useSessionState("session", () => 10, { autoSave: true });

  return (
    <div className="flex-stretch p-1">
      <Row className="gap-1">
        <Button
          $onClick={() => {
            console.log("count up");
            session[1]((cur) => {
              return cur + 1;
            });
          }}
        >
          count up {session[0]}
        </Button>
        <Button
          $onClick={() => {
            console.log("reset");
            session[1](0);
          }}
        >
          reset
        </Button>
        <Button
          $onClick={() => {
            console.log("save");
            session[2].save();
          }}
        >
          save
        </Button>
      </Row>
    </div>
  );
};

export default Page;