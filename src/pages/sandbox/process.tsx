import Button from "@/components/elements/button";
import Loading from "@/components/elements/loading";
import Row from "@/components/elements/row";
import Text from "@/components/elements/text";
import useProcess from "@/hooks/process";
import type { NextPage } from "next";
import { useState } from "react";

const Page: NextPage = () => {
  const process = useProcess();
  const [last, setLast] = useState<number>();
  const [count, setCount] = useState(0);

  const func = async (c: number, wait?: boolean, key?: string) => {
    try {
      const ret = await process(async () => {
        console.log("process", c);
        await new Promise<void>(resolve => {
          setTimeout(resolve, 2000);
        });
        // if (count % 3 === 2) throw new Error("world of nabeatsu");
        return c;
      }, {
        key: key ?? "process1",
        // wait,
        // wait: "keyUnique",
        // wait: "keyMonopoly",
        // wait: count % 3 !== 2,
        // killRunning: !wait,
        // killAll: !wait,
        // cutIn: !wait,
        // cutIn: true,
        then: (ret) => {
          console.log("p:done", ret);
        },
        blocked: (context) => {
          console.log("p:blocked", c, context);
        },
        killed: () => {
          console.log("p:killed", c);
        },
        canceled: () => {
          console.log("p:canceled", c);
        },
        catch: (err) => {
          console.log("p:catch", c);
        },
        finally: (succeeded) => {
          console.log("p:finally", c, succeeded);
        },
        done: (succeeded) => {
          console.log("p:done", c, succeeded);
        },
      });
      setLast(ret);
      console.log("done", ret);
    } catch (e) {
      console.log("error", c);
    } finally {
      console.log("finally", c);
    }
  };

  return (
    <div className="flex-start p-2 gap-2">
      {process.ing && <Loading />}
      <Text>processing: {String(process.ing)}</Text>
      <Text>last: {last}</Text>
      <Row className="gap-2">
        <Button
          $onClick={() => {
            setCount(count + 1);
            func(count + 1);
          }}
        >
          add sync process
        </Button>
        <Button
          $onClick={() => {
            setCount(count + 1);
            func(count + 1, true);
          }}
        >
          add wait process
        </Button>
        <Button
          $onClick={() => {
            setCount(count + 1);
            func(count + 1, true, "process2");
          }}
        >
          add wait process as other key
        </Button>
        <Text>{count}</Text>
      </Row>
      <Row className="gap-2">
        <Button
          $onClick={() => {
            console.log("cancel", process.cancel());
          }}
        >
          cancel waiting
        </Button>
        <Button
          $onClick={() => {
            console.log("kill: ", process.kill());
          }}
        >
          kill running process
        </Button>
        <Button
          $onClick={() => {
            console.log("kill all: ", process.kill(true));
          }}
        >
          kill running process & cancel waiting
        </Button>
      </Row>
    </div>
  );
};

export default Page;