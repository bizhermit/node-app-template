import { FormItemProps, FormItemValidation, FormItemWrap, useForm } from "@/components/elements/form";
import DatetimeUtils from "@bizhermit/basic-utils/dist/datetime-utils";
import { dateFormat } from "@bizhermit/basic-utils/dist/datetime-utils";
import { convertDate } from "@bizhermit/basic-utils/dist/datetime-utils";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Style from "$/components/elements/form-items/date-box.module.scss";
import Popup from "@/components/elements/popup";
import DatePicker from "@/components/elements/form-items/date-picker";
import { VscCalendar, VscClose } from "react-icons/vsc";
import { isEmpty } from "@bizhermit/basic-utils/dist/string-utils";

type DateBoxType = "date" | "month" | "year";

type DateBoxCommonProps = {
  $type?: DateBoxType;
  $min?: string | number | Date;
  $max?: string | number | Date;
  $rangePair?: {
    name: string;
    position: "before" | "after";
    disallowSame?: boolean;
  }
  $disallowInput?: boolean;
};

type DateBoxStringProps = FormItemProps<string> & {
  $typeof?: "string";
};

type DateBoxNumberProps = FormItemProps<number> & {
  $typeof: "number";
};

type DateBoxDateProps = FormItemProps<Date> & {
  $typeof: "date";
};

export type DateBoxProps = (DateBoxStringProps | DateBoxNumberProps | DateBoxDateProps) & DateBoxCommonProps;

const today = new Date();

const convertDateToValue = (date: Date, $typeof: "string" | "number" | "date" | undefined) => {
  switch ($typeof) {
    case "date":
      return date;
    case "number":
      return date?.getTime();
    default:
      return dateFormat(date);
  }
};

const toStr = (time?: number, type?: DateBoxType) => {
  if (time == null) return "";
  if (type === "year") return dateFormat(time, "yyyy年");
  if (type === "month") return dateFormat(time, "yyyy/MM");
  return dateFormat(time, "yyyy/MM/dd");
};

const isNumericOrEmpty = (value?: string): value is string => {
  if (isEmpty(value)) return true;
  return /^[0-9]+$/.test(value);
};

