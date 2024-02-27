"use client";

import { forwardRef, useEffect, useMemo, useRef, useState, type ForwardedRef, type FunctionComponent, type ReactElement, type ReactNode } from "react";
import TimeInput from "../../../../../data-items/time/input";
import TimeItemUtils from "../../../../../data-items/time/utilities";
import Time from "../../../../../objects/time";
import { CrossIcon } from "../../../icon";
import Text from "../../../text";
import useForm from "../../context";
import { FormItemWrap } from "../../items/common";
import { useDataItemMergedProps, useFormItemBase, useFormItemContext } from "../../items/hooks";
import { convertDataItemValidationToFormItemValidation } from "../../utilities";
import Style from "./index.module.scss";

type TimePickerHook<T extends TimeValue> = F.ItemHook<T>;

export const useTimePicker = <T extends TimeValue>() => useFormItemBase<TimePickerHook<T>>();

export type TimePickerBaseOptions<D extends DataItem_Time | undefined = undefined> = TimeInput.FCProps & {
  $ref?: TimePickerHook<F.VType<TimeValue, D, TimeValue>> | TimePickerHook<TimeValue>;
  $typeof?: TimeValueType;
  $onClickPositive?: (value: TimeValue | null | undefined) => void;
  $onClickNegative?: () => void;
  $positiveText?: ReactNode;
  $negativeText?: ReactNode;
  $skipValidation?: boolean;
};

type OmitAttrs = "$tagPosition" | "placeholder" | "tabIndex";
export type TimePickerProps<D extends DataItem_Time | undefined = undefined> =
  OverwriteAttrs<Omit<F.ItemProps<TimeValue, D>, OmitAttrs>, TimePickerBaseOptions<D>>;

interface TimePickerFC extends FunctionComponent<TimePickerProps> {
  <D extends DataItem_Time | undefined = undefined>(
    attrs: ComponentAttrsWithRef<HTMLDivElement, TimePickerProps<D>>
  ): ReactElement<any> | null;
}

