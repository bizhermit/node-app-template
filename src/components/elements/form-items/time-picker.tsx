import { FormItemProps, FormItemWrap, useForm } from "@/components/elements/form";
import { TimeInputProps } from "@/utilities/time-input";
import Time from "@bizhermit/time";
import React, { ReactNode } from "react";
import Style from "$/components/elements/form-items/time-picker.module.scss";
import { VscClose, VscRecord } from "react-icons/vsc";
import LabelText from "@/components/elements/label-text";

export type TimePickerCommonProps = TimeInputProps & {
  $onClickNegative?: () => void;
  $positiveText?: ReactNode;
  $negativeText?: ReactNode;
  $skipValidation?: boolean;
};

type TimePickerStringProps = FormItemProps<string> & {
  $typeof?: "string";
  $onClickPositive?: (value: Nullable<string>) => void;
};

type TimePickerNumberProps = FormItemProps<number> & {
  $typeof: "number";
  $onClickPositive?: (value: Nullable<number>) => void;
};

export type TimePickerProps =
  (TimePickerStringProps | TimePickerNumberProps) & TimePickerCommonProps;

const TimePicker = React.forwardRef<HTMLDivElement, TimePickerProps>((props, ref) => {
  const form = useForm<any>(props);

  const clear = () => {
    form.change(undefined);
  };

  return (
    <FormItemWrap
      {...props}
      $$form={form}
      ref={ref}
      $preventFieldLayout
      $useHidden
      $mainProps={{
        className: Style.main,
      }}
    >
      <div
        className={Style.content}
      >
      </div>
      <div className={Style.buttons}>
        {form.editable &&
          <div
            className={Style.clear}
            onClick={clear}
          >
            <VscClose />
          </div>
        }
        {props.$onClickNegative != null &&
          <div
            className={Style.negative}
            onClick={props.$onClickNegative}
          >
            <LabelText>{props.$negativeText ?? "キャンセル"}</LabelText>
          </div>
        }
        {props.$onClickPositive != null &&
          <div
            className={Style.positive}
            onClick={() => {
              props.$onClickPositive?.(form.value as never);
            }}
          >
            <LabelText>{props.$positiveText ?? "OK"}</LabelText>
          </div>
        }
      </div>
    </FormItemWrap>
  );
});

export default TimePicker;