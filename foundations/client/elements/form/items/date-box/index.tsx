"use client";

import DatetimeUtils, { convertDate } from "@bizhermit/basic-utils/dist/datetime-utils";
import { isEmpty } from "@bizhermit/basic-utils/dist/string-utils";
import { forwardRef, useEffect, useMemo, useRef, useState, type ForwardedRef, type FunctionComponent, type ReactElement } from "react";
import type { FormItemHook, FormItemProps, FormItemValidation, ValueType } from "../../$types";
import { DateData, DateInput } from "../../../../../data-items/date";
import { equals } from "../../../../../data-items/utilities";
import { CalendarIcon, CrossIcon } from "../../../icon";
import Popup from "../../../popup";
import useForm from "../../context";
import { convertDataItemValidationToFormItemValidation } from "../../utilities";
import { FormItemWrap } from "../common";
import DatePicker from "../date-picker";
import { useDataItemMergedProps, useFormItemBase, useFormItemContext } from "../hooks";
import Style from "./index.module.scss";

type DateBoxHookAddon = {
  addDay: (num?: number) => Date;
  addMonth: (num?: number) => Date;
  addYear: (num?: number) => Date;
  setFirstDate: () => Date;
  setLastDate: () => Date;
};
type DateBoxHook<T extends string | number | Date> = FormItemHook<T, DateBoxHookAddon>;

export const useDateBox = <T extends string | number | Date>() => useFormItemBase<DateBoxHook<T>>(e => {
  return {
    addDay: () => {
      throw e;
    },
    addMonth: () => {
      throw e;
    },
    addYear: () => {
      throw e;
    },
    setFirstDate: () => {
      throw e;
    },
    setLastDate: () => {
      throw e;
    },
  };
});

type OmitAttributes = "placeholder";
type DateBoxBaseProps<T, D extends DataItem_Date | DataItem_String | DataItem_Number | undefined = undefined> = Omit<FormItemProps<T, D>, OmitAttributes> & DateInput.FCPorps & {
  $ref?: DateBoxHook<ValueType<T, D, string | number | Date>> | DateBoxHook<string | number | Date>;
  $disallowInput?: boolean;
  $pickerButtonless?: boolean;
  $yearPlaceholder?: string;
  $monthPlaceholder?: string;
  $dayPlaceholder?: string;
  $showSeparatorAlwarys?: boolean;
};

export type DateBoxProps_TypeString<D extends DataItem_String | undefined = undefined> = DateBoxBaseProps<string, D>;

export type DateBoxProps_TypeNumber<D extends DataItem_Number | undefined = undefined> = DateBoxBaseProps<number, D>;

export type DateBoxProps_TypeDate<D extends DataItem_Date | undefined = undefined> = DateBoxBaseProps<Date, D>;

export type DateBoxProps<D extends DataItem_Date | DataItem_String | DataItem_Number | undefined = undefined> = D extends undefined ?
  (
    (DateBoxProps_TypeString & { $typeof?: "string" }) | (DateBoxProps_TypeNumber & { $typeof: "number" }) | (DateBoxProps_TypeDate & { $typeof: "date" })
  ) : (
    D extends { type: infer T } ? (
      T extends DataItem_Date["type"] ? (DateBoxProps_TypeDate<Exclude<D, DataItem_String | DataItem_Number>> & { $typeof?: "date" }) :
      T extends DataItem_Number["type"] ? (DateBoxProps_TypeNumber<Exclude<D, DataItem_Date | DataItem_String>> & { $typeof?: "number" }) :
      (DateBoxProps_TypeString<Exclude<D, DataItem_Date | DataItem_Number>> & { $typeof?: "string" })
    ) : (DateBoxProps_TypeString & { $typeof?: "string" }) | (DateBoxProps_TypeNumber & { $typeof: "number" }) | (DateBoxProps_TypeDate & { $typeof: "date" })
  );

const isNumericOrEmpty = (value?: string): value is string => {
  if (isEmpty(value)) return true;
  return /^[0-9]+$/.test(value);
};

