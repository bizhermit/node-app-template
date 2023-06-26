"use client";

import Style from "#/styles/components/elements/form/items/time-picker.module.scss";
import Time from "@bizhermit/time";
import { type ForwardedRef, forwardRef, type FunctionComponent, type ReactElement, type ReactNode, useEffect, useMemo, useRef, useState, type Ref } from "react";
import Text from "#/components/elements/text";
import { TimeData, TimeInput } from "#/data-items/time";
import { CrossIcon } from "#/components/elements/icon";
import type { FormItemProps, FormItemValidation } from "#/components/elements/form/$types";
import { convertDataItemValidationToFormItemValidation } from "#/components/elements/form/utilities";
import useForm from "#/components/elements/form/context";
import { useDataItemMergedProps, useFormItemContext } from "#/components/elements/form/item-hook";
import { FormItemWrap } from "#/components/elements/form/item-wrap";

export type TimePickerBaseProps<T, D extends DataItem_Time | DataItem_Number | DataItem_String | undefined = undefined> = FormItemProps<T, D> & TimeInput.FCProps & {
  ref?: Ref<HTMLDivElement>;
  $onClickPositive?: (value: Nullable<T>) => void;
  $onClickNegative?: () => void;
  $positiveText?: ReactNode;
  $negativeText?: ReactNode;
  $skipValidation?: boolean;
};

type TimePickerProps_TypeString<D extends DataItem_Time | DataItem_String | undefined = undefined> = TimePickerBaseProps<string, D>;

type TimePickerProps_TypeNumber<D extends DataItem_Time | DataItem_Number | undefined = undefined> = TimePickerBaseProps<number, D>;

export type TimePickerProps<D extends DataItem_Time | DataItem_Number | DataItem_String | undefined = undefined> = D extends undefined ?
  (
    (TimePickerProps_TypeNumber & { $typeof?: "number" }) | (TimePickerProps_TypeString & { $typeof: "string" })
  ) :
  (
    D extends { type: infer T } ? (
      T extends DataItem_String["type"] ? (TimePickerProps_TypeString<Exclude<D, DataItem_Number>> & { $typeof?: "string" }) :
      T extends DataItem_Number["type"] ? (TimePickerProps_TypeNumber<Exclude<D, DataItem_String>> & { $typeof?: "number" }) :
      (TimePickerProps_TypeNumber<Exclude<D, DataItem_String>> & { $typeof?: "number" }) | (TimePickerProps_TypeString<Exclude<D, DataItem_Number>> & { $typeof: "string" })
    ) : (TimePickerProps_TypeNumber & { $typeof?: "number" }) | (TimePickerProps_TypeString & { $typeof: "string" })
  )

interface TimePickerFC extends FunctionComponent<TimePickerProps> {
  <D extends DataItem_Time | DataItem_Number | DataItem_String | undefined = undefined>(attrs: TimePickerProps<D>, ref?: ForwardedRef<HTMLDivElement>): ReactElement<any> | null;
}

const TimePicker: TimePickerFC = forwardRef<HTMLDivElement, TimePickerProps>(<
  D extends DataItem_Time | DataItem_Number | DataItem_String | undefined = undefined
>(p: TimePickerProps<D>, ref: ForwardedRef<HTMLDivElement>) => {
  const form = useForm();
  const props = useDataItemMergedProps(form, p, {
    under: ({ dataItem }) => {
      switch (dataItem.type) {
        case "number":
          return {
            $typeof: "number",
            $min: dataItem.min,
            $max: dataItem.max,
          } as TimePickerProps<D>;
        case "string":
          return {
            $typeof: "string",
            $min: dataItem.minLength,
            $max: dataItem.maxLength,
          } as TimePickerProps<D>;
        default:
          return {
            $typeof: dataItem.typeof,
            $min: dataItem.min,
            $max: dataItem.max,
            $rangePair: dataItem.rangePair,
          } as TimePickerProps<D>;
      }
    },
    over: ({ dataItem, props }) => {
      switch (dataItem.type) {
        case "number":
          return {
            $validations: dataItem.validations?.map(f => convertDataItemValidationToFormItemValidation(f, props, dataItem, v => v)),
          } as TimePickerProps<D>;
        case "string":
          return {
            $validations: dataItem.validations?.map(f => convertDataItemValidationToFormItemValidation(f, props, dataItem, v => v)),
          } as TimePickerProps<D>;
        default:
          return {
            $validations: dataItem.validations?.map(f => convertDataItemValidationToFormItemValidation(f, props, dataItem, v => v)),
          } as TimePickerProps<D>;
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

  const hourElemRef = useRef<HTMLDivElement>(null!);
  const minuteElemRef = useRef<HTMLDivElement>(null!);
  const secondElemRef = useRef<HTMLDivElement>(null!);
  const [hour, setHour] = useState<number | undefined>(undefined);
  const [minute, setMinute] = useState<number | undefined>(undefined);
  const [second, setSecond] = useState<number | undefined>(undefined);
  const needH = type !== "ms";
  const needM = type !== "h";
  const needS = type === "hms" || type === "ms";

  const ctx = useFormItemContext(form, props, {
    interlockValidation: props.$rangePair != null,
    validations: () => {
      if (props.$skipValidation) return [];
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
      props.$skipValidation,
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
    ctx.change(TimeInput.convertTimeToValue(time.getTime(), unit, type, props.$typeof));
    if (props.$onClickPositive == null) {
      setTimeout(scrollToSelected, 20);
    }
  };

  const hourNodes = useMemo(() => {
    if (!needH) return [];
    const nodes = [];
    const interval = props.$hourInterval || 1;
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
    props.$hourInterval,
  ]);

  const minuteNodes = useMemo(() => {
    if (!needM) return [];
    const nodes = [];
    const interval = props.$minuteInterval || 1;
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
    props.$minuteInterval,
  ]);

  const secondNodes = useMemo(() => {
    if (!needS) return [];
    const nodes = [];
    const interval = props.$secondInterval || 1;
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
    props.$secondInterval,
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
    const time = TimeData.convertTime(ctx.valueRef.current, unit);
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
  }, [props.$value, props.$bind, ctx.bind]);

  return (
    <FormItemWrap
      tabIndex={-1}
      {...props}
      ref={ref}
      $context={ctx}
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
        {props.$onClickNegative != null &&
          <div
            className={Style.negative}
            onClick={() => {
              scrollToSelected();
              props.$onClickNegative?.();
            }}
          >
            <Text>{props.$negativeText ?? "キャンセル"}</Text>
          </div>
        }
        {props.$onClickPositive != null &&
          <div
            className={Style.positive}
            onClick={() => {
              scrollToSelected();
              props.$onClickPositive?.(ctx.value as never);
            }}
          >
            <Text>{props.$positiveText ?? "OK"}</Text>
          </div>
        }
      </div>
    </FormItemWrap>
  );
});

export default TimePicker;