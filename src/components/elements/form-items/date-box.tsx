import { FormItemProps, FormItemValidation, FormItemWrap, useForm } from "@/components/elements/form";
import DatetimeUtils from "@bizhermit/basic-utils/dist/datetime-utils";
import { dateFormat } from "@bizhermit/basic-utils/dist/datetime-utils";
import { convertDate } from "@bizhermit/basic-utils/dist/datetime-utils";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Style from "$/components/elements/form-items/date-box.module.scss";
import Popup from "@/components/elements/popup";
import DatePicker from "@/components/elements/form-items/date-picker";
import { VscCalendar, VscClose } from "react-icons/vsc";
import StringUtils, { isEmpty } from "@bizhermit/basic-utils/dist/string-utils";

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
  const cacheY = useRef("");
  const cacheM = useRef("");
  const cacheD = useRef("");
  const [showPicker, setShowPicker] = useState(false);

  const setInputValues = (value?: string | number | Date) => {
    const date = convertDate(value);
    if (date == null) {
      cacheY.current = cacheM.current = cacheD.current = "";
      if (yref.current) yref.current.value = "";
      if (mref.current) mref.current.value = "";
      if (dref.current) dref.current.value = "";
      return;
    }
    cacheY.current = String(date.getFullYear());
    if (yref.current) yref.current.value = cacheY.current;
    cacheM.current = String(date.getMonth() + 1);
    if (mref.current) mref.current.value = cacheM.current;
    cacheD.current = String(date.getDate());
    if (dref.current) dref.current.value = cacheD.current;
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
            if (!DatetimeUtils.isBefore(pairDate, date)) return "日付の前後関係が不適切です。";
          }
          if (!DatetimeUtils.isAfter(pairDate, date)) return "日付の前後関係が不適切です。";
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
  });

  const commitCache = () => {
    const y = cacheY.current;
    const m = type !== "year" ? cacheM.current : "0";
    const d = type === "date" ? cacheD.current : "1";
    if (StringUtils.isAnyEmpty(y, m, d)) {
      setInputValues(undefined);
      return;
    };
    const date = convertDate(`${y}-${m}-${d}`);
    if (date == null) {
      setInputValues(undefined);
      return;
    };
    form.change(convertDateToValue(date, props.$typeof));
  };

  const changeY = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.currentTarget.value;
    if (!isNumericOrEmpty(v)) {
      e.currentTarget.value = cacheY.current;
      return;
    }
    cacheY.current = v;
    if (v.length === 4) mref.current?.focus();
  };

  const changeM = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.currentTarget.value;
    if (!isNumericOrEmpty(v)) {
      e.currentTarget.value = cacheM.current;
      return;
    }
    cacheM.current = v;
    if (v.length === 2 || !(v === "1" || v === "2")) dref.current?.focus();
  };

  const changeD = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.currentTarget.value;
    if (!isNumericOrEmpty(v)) {
      e.currentTarget.value = cacheD.current;
      return;
    }
    cacheD.current = v;
  };

  const blur = (e: React.FocusEvent) => {
    if (e.relatedTarget === yref.current || e.relatedTarget === mref.current || e.relatedTarget === dref.current) return;
    commitCache();
  };

  const picker = () => {
    setShowPicker(true);
  };

  const clear = () => {
    form.change(undefined);
  };

  const focusInput = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.select();
  };

  useEffect(() => {
    setInputValues(form.value);
  }, [form.value, type]);

  return (
    <FormItemWrap
      {...props}
      $$form={form}
      ref={ref}
      $useHidden
      data-has={Boolean(form.value)}
      $mainProps={{
        onBlur: blur,
      }}
    >
      <input
        ref={yref}
        className={Style.y}
        type="text"
        disabled={props.$disallowInput || form.disabled}
        readOnly={props.$disallowInput || form.readOnly}
        maxLength={4}
        onChange={changeY}
        onFocus={focusInput}
      />
      {type !== "year" &&
        <>
          <span className={Style.sep}>/</span>
          <input
            ref={mref}
            className={Style.m}
            type="text"
            disabled={props.$disallowInput || form.disabled}
            readOnly={props.$disallowInput || form.readOnly}
            maxLength={2}
            onChange={changeM}
            onFocus={focusInput}
          />
        </>
      }
      {type === "date" &&
        <>
          <span className={Style.sep}>/</span>
          <input
            ref={dref}
            className={Style.d}
            type="text"
            disabled={props.$disallowInput || form.disabled}
            readOnly={props.$disallowInput || form.readOnly}
            maxLength={2}
            onChange={changeD}
            onFocus={focusInput}
          />
        </>
      }
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
        $anchor="parent"
        $position={{
          x: "inner",
          y: "outer",
        }}
      >
        <DatePicker
          $value={form.value || today}
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