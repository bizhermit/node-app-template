import { convertDataItemValidationToFormItemValidation, FormItemProps, FormItemValidation, FormItemWrap, useDataItemMergedProps, useForm, useFormItemContext } from "@/components/elements/form";
import { isEmpty } from "@bizhermit/basic-utils/dist/string-utils";
import { forwardRef, FunctionComponent, ReactElement, useEffect, useMemo, useRef, useState } from "react";
import Style from "$/components/elements/form-items/time-box.module.scss";
import { VscClose } from "react-icons/vsc";
import { BsClock } from "react-icons/bs";
import Time from "@bizhermit/time";
import Popup from "@/components/elements/popup";
import TimePicker from "@/components/elements/form-items/time-picker";
import { TimeData, TimeInput } from "@/data-items/time";
import { equals } from "@/data-items/utilities";

type TimeBoxBaseProps<T, D extends DataItem_Time | DataItem_Number | DataItem_String | undefined = undefined> = FormItemProps<T, D> & TimeInput.FCProps & {
  $disallowInput?: boolean;
};

type TimeBoxProps_TypeString<D extends DataItem_Time | DataItem_String | undefined = undefined> = TimeBoxBaseProps<string, D>;

type TimeBoxProps_TypeNumber<D extends DataItem_Time | DataItem_Number | undefined = undefined> = TimeBoxBaseProps<number, D>;

export type TimeBoxProps<D extends DataItem_Time | DataItem_Number | DataItem_String | undefined = undefined> = D extends undefined ?
  (
    (TimeBoxProps_TypeNumber & { $typeof?: "number" }) | (TimeBoxProps_TypeString & { $typeof: "string" })
  ) : (
    D extends { type: infer T } ? (
      T extends DataItem_String["type"] ? (TimeBoxProps_TypeString<Exclude<D, DataItem_Number>> & { $typeof?: "string" }) :
      T extends DataItem_Number["type"] ? (TimeBoxProps_TypeNumber<Exclude<D, DataItem_String>> & { $typeof?: "number" }) :
      D extends { typeof: infer R } ? (
        R extends "string" ? (TimeBoxProps_TypeString<Exclude<D, DataItem_Number>> & { $typeof?: "string" }) : (TimeBoxProps_TypeNumber<Exclude<D, DataItem_String>> & { $typeof?: "number" })
      ) : (TimeBoxProps_TypeNumber<Exclude<D, DataItem_String>> & { $typeof?: "number" })
    ) : (TimeBoxProps_TypeNumber & { $typeof?: "number" }) | (TimeBoxProps_TypeString & { $typeof: "string" })
  );

const isNumericOrEmpty = (value?: string): value is string => {
  if (isEmpty(value)) return true;
  return /^[0-9]+$/.test(value);
};

interface TimeBoxFC extends FunctionComponent<TimeBoxProps> {
  <D extends DataItem_Time | DataItem_Number | DataItem_String | undefined = undefined>(attrs: TimeBoxProps<D>, ref?: React.ForwardedRef<HTMLDivElement>): ReactElement<any> | null;
}

