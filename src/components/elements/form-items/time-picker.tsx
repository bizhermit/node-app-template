import { FormItemProps, FormItemValidation, FormItemWrap, useForm } from "@/components/elements/form";
import { convertTime, getMaxTime, getMinTime, getUnit, maxTimeValidation, minTimeValidation, rangeTimeValidation, timeContextValidation, TimeInputProps } from "@/utilities/time-input";
import Time, { TimeUtils } from "@bizhermit/time";
import React, { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import Style from "$/components/elements/form-items/time-picker.module.scss";
import { VscClose, VscRecord } from "react-icons/vsc";
import LabelText from "@/components/elements/label-text";

export type TimePickerBaseProps<T> = FormItemProps<T> & TimeInputProps & {
  $onClickPositive?: (value: Nullable<T>) => void;
  $onClickNegative?: () => void;
  $positiveText?: ReactNode;
  $negativeText?: ReactNode;
  $skipValidation?: boolean;
};

type TimePickerProps_TypeString = TimePickerBaseProps<string>;

type TimePickerProps_TypeNumber = TimePickerBaseProps<number>;

export type TimePickerProps = (TimePickerProps_TypeString & { $typeof?: "string" })
  | (TimePickerProps_TypeNumber & { $typeof: "number" });

const TimePicker = React.forwardRef<HTMLDivElement, TimePickerProps>((props, ref) => {
  const type = props.$type ?? "hm";
  const unit = useMemo(() => {
    return getUnit(props, type);
  }, [type, props.$unit]);
  const minTime = useMemo(() => {
    return getMinTime(props, unit);
  }, [props.$min]);
  const maxTime = useMemo(() => {
    return getMaxTime(props, unit);
  }, [props.$max]);

  const needH = type !== "ms";
  const needM = type !== "h";
  const needS = type === "hms" || type === "ms";
  const hourElemRef = useRef<HTMLDivElement>(null!);
  const minuteElemRef = useRef<HTMLDivElement>(null!);
  const secondElemRef = useRef<HTMLDivElement>(null!);
  const [hour, setHour] = useState<number>();
  const [minute, setMinute] = useState<number>();
  const [second, setSecond] = useState<number>();

  const form = useForm<any>(props, {
    interlockValidation: props.$rangePair != null,
    validations: () => {
      const validations: Array<FormItemValidation<any>> = [];
      if (maxTime != null && minTime != null) {
        validations.push(rangeTimeValidation(minTime, maxTime, type, unit));
      } else {
        if (maxTime != null) {
          validations.push(maxTimeValidation(maxTime, type, unit));
        }
        if (minTime != null) {
          validations.push(minTimeValidation(minTime, type, unit));
        }
      }
      const rangePair = props.$rangePair;
      if (rangePair != null) {
        const { validation } = timeContextValidation(rangePair, unit);
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

  const selectCell = (h: number | undefined, m: number | undefined, s: number | undefined, commit?: boolean) => {
    const time = new Time((
      (h ?? 0) * 3600 +
      (m ?? 0) * 60 +
      (s ?? 0)
    ) * 1000);
    if (needH) setHour(time.getHours());
    setMinute(time.getMinutes(!needH));
    if (needS) setSecond(time.getSeconds());
    if (commit) {
      form.change(TimeUtils.convertMillisecondsToUnit(time.getTime(), unit));
    }
  };

  const hourNodes = useMemo(() => {
    if (!needH) return [];
    const nodes = [];
    const interval = props.$hourInterval || 1;
    const select = (h: number) => {
      selectCell(h, minute, second, true);
    };
    for (let i = 0, il = 24; i < il; i++) {
      if (i % interval !== 0) continue;
      nodes.push(
        <div
          key={i}
          className={Style.cell}
          data-selectable={true}
          data-selected={hour === i}
          data-current={false}
          onClick={form.editable ? () => {
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
    needH,
    form.editable,
    minTime,
    maxTime,
    props.$hourInterval,
  ]);

  const minuteNodes = useMemo(() => {
    if (!needM) return [];
    const nodes = [];
    const interval = props.$minuteInterval || 1;
    const select = (m: number) => {
      selectCell(hour, m, second, true);
    };
    for (let i = 0, il = 60; i < il; i++) {
      if (i % interval !== 0) continue;
      nodes.push(
        <div
          key={i}
          className={Style.cell}
          data-selectable={true}
          data-selected={minute === i}
          data-current={false}
          onClick={form.editable ? () => {
            select(i);
          } : undefined}
        >
          {String(i)}
        </div>
      );
    }
    return nodes;
  }, [
    minute,
    form.editable,
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
      selectCell(hour, minute, s, true);
    };
    for (let i = 0, il = 60; i < il; i++) {
      if (i % interval !== 0) continue;
      nodes.push(
        <div
          key={i}
          className={Style.cell}
          data-selectable={true}
          data-selected={second === i}
          data-current={false}
          onClick={form.editable ? () => {
            select(i);
          } : undefined}
        >
          {String(i)}
        </div>
      );
    }
    return nodes;
  }, [
    second,
    form.editable,
    needS,
    minTime,
    maxTime,
    props.$secondInterval,
  ]);

  const clear = () => {
    form.change(undefined);
  };

  useEffect(() => {
    if (hourElemRef.current == null) return;
    const elem = (
      hourElemRef.current.querySelector(`.${Style.cell}[data-selected="true"]`)
      ?? hourElemRef.current.querySelector(`.${Style.cell}[data-today="true"]`)
    ) as HTMLDivElement;
    if (elem == null) return;
    hourElemRef.current.scrollTop = elem.offsetTop + elem.offsetHeight / 2 - hourElemRef.current.clientHeight / 2;
  }, [hourNodes, form.editable]);

  useEffect(() => {
    if (minuteElemRef.current == null) return;
    const elem = (
      minuteElemRef.current.querySelector(`.${Style.cell}[data-selected="true"]`)
      ?? minuteElemRef.current.querySelector(`.${Style.cell}[data-today="true"]`)
    ) as HTMLDivElement;
    if (elem == null) return;
    minuteElemRef.current.scrollTop = elem.offsetTop + elem.offsetHeight / 2 - minuteElemRef.current.clientHeight / 2;
  }, [minuteNodes, form.editable]);

  useEffect(() => {
    if (secondElemRef.current == null) return;
    const elem = (
      secondElemRef.current.querySelector(`.${Style.cell}[data-selected="true"]`)
      ?? secondElemRef.current.querySelector(`.${Style.cell}[data-today="true"]`)
    ) as HTMLDivElement;
    if (elem == null) return;
    secondElemRef.current.scrollTop = elem.offsetTop + elem.offsetHeight / 2 - secondElemRef.current.clientHeight / 2;
  }, [secondNodes, form.editable]);

  useEffect(() => {
    const time = convertTime(form.valueRef.current, unit);
    if (time == null) {
      setHour(needH ? 0 : undefined);
      setMinute(needM ? 0 : undefined);
      setSecond(needS ? 0 : undefined);
    } else {
      const t = new Time (time);
      if (needH) setHour(t.getHours());
      else setHour(undefined);
      setMinute(t.getMinutes(!needH));
      if (needS) setSecond(t.getSeconds());
      else setSecond(undefined);
    }
  }, [props.$value, props.$bind, form.bind]);

  return (
    <FormItemWrap
      {...props}
      $$form={form}
      ref={ref}
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
        {form.editable &&
          <div
            className={Style.clear}
            onClick={clear}
          >
            <VscClose />
          </div>
        }
        {props.$onClickNegative != null &&
          <div
            className={Style.negative}
            onClick={props.$onClickNegative}
          >
            <LabelText>{props.$negativeText ?? "キャンセル"}</LabelText>
          </div>
        }
        {props.$onClickPositive != null &&
          <div
            className={Style.positive}
            onClick={() => {
              props.$onClickPositive?.(form.value as never);
            }}
          >
            <LabelText>{props.$positiveText ?? "OK"}</LabelText>
          </div>
        }
      </div>
    </FormItemWrap>
  );
});

export default TimePicker;