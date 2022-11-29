import CheckBox from "@/components/elements/form-items/check-box";
import Row from "@/components/elements/row";
import { colors } from "@/utilities/sandbox";
import { NextPage } from "next";

const Page: NextPage = () => {
  return (
    <div className="flex-box flex-start p-1">
      <Row>
        <CheckBox>editable</CheckBox>
        <CheckBox $readOnly>readOnly</CheckBox>
        <CheckBox $disabled>disabled</CheckBox>
      </Row>
      <CheckBox
        $tag="CheckBox"
      >
        チェックボックス
      </CheckBox>
      <CheckBox
        $outline
      >
        outline
      </CheckBox>
      {colors.map(color => {
        return (
          <Row key={color}>
            <CheckBox $color={color} $defaultValue />
            <CheckBox $color={color} $outline $defaultValue />
            <span className={`pt-t px-1 c-${color}`}>{color}</span>
          </Row>
        );
      })}
    </div>
  );
};

export default Page;