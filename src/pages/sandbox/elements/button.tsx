import Button from "@/components/elements/button";
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
    <div className="flex-box">
      <section>
        <caption>Size</caption>
        <Row className="gap-2 p-1">
          <Button $size="xs">X Small</Button>
          <Button $size="s">Small</Button>
          <Button $size="m">Medium</Button>
          <Button $size="l">Large</Button>
          <Button $size="xl">X Large</Button>
        </Row>
        <Row className="gap-2 p-1">
          <Button $icon={<VscCloudDownload size="1.6rem" />} $size="xs">X Small</Button>
          <Button $icon={<VscCloudDownload size="1.8rem" />} $size="s">Small</Button>
          <Button $icon={<VscCloudDownload />} $size="m">Medium</Button>
          <Button $icon={<VscCloudDownload size="2.5rem" />} $size="l">Large</Button>
          <Button $icon={<VscCloudDownload size="3rem" />} $size="xl">X Large</Button>
        </Row>
      </section>
      <section>
        <caption>Color</caption>
        <Row className="pt-1 px-1 gap-1">
          <Button style={style}>button</Button>
          <Button $outline style={style}>outline</Button>
          <span className={`pt-t fgc-base`}>color</span>
          <span className={`pt-t fgc-bse_r`}>color</span>
        </Row>
        {colors.map(color => {
          return (
            <Row key={color} className="pt-1 px-1 gap-1">
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