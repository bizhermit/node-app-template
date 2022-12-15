import ToggleBox from "@/components/elements/form-items/toggle-box";
import Row from "@/components/elements/row";
import { colors } from "@/utilities/sandbox";
import { NextPage } from "next";

const Page: NextPage = () => {
  return (
    <div className="flex-start p-1">
      <Row>
        <ToggleBox>editable</ToggleBox>
        <ToggleBox $readOnly>readOnly</ToggleBox>
        <ToggleBox $disabled>disabled</ToggleBox>
      </Row>
      <ToggleBox
        $tag="ToggleBox"
      >
        トグルボックス
      </ToggleBox>
      <ToggleBox
        $outline
      >
        outline
      </ToggleBox>
      {colors.map(color => {
        return (
          <Row key={color}>
            <ToggleBox $color={color} $defaultValue />
            <ToggleBox $color={color} $outline $defaultValue />
            <span className={`pt-t px-1 c-${color}`}>{color}</span>
          </Row>
        );
      })}
    </div>
  );
};

export default Page;