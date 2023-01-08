import $TextBox, { TextBoxProps } from "@/components/elements/form-items/text-box";
import { FC } from "react";

export namespace Password {

  export const name = "password";
  export const minLength = 8;
  export const maxLength = 16;

  export const TextBox: FC<TextBoxProps> = (props) => {
    return (
      <$TextBox
        name={name}
        // $type="password"
        $minLength={minLength}
        $maxLength={maxLength}
        {...props}
      />
    );
  };

}