"use client";

import Button from "#/client/elements/button";
import Form from "#/client/elements/form";
import TextBox from "#/client/elements/form/items/text-box";
import { CloudDownloadIcon } from "#/client/elements/icon";
import Row from "#/client/elements/row";
import Text from "#/client/elements/text";
import { colors } from "#/utilities/sandbox";
import type { CSSProperties } from "react";

const style: CSSProperties = {
  width: 200
};

const ButtonClient = () => {
  return (
    <div className="flex p-xs">
      <h1>Button</h1>
      <section>
        <h2>click event</h2>
        <Row className="g-s">
          <Button
            $onClick={(_, e) => {
              console.log("click sync", e);
            }}
          >
            click sync
          </Button>
          <Button
            $onClick={async (unlock, e) => {
              console.log("click async", e);
              setTimeout(() => {
                unlock();
              }, 2000);
            }}
          >
            click async
          </Button>
        </Row>
      </section>
      <section>
        <h2>form button</h2>
        <Form
          $onSubmit={() => {
            console.log("submit");
          }}
        // $bind={{}}
        >
          <Row className="g-s">
            <TextBox $required name="text-box" />
            <Button type="submit">submit</Button>
            <Button type="button">button</Button>
            <Button type="reset">reset</Button>
          </Row>
        </Form>
      </section>
      <section className="flex g-s">
        <h2>size</h2>
        <Row className="g-s">
          <Button $size="xs">X Small</Button>
          <Button $size="s">Small</Button>
          <Button $size="m">Medium</Button>
          <Button $size="l">Large</Button>
          <Button $size="xl">X Large</Button>
        </Row>
        <Row className="g-s mt-xs">
          <Button $icon={<CloudDownloadIcon />} $size="xs">X Small</Button>
          <Button $icon={<CloudDownloadIcon />} $size="s">Small</Button>
          <Button $icon={<CloudDownloadIcon />} $size="m">Medium</Button>
          <Button $icon={<CloudDownloadIcon />} $size="l">Large</Button>
          <Button $icon={<CloudDownloadIcon />} $size="xl">X Large</Button>
        </Row>
        <Row className="g-s mt-xs">
          <Button $icon={<CloudDownloadIcon />} $size="xs" $round />
          <Button $icon={<CloudDownloadIcon />} $size="s" $round />
          <Button $icon={<CloudDownloadIcon />} $size="m" $round />
          <Button $icon={<CloudDownloadIcon />} $size="l" $round />
          <Button $icon={<CloudDownloadIcon />} $size="xl" $round />
        </Row>
        <div className="flex row g-s">
          <Button
            $size="s"
            className="fs-xl"
            $icon={<CloudDownloadIcon />}
          >
            custom font size
          </Button>
          <Button
            $round
          >
            round
          </Button>
          <Button $fitContent>fit</Button>
          <Button $noPadding $fitContent>
            <div className="flex p-s">
              <Text>hoge</Text>
              <Text>fuga</Text>
              <Text>piyo</Text>
            </div>
          </Button>
        </div>
      </section>
      <section className="flex g-s">
        <h2>color</h2>
        <Row className="pt-s g-s">
          <Button style={style}>button</Button>
          <Button $outline style={style}>outline</Button>
          <span className={`pt-t fgc-base`}>color</span>
          <span className={`pt-t fgc-bse_r`}>color</span>
        </Row>
        {colors.map(color => {
          return (
            <Row key={color} className="pt-s g-s">
              <Button $color={color} style={style}>{color}</Button>
              <Button $color={color} $outline style={style}>{color}</Button>
              <span className={`pt-t fgc-${color}`}>{color}</span>
              <span className={`pt-t fgc-${color}_r`}>{color}</span>
            </Row>
          );
        })}
      </section>
    </div>
  );
};
export default ButtonClient;