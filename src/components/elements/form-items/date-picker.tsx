import { FormItemProps, FormItemWrap, useForm } from "@/components/elements/form";
import React, { ReactNode, useEffect, useMemo, useState } from "react";
import Style from "$/components/elements/form-items/date-picker.module.scss";
import { convertDate } from "@bizhermit/basic-utils/dist/datetime-utils";
import { VscCalendar, VscClose, VscListFlat, VscRecord } from "react-icons/vsc";
import { dateFormat } from "@bizhermit/basic-utils/dist/datetime-utils";
import DatetimeUtils from "@bizhermit/basic-utils/dist/datetime-utils";

type DatePickerMode = "calendar" | "list";

export type DatePickerCommonProps<T> = {
  $type?: "date" | "month" | "year";
  $mode?: DatePickerMode;
  $multiable?: boolean;
  $firstWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  $weekTexts?: "en" | "ja" | [ReactNode, ReactNode, ReactNode, ReactNode, ReactNode, ReactNode, ReactNode];
};

type DatePickerStringProps = FormItemProps<Array<string>> & {
  $typeof?: "string";
} & DatePickerCommonProps<string>;

type DatePickerNumberProps = FormItemProps<Array<number>> & {
  $typeof: "number";
} & DatePickerCommonProps<number>;

type DatePickerDateProps = FormItemProps<Array<Date>> & {
  $typeof: "date";
} & DatePickerCommonProps<Date>;

export type DatePickerProps = DatePickerStringProps | DatePickerNumberProps | DatePickerDateProps;

const today = new Date();
const threshold = 2;

const DatePicker = React.forwardRef<HTMLDivElement, DatePickerProps>((props, ref) => {
  const type = props.$type ?? "date";
  const multiable = props.$multiable === true;
  const [mode, setMode] = useState<DatePickerMode>(() => {
    if (type === "year") return "list";
    if (multiable) return "calendar";
    return props.$mode || "calendar";
  });
  const [year, setYear] = useState<number>();
  const [month, setMonth] = useState<number>();
  const [days, setDays] = useState<Array<Date>>([]);
  const weekTexts = useMemo(() => {
    if (props.$weekTexts == null || props.$weekTexts === "ja") return DatetimeUtils.Week.ja;
    if (props.$weekTexts === "en") return DatetimeUtils.Week.en;
    if (props.$weekTexts.length !== 7) return DatetimeUtils.Week.ja;
    return props.$weekTexts;
  }, [props.$weekTexts]);

  const convertDateToValue = (date: Date) => {
    switch (props.$typeof) {
      case "date":
        return date;
      case "number":
        return date?.getTime();
      default:
        return dateFormat(date);
    }
  };

  const form = useForm<Array<string | number | Date | any>>(props, {

  });

  const yearNodes = useMemo(() => {
    if (year == null) return <></>;
    return <></>;
  }, [year]);

  const monthNodes = useMemo(() => {
    if (month == null) return <></>;
    return <></>;
  }, [month, year]);

  const dayNodes = useMemo(() => {
    if (year == null || month == null) return <></>;
    const nodes = [];
    const cursor = new Date(year, month, 1);
    const firstWeek = props.$firstWeek ?? 0;
    const startWeek = cursor.getDay();
    let beforeLength = (startWeek - firstWeek + 7) % 7 || 7;
    if (beforeLength < threshold) beforeLength += 7;
    DatetimeUtils.addDay(cursor, beforeLength * -1);
    while (cursor.getMonth() < month) {
      nodes.push(
        <div
          key={`b${cursor.getDate()}`}
          className={Style.cell}
          data-state="before"
        >
          {cursor.getDate()}
        </div>
      );
      DatetimeUtils.addDay(cursor, 1);
    }
    while (cursor.getMonth() === month) {
      nodes.push(
        <div
          key={cursor.getDate()}
          className={Style.cell}
          data-state="current"
        >
          {cursor.getDate()}
        </div>
      );
      DatetimeUtils.addDay(cursor, 1);
    }
    for (let i = 0, il = (7 - nodes.length % 7); i < il; i++) {
      nodes.push(
        <div
          key={`a${cursor.getDate()}`}
          className={Style.cell}
          data-state="after"
        >
          {cursor.getDate()}
        </div>
      );
      DatetimeUtils.addDay(cursor, 1);
    }
    return nodes;
  }, [month, year, days]);

  const weekNodes = useMemo(() => {
    const nodes = [];
    for (let i = 0; i < 7; i++) {
      const week = (i + (props.$firstWeek ?? 0)) % 7;
      nodes.push(
        <div
          key={week}
          className={Style.cell}
        >
          {weekTexts[week]}
        </div>
      );
    }
    return nodes;
  }, [props.$firstWeek]);

  const toggleMode = () => {
    if (type === "year") return;
    setMode(cur => {
      if (cur === "calendar") return "list";
      return "calendar";
    });
  };

  useEffect(() => {
    setDays(form.value?.map(v => convertDate(v)!) ?? []);
  }, [form.value]);

  useEffect(() => {
    const vals = form.value ?? [];
    const date = convertDate(vals[vals.length - 1]);
    if (date == null) {
      setYear(today.getFullYear());
      setMonth(today.getMonth());
    } else {
      setYear(date.getFullYear());
      setMonth(date.getMonth());
    }
  }, []);

  return (
    <FormItemWrap
      {...props}
      $$form={form}
      ref={ref}
      $preventFieldLayout
      $useHidden
      $mainProps={{
        className: Style.main
      }}
    >
      <div
        className={Style.content}
        data-mode={mode}
      >
        <div>

        </div>
        <div
          className={Style.week}
        >
          {weekNodes}
        </div>
        <div
          className={Style.date}
        >
          {dayNodes}
        </div>
      </div>
      <div
        className={Style.buttons}
      >
        <div
          className={Style.clear}
        >
          <VscClose />
        </div>
        <div
          className={Style.today}
        >
          <VscRecord />
        </div>
        <div
          className={Style.negative}
        >
          キャンセル
        </div>
        <div
          className={Style.positive}
        >
          OK
        </div>
        {type !== "year" && !multiable &&
          <div
            className={Style.switch}
            onClick={toggleMode}
          >
            {mode === "list" ? <VscCalendar /> : <VscListFlat />}
          </div>
        }
      </div>
    </FormItemWrap>
  );
});

export default DatePicker;