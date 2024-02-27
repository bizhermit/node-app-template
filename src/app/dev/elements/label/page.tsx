import NumberBox from "#/client/elements/form/items/number-box";
import TextBox from "#/client/elements/form/items/text-box";
import Label from "#/client/elements/label";
import { colors, sizes } from "#/utilities/sandbox";
import BaseLayout, { BaseRow, BaseSheet } from "../../_components/base-layout";

const Page = () => {
  return (
    <BaseLayout title="Label">
      <BaseSheet>
        <BaseRow $middle>
          <Label $size="xs" $color="danger">必須</Label>
          <TextBox />
        </BaseRow>
        <BaseRow $middle>
          <NumberBox />
          <Label $color="cool" $size="s">任意</Label>
        </BaseRow>
        <BaseRow>
          {sizes.map(size => {
            return <Label key={size} $size={size}>{`Size: ${size}`}</Label>;
          })}
        </BaseRow>
        {colors.map(color => {
          return <Label key={color} $color={color}>{color}</Label>;
        })}
      </BaseSheet>
    </BaseLayout>
  );
};

export default Page;
