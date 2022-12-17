import { FormItemProps, FormItemWrap, useForm } from "@/components/elements/form";
import { convertTime, TimeInputProps, TimeValue } from "@/utilities/time-input";
import { isEmpty } from "@bizhermit/basic-utils/dist/string-utils";
import React, { useEffect, useRef, useState } from "react";
import Style from "$/components/elements/form-items/time-box.module.scss";
import { VscClose } from "react-icons/vsc";
import { BsClock } from "react-icons/bs";
import Time, { TimeUtils } from "@bizhermit/time";
import Popup from "@/components/elements/popup";
import TimePicker from "@/components/elements/form-items/time-picker";

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

  const form = useForm<any>(props, {
    interlockValidation: props.$rangePair != null,
  });

  const commitCache = () => {
    // const h = cacheH.current;
    // const m = type !== "year" ? cacheM.current : 1;
    // const d = type === "date" ? cacheD.current : 1;
    // if (h == null || (type !== "year" && m == null) || (type === "date" && d == null)) {
    //   form.change(undefined);
    //   return;
    // }
    // const date = converti(`${h}-${m}-${d}`);
    // if (date == null) {
    //   form.change(undefined);
    //   return;
    // }
    // form.change(convertDateToValue(date, props.$typeof));
  };

  const blur = (e: React.FocusEvent) => {
    if (e.relatedTarget === href.current || e.relatedTarget === mref.current || e.relatedTarget === sref.current) return;
    commitCache();
  };

  const picker = () => {
    if (!form.editable) return;
    if (showPicker) return;
    setShowPicker(true);
  };

  const clear = () => {
    if (!form.editable) return;
    form.change(undefined);
  };

  const focusInput = (e: React.FocusEvent<HTMLInputElement>) => {
    if (!form.editable) return;
    e.currentTarget.select();
  };

  const clickInputs = () => {
    if (!props.$disallowInput) return;
    picker();
  };

  const focus = () => {
    (href.current ?? mref.current ?? sref.current)?.focus();
  };

  useEffect(() => {
    setInputValues(form.value);
  }, [form.value, type, unit]);

  const hasData = form.value != null && form.value !== "";

  return (
    <FormItemWrap
      {...props}
      $$form={form}
      ref={ref}
      $useHidden
      data-has={hasData}
      $mainProps={{
        onBlur: blur,
      }}
    >
      <div
        className={Style.inputs}
        onClick={clickInputs}
        data-input={!props.$disallowInput}
      >
        {type !== "ms" &&
          <input
            ref={href}
            className={Style.h}
            type="text"
            disabled={props.$disallowInput || form.disabled}
            readOnly={props.$disallowInput || form.readOnly}
            maxLength={2}
            defaultValue={cacheH.current || ""}
            onFocus={focusInput}
          />
        }
        <span className={Style.sep} data-has={hasData}>:</span>
        {type !== "h" &&
          <input
            ref={mref}
            className={Style.m}
            type="text"
            disabled={props.$disallowInput || form.disabled}
            readOnly={props.$disallowInput || form.readOnly}
            maxLength={2}
            defaultValue={cacheM.current || ""}
            onFocus={focusInput}
          />
        }
        {(type === "hms" || type === "ms") &&
          <>
            <span className={Style.sep} data-has={hasData}>:</span>
            <input
              ref={sref}
              className={Style.s}
              type="text"
              disabled={props.$disallowInput || form.disabled}
              readOnly={props.$disallowInput || form.readOnly}
              maxLength={2}
              defaultValue={cacheS.current || ""}
              onFocus={focusInput}
            />
          </>
        }
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
      <Popup
        className="es-4"
        $show={showPicker}
        $onToggle={setShowPicker}
        $anchor="parent"
        $position={{
          x: "inner",
          y: "outer",
        }}
        $animationDuration={50}
        $closeWhenClick
        $preventClickEvent
      >
        <TimePicker
          $value={form.value}
          $type={type}
          $unit={unit}
          $max={props.$max}
          $min={props.$min}
          $skipValidation
          $onClickPositive={(value) => {
            form.change(value);
            setShowPicker(false);
            focus();
          }}
          $onClickNegative={() => {
            setShowPicker(false);
            focus();
          }}
        />
      </Popup>
    </FormItemWrap>
  );
});

export default TimeBox;