const TimePicker = forwardRef(<
  D extends DataItem_Time | undefined = undefined
>(p: TimePickerProps<D>, ref: ForwardedRef<HTMLDivElement>) => {
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
    $onClickPositive,
    $onClickNegative,
    $positiveText,
    $negativeText,
    $skipValidation,
    $focusWhenMounted,
    ...$p
  } = useDataItemMergedProps(form, p, {
    under: ({ dataItem }) => {
      return {
        $typeof: dataItem.typeof,
        $min: dataItem.min,
        $max: dataItem.max,
        $rangePair: dataItem.rangePair,
      } as TimePickerProps<D>;
    },
    over: ({ dataItem, props }) => {
      return {
        $validations: dataItem.validations?.map(f => convertDataItemValidationToFormItemValidation(f, props, dataItem, v => v)),
      } as TimePickerProps<D>;
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

  const hourElemRef = useRef<HTMLDivElement>(null!);
  const minuteElemRef = useRef<HTMLDivElement>(null!);
  const secondElemRef = useRef<HTMLDivElement>(null!);
  const [hour, setHour] = useState<number | undefined>(undefined);
  const [minute, setMinute] = useState<number | undefined>(undefined);
  const [second, setSecond] = useState<number | undefined>(undefined);
  const needH = type !== "ms";
  const needM = type !== "h";
  const needS = type === "hms" || type === "ms";

  const { ctx, props, $ref } = useFormItemContext(form, $p, {
    interlockValidation: $rangePair != null,
    validations: ({ label }) => {
      if ($skipValidation) return [];
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
      $skipValidation,
    ],
  });

  const scrollToHourSelected = () => {
    if (hourElemRef.current == null) return;
    const elem = (
      hourElemRef.current.querySelector(`.${Style.cell}[data-selected="true"]`)
      ?? hourElemRef.current.querySelector(`.${Style.cell}[data-today="true"]`)
    ) as HTMLDivElement;
    if (elem == null) return;
    hourElemRef.current.scrollTop = elem.offsetTop + elem.offsetHeight / 2 - hourElemRef.current.clientHeight / 2;
  };

  const scrollToMinuteSelected = () => {
    if (minuteElemRef.current == null) return;
    const elem = (
      minuteElemRef.current.querySelector(`.${Style.cell}[data-selected="true"]`)
      ?? minuteElemRef.current.querySelector(`.${Style.cell}[data-today="true"]`)
    ) as HTMLDivElement;
    if (elem == null) return;
    minuteElemRef.current.scrollTop = elem.offsetTop + elem.offsetHeight / 2 - minuteElemRef.current.clientHeight / 2;
  };

  const scrollToSecondSelected = () => {
    if (secondElemRef.current == null) return;
    const elem = (
      secondElemRef.current.querySelector(`.${Style.cell}[data-selected="true"]`)
      ?? secondElemRef.current.querySelector(`.${Style.cell}[data-today="true"]`)
    ) as HTMLDivElement;
    if (elem == null) return;
    secondElemRef.current.scrollTop = elem.offsetTop + elem.offsetHeight / 2 - secondElemRef.current.clientHeight / 2;
  };

  const scrollToSelected = () => {
    scrollToHourSelected();
    scrollToMinuteSelected();
    scrollToSecondSelected();
  };

  const selectCell = (h: number | undefined, m: number | undefined, s: number | undefined) => {
    const time = new Time((
      (h ?? 0) * 3600 +
      (m ?? 0) * 60 +
      (s ?? 0)
    ) * 1000);
    if (needH) setHour(time.getHours());
    setMinute(time.getMinutes(!needH));
    if (needS) setSecond(time.getSeconds());
    ctx.change(TimeInput.convertTimeToValue(time.getTime(), unit, type, $typeof));
    if ($onClickPositive == null) {
      setTimeout(scrollToSelected, 20);
    }
  };

  const hourNodes = useMemo(() => {
    if (!needH) return [];
    const nodes = [];
    const interval = $hourInterval || 1;
    const select = (h: number) => {
      selectCell(h, minute, second);
    };
    const min = Math.floor(minTime / 3600000);
    const max = Math.floor(maxTime / 3600000);
    for (let i = 0, il = 24; i < il; i++) {
      if (i % interval !== 0) continue;
      nodes.push(
        <div
          key={i}
          className={Style.cell}
          data-selectable={min <= i && i <= max}
          data-selected={hour === i}
          data-current={false}
          onClick={ctx.editable ? () => {
            select(i);
          } : undefined}
        >
          {String(i)}
        </div>
      );
    }
    return nodes;
  }, [
    hour,
    minute,
    second,
    needH,
    ctx.editable,
    minTime,
    maxTime,
    $hourInterval,
  ]);

  const minuteNodes = useMemo(() => {
    if (!needM) return [];
    const nodes = [];
    const interval = $minuteInterval || 1;
    const select = (m: number) => {
      selectCell(hour, m, second);
    };
    const h = needH ? (hour ?? 0) * 3600000 : 0;
    const min = Math.floor((minTime - h) / 60000);
    const max = Math.floor((maxTime - h) / 60000);
    for (let i = 0, il = 60; i < il; i++) {
      if (i % interval !== 0) continue;
      nodes.push(
        <div
          key={i}
          className={Style.cell}
          data-selectable={min <= i && i <= max}
          data-selected={minute === i}
          data-current={false}
          onClick={ctx.editable ? () => {
            select(i);
          } : undefined}
        >
          {needH ? `00${i}`.slice(-2) : String(i)}
        </div>
      );
    }
    return nodes;
  }, [
    hour,
    minute,
    second,
    ctx.editable,
    needM,
    minTime,
    maxTime,
    $minuteInterval,
  ]);

  const secondNodes = useMemo(() => {
    if (!needS) return [];
    const nodes = [];
    const interval = $secondInterval || 1;
    const select = (s: number) => {
      selectCell(hour, minute, s);
    };
    const hm = (hour ?? 0) * 3600000 + (minute ?? 0) * 60000;
    const min = Math.floor((minTime - hm) / 1000);
    const max = Math.floor((maxTime - hm) / 1000);
    for (let i = 0, il = 60; i < il; i++) {
      if (i % interval !== 0) continue;
      nodes.push(
        <div
          key={i}
          className={Style.cell}
          data-selectable={min <= i && i <= max}
          data-selected={second === i}
          data-current={false}
          onClick={ctx.editable ? () => {
            select(i);
          } : undefined}
        >
          {`00${i}`.slice(-2)}
        </div>
      );
    }
    return nodes;
  }, [
    hour,
    minute,
    second,
    ctx.editable,
    needS,
    minTime,
    maxTime,
    $secondInterval,
  ]);

  const clear = () => {
    if (ctx.valueRef.current == null) {
      setHour(undefined);
      setMinute(undefined);
      setSecond(undefined);
    } else {
      ctx.change(undefined);
    }
  };

  useEffect(() => {
    scrollToSecondSelected();
  }, [ctx.editable]);

  useEffect(() => {
    const time = TimeItemUtils.convertTime(ctx.valueRef.current, unit);
    if (time == null) {
      setHour(undefined);
      setMinute(undefined);
      setSecond(undefined);
    } else {
      const t = new Time(time);
      if (needH) setHour(t.getHours());
      else setHour(undefined);
      setMinute(t.getMinutes(!needH));
      if (needS) setSecond(t.getSeconds());
      else setSecond(undefined);
    }
    setTimeout(scrollToSelected, 20);
  }, [
    props.$value,
    // props.$bind,
    ctx.bind,
  ]);

  const focus = () => {
    (hourElemRef.current ?? minuteElemRef.current ?? secondElemRef.current)?.focus();
  };

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
      tabIndex={-1}
      {...props}
      ref={ref}
      $ctx={ctx}
      $preventFieldLayout
      $useHidden
      $mainProps={{
        className: Style.main,
      }}
    >
      <div
        className={Style.content}
        data-type={type}
      >
        {needH &&
          <div
            ref={hourElemRef}
            className={Style.list}
          >
            {hourNodes}
          </div>
        }
        {needM &&
          <div
            ref={minuteElemRef}
            className={Style.list}
          >
            {minuteNodes}
          </div>
        }
        {needS &&
          <div
            ref={secondElemRef}
            className={Style.list}
          >
            {secondNodes}
          </div>
        }
      </div>
      <div className={Style.buttons}>
        {ctx.editable &&
          <div
            className={Style.clear}
            onClick={clear}
          >
            <CrossIcon />
          </div>
        }
        {$onClickNegative != null &&
          <div
            className={Style.negative}
            onClick={() => {
              scrollToSelected();
              $onClickNegative?.();
            }}
          >
            <Text>{$negativeText ?? "キャンセル"}</Text>
          </div>
        }
        {$onClickPositive != null &&
          <div
            className={Style.positive}
            onClick={() => {
              scrollToSelected();
              $onClickPositive?.(ctx.value as never);
            }}
          >
            <Text>{$positiveText ?? "OK"}</Text>
          </div>
        }
      </div>
    </FormItemWrap>
  );
}) as TimePickerFC;

export default TimePicker;
