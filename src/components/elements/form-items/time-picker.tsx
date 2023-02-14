/* eslint-disable react-hooks/rules-of-hooks */
import { FormItemProps, FormItemValidation, FormItemWrap, useForm } from "@/components/elements/form";
import Time from "@bizhermit/time";
import React, { FunctionComponent, ReactElement, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import Style from "$/components/elements/form-items/time-picker.module.scss";
import { VscClose } from "react-icons/vsc";
import LabelText from "@/components/elements/label-text";
import { TimeData, TimeInput } from "@/data-items/time";

export type TimePickerBaseProps<T, D extends DataItem_Time | DataItem_Number | DataItem_String | undefined = undefined> = FormItemProps<T, null, D> & TimeInput.FCProps & {
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
  <D extends DataItem_Time | DataItem_Number | DataItem_String | undefined = undefined>(attrs: TimePickerProps<D>, ref?: React.ForwardedRef<HTMLDivElement>): ReactElement<any> | null;
}

const TimePicker: TimePickerFC = React.forwardRef<HTMLDivElement, TimePickerProps>(<
  D extends DataItem_Time | DataItem_Number | DataItem_String | undefined = undefined
>(p: TimePickerProps<D>, ref: React.ForwardedRef<HTMLDivElement>) => {
  const hourElemRef = useRef<HTMLDivElement>(null!);
  const minuteElemRef = useRef<HTMLDivElement>(null!);
  const secondElemRef = useRef<HTMLDivElement>(null!);
  const [hour, setHour] = useState<number | undefined>(undefined);
  const [minute, setMinute] = useState<number | undefined>(undefined);
  const [second, setSecond] = useState<number | undefined>(undefined);

  const form = useForm(p, {
    setDataItem: (d) => {
      switch (d.type) {
        case "number":
          return {
            $typeof: "number" as "number",
            $min: d.min,
            $max: d.max,
          } as TimePickerProps<D>;
        case "string":
          return {
            $typeof: "string" as "string",
            $min: d.minLength,
            $max: d.maxLength,
          } as TimePickerProps<D>;
        default:
          return {
            $typeof: "number" as "number",
            $min: d.min,
            $max: d.max,
            $rangePair: d.rangePair,
          } as TimePickerProps<D>;
      }
    },
    addStates: (props) => {
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
      return {
        type,
        unit,
        minTime,
        maxTime,
      };
    },
    interlockValidation: (props) => props.$rangePair != null,
    validations: (props, states) => {
      if (props.$skipValidation) return [];
      const validations: Array<FormItemValidation<any>> = [];
      if (states.maxTime != null && states.minTime != null) {
        validations.push(TimeInput.rangeValidation(states.minTime, states.maxTime, states.type, states.unit));
      } else {
        if (states.maxTime != null) {
          validations.push(TimeInput.maxValidation(states.maxTime, states.type, states.unit));
        }
        if (states.minTime != null) {
          validations.push(TimeInput.minValidation(states.minTime, states.type, states.unit));
        }
      }
      const rangePair = props.$rangePair;
      if (rangePair != null) {
        const { validation } = TimeInput.contextValidation(rangePair, states.type, states.unit);
        validations.push(validation);
      }
      return validations;
    },
    validationsDeps: (props, states) => [
      states.type,
      states.unit,
      states.minTime,
      states.maxTime,
      props.$rangePair?.name,
      props.$rangePair?.position,
      props.$rangePair?.disallowSame,
      props.$skipValidation,
    ],
  });

  const {
    type,
    unit,
    minTime,
    maxTime,
  } = form.states;

  const needH = type !== "ms";
  const needM = type !== "h";
  const needS = type === "hms" || type === "ms";

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
    form.change(TimeInput.convertTimeToValue(time.getTime(), unit, type, form.props.$typeof));
    if (form.props.$onClickPositive == null) {
      setTimeout(scrollToSelected, 20);
    }
  };

  const hourNodes = useMemo(() => {
    if (!needH) return [];
    const nodes = [];
    const interval = form.props.$hourInterval || 1;
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
    minute,
    second,
    needH,
    form.editable,
    minTime,
    maxTime,
    form.props.$hourInterval,
  ]);

  const minuteNodes = useMemo(() => {
    if (!needM) return [];
    const nodes = [];
    const interval = form.props.$minuteInterval || 1;
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
          onClick={form.editable ? () => {
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
    form.editable,
    needM,
    minTime,
    maxTime,
    form.props.$minuteInterval,
  ]);

  const secondNodes = useMemo(() => {
    if (!needS) return [];
    const nodes = [];
    const interval = form.props.$secondInterval || 1;
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
          onClick={form.editable ? () => {
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
    form.editable,
    needS,
    minTime,
    maxTime,
    form.props.$secondInterval,
  ]);

  const clear = () => {
    if (form.valueRef.current == null) {
      setHour(undefined);
      setMinute(undefined);
      setSecond(undefined);
    } else {
      form.change(undefined);
    }
  };

  useEffect(() => {
    scrollToSecondSelected();
  }, [form.editable]);

  useEffect(() => {
    const time = TimeData.convertTime(form.valueRef.current, unit);
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
  }, [form.props.$value, form.props.$bind, form.bind]);

  return (
    <FormItemWrap
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
        {form.props.$onClickNegative != null &&
          <div
            className={Style.negative}
            onClick={() => {
              scrollToSelected();
              form.props.$onClickNegative?.();
            }}
          >
            <LabelText>{form.props.$negativeText ?? "キャンセル"}</LabelText>
          </div>
        }
        {form.props.$onClickPositive != null &&
          <div
            className={Style.positive}
            onClick={() => {
              scrollToSelected();
              form.props.$onClickPositive?.(form.value as never);
            }}
          >
            <LabelText>{form.props.$positiveText ?? "OK"}</LabelText>
          </div>
        }
      </div>
    </FormItemWrap>
  );
});

export default TimePicker;