import { FormItemProps, FormItemWrap, useForm } from "@/components/elements/form";
import React, { ReactNode, useEffect, useMemo, useState } from "react";
import Style from "$/components/elements/form-items/date-picker.module.scss";
import { convertDate } from "@bizhermit/basic-utils/dist/datetime-utils";
import { VscCalendar, VscClose, VscListFlat, VscRecord } from "react-icons/vsc";
import { dateFormat } from "@bizhermit/basic-utils/dist/datetime-utils";
import DatetimeUtils from "@bizhermit/basic-utils/dist/datetime-utils";

type DatePickerMode = "calendar" | "list";

export type DatePickerCommonProps = {
  $type?: "date" | "month" | "year";
  $mode?: DatePickerMode;
  $firstWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  $weekTexts?: "en" | "ja" | [ReactNode, ReactNode, ReactNode, ReactNode, ReactNode, ReactNode, ReactNode];
};

type DatePickerStringProps =
  (FormItemProps<string> & {
    $typeof?: "string";
    $multiable?: false;
  }) |
  (FormItemProps<Array<string>> & {
    $typeof?: "string";
    $multiable: true;
  });

type DatePickerNumberProps =
  (FormItemProps<number> & {
    $typeof: "number";
    $multiable?: false;
  }) |
  (FormItemProps<Array<number>> & {
    $typeof: "number";
    $multiable: true;
  });

type DatePickerDateProps =
  (FormItemProps<Array<Date>> & {
    $typeof: "date";
    $multiable?: false;
  }) |
  (FormItemProps<Array<Date>> & {
    $typeof: "date";
    $multiable: true;
  });

export type DatePickerProps =
  (DatePickerStringProps | DatePickerNumberProps | DatePickerDateProps)
  & DatePickerCommonProps;

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

  const form = useForm<string | number | Date | Array<string | number | Date> | any>(props, {

  });

  const getArrayValue = () => {
    const v = form.valueRef.current;
    if (v == null) return [];
    if (Array.isArray(v)) return v;
    return [v];
  };

  const yearNodes = useMemo(() => {
    if (year == null) return [];
    return [];
  }, [year]);

  const monthNodes = useMemo(() => {
    if (month == null) return [];
    return [];
  }, [month, year]);

  const dayNodes = useMemo(() => {
    if (year == null || month == null) return [];
    const nodes = [];
    const cursor = new Date(year, month, 1);
    const firstWeek = props.$firstWeek ?? 0;
    const startWeek = cursor.getDay();
    let beforeLength = (startWeek - firstWeek + 7) % 7 || 7;
    if (beforeLength < threshold) beforeLength += 7;
    DatetimeUtils.addDay(cursor, beforeLength * -1);
    let findCount = 0;
    const isSelected = (date: Date) => {
      if (days.length === findCount) return false;
      const ret = days.find(v => DatetimeUtils.equalDate(v, date)) != null;
      if (ret) findCount++;
      return ret;
    };
    const select = (dateStr: string, selected: boolean) => {
      const date = convertDate(dateStr)!;
      if (!multiable) {
        form.change(convertDateToValue(date));
        return;
      }
      if (selected) {
        const vals = [...getArrayValue()];
        const index = vals.findIndex(v => DatetimeUtils.equalDate(convertDate(v), date));
        vals.splice(index, 1);
        form.change(vals);
        return;
      }
      const vals = [...getArrayValue()];
      vals.push(convertDateToValue(date));
      form.change(vals.sort((d1, d2) => {
        return DatetimeUtils.isBefore(convertDate(d1)!, convertDate(d2)!) ? 1 : -1;
      }));
    };
    while (cursor.getMonth() < month) {
      const dateStr = dateFormat(cursor)!;
      const selected = isSelected(cursor);
      nodes.push(
        <div
          key={`b${cursor.getDate()}`}
          className={Style.cell}
          data-state="before"
          data-selected={selected}
          onClick={() => {
            select(dateStr, selected);
          }}
        >
          {cursor.getDate()}
        </div>
      );
      DatetimeUtils.addDay(cursor, 1);
    }
    while (cursor.getMonth() === month) {
      const dateStr = dateFormat(cursor)!;
      const selected = isSelected(cursor);
      nodes.push(
        <div
          key={cursor.getDate()}
          className={Style.cell}
          data-state="current"
          data-selected={selected}
          onClick={() => {
            select(dateStr, selected);
          }}
        >
          {cursor.getDate()}
        </div>
      );
      DatetimeUtils.addDay(cursor, 1);
    }
    for (let i = 0, il = (7 - nodes.length % 7); i < il; i++) {
      const dateStr = dateFormat(cursor)!;
      const selected = isSelected(cursor);
      nodes.push(
        <div
          key={`a${cursor.getDate()}`}
          className={Style.cell}
          data-state="after"
          data-selected={selected}
          onClick={() => {
            select(dateStr, selected);
          }}
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
    setDays(
      getArrayValue()
        .map(v => convertDate(v)!)
        .filter(v => v != null)
      ?? []
    );
  }, [form.value]);

  useEffect(() => {
    const vals = getArrayValue();
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
        {mode === "calendar" &&
          <div
            className={Style.week}
          >
            {weekNodes}
          </div>
        }
        <div
          className={Style.date}
          data-rows={dayNodes.length % 7}
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