import Badge from "#/components/elements/badge";
import Button from "#/components/elements/button";
import Divider from "#/components/elements/divider";
import RadioButtons from "#/components/elements/form-items/radio-buttons";
import Row from "#/components/elements/row";
import { sizes } from "#/utilities/sandbox";
import type { NextPage } from "next";
import { useState } from "react";

const Page: NextPage = () => {
  const [count, setCount] = useState(99);
  const [size, setSize] = useState<Size>("m");

  return (
    <div className="flex-start p-2 w-100 h-100 gap-1">
      <Row className="gap-1">
        <Button $onClick={() => setCount(c => c+1)}>count up</Button>
        <Button $onClick={() => setCount(0)} $outline>reset</Button>
        <RadioButtons
          $source={sizes.map(size => {
            return { value: size, label: size };
          })}
          $value={size}
          $onChange={v => setSize(v!)}
        />
      </Row>
      <Divider />
      <Row className="gap-1">
        <div className="anchor c-primary">
          <Badge
            className="c-base e-4 round"
            $position="left-top"
            $size={size}
          >
            {count}
          </Badge>
        </div>
        <div className="anchor c-primary">
          <Badge
            className="c-base e-4 round"
            $position="right-top"
            $size={size}
          >
            {count}
          </Badge>
        </div>
      </Row>
      <Row className="gap-1">
        <div className="anchor c-primary">
          <Badge
            className="c-base e-4 round"
            $position="left-bottom"
            $size={size}
          >
            {count}
          </Badge>
        </div>
        <div className="anchor c-primary">
          <Badge
            className="c-base e-4 round"
            $position="right-bottom"
            $size={size}
          >
            {count}
          </Badge>
        </div>
      </Row>
      <style jsx>{`
        .anchor {
          position: relative;
          height: 20rem;
          width: 20rem;
        }
      `}</style>
    </div>
  );
};

export default Page;