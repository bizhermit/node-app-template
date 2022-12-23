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

type TimeBoxBaseProps<T> = FormItemProps<T> & TimeInputProps & {
  $disallowInput?: boolean;
};

type TimeBoxProps_TypeString = TimeBoxBaseProps<string>;

type TimeBoxProps_TypeNumber = TimeBoxBaseProps<number>;

export type TimeBoxProps = (TimeBoxProps_TypeString & { $typeof?: "string" })
  | (TimeBoxProps_TypeNumber & { $typeof: "number" });

const isNumericOrEmpty = (value?: string): value is string => {
  if (isEmpty(value)) return true;
  return /^[0-9]+$/.test(value);
};

const TimeBox = React.forwardRef<HTMLDivElement, TimeBoxProps>((props, ref) => {
  const type = props.$type ?? "hm";
  const unit = props.$unit ?? "minute";

  const [showPicker, setShowPicker] = useState(false);

  const href = useRef<HTMLInputElement>(null!);
  const mref = useRef<HTMLInputElement>(null!);
  const sref = useRef<HTMLInputElement>(null!);
  const cacheH = useRef<number>();
  const cacheM = useRef<number>();
  const cacheS = useRef<number>();
  const needH = type !== "ms";
  const needM = type !== "h";
  const needS = type === "hms" || type === "ms";

  const setInputValues = (value?: TimeValue) => {
    const time = convertTime(value, unit);
  };

  const form = useForm<any>(props, {
    interlockValidation: props.$rangePair != null,
  });

  const commitCache = () => {
    const h = needH ? cacheH.current : 0;
    const m = needM ? cacheM.current : 0;
    const s = needS ? cacheS.current : 0;
    if ((needH && h == null) || (needM && m == null) || (needS && m == null)) {
      form.change(undefined);
      return;
    }
    const time = new Time(`${h}:${m}:${s}`);
    form.change(TimeUtils.convertMillisecondsToUnit(time.getTime(), unit));
  };

  const changeH = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!form.editable) return;
    const v = e.currentTarget.value;
    if (!isNumericOrEmpty(v)) {
      e.currentTarget.value = String(cacheH.current || "");
      return;
    }
    cacheH.current = isEmpty(v) ? undefined : Number(v);
    if (v.length === 2) mref.current?.focus();
  };

  const changeM = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!form.editable) return;
    const v = e.currentTarget.value;
    if (!isNumericOrEmpty(v)) {
      e.currentTarget.value = String(cacheM.current || "");
      return;
    }
    cacheM.current = isEmpty(v) ? undefined : Number(v);
    if (v.length === 2 || !(v === "1" || v === "2")) mref.current?.focus();
  };

  const changeS = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!form.editable) return;
    const v = e.currentTarget.value;
    if (!isNumericOrEmpty(v)) {
      e.currentTarget.value = String(cacheS.current || "");
      return;
    }
    cacheS.current = isEmpty(v) ? undefined : Number(v);
  };

  const updown = (y = 0, m = 0, d = 0) => {
    let hour = cacheH.current == null ? 0 : cacheH.current + y;
    let minute = cacheM.current == null ? 0 : cacheM.current + m;
    let second = cacheS.current == null ? 0 : cacheS.current + d;
    // const date = new Date(hour, minute - 1, second);
    // if (minDate) {
    //   if (DatetimeUtils.isBeforeDate(minDate, date)) {
    //     hour = minDate.getFullYear();
    //     minute = minDate.getMonth() + 1;
    //     second = minDate.getDate();
    //   }
    // }
    // if (maxDate) {
    //   if (DatetimeUtils.isAfterDate(maxDate, date)) {
    //     hour = maxDate.getFullYear();
    //     minute = maxDate.getMonth() + 1;
    //     second = maxDate.getDate();
    //   }
    // }
    if (!(cacheS.current !== second || cacheM.current !== minute || cacheH.current !== hour)) return;
    cacheH.current = hour;
    cacheM.current = minute;
    cacheS.current = second;
    commitCache();
  };

  const keydownH = (e: React.KeyboardEvent) => {
    if (!form.editable) return;
    switch (e.key) {
      case "F2":
        picker();
        break;
      case "Enter":
        commitCache();
        break;
      case "ArrowUp":
        updown(1, 0, 0);
        e.preventDefault();
        break;
      case "ArrowDown":
        updown(-1, 0, 0);
        e.preventDefault();
        break;
      default:
        break;
    }
  };

  const keydownM = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!form.editable) return;
    switch (e.key) {
      case "F2":
        picker();
        break;
      case "Enter":
        commitCache();
        break;
      case "Backspace":
        if (e.currentTarget.value.length === 0) href.current?.focus();
        break;
      case "ArrowUp":
        updown(0, 1, 0);
        e.preventDefault();
        break;
      case "ArrowDown":
        updown(0, -1, 0);
        e.preventDefault();
        break;
      default:
        break;
    }
  };

  const keydownS = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!form.editable) return;
    switch (e.key) {
      case "F2":
        picker();
        break;
      case "Enter":
        commitCache();
        break;
      case "Backspace":
        if (e.currentTarget.value.length === 0) mref.current?.focus();
        break;
      case "ArrowUp":
        updown(0, 0, 1);
        e.preventDefault();
        break;
      case "ArrowDown":
        updown(0, 0, -1);
        e.preventDefault();
        break;
      default:
        break;
    }
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
        {needH &&
          <input
            ref={href}
            className={Style.h}
            type="text"
            disabled={props.$disallowInput || form.disabled}
            readOnly={props.$disallowInput || form.readOnly}
            maxLength={2}
            defaultValue={cacheH.current || ""}
            onFocus={focusInput}
            onKeyDown={keydownH}
            onChange={changeH}
          />
        }
        <span className={Style.sep} data-has={hasData}>:</span>
        {needM &&
          <input
            ref={mref}
            className={Style.m}
            type="text"
            disabled={props.$disallowInput || form.disabled}
            readOnly={props.$disallowInput || form.readOnly}
            maxLength={2}
            defaultValue={cacheM.current || ""}
            onFocus={focusInput}
            onKeyDown={keydownM}
            onChange={changeM}
          />
        }
        {needS &&
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
              onKeyDown={keydownS}
              onChange={changeS}
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