const DateBox = React.forwardRef<HTMLDivElement, DateBoxProps>((props, ref) => {
  const type = props.$type ?? "date";
  const minDate = useMemo(() => {
    return convertDate(props.$min) ?? new Date(1900, 0, 1);
  }, [props.$min]);
  const maxDate = useMemo(() => {
    return convertDate(props.$max) ?? new Date(2100, 0, 0);
  }, [props.$max]);

  const yref = useRef<HTMLInputElement>(null!);
  const mref = useRef<HTMLInputElement>(null!);
  const dref = useRef<HTMLInputElement>(null!);
  const cacheY = useRef<number>();
  const cacheM = useRef<number>();
  const cacheD = useRef<number>();
  const [showPicker, setShowPicker] = useState(false);

  const setInputValues = (value?: string | number | Date) => {
    const date = convertDate(value);
    if (date == null) {
      cacheY.current = cacheM.current = cacheD.current = undefined;
    } else {
      cacheY.current = date.getFullYear();
      cacheM.current = date.getMonth() + 1;
      cacheD.current = date.getDate();
    }
    if (yref.current) yref.current.value = String(cacheY.current || "");
    if (mref.current) mref.current.value = String(cacheM.current || "");
    if (dref.current) dref.current.value = String(cacheD.current || "");
  };

  const form = useForm<string | number | Date | any>(props, {
    interlockValidation: props.$rangePair != null,
    validations: () => {
      const validations: Array<FormItemValidation<any>> = [];
      const maxTime = convertDate((() => {
        switch (type) {
          case "year":
            return DatetimeUtils.getLastDateAtYear(maxDate);
          case "month":
            return DatetimeUtils.getLastDateAtMonth(maxDate);
          default:
            return maxDate;
        }
      })())?.getTime();
      const minTime = convertDate((() => {
        switch (type) {
          case "year":
            return DatetimeUtils.getFirstDateAtYear(minDate);
          case "month":
            return DatetimeUtils.getFirstDateAtMonth(minDate);
          default:
            return minDate;
        }
      })())?.getTime();
      if (maxTime != null && minTime != null) {
        const maxDateStr = toStr(maxTime, type);
        const minDateStr = toStr(minTime, type);
        const compare = (v: any) => {
          const time = convertDate(v)?.getTime();
          if (time == null) return "";
          if (time < minTime || maxTime < time) return `${minDateStr}～${maxDateStr}の範囲で入力してください。`;
          return "";
        };
        validations.push(compare);
      } else {
        if (maxTime != null) {
          const maxDateStr = toStr(maxTime);
          const compare = (v: any) => {
            const time = convertDate(v)?.getTime();
            if (time == null) return "";
            if (time > maxTime) return `${maxDateStr}以前で入力してください。`;
            return "";
          };
          validations.push(compare);
        }
        if (minTime != null) {
          const minDateStr = toStr(minTime);
          const compare = (v: any) => {
            const time = convertDate(v)?.getTime();
            if (time == null) return "";
            if (time < minTime) return `${minDateStr}以降で入力してください。`;
            return "";
          };
          validations.push(compare);
        }
      }
      const rangePair = props.$rangePair;
      if (rangePair != null) {
        const compare = (value: string | number | Date | any, pairDate: Date) => {
          const date = convertDate(value);
          if (date == null) return "";
          if (rangePair.disallowSame !== true && DatetimeUtils.equalDate(date, pairDate)) {
            return "";
          }
          if (rangePair.position === "before") {
            if (!DatetimeUtils.isBeforeDate(date, pairDate)) return "日付の前後関係が不適切です。";
            return "";
          }
          if (!DatetimeUtils.isAfterDate(date, pairDate)) return "日付の前後関係が不適切です。";
          return "";
        };
        const getPairDate = (data: Struct) => {
          if (data == null) return undefined;
          const pairValue = data[rangePair.name];
          if (pairValue == null || Array.isArray(pairValue)) return undefined;
          return convertDate(pairValue);
        };
        validations.push((v, d) => {
          if (d == null) return "";
          const pairDate = getPairDate(d);
          if (pairDate == null) return "";
          return compare(v, pairDate);
        });
      }
      return validations;
    },
    validationsDeps: [
      maxDate,
      minDate,
      type,
      props.$rangePair?.name,
      props.$rangePair?.position,
      props.$rangePair?.disallowSame,
    ],
  });

  const commitCache = () => {
    const y = cacheY.current;
    const m = type !== "year" ? cacheM.current : 1;
    const d = type === "date" ? cacheD.current : 1;
    if (y == null || (type !== "year" && m == null) || (type === "date" && d == null)) {
      setInputValues(undefined);
      return;
    }
    const date = convertDate(`${y}-${m}-${d}`);
    if (date == null) {
      setInputValues(undefined);
      return;
    }
    form.change(convertDateToValue(date, props.$typeof));
  };

  const changeY = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!form.editable) return;
    const v = e.currentTarget.value;
    if (!isNumericOrEmpty(v)) {
      e.currentTarget.value = String(cacheY.current || "");
      return;
    }
    cacheY.current = Number(v);
    if (v.length === 4) mref.current?.focus();
  };

  const changeM = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!form.editable) return;
    const v = e.currentTarget.value;
    if (!isNumericOrEmpty(v)) {
      e.currentTarget.value = String(cacheM.current || "");
      return;
    }
    cacheM.current = Number(v);
    if (v.length === 2 || !(v === "1" || v === "2")) dref.current?.focus();
  };

  const changeD = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!form.editable) return;
    const v = e.currentTarget.value;
    if (!isNumericOrEmpty(v)) {
      e.currentTarget.value = String(cacheD.current || "");
      return;
    }
    cacheD.current = Number(v);
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

  useEffect(() => {
    setInputValues(form.value);
  }, [form.value, type]);

  const hasData = Boolean(form.value);

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
        />
        {type !== "year" &&
          <>
            <span
              className={Style.sep}
              data-has={hasData}
            >
              /
            </span>
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
            />
          </>
        }
        {type === "date" &&
          <>
            <span
              className={Style.sep}
              data-has={hasData}
            >
              /
            </span>
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
              <VscCalendar />
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
        $unmountWhenHid
      >
        <DatePicker
          $value={form.value || today}
          $type={type}
          $max={maxDate}
          $min={minDate}
          $onClickPositive={(value) => {
            form.change(value);
            setShowPicker(false);
          }}
          $onClickNegative={() => {
            setShowPicker(false);
          }}
        />
      </Popup>
    </FormItemWrap>
  );
});

export default DateBox;