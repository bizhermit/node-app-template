import Button from "@/components/elements/button";
import Row from "@/components/templates/row";
import { NextPage } from "next";
import { CSSProperties } from "react";

const colors: Array<Color> = [
  "base",
  "pure",
  "dull",
];
const style: CSSProperties = {
  width: 200
};

const Page: NextPage = () => {
  return (
    <div className="flex-box">
      {colors.map(color => {
        return (
          <Row key={color} className="pt-1 px-1 gap-1">
            <Button $color={color} style={style}>{color}</Button>
            <Button $color={color} $outline style={style}>{color}</Button>
            <span className={`pt-t fgc-${color}`}>{color}</span>
          </Row>
        );
      })}
    </div>
  );
};
export default Page;