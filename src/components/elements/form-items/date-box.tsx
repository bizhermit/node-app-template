import { FormItemProps, FormItemValidation, FormItemWrap, useForm } from "@/components/elements/form";
import DatetimeUtils from "@bizhermit/basic-utils/dist/datetime-utils";
import { convertDate } from "@bizhermit/basic-utils/dist/datetime-utils";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Style from "$/components/elements/form-items/date-box.module.scss";
import Popup from "@/components/elements/popup";
import DatePicker from "@/components/elements/form-items/date-picker";
import { VscCalendar, VscClose } from "react-icons/vsc";
import { isEmpty } from "@bizhermit/basic-utils/dist/string-utils";
import { DateData, DateInput } from "@/data-items/date";
import { equals } from "@/data-items/utilities";

type DateBoxBaseProps<T> = FormItemProps<T> & DateInput.FCPorps & {
  $disallowInput?: boolean;
};

export type DateBoxProps_TypeString = DateBoxBaseProps<string>;

export type DateBoxProps_TypeNumber = DateBoxBaseProps<number>;

export type DateBoxProps_TypeDate = DateBoxBaseProps<Date>;

export type DateBoxProps = (DateBoxProps_TypeString & { $typeof?: "string" })
  | (DateBoxProps_TypeNumber & { $typeof: "number" })
  | (DateBoxProps_TypeDate & { $typeof: "date" });

const today = new Date();

const isNumericOrEmpty = (value?: string): value is string => {
  if (isEmpty(value)) return true;
  return /^[0-9]+$/.test(value);
};

