"use client";

import { forwardRef, useEffect, useMemo, useRef, useState, type ForwardedRef, type FunctionComponent, type ReactElement } from "react";
import DateInput from "../../../../../data-items/date/input";
import DateItemUtils from "../../../../../data-items/date/utilities";
import { isBeforeDate } from "../../../../../objects/date/compare";
import formatDate from "../../../../../objects/date/format";
import parseDate from "../../../../../objects/date/parse";
import equals from "../../../../../objects/equal";
import { isEmpty } from "../../../../../objects/string/empty";
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
type DateBoxHook<T extends DateValue> = F.ItemHook<T, DateBoxHookAddon>;

export const useDateBox = <T extends DateValue>() => useFormItemBase<DateBoxHook<T>>(e => {
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

type DateBoxOptions<D extends DataItem_Date | undefined = undefined> = DateInput.FCPorps & {
  $ref?: DateBoxHook<F.VType<DateValue, D, DateValue>> | DateBoxHook<DateValue>;
  $typeof?: DateValueType;
  $disallowInput?: boolean;
  $pickerButtonless?: boolean;
  $yearPlaceholder?: string;
  $monthPlaceholder?: string;
  $dayPlaceholder?: string;
  $showSeparatorAlwarys?: boolean;
};

type OmitAttrs = "placeholder" | "tabIndex";
export type DateBoxProps<D extends DataItem_Date | undefined = undefined> =
  OverwriteAttrs<Omit<F.ItemProps<DateValue, D>, OmitAttrs>, DateBoxOptions<D>>;

const isNumericOrEmpty = (value?: string): value is string => {
  if (isEmpty(value)) return true;
  return /^[0-9]+$/.test(value);
};

interface DateBoxFC extends FunctionComponent<DateBoxProps> {
  <D extends DataItem_Date | undefined = undefined>(
    attrs: ComponentAttrsWithRef<HTMLDivElement, DateBoxProps<D>>
  ): ReactElement<any> | null;
}

const DateBox = forwardRef(<
  D extends DataItem_Date | undefined = undefined
>(p: DateBoxProps<D>, ref: ForwardedRef<HTMLDivElement>) => {
  const form = useForm();
  const {
    $type,
    $min,
    $max,
    $rangePair,
    $validDays,
    $validDaysMode,
    $initValue,
    $typeof,
    $disallowInput,
    $pickerButtonless,
    $yearPlaceholder,
    $monthPlaceholder,
    $dayPlaceholder,
    $showSeparatorAlwarys,
    $focusWhenMounted,
    ...$p
  } = useDataItemMergedProps(form, p, {
    under: ({ dataItem }) => {
      return {
        $type: dataItem.type as DateType,
        $typeof: dataItem.typeof,
        $min: dataItem.min,
        $max: dataItem.max,
        $rangePair: dataItem.rangePair,
      } as DateBoxProps<D>;
    },
    over: ({ dataItem, props }) => {
      return {
        $validations: dataItem.validations?.map(f => convertDataItemValidationToFormItemValidation(f, props, dataItem, parseDate)),
      } as DateBoxProps<D>;
    },
  });

  const type = $type ?? "date";
  const minDate = useMemo(() => {
    return DateInput.getMinDate($min);
  }, [$min]);
  const maxDate = useMemo(() => {
    return DateInput.getMaxDate($max);
  }, [$max]);
  const judgeValid = useMemo(() => {
    return DateInput.selectableValidation($validDays, $validDaysMode);
  }, [$validDays, $validDaysMode]);

  const initValue = useMemo(() => {
    return DateInput.getInitValue($initValue);
  }, [$initValue]);

  const yref = useRef<HTMLInputElement>(null!);
  const mref = useRef<HTMLInputElement>(null!);
  const dref = useRef<HTMLInputElement>(null!);
  const pref = useRef<HTMLDivElement>(null!);
  const cacheY = useRef<number>();
  const cacheM = useRef<number>();
  const cacheD = useRef<number>();
  const [showPicker, setShowPicker] = useState(false);

  const { ctx, props, $ref } = useFormItemContext(form, $p, {
    interlockValidation: $rangePair != null,
    receive: (v): any => {
      if (v == null) return v;
      switch ($typeof) {
        case "date": return parseDate(v);
        case "number": return parseDate(v)?.getTime();
        default: return formatDate(v);
      }
    },
    validations: ({ label }) => {
      const validations: Array<F.Validation<any>> = [];
      const max = DateItemUtils.dateAsLast(maxDate, type);
      const min = DateItemUtils.dateAsFirst(minDate, type);
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
      const rangePair = $rangePair;
      if (rangePair != null) {
        const { validation } = DateInput.contextValidation(rangePair, type, label);
        validations.push(validation);
      }
      if ($validDays) {
        const judge = (value: DateValue | null) => {
          const date = parseDate(value);
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
      $rangePair?.name,
      $rangePair?.position,
      $rangePair?.disallowSame,
      judgeValid,
    ],
  });

  const setInputValues = (value?: DateValue) => {
    const date = parseDate(value);
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
    const date = parseDate(`${y}-${m}-${d}`);
    if (date == null) {
      if (ctx.valueRef.current == null) setInputValues(undefined);
      else ctx.change(undefined, edit);
      return;
    }
    const v = DateInput.convertDateToValue(date, $typeof);
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
      if (isBeforeDate(minDate, date)) {
        year = minDate.getFullYear();
        month = minDate.getMonth() + 1;
        day = minDate.getDate();
      }
    }
    if (maxDate) {
      if (!isBeforeDate(maxDate, date)) {
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
      (type === "year" ? 1 : (cacheM.current == null ? initValue.getMonth() + 1 : cacheM.current + m)) - 1,
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
    if (!$disallowInput) return;
    picker();
  };

  const focus = () => {
    if ($disallowInput) yref.current.parentElement?.focus();
    else (dref.current ?? mref.current ?? yref.current)?.focus();
  };

  useEffect(() => {
    setInputValues(ctx.value);
  }, [ctx.value, type]);

  const hasData = ctx.value != null && ctx.value !== "";
  const formEnable = !form.disabled && !form.readOnly;

  useEffect(() => {
    if ($focusWhenMounted && formEnable) {
      focus();
    }
  }, [formEnable]);

  if ($ref) {
    $ref.focus = focus;
    $ref.addDay = (num = 1) => {
      updown(0, 0, num, false);
      return parseDate(ctx.valueRef.current)!;
    };
    $ref.addMonth = (num = 1) => {
      updown(0, num, 0, false);
      return parseDate(ctx.valueRef.current)!;
    };
    $ref.addYear = (num = 1) => {
      updown(num, 0, 0, false);
      return parseDate(ctx.valueRef.current)!;
    };
    $ref.setFirstDate = () => {
      return setCache(new Date(
        cacheY.current == null ? initValue.getFullYear() : cacheY.current,
        (type === "year" ? 0 : (cacheM.current == null ? initValue.getMonth() + 1 : cacheM.current)) - 1,
        1
      ), false);
    };
    $ref.setLastDate = () => {
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
      $ctx={ctx}
      $useHidden
      $hasData={hasData}
      $mainProps={{
        onBlur: blur,
      }}
    >
      <div
        className={Style.inputs}
        onClick={clickInputs}
        data-input={!$disallowInput}
        data-editable={ctx.editable}
      >
        <input
          ref={yref}
          className={Style.y}
          type="text"
          disabled={ctx.disabled}
          readOnly={$disallowInput || ctx.readOnly}
          maxLength={4}
          defaultValue={cacheY.current || ""}
          onChange={changeY}
          onFocus={focusInput}
          onKeyDown={keydownY}
          autoComplete="off"
          inputMode="numeric"
          placeholder={ctx.editable ? $yearPlaceholder : ""}
        />
        {type !== "year" &&
          <>
            <span
              className={Style.sep}
              data-has={hasData}
              data-show={hasData || $showSeparatorAlwarys === true}
            >
              /
            </span>
            <input
              ref={mref}
              className={Style.m}
              type="text"
              disabled={ctx.disabled}
              readOnly={$disallowInput || ctx.readOnly}
              maxLength={2}
              defaultValue={cacheM.current || ""}
              onChange={changeM}
              onFocus={focusInput}
              onKeyDown={keydownM}
              autoComplete="off"
              inputMode="numeric"
              placeholder={ctx.editable ? $monthPlaceholder : ""}
            />
          </>
        }
        {type === "date" &&
          <>
            <span
              className={Style.sep}
              data-has={hasData}
              data-show={hasData || $showSeparatorAlwarys === true}
            >
              /
            </span>
            <input
              ref={dref}
              className={Style.d}
              type="text"
              disabled={ctx.disabled}
              readOnly={$disallowInput || ctx.readOnly}
              maxLength={2}
              defaultValue={cacheD.current || ""}
              onChange={changeD}
              onFocus={focusInput}
              onKeyDown={keydownD}
              autoComplete="off"
              inputMode="numeric"
              placeholder={ctx.editable ? $dayPlaceholder : ""}
            />
          </>
        }
      </div>
      {ctx.editable &&
        <>
          <div
            className={Style.clear}
            onClick={clear}
            data-disabled={!hasData}
          >
            <CrossIcon />
          </div>
          {!$disallowInput &&
            <div
              className={Style.picker}
              onClick={picker}
              data-disabled={showPicker}
            >
              <CalendarIcon />
            </div>
          }
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
        $preventFocus
      >
        <DatePicker
          ref={pref}
          $value={ctx.value || initValue}
          $type={type}
          $typeof={$typeof}
          $multiple={false}
          $max={maxDate}
          $min={minDate}
          $validDays={$validDays}
          $validDaysMode={$validDaysMode}
          $skipValidation
          $onClickPositive={(value) => {
            ctx.change(value);
            setShowPicker(false);
            setTimeout(focus);
          }}
          $onClickNegative={() => {
            setShowPicker(false);
            setTimeout(focus);
          }}
          $positiveButtonless
          $buttonless={$pickerButtonless}
        />
      </Popup>
    </FormItemWrap>
  );
}) as DateBoxFC;

export default DateBox;