"use client";

import Badge from "#/client/elements/badge";
import Button from "#/client/elements/button";
import Divider from "#/client/elements/divider";
import RadioButtons from "#/client/elements/form/items/radio-buttons";
import Row from "#/client/elements/row";
import { sizes } from "#/utilities/sandbox";
import { useState } from "react";

const BadgeClient = () => {
  const [count, setCount] = useState(99);
  const [size, setSize] = useState<Size>("m");

  return (
    <div className="flex p-s w-100 h-100 g-s">
      <Row className="g-s">
        <Button onClick={() => setCount(c => c+1)}>count up</Button>
        <Button onClick={() => setCount(0)} $outline>reset</Button>
        <RadioButtons
          $source={sizes.map(size => {
            return { value: size, label: size };
          })}
          $value={size}
          $onChange={v => setSize(v!)}
        />
      </Row>
      <Divider />
      <Row className="g-s">
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
            $round
          >
            {count}
          </Badge>
        </div>
      </Row>
      <Row className="g-s">
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

export default BadgeClient;