const TimeBox: TimeBoxFC = forwardRef<HTMLDivElement, TimeBoxProps>(<
  D extends DataItem_Time | DataItem_Number | DataItem_String | undefined = undefined
>(p: TimeBoxProps<D>, ref: React.ForwardedRef<HTMLDivElement>) => {
  const form = useForm();
  const props = useDataItemMergedProps(form, p, {
    under: ({ dataItem }) => {
      switch (dataItem.type) {
        case "number":
          return {
            $typeof: "number",
            $min: dataItem.min,
            $max: dataItem.max,
          } as TimeBoxProps<D>;
        case "string":
          return {
            $typeof: "string",
            $min: dataItem.minLength,
            $max: dataItem.maxLength,
          } as TimeBoxProps<D>;
        default:
          return {
            $typeof: "number",
            $min: dataItem.min,
            $max: dataItem.max,
            $rangePair: dataItem.rangePair,
          } as TimeBoxProps<D>;
      }
    },
    over: ({ dataItem, props }) => {
      switch (dataItem.type) {
        case "number":
          return {
            $validations: dataItem.validations?.map(f => convertDataItemValidationToFormItemValidation(f, props, dataItem, v => v)),
          } as TimeBoxProps<D>;
        case "string":
          return {
            $validations: dataItem.validations?.map(f => convertDataItemValidationToFormItemValidation(f, props, dataItem, v => v)),
          } as TimeBoxProps<D>;
        default:
          return {
            $validations: dataItem.validations?.map(f => convertDataItemValidationToFormItemValidation(f, props, dataItem, v => v)),
          } as TimeBoxProps<D>;
      }
    },
  });

  const type = props.$type ?? "hm";
  const unit = useMemo(() => {
    return TimeInput.getUnit(props, type);
  }, [type, props.$unit]);
  const minTime = useMemo(() => {
    return TimeInput.getMinTime(props, unit);
  }, [props.$min]);
  const maxTime = useMemo(() => {
    return TimeInput.getMaxTime(props, unit);
  }, [props.$max]);

  const href = useRef<HTMLInputElement>(null!);
  const mref = useRef<HTMLInputElement>(null!);
  const sref = useRef<HTMLInputElement>(null!);
  const cacheH = useRef<number>();
  const cacheM = useRef<number>();
  const cacheS = useRef<number>();
  const needH = type !== "ms";
  const needM = type !== "h";
  const needS = type === "hms" || type === "ms";
  const [showPicker, setShowPicker] = useState(false);

  const ctx = useFormItemContext(form, props, {
    interlockValidation: props.$rangePair != null,
    validations: () => {
      const validations: Array<FormItemValidation<any>> = [];
      if (maxTime != null && minTime != null) {
        validations.push(TimeInput.rangeValidation(minTime, maxTime, type, unit));
      } else {
        if (maxTime != null) {
          validations.push(TimeInput.maxValidation(maxTime, type, unit));
        }
        if (minTime != null) {
          validations.push(TimeInput.minValidation(minTime, type, unit));
        }
      }
      const rangePair = props.$rangePair;
      if (rangePair != null) {
        const { validation } = TimeInput.contextValidation(rangePair, type, unit);
        validations.push(validation);
      }
      return validations;
    },
    validationsDeps: [
      type,
      unit,
      minTime,
      maxTime,
      props.$rangePair?.name,
      props.$rangePair?.position,
      props.$rangePair?.disallowSame,
    ],
  });

  const setInputValues = (value?: TimeValue) => {
    const time = TimeData.convertTime(value, unit);
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
    const i = props.$hourInterval ?? 1;
    return Math.floor(h / i) * i;
  };

  const optimizedIntervalMinute = (m: number | undefined) => {
    if (m == null) return m;
    const i = props.$minuteInterval ?? 1;
    return Math.floor(m / i) * i;
  };

  const optimizedIntervalSecond = (s: number | undefined) => {
    if (s == null) return s;
    const i = props.$secondInterval ?? 1;
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
    ) * 1000, unit, type, props.$typeof);
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
        updown((props.$hourInterval ?? 1), 0, 0);
        e.preventDefault();
        break;
      case "ArrowDown":
        updown((props.$hourInterval ?? 1) * -1, 0, 0);
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
        updown(0, (props.$minuteInterval ?? 1), 0);
        e.preventDefault();
        break;
      case "ArrowDown":
        updown(0, (props.$minuteInterval ?? 1) * -1, 0);
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
        updown(0, 0, (props.$secondInterval ?? 1));
        e.preventDefault();
        break;
      case "ArrowDown":
        updown(0, 0, (props.$secondInterval ?? 1) * -1);
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
    (href.current ?? mref.current ?? sref.current)?.focus();
  };

  useEffect(() => {
    setInputValues(ctx.value);
  }, [ctx.value, type, unit]);

  const hasData = ctx.value != null && ctx.value !== "";

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
      >
        {needH &&
          <input
            ref={href}
            className={Style.h}
            type="text"
            disabled={props.$disallowInput || ctx.disabled}
            readOnly={props.$disallowInput || ctx.readOnly}
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
            disabled={props.$disallowInput || ctx.disabled}
            readOnly={props.$disallowInput || ctx.readOnly}
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
              disabled={props.$disallowInput || ctx.disabled}
              readOnly={props.$disallowInput || ctx.readOnly}
              maxLength={2}
              defaultValue={cacheS.current || ""}
              onFocus={focusInput}
              onKeyDown={keydownS}
              onChange={changeS}
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
          $value={ctx.value}
          $type={type}
          $unit={unit}
          $typeof={props.$typeof}
          $max={props.$max}
          $min={props.$min}
          $hourInterval={props.$hourInterval}
          $minuteInterval={props.$minuteInterval}
          $secondInterval={props.$secondInterval}
          $skipValidation
          $onClickPositive={(value: any) => {
            ctx.change(value);
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