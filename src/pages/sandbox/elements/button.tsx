import Button from "@/components/elements/button";
import Row from "@/components/templates/row";
import { NextPage } from "next";
import { CSSProperties } from "react";

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
    </div>
  );
};
export default Page;