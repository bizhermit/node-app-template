"use client";

import { forwardRef, useEffect, useMemo, useRef, useState, type ForwardedRef, type FunctionComponent, type ReactElement } from "react";
import TimeInput from "../../../../../data-items/time/input";
import TimeItemUtils from "../../../../../data-items/time/utilities";
import equals from "../../../../../objects/equal";
import { isEmpty } from "../../../../../objects/string/empty";
import Time from "../../../../../objects/time";
import { ClockIcon, CrossIcon } from "../../../icon";
import Popup from "../../../popup";
import useForm from "../../context";
import { convertDataItemValidationToFormItemValidation } from "../../utilities";
import { FormItemWrap } from "../common";
import { useDataItemMergedProps, useFormItemBase, useFormItemContext } from "../hooks";
import TimePicker from "../time-picker";
import Style from "./index.module.scss";

type TimeBoxHook<T extends TimeValue> = F.ItemHook<T>;

export const useTimeBox = <T extends TimeValue>() => useFormItemBase<TimeBoxHook<T>>();

type TimeBoxOptions<D extends DataItem_Time | undefined = undefined> = & TimeInput.FCProps & {
  $ref?: TimeBoxHook<F.VType<TimeValue, D, TimeValue>> | TimeBoxHook<TimeValue>;
  $typeof?: TimeValueType;
  $disallowInput?: boolean;
  $hideClearButton?: boolean;
  $hourPlaceholder?: string;
  $minutePlaceholder?: string;
  $secondPlaceholder?: string;
  $showSeparatorAlwarys?: boolean;
};

type OmitAttrs = "placeholder" | "tabIndex";
export type TimeBoxProps<D extends DataItem_Time | undefined = undefined> =
  OverwriteAttrs<Omit<F.ItemProps<TimeValue, D>, OmitAttrs>, TimeBoxOptions<D>>;

const isNumericOrEmpty = (value?: string): value is string => {
  return isEmpty(value) || /^[0-9]+$/.test(value);
};

interface TimeBoxFC extends FunctionComponent<TimeBoxProps> {
  <D extends DataItem_Time | undefined = undefined>(
    attrs: ComponentAttrsWithRef<HTMLDivElement, TimeBoxProps<D>>
  ): ReactElement<any> | null;
}

