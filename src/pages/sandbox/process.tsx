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

  const func = async (c: number) => {
    try {
      const ret = await process(async () => {
        console.log("process", c);
        await new Promise<void>(resolve => {
          setTimeout(resolve, 1000);
        });
        // if (count % 3 === 2) throw new Error("world of nabeatsu");
        setLast(c);
        return c;
      }, {
        // wait: true,
        wait: count % 3 !== 2,
      });
      console.log("done", ret);
    } catch (e) {
      console.log("error", c, e);
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
            // setCount(count + 2);
            // func(count + 2);
          }}
        >
          add process: {count}
        </Button>
        <Button
          $onClick={() => {
            console.log("clear", process.clear());
          }}
        >
          clear queue
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
          kill all process
        </Button>
      </Row>
    </div>
  );
};

export default Page;