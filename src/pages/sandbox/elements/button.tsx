import Button from "@/components/elements/button";
import Form from "@/components/elements/form";
import TextBox from "@/components/elements/form-items/text-box";
import Row from "@/components/templates/row";
import { NextPage } from "next";
import { CSSProperties } from "react";
import { VscCloudDownload } from "react-icons/vsc";

const colors: Array<Color> = [
  "base",
  "pure",
  "dull",
  "border",
  "shadow",
  "mask",
  "input",
  "error",
  "main",
  "main-light",
  "main-dark",
  "sub",
  "sub-light",
  "sub-dark",
  "primary",
  "secondary",
  "tertiary",
  "warning",
  "danger",
  "cool",
  "pretty",
];
const style: CSSProperties = {
  width: 200
};

const Page: NextPage = () => {
  return (
    <div className="flex-box p-1">
      <h1>Button</h1>
      <section>
        <h2>click event</h2>
        <Row className="gap-1">
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
          <Row className="gap-1">
            <TextBox $required name="text-box" />
            <Button type="submit">submit</Button>
            <Button type="button">button</Button>
            <Button type="reset">reset</Button>
          </Row>
        </Form>
      </section>
      <section>
        <h2>size</h2>
        <Row className="gap-1">
          <Button $size="xs">X Small</Button>
          <Button $size="s">Small</Button>
          <Button $size="m">Medium</Button>
          <Button $size="l">Large</Button>
          <Button $size="xl">X Large</Button>
        </Row>
        <Row className="gap-1 mt-1">
          <Button $icon={<VscCloudDownload size="1.6rem" />} $size="xs">X Small</Button>
          <Button $icon={<VscCloudDownload size="1.8rem" />} $size="s">Small</Button>
          <Button $icon={<VscCloudDownload />} $size="m">Medium</Button>
          <Button $icon={<VscCloudDownload size="2.5rem" />} $size="l">Large</Button>
          <Button $icon={<VscCloudDownload size="3rem" />} $size="xl">X Large</Button>
        </Row>
      </section>
      <section>
        <h2>color</h2>
        <Row className="pt-1 gap-1">
          <Button style={style}>button</Button>
          <Button $outline style={style}>outline</Button>
          <span className={`pt-t fgc-base`}>color</span>
          <span className={`pt-t fgc-bse_r`}>color</span>
        </Row>
        {colors.map(color => {
          return (
            <Row key={color} className="pt-1 gap-1">
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
export default Page;