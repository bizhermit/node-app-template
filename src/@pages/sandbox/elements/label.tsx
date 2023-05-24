import NumberBox from "@/components/elements/form-items/number-box";
import TextBox from "@/components/elements/form-items/text-box";
import Label from "@/components/elements/label";
import Row from "@/components/elements/row";
import { colors, sizes } from "@/utilities/sandbox";
import type { NextPage } from "next";

const Page: NextPage = () => {
  return (
    <div className="flex-start gap-1 p-2">
      <Row className="gap-1">
        <Label $size="xs" $color="danger">必須</Label>
        <TextBox />
      </Row>
      <Row className="gap-1">
        <NumberBox />
        <Label $color="cool" $size="s">任意</Label>
      </Row>
      <Row className="gap-1">
        {sizes.map(size => {
          return <Label key={size} $size={size}>{`Size: ${size}`}</Label>
        })}
      </Row>
      {colors.map(color => {
        return <Label key={color} $color={color}>{color}</Label>
      })}
    </div>
  );
};

export default Page;