const TimeBox = forwardRef(<
  D extends DataItem_Time | undefined = undefined
>(p: TimeBoxProps<D>, ref: ForwardedRef<HTMLDivElement>) => {
  const form = useForm();
  const {
    $typeof,
    $type,
    $unit,
    $min,
    $max,
    $rangePair,
    $hourInterval,
    $minuteInterval,
    $secondInterval,
    $disallowInput,
    $hideClearButton,
    $hourPlaceholder,
    $minutePlaceholder,
    $secondPlaceholder,
    $showSeparatorAlwarys,
    $focusWhenMounted,
    ...$p
  } = useDataItemMergedProps(form, p, {
    under: ({ dataItem }) => {
      return {
        $typeof: dataItem.typeof,
        $min: dataItem.min,
        $max: dataItem.max,
        $rangePair: dataItem.rangePair,
      } as TimeBoxProps<D>;
    },
    over: ({ dataItem, props }) => {
      return {
        $validations: dataItem.validations?.map(f => convertDataItemValidationToFormItemValidation(f, props, dataItem, v => v)),
      } as TimeBoxProps<D>;
    },
  });

  const type = $type ?? "hm";
  const unit = useMemo(() => {
    return TimeInput.getUnit($unit, type);
  }, [type, $unit]);
  const minTime = useMemo(() => {
    return TimeInput.getMinTime($min, unit);
  }, [$min]);
  const maxTime = useMemo(() => {
    return TimeInput.getMaxTime($max, unit);
  }, [$max]);

  const href = useRef<HTMLInputElement>(null!);
  const mref = useRef<HTMLInputElement>(null!);
  const sref = useRef<HTMLInputElement>(null!);
  const pref = useRef<HTMLDivElement>(null!);
  const cacheH = useRef<number>();
  const cacheM = useRef<number>();
  const cacheS = useRef<number>();
  const needH = type !== "ms";
  const needM = type !== "h";
  const needS = type === "hms" || type === "ms";
  const [showPicker, setShowPicker] = useState(false);

  const { ctx, props, $ref } = useFormItemContext(form, $p, {
    interlockValidation: $rangePair != null,
    validations: ({ label }) => {
      const validations: Array<F.Validation<any>> = [];
      if (maxTime != null && minTime != null) {
        validations.push(TimeInput.rangeValidation(minTime, maxTime, type, unit, label));
      } else {
        if (maxTime != null) {
          validations.push(TimeInput.maxValidation(maxTime, type, unit, label));
        }
        if (minTime != null) {
          validations.push(TimeInput.minValidation(minTime, type, unit, label));
        }
      }
      const rangePair = $rangePair;
      if (rangePair != null) {
        const { validation } = TimeInput.contextValidation(rangePair, type, unit, label);
        validations.push(validation);
      }
      return validations;
    },
    validationsDeps: [
      type,
      unit,
      minTime,
      maxTime,
      $rangePair?.name,
      $rangePair?.position,
      $rangePair?.disallowSame,
    ],
  });

  const setInputValues = (value?: TimeValue) => {
    const time = TimeItemUtils.convertTime(value, unit);
    if (time == null) {
      cacheH.current = cacheM.current = cacheS.current = undefined;
    } else {
      const t = new Time(time);
      cacheH.current = t.getHours();
      cacheM.current = t.getMinutes();
      cacheS.current = t.getSeconds();
    }
    if (href.current) href.current.value = String(cacheH.current ?? "");
    if (mref.current) {
      const v = String(cacheM.current ?? "");
      mref.current.value = v ? `00${v}`.slice(-2) : v;
    }
    if (sref.current) {
      const v = String(cacheS.current ?? "");
      sref.current.value = v ? `00${v}`.slice(-2) : v;
    }
  };

  const optimizedIntervalHour = (h: number | undefined) => {
    if (h == null) return h;
    const i = $hourInterval ?? 1;
    return Math.floor(h / i) * i;
  };

  const optimizedIntervalMinute = (m: number | undefined) => {
    if (m == null) return m;
    const i = $minuteInterval ?? 1;
    return Math.floor(m / i) * i;
  };

  const optimizedIntervalSecond = (s: number | undefined) => {
    if (s == null) return s;
    const i = $secondInterval ?? 1;
    return Math.floor(s / i) * i;
  };

  const commitCache = () => {
    const h = optimizedIntervalHour(needH ? cacheH.current : 0);
    const m = optimizedIntervalMinute(needM ? cacheM.current : 0);
    const s = optimizedIntervalSecond(needS ? cacheS.current : 0);
    if ((needH && h == null) || (needM && m == null) || (needS && m == null)) {
      if (ctx.valueRef.current == null) setInputValues(undefined);
      else ctx.change(undefined);
      return;
    }
    const v = TimeInput.convertTimeToValue((
      (h ?? 0) * 3600 +
      (m ?? 0) * 60 +
      (s ?? 0)
    ) * 1000, unit, type, $typeof);
    if (equals(v, ctx.valueRef.current)) {
      setInputValues(v);
    } else {
      ctx.change(v);
    }
  };

  const changeH = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!ctx.editable) return;
    const v = e.currentTarget.value;
    if (!isNumericOrEmpty(v)) {
      e.currentTarget.value = String(cacheH.current || "");
      return;
    }
    cacheH.current = isEmpty(v) ? undefined : Number(v);
    if (v.length === 2) mref.current?.focus();
  };

  const changeM = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!ctx.editable) return;
    const v = e.currentTarget.value;
    if (!isNumericOrEmpty(v)) {
      e.currentTarget.value = String(cacheM.current || "");
      return;
    }
    cacheM.current = isEmpty(v) ? undefined : Number(v);
    if (v.length === 2 || !(v === "1" || v === "2")) mref.current?.focus();
  };

  const changeS = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!ctx.editable) return;
    const v = e.currentTarget.value;
    if (!isNumericOrEmpty(v)) {
      e.currentTarget.value = String(cacheS.current || "");
      return;
    }
    cacheS.current = isEmpty(v) ? undefined : Number(v);
  };

  const updown = (y = 0, m = 0, d = 0) => {
    const time = new Time(Math.max(0, (
      (cacheH.current == null ? 0 : cacheH.current + y) * 3600 +
      (cacheM.current == null ? 0 : cacheM.current + m) * 60 +
      (cacheS.current == null ? 0 : cacheS.current + d)
    )) * 1000);
    if (minTime != null) {
      if (time.getTime() < minTime) return;
    }
    if (maxTime != null) {
      if (time.getTime() > maxTime) return;
    }
    cacheH.current = needH ? time.getHours() : undefined;
    cacheM.current = time.getMinutes(!needH);
    cacheS.current = time.getSeconds();
    commitCache();
  };

  const keydownH = (e: React.KeyboardEvent) => {
    if (!ctx.editable) return;
    switch (e.key) {
      case "F2":
        picker();
        break;
      case "Enter":
        commitCache();
        break;
      case "ArrowUp":
        updown(($hourInterval ?? 1), 0, 0);
        e.preventDefault();
        break;
      case "ArrowDown":
        updown(($hourInterval ?? 1) * -1, 0, 0);
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
        if (e.currentTarget.value.length === 0) href.current?.focus();
        break;
      case "ArrowUp":
        updown(0, ($minuteInterval ?? 1), 0);
        e.preventDefault();
        break;
      case "ArrowDown":
        updown(0, ($minuteInterval ?? 1) * -1, 0);
        e.preventDefault();
        break;
      default:
        break;
    }
  };

  const keydownS = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
        updown(0, 0, ($secondInterval ?? 1));
        e.preventDefault();
        break;
      case "ArrowDown":
        updown(0, 0, ($secondInterval ?? 1) * -1);
        e.preventDefault();
        break;
      default:
        break;
    }
  };

  const blur = (e: React.FocusEvent) => {
    if (
      (href.current != null && e.relatedTarget === href.current) ||
      (mref.current != null && e.relatedTarget === mref.current) ||
      (sref.current != null && e.relatedTarget === sref.current) ||
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
    if ($disallowInput) (href.current ?? mref.current ?? sref.current).parentElement?.focus();
    else (href.current ?? mref.current ?? sref.current)?.focus();
  };

  useEffect(() => {
    setInputValues(ctx.value);
  }, [ctx.value, type, unit]);

  const hasData = ctx.value != null && ctx.value !== "";
  const hasButton = ctx.editable && ($hideClearButton !== true || !$disallowInput);
  const formEnable = !form.disabled && !form.readOnly;

  useEffect(() => {
    if ($focusWhenMounted && formEnable) {
      focus();
    }
  }, [formEnable]);

  if ($ref) {
    $ref.focus = () => focus();
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
        {needH &&
          <input
            ref={href}
            className={Style.h}
            type="text"
            disabled={ctx.disabled}
            readOnly={$disallowInput || ctx.readOnly}
            maxLength={2}
            defaultValue={cacheH.current || ""}
            onFocus={focusInput}
            onKeyDown={keydownH}
            onChange={changeH}
            autoComplete="off"
            inputMode="numeric"
            placeholder={ctx.editable ? $hourPlaceholder : ""}
            data-button={type === "h" && hasButton}
          />
        }
        <span
          className={Style.sep}
          data-has={hasData}
          data-show={hasData || $showSeparatorAlwarys === true}
        >
          :
        </span>
        {needM &&
          <input
            ref={mref}
            className={Style.m}
            type="text"
            disabled={ctx.disabled}
            readOnly={$disallowInput || ctx.readOnly}
            maxLength={2}
            defaultValue={cacheM.current || ""}
            onFocus={focusInput}
            onKeyDown={keydownM}
            onChange={changeM}
            autoComplete="off"
            inputMode="numeric"
            placeholder={ctx.editable ? $minutePlaceholder : ""}
            data-button={type === "hm" && hasButton}
          />
        }
        {needS &&
          <>
            <span
              className={Style.sep}
              data-has={hasData}
              data-show={hasData || $showSeparatorAlwarys === true}
            >
              :
            </span>
            <input
              ref={sref}
              className={Style.s}
              type="text"
              disabled={ctx.disabled}
              readOnly={$disallowInput || ctx.readOnly}
              maxLength={2}
              defaultValue={cacheS.current || ""}
              onFocus={focusInput}
              onKeyDown={keydownS}
              onChange={changeS}
              autoComplete="off"
              inputMode="numeric"
              placeholder={ctx.editable ? $secondPlaceholder : ""}
              data-button={type === "hms" && hasButton}
            />
          </>
        }
      </div>
      {ctx.editable &&
        <>
          {$hideClearButton !== true &&
            <div
              className={Style.clear}
              onClick={clear}
              data-disabled={!hasData}
            >
              <CrossIcon />
            </div>
          }
          {!$disallowInput &&
            <div
              className={Style.picker}
              onClick={picker}
              data-disabled={showPicker}
            >
              <ClockIcon />
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
        <TimePicker
          ref={pref}
          $value={ctx.value}
          $type={type}
          $unit={unit}
          $typeof={$typeof}
          $max={$max}
          $min={$min}
          $hourInterval={$hourInterval}
          $minuteInterval={$minuteInterval}
          $secondInterval={$secondInterval}
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
        />
      </Popup>
    </FormItemWrap>
  );
}) as TimeBoxFC;

export default TimeBox;