const DateBox = React.forwardRef<HTMLDivElement, DateBoxProps>((props, ref) => {
  const type = props.$type ?? "date";
  const minDate = useMemo(() => {
    return DateInput.getMinDate(props);
  }, [props.$min]);
  const maxDate = useMemo(() => {
    return DateInput.getMaxDate(props);
  }, [props.$max]);
  const judgeValid = useMemo(() => {
    return DateInput.selectableValidation(props);
  }, [props.$validDays, props.$validDaysMode]);

  const yref = useRef<HTMLInputElement>(null!);
  const mref = useRef<HTMLInputElement>(null!);
  const dref = useRef<HTMLInputElement>(null!);
  const cacheY = useRef<number>();
  const cacheM = useRef<number>();
  const cacheD = useRef<number>();
  const [showPicker, setShowPicker] = useState(false);

  const setInputValues = (value?: DateValue) => {
    const date = convertDate(value);
    if (date == null) {
      cacheY.current = cacheM.current = cacheD.current = undefined;
    } else {
      cacheY.current = date.getFullYear();
      cacheM.current = date.getMonth() + 1;
      cacheD.current = date.getDate();
    }
    if (yref.current) yref.current.value = String(cacheY.current ?? "");
    if (mref.current) mref.current.value = String(cacheM.current ?? "");
    if (dref.current) dref.current.value = String(cacheD.current ?? "");
  };

  const form = useForm<DateValue | any>(props, {
    interlockValidation: props.$rangePair != null,
    validations: () => {
      const validations: Array<FormItemValidation<any>> = [];
      const max = DateData.dateAsLast(maxDate, type);
      const min = DateData.dateAsFirst(minDate, type);
      if (max != null && min != null) {
        validations.push(DateInput.rangeValidation(min, max, type));
      } else {
        if (max != null) {
          validations.push(DateInput.maxValidation(max, type));
        }
        if (min != null) {
          validations.push(DateInput.minValidation(min, type));
        }
      }
      const rangePair = props.$rangePair;
      if (rangePair != null) {
        const { validation } = DateInput.contextValidation(rangePair, type);
        validations.push(validation);
      }
      if (props.$validDays) {
        const judge = (value: DateValue | null) => {
          const date = convertDate(value);
          if (date == null) return "";
          return judgeValid(date) ? "" : "選択可能な日付ではありません。";
        };
        validations.push(judge);
      }
      return validations;
    },
    validationsDeps: [
      type,
      maxDate,
      minDate,
      props.$rangePair?.name,
      props.$rangePair?.position,
      props.$rangePair?.disallowSame,
      judgeValid,
    ],
  });

  const commitCache = () => {
    const y = cacheY.current;
    const m = type !== "year" ? cacheM.current : 1;
    const d = type === "date" ? cacheD.current : 1;
    if (y == null || (type !== "year" && m == null) || (type === "date" && d == null)) {
      if (form.valueRef.current == null) setInputValues(undefined);
      else form.change(undefined);
      return;
    }
    const date = convertDate(`${y}-${m}-${d}`);
    if (date == null) {
      if (form.valueRef.current == null) setInputValues(undefined);
      else form.change(undefined);
      return;
    }
    const v = DateInput.convertDateToValue(date, props.$typeof);
    if (equals(v, form.valueRef.current)) setInputValues(v);
    else form.change(v);
  };

  const changeY = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!form.editable) return;
    const v = e.currentTarget.value;
    if (!isNumericOrEmpty(v)) {
      e.currentTarget.value = String(cacheY.current || "");
      return;
    }
    cacheY.current = isEmpty(v) ? undefined : Number(v);
    if (v.length === 4) mref.current?.focus();
  };

  const changeM = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!form.editable) return;
    const v = e.currentTarget.value;
    if (!isNumericOrEmpty(v)) {
      e.currentTarget.value = String(cacheM.current || "");
      return;
    }
    cacheM.current = isEmpty(v) ? undefined : Number(v);
    if (v.length === 2 || !(v === "1" || v === "2")) dref.current?.focus();
  };

  const changeD = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!form.editable) return;
    const v = e.currentTarget.value;
    if (!isNumericOrEmpty(v)) {
      e.currentTarget.value = String(cacheD.current || "");
      return;
    }
    cacheD.current = isEmpty(v) ? undefined : Number(v);
  };

  const updown = (y = 0, m = 0, d = 0) => {
    let year = cacheY.current == null ? today.getFullYear() : cacheY.current + y;
    let month = type === "year" ? 0 : (cacheM.current == null ? today.getMonth() + 1 : cacheM.current + m);
    let day = type === "date" ? (cacheD.current == null ? today.getDate() : cacheD.current + d) : 1;
    const date = new Date(year, month - 1, day);
    if (minDate) {
      if (DatetimeUtils.isBeforeDate(minDate, date)) {
        year = minDate.getFullYear();
        month = minDate.getMonth() + 1;
        day = minDate.getDate();
      }
    }
    if (maxDate) {
      if (DatetimeUtils.isAfterDate(maxDate, date)) {
        year = maxDate.getFullYear();
        month = maxDate.getMonth() + 1;
        day = maxDate.getDate();
      }
    }
    if (!(cacheD.current !== day || cacheM.current !== month || cacheY.current !== year)) return;
    cacheY.current = year;
    cacheM.current = month;
    cacheD.current = day;
    commitCache();
  };

  const keydownY = (e: React.KeyboardEvent) => {
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
        if (e.currentTarget.value.length === 0) yref.current?.focus();
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

  const keydownD = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
    if (e.relatedTarget === yref.current || e.relatedTarget === mref.current || e.relatedTarget === dref.current) return;
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
    (dref.current ?? mref.current ?? yref.current)?.focus();
  };

  useEffect(() => {
    setInputValues(form.value);
  }, [form.value, type]);

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
        data-editable={form.editable}
      >
        <input
          ref={yref}
          className={Style.y}
          type="text"
          disabled={props.$disallowInput || form.disabled}
          readOnly={props.$disallowInput || form.readOnly}
          maxLength={4}
          defaultValue={cacheY.current || ""}
          onChange={changeY}
          onFocus={focusInput}
          onKeyDown={keydownY}
          autoComplete="off"
        />
        {type !== "year" &&
          <>
            <span className={Style.sep} data-has={hasData}>/</span>
            <input
              ref={mref}
              className={Style.m}
              type="text"
              disabled={props.$disallowInput || form.disabled}
              readOnly={props.$disallowInput || form.readOnly}
              maxLength={2}
              defaultValue={cacheM.current || ""}
              onChange={changeM}
              onFocus={focusInput}
              onKeyDown={keydownM}
              autoComplete="off"
            />
          </>
        }
        {type === "date" &&
          <>
            <span className={Style.sep} data-has={hasData}>/</span>
            <input
              ref={dref}
              className={Style.d}
              type="text"
              disabled={props.$disallowInput || form.disabled}
              readOnly={props.$disallowInput || form.readOnly}
              maxLength={2}
              defaultValue={cacheD.current || ""}
              onChange={changeD}
              onFocus={focusInput}
              onKeyDown={keydownD}
              autoComplete="off"
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
              data-disabled={showPicker}
            >
              <VscCalendar />
            </div>
          }
          <div
            className={Style.clear}
            onClick={clear}
            data-disabled={!hasData}
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
        <DatePicker
          $value={form.value || today}
          $type={type}
          $max={maxDate}
          $min={minDate}
          $validDays={props.$validDays}
          $validDaysMode={props.$validDaysMode}
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

export default DateBox;