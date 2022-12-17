import { FormItemProps, FormItemWrap, useForm } from "@/components/elements/form";
import { convertTime, TimeInputProps, TimeValue } from "@/utilities/time-input";
import { isEmpty } from "@bizhermit/basic-utils/dist/string-utils";
import React, { useRef, useState } from "react";
import Style from "$/components/elements/form-items/time-box.module.scss";
import { VscClose } from "react-icons/vsc";
import { BsClock } from "react-icons/bs";
import Time, { TimeUtils } from "@bizhermit/time";

type TimeBoxCommonProps = TimeInputProps & {
  $disallowInput?: boolean;
};

type TimeBoxStringProps = FormItemProps<string> & {
  $typeof?: "string";
};

type TimeBoxNumberProps = FormItemProps<number> & {
  $typeof: "number";
};

export type TimeBoxProps = (TimeBoxStringProps | TimeBoxNumberProps) & TimeBoxCommonProps;

const isNumericOrEmpty = (value?: string): value is string => {
  if (isEmpty(value)) return true;
  return /^[0-9]+$/.test(value);
};

const TimeBox = React.forwardRef<HTMLDivElement, TimeBoxProps>((props, ref) => {
  const type = props.$type ?? "hm";
  const unit = props.$unit

  const [showPicker, setShowPicker] = useState(false);

  const href = useRef<HTMLInputElement>(null!);
  const mref = useRef<HTMLInputElement>(null!);
  const sref = useRef<HTMLInputElement>(null!);
  const cacheH = useRef<number>();
  const cacheM = useRef<number>();
  const cacheS = useRef<number>();

  const setInputValues = (value?: TimeValue) => {
    const time = convertTime(value, unit);
  };

  const form = useForm<any>(props);

  const picker = () => {
    if (!form.editable) return;
    if (showPicker) return;
    setShowPicker(true);
  };

  const clear = () => {
    if (!form.editable) return;
    form.change(undefined);
  };

  const hasData = form.value != null && form.value !== "";

  return (
    <FormItemWrap
      {...props}
      $$form={form}
      ref={ref}
      $useHidden
      data-has={hasData}
    >
      <div
        className={Style.inputs}
      >

      </div>
      {form.editable &&
        <>
          {!props.$disallowInput &&
            <div
              className={Style.picker}
              onClick={picker}
            >
              <BsClock />
            </div>
          }
          <div
            className={Style.clear}
            onClick={clear}
          >
            <VscClose />
          </div>
        </>
      }
    </FormItemWrap>
  );
});

export default TimeBox;