interface DateBoxFC extends FunctionComponent<DateBoxProps> {
  <D extends DataItem_Date | DataItem_String | DataItem_Number | undefined = undefined>(
    attrs: ComponentAttrsWithRef<HTMLDivElement, DateBoxProps<D>>
  ): ReactElement<any> | null;
}

const DateBox = forwardRef<HTMLDivElement, DateBoxProps>(<
  D extends DataItem_Date | DataItem_String | DataItem_Number | undefined = undefined
>(p: DateBoxProps<D>, ref: ForwardedRef<HTMLDivElement>) => {
  const form = useForm();
  const props = useDataItemMergedProps(form, p, {
    under: ({ dataItem }) => {
      switch (dataItem.type) {
        case "number":
          return {
            $typeof: "number",
          } as DateBoxProps<D>;
        case "date":
        case "month":
        case "year":
          return {
            $type: dataItem.type as DateType,
            $typeof: dataItem.typeof,
            $min: dataItem.min,
            $max: dataItem.max,
            $rangePair: dataItem.rangePair,
          } as DateBoxProps<D>;
        default:
          return {
            $typeof: "string",
          } as DateBoxProps<D>;
      }
    },
    over: ({ dataItem, props }) => {
      switch (dataItem.type) {
        case "number":
          return {
            $validations: dataItem.validations?.map(f => convertDataItemValidationToFormItemValidation(f, props, dataItem)),
          } as DateBoxProps<D>;
        case "date":
        case "month":
        case "year":
          return {
            $validations: dataItem.validations?.map(f => convertDataItemValidationToFormItemValidation(f, props, dataItem, convertDate)),
          } as DateBoxProps<D>;
        default:
          return {
            $validations: dataItem.validations?.map(f => convertDataItemValidationToFormItemValidation(f, props, dataItem)),
          } as DateBoxProps<D>;
      }
    },
  });

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

  const initValue = useMemo(() => {
    return DateInput.getInitValue(props);
  }, [props.$initValue]);

  const yref = useRef<HTMLInputElement>(null!);
  const mref = useRef<HTMLInputElement>(null!);
  const dref = useRef<HTMLInputElement>(null!);
  const pref = useRef<HTMLDivElement>(null!);
  const cacheY = useRef<number>();
  const cacheM = useRef<number>();
  const cacheD = useRef<number>();
  const [showPicker, setShowPicker] = useState(false);

  const ctx = useFormItemContext(form, props, {
    interlockValidation: props.$rangePair != null,
    validations: (_, label) => {
      const validations: Array<FormItemValidation<any>> = [];
      const max = DateData.dateAsLast(maxDate, type);
      const min = DateData.dateAsFirst(minDate, type);
      if (max != null && min != null) {
        validations.push(DateInput.rangeValidation(min, max, type, label));
      } else {
        if (max != null) {
          validations.push(DateInput.maxValidation(max, type, label));
        }
        if (min != null) {
          validations.push(DateInput.minValidation(min, type, label));
        }
      }
      const rangePair = props.$rangePair;
      if (rangePair != null) {
        const { validation } = DateInput.contextValidation(rangePair, type, label);
        validations.push(validation);
      }
      if (props.$validDays) {
        const judge = (value: DateValue | null) => {
          const date = convertDate(value);
          if (date == null) return undefined;
          return judgeValid(date) ? undefined : "選択可能な日付ではありません。";
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

  const commitCache = (edit = true) => {
    const y = cacheY.current;
    const m = type !== "year" ? cacheM.current : 1;
    const d = type === "date" ? cacheD.current : 1;
    if (y == null || (type !== "year" && m == null) || (type === "date" && d == null)) {
      if (ctx.valueRef.current == null) setInputValues(undefined);
      else ctx.change(undefined, edit);
      return;
    }
    const date = convertDate(`${y}-${m}-${d}`);
    if (date == null) {
      if (ctx.valueRef.current == null) setInputValues(undefined);
      else ctx.change(undefined, edit);
      return;
    }
    const v = DateInput.convertDateToValue(date, props.$typeof);
    if (equals(v, ctx.valueRef.current)) setInputValues(v);
    else ctx.change(v, edit);
  };

  const changeY = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!ctx.editable) return;
    const v = e.currentTarget.value;
    if (!isNumericOrEmpty(v)) {
      e.currentTarget.value = String(cacheY.current || "");
      return;
    }
    cacheY.current = isEmpty(v) ? undefined : Number(v);
    if (v.length === 4) mref.current?.focus();
  };

  const changeM = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!ctx.editable) return;
    const v = e.currentTarget.value;
    if (!isNumericOrEmpty(v)) {
      e.currentTarget.value = String(cacheM.current || "");
      return;
    }
    cacheM.current = isEmpty(v) ? undefined : Number(v);
    if (v.length === 2 || !(v === "1" || v === "2")) dref.current?.focus();
  };

  const changeD = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!ctx.editable) return;
    const v = e.currentTarget.value;
    if (!isNumericOrEmpty(v)) {
      e.currentTarget.value = String(cacheD.current || "");
      return;
    }
    cacheD.current = isEmpty(v) ? undefined : Number(v);
  };

  const setCache = (date: Date, edit = true) => {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    if (minDate) {
      if (DatetimeUtils.isBeforeDate(minDate, date)) {
        year = minDate.getFullYear();
        month = minDate.getMonth() + 1;
        day = minDate.getDate();
      }
    }
    if (maxDate) {
      if (!DatetimeUtils.isBeforeDate(maxDate, date)) {
        year = maxDate.getFullYear();
        month = maxDate.getMonth() + 1;
        day = maxDate.getDate();
      }
    }
    if (!(cacheD.current !== day || cacheM.current !== month || cacheY.current !== year)) return date;
    cacheY.current = year;
    cacheM.current = month;
    cacheD.current = day;
    commitCache(edit);
    return date;
  };

  const updown = (y = 0, m = 0, d = 0, edit = true) => {
    setCache(new Date(
      cacheY.current == null ? initValue.getFullYear() : cacheY.current + y,
      (type === "year" ? 0 : (cacheM.current == null ? initValue.getMonth() + 1 : cacheM.current + m)) - 1,
      type === "date" ? (cacheD.current == null ? initValue.getDate() : cacheD.current + d) : 1
    ), edit);
  };

  const keydownY = (e: React.KeyboardEvent) => {
    if (!ctx.editable) return;
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
    if (!ctx.editable) return;
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
    if (!ctx.editable) return;
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
    if (
      (yref.current != null && e.relatedTarget === yref.current) ||
      (mref.current != null && e.relatedTarget === mref.current) ||
      (dref.current != null && e.relatedTarget === dref.current) ||
      (pref.current != null && e.relatedTarget === pref.current)
    ) return;
    commitCache();
    setShowPicker(false);
  };

  const picker = () => {
    if (!ctx.editable) return;
    if (showPicker) return;
    setShowPicker(true);
  };

  const clear = () => {
    if (!ctx.editable) return;
    ctx.change(undefined);
  };

  const focusInput = (e: React.FocusEvent<HTMLInputElement>) => {
    if (!ctx.editable) return;
    e.currentTarget.select();
  };

  const clickInputs = () => {
    if (!props.$disallowInput) return;
    picker();
  };

  const focus = () => {
    if (props.$disallowInput) yref.current.parentElement?.focus();
    else (dref.current ?? mref.current ?? yref.current)?.focus();
  };

  useEffect(() => {
    setInputValues(ctx.value);
  }, [ctx.value, type]);

  const hasData = ctx.value != null && ctx.value !== "";

  useEffect(() => {
    if (props.$focusWhenMounted) {
      focus();
    }
  }, []);

  if (props.$ref) {
    props.$ref.focus = focus;
    props.$ref.getValue = () => ctx.valueRef.current;
    props.$ref.setValue = (v: any) => ctx.change(v, false);
    props.$ref.setDefaultValue = () => ctx.change(props.$defaultValue, false);
    props.$ref.clear = () => ctx.change(undefined, false);
    props.$ref.addDay = (num = 1) => {
      updown(0, 0, num, false);
      return DatetimeUtils.copy(convertDate(ctx.valueRef.current)!);
    };
    props.$ref.addMonth = (num = 1) => {
      updown(0, num, 0, false);
      return DatetimeUtils.copy(convertDate(ctx.valueRef.current)!);
    };
    props.$ref.addYear = (num = 1) => {
      updown(num, 0, 0, false);
      return DatetimeUtils.copy(convertDate(ctx.valueRef.current)!);
    };
    props.$ref.setFirstDate = () => {
      return setCache(new Date(
        cacheY.current == null ? initValue.getFullYear() : cacheY.current,
        (type === "year" ? 0 : (cacheM.current == null ? initValue.getMonth() + 1 : cacheM.current)) - 1,
        1
      ), false);
    };
    props.$ref.setLastDate = () => {
      return setCache(new Date(
        cacheY.current == null ? initValue.getFullYear() : cacheY.current,
        type === "year" ? 0 : (cacheM.current == null ? initValue.getMonth() + 1 : cacheM.current),
        0
      ), false);
    };
  }

  return (
    <FormItemWrap
      {...props}
      ref={ref}
      $context={ctx}
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
        data-editable={ctx.editable}
        tabIndex={props.$disallowInput ? 0 : undefined}
      >
        <input
          ref={yref}
          className={Style.y}
          type="text"
          disabled={ctx.disabled}
          readOnly={props.$disallowInput || ctx.readOnly}
          maxLength={4}
          tabIndex={props.$disallowInput ? -1 : undefined}
          defaultValue={cacheY.current || ""}
          onChange={changeY}
          onFocus={focusInput}
          onKeyDown={keydownY}
          autoComplete="off"
          inputMode="numeric"
          placeholder={ctx.editable ? props.$yearPlaceholder : ""}
        />
        {type !== "year" &&
          <>
            <span
              className={Style.sep}
              data-has={hasData}
              data-show={hasData || props.$showSeparatorAlwarys === true}
            >
              /
            </span>
            <input
              ref={mref}
              className={Style.m}
              type="text"
              disabled={ctx.disabled}
              readOnly={props.$disallowInput || ctx.readOnly}
              maxLength={2}
              tabIndex={props.$disallowInput ? -1 : undefined}
              defaultValue={cacheM.current || ""}
              onChange={changeM}
              onFocus={focusInput}
              onKeyDown={keydownM}
              autoComplete="off"
              inputMode="numeric"
              placeholder={ctx.editable ? props.$monthPlaceholder : ""}
            />
          </>
        }
        {type === "date" &&
          <>
            <span
              className={Style.sep}
              data-has={hasData}
              data-show={hasData || props.$showSeparatorAlwarys === true}
            >
              /
            </span>
            <input
              ref={dref}
              className={Style.d}
              type="text"
              disabled={ctx.disabled}
              readOnly={props.$disallowInput || ctx.readOnly}
              maxLength={2}
              tabIndex={props.$disallowInput ? -1 : undefined}
              defaultValue={cacheD.current || ""}
              onChange={changeD}
              onFocus={focusInput}
              onKeyDown={keydownD}
              autoComplete="off"
              inputMode="numeric"
              placeholder={ctx.editable ? props.$dayPlaceholder : ""}
            />
          </>
        }
      </div>
      {ctx.editable &&
        <>
          {!props.$disallowInput &&
            <div
              className={Style.picker}
              onClick={picker}
              data-disabled={showPicker}
            >
              <CalendarIcon />
            </div>
          }
          <div
            className={Style.clear}
            onClick={clear}
            data-disabled={!hasData}
          >
            <CrossIcon />
          </div>
        </>
      }
      <Popup
        className={Style.popup}
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
        $mask="transparent"
      >
        <DatePicker
          ref={pref}
          $value={ctx.value || initValue}
          $type={type}
          $typeof={props.$typeof}
          $multiple={false}
          $max={maxDate}
          $min={minDate}
          $validDays={props.$validDays}
          $validDaysMode={props.$validDaysMode}
          $skipValidation
          $onClickPositive={(value: any) => {
            ctx.change(value);
            setShowPicker(false);
            setTimeout(focus);
          }}
          $onClickNegative={() => {
            setShowPicker(false);
            setTimeout(focus);
          }}
          $buttonless={props.$pickerButtonless}
        />
      </Popup>
    </FormItemWrap>
  );
}) as DateBoxFC;

export default DateBox;