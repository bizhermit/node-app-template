import { FormItemProps, FormItemValidation, FormItemWrap, formValidationMessages, useForm } from "@/components/elements/form";
import React, { Key, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import Style from "$/components/elements/form-items/date-picker.module.scss";
import { convertDate } from "@bizhermit/basic-utils/dist/datetime-utils";
import { VscCalendar, VscChevronLeft, VscChevronRight, VscClose, VscListFlat, VscRecord } from "react-icons/vsc";
import { dateFormat } from "@bizhermit/basic-utils/dist/datetime-utils";
import DatetimeUtils from "@bizhermit/basic-utils/dist/datetime-utils";
import ArrayUtils from "@bizhermit/basic-utils/dist/array-utils";
import LabelText from "@/components/elements/label-text";

type DatePickerMode = "calendar" | "list";
type DatePickerType = "date" | "month" | "year";
const monthTextsNum = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"] as const;

export type DatePickerCommonProps = {
  $type?: DatePickerType;
  $mode?: DatePickerMode;
  $firstWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  $monthTexts?: "en" | "en-s" | "ja" | "num" | [string, string, string, string, string, string, string, string, string, string, string, string];
  $weekTexts?: "en" | "ja" | [ReactNode, ReactNode, ReactNode, ReactNode, ReactNode, ReactNode, ReactNode];
  $onClickNegative?: () => void;
  $positiveText?: ReactNode;
  $negativeText?: ReactNode;
  $min?: string | number | Date;
  $max?: string | number | Date;
  $rangePair?: {
    name: string;
    position: "before" | "after";
    disallowSame?: boolean;
  }
};

type DatePickerStringProps =
  (FormItemProps<string> & {
    $typeof?: "string";
    $multiable?: false;
    $onClickPositive?: (value: Nullable<string>) => void;
  }) |
  (FormItemProps<Array<string>> & {
    $typeof?: "string";
    $multiable: true;
    $onClickPositive?: (value: Array<Nullable<string>>) => void;
  });

type DatePickerNumberProps =
  (FormItemProps<number> & {
    $typeof: "number";
    $multiable?: false;
    $onClickPositive?: (value: Nullable<number>) => void;
  }) |
  (FormItemProps<Array<number>> & {
    $typeof: "number";
    $multiable: true;
    $onClickPositive?: (value: Array<Nullable<number>>) => void;
  });

type DatePickerDateProps =
  (FormItemProps<Date> & {
    $typeof: "date";
    $multiable?: false;
    $onClickPositive?: (value: Nullable<Date>) => void;
  }) |
  (FormItemProps<Array<Date>> & {
    $typeof: "date";
    $multiable: true;
    $onClickPositive?: (value: Array<Nullable<Date>>) => void;
  });

export type DatePickerProps =
  (DatePickerStringProps | DatePickerNumberProps | DatePickerDateProps)
  & DatePickerCommonProps;

const today = new Date();
const threshold = 2;

const convertDateToValue = (date: Date, $typeof: "string" | "number" | "date" | undefined) => {
  switch ($typeof) {
    case "date":
      return date;
    case "number":
      return date?.getTime();
    default:
      return dateFormat(date);
  }
};

const toStr = (time?: number, type?: DatePickerType) => {
  if (time == null) return "";
  if (type === "year") return dateFormat(time, "yyyy年");
  if (type === "month") return dateFormat(time, "yyyy/MM");
  return dateFormat(time, "yyyy/MM/dd");
};

const multiValidationIterator = (v: any, func: (value: string | number | Date) => string) => {
  if (v == null || !Array.isArray(v)) return "";
  for (let i = 0, il = v.length; i < il; i++) {
    const ret = func(v[i]);
    if (ret) return ret;
  }
  return "";
};

const DatePicker = React.forwardRef<HTMLDivElement, DatePickerProps>((props, ref) => {
  const yearElemRef = useRef<HTMLDivElement>(null!);
  const monthElemRef = useRef<HTMLDivElement>(null!);
  const dayElemRef = useRef<HTMLDivElement>(null!);
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
  const monthTexts = useMemo(() => {
    if (props.$monthTexts == null || props.$monthTexts === "num") return monthTextsNum;
    if (props.$monthTexts === "en") return DatetimeUtils.Month.En;
    if (props.$monthTexts === "en-s") return DatetimeUtils.Month.en;
    if (props.$monthTexts === "ja") return DatetimeUtils.Month.Ja;
    if (props.$monthTexts.length !== 12) return monthTextsNum;
    return props.$monthTexts;
  }, [props.$monthTexts]);
  const weekTexts = useMemo(() => {
    if (props.$weekTexts == null || props.$weekTexts === "ja") return DatetimeUtils.Week.ja;
    if (props.$weekTexts === "en") return DatetimeUtils.Week.en;
    if (props.$weekTexts.length !== 7) return DatetimeUtils.Week.ja;
    return props.$weekTexts;
  }, [props.$weekTexts]);
  const minDate = useMemo(() => {
    return convertDate(props.$min) ?? new Date(1900, 0, 1);
  }, [props.$min]);
  const maxDate = useMemo(() => {
    return convertDate(props.$max) ?? new Date(2100, 0, 0);
  }, [props.$max]);

  const form = useForm<string | number | Date | Array<string | number | Date> | any>(props, {
    preventRequiredValidation: multiable,
    interlockValidation: props.$rangePair != null,
    validations: () => {
      const validations: Array<FormItemValidation<any>> = [];
      if (multiable) {
        if (props.$required) {
          validations.push(v => {
            if (v == null) return formValidationMessages.required;
            if (!Array.isArray(v)) {
              return formValidationMessages.typeMissmatch;
            }
            if (v.length === 0 || v[0] === null) {
              return formValidationMessages.required;
            }
            return "";
          });
        }
      }
      const maxTime = convertDate(props.$max)?.getTime();
      const minTime = convertDate(props.$min)?.getTime();
      if (maxTime != null && minTime != null) {
        const maxDateStr = toStr(maxTime);
        const minDateStr = toStr(minTime);
        const compare = (v: any) => {
          const time = convertDate(v)?.getTime();
          if (time == null) return "";
          if (time < minTime || maxTime < time) return `${minDateStr}～${maxDateStr}の範囲で入力してください。`;
          return "";
        };
        if (multiable) {
          validations.push(v => multiValidationIterator(v, compare));
        } else {
          validations.push(compare);
        }
      } else {
        if (maxTime != null) {
          const maxDateStr = toStr(maxTime);
          const compare = (v: any) => {
            const time = convertDate(v)?.getTime();
            if (time == null) return "";
            if (time > maxTime) return `${maxDateStr}以前で入力してください。`;
            return "";
          };
          if (multiable) {
            validations.push(v => multiValidationIterator(v, compare));
          } else {
            validations.push(compare);
          }
        }
        if (minTime != null) {
          const minDateStr = toStr(minTime);
          const compare = (v: any) => {
            const time = convertDate(v)?.getTime();
            if (time == null) return "";
            if (time < minTime) return `${minDateStr}以降で入力してください。`;
            return "";
          };
          if (multiable) {
            validations.push(v => multiValidationIterator(v, compare));
          } else {
            validations.push(compare);
          }
        }
      }
      const rangePair = props.$rangePair;
      if (rangePair != null) {
        const compare = (value: string | number | Date | any, pairDate: Date) => {
          const date = convertDate(value);
          if (date == null) return "";
          if (rangePair.disallowSame !== true && DatetimeUtils.equalDate(date, pairDate)) {
            return "";
          }
          if (rangePair.position === "before") {
            if (!DatetimeUtils.isBefore(pairDate, date)) return "日付の前後関係が不適切です。";
          }
          if (!DatetimeUtils.isAfter(pairDate, date)) return "日付の前後関係が不適切です。";
          return "";
        };
        const getPairDate = (data: Struct) => {
          if (data == null) return undefined;
          const pairValue = data[rangePair.name];
          if (pairValue == null || Array.isArray(pairValue)) return undefined;
          return convertDate(pairValue);
        };
        if (multiable) {
          validations.push((v, d) => {
            if (d == null) return "";
            const pairDate = convertDate(getPairDate(d));
            if (pairDate == null) return "";
            return multiValidationIterator(v, (val) => compare(val, pairDate));
          });
        } else {
          validations.push((v, d) => {
            if (d == null) return "";
            const pairDate = getPairDate(d);
            if (pairDate == null) return "";
            return compare(v, pairDate);
          });
        }
      }
      return validations;
    },
    validationsDeps: [
      multiable,
      props.$max,
      props.$min,
      props.$rangePair?.name,
      props.$rangePair?.position,
      props.$rangePair?.disallowSame,
    ],
  });

  const getArrayValue = () => {
    const v = form.valueRef.current;
    if (v == null) return [];
    if (Array.isArray(v)) return v;
    return [v];
  };

  const getLatestDate = () => {
    if (multiable) return undefined;
    const vals = getArrayValue();
    const val = vals[vals.length - 1];
    if (val == null) return undefined;
    return convertDate(val);
  };

  const yearNodes = useMemo(() => {
    if (year == null) return [];
    const min = minDate.getFullYear();
    const max = maxDate.getFullYear();
    const nodes = [];
    for (let i = min; i <= max; i++) {
      nodes.push(
        <div
          key={i}
          className={Style.cell}
          data-selected={i === year}
          onClick={() => {
            setYear(i);
          }}
        >
          {i}
        </div>
      );
    }
    return nodes;
  }, [year, form.editable]);

  const monthNodes = useMemo(() => {
    if (month == null) return [];
    return ArrayUtils.generateArray(12, num => {
      return (
        <div
          key={num}
          className={Style.cell}
          data-selected={month === num}
          onClick={() => {
            setMonth(num);
          }}
        >
          {monthTexts[num]}
        </div>
      );
    });
  }, [month, year, form.editable, monthTexts]);

  const dayNodes = useMemo(() => {
    if (year == null || month == null) return [];
    const nodes = [];
    const cursor = new Date(year, month, 1);
    let findCount = 0, findToday = false;
    const isToday = (date: Date) => {
      if (findToday) return false;
      return findToday = DatetimeUtils.equalDate(date, today);
    };
    const isSelected = (date: Date) => {
      if (days.length === findCount) return false;
      const ret = days.find(v => DatetimeUtils.equalDate(v, date)) != null;
      if (ret) findCount++;
      return ret;
    };
    const select = (dateStr: string, selected: boolean) => {
      const date = convertDate(dateStr)!;
      if (!multiable) {
        form.change(convertDateToValue(date, props.$typeof));
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
      vals.push(convertDateToValue(date, props.$typeof));
      form.change(vals.sort((d1, d2) => {
        return DatetimeUtils.isBefore(convertDate(d1)!, convertDate(d2)!) ? 1 : -1;
      }));
    };
    const generateCellNode = (key: Key, date: Date, state: string) => {
      const dateStr = dateFormat(cursor)!;
      const selected = isSelected(cursor);
      return (
        <div
          key={key}
          className={Style.cell}
          data-state={state}
          data-selected={selected}
          data-today={isToday(date)}
          onClick={form.editable ?
            () => {
              select(dateStr, selected);
            } : undefined
          }
        >
          {date.getDate()}
        </div>
      );
    };
    if (mode === "calendar") {
      let beforeLength = (cursor.getDay() - (props.$firstWeek ?? 0) + 7) % 7 || 7;
      if (beforeLength < threshold) beforeLength += 7;
      DatetimeUtils.addDay(cursor, beforeLength * -1);
      const m = cursor.getMonth();
      while (cursor.getMonth() === m) {
        nodes.push(
          generateCellNode(
            `b${cursor.getDate()}`,
            cursor,
            "before"
          )
        );
        DatetimeUtils.addDay(cursor, 1);
      }
    }
    while (cursor.getMonth() === month) {
      nodes.push(
        generateCellNode(
          cursor.getDate(),
          cursor,
          "current",
        )
      );
      DatetimeUtils.addDay(cursor, 1);
    }
    if (mode === "calendar") {
      for (let i = 0, il = (7 - nodes.length % 7); i < il; i++) {
        nodes.push(
          generateCellNode(
            `a${cursor.getDate()}`,
            cursor,
            "after",
          )
        );
        DatetimeUtils.addDay(cursor, 1);
      }
    }
    return nodes;
  }, [month, year, days, form.editable]);

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

  const prevYear = () => {
    if (year == null) return;
    setYear(year - 1);
  };

  const nextYear = () => {
    if (year == null) return;
    setYear(year + 1);
  };

  const prevMonth = () => {
    if (month == null || year == null) return;
    const m = month - 1;
    if (m < 0) setYear(year - 1);
    setMonth((m + 12) % 12);
  };

  const nextMonth = () => {
    if (month == null || year == null) return;
    const m = month + 1;
    if (m >= 12) setYear(year + 1);
    setMonth(m % 12);
  };

  const clear = () => {
    setYear(today.getFullYear());
    setMonth(today.getMonth());
    if (multiable) {
      form.change([]);
      return;
    }
    form.change(undefined);
  };

  const selectToday = () => {
    setYear(today.getFullYear());
    setMonth(today.getMonth());
    if (multiable) {
      form.change([convertDateToValue(today, props.$typeof)]);
      return;
    }
    form.change(convertDateToValue(today, props.$typeof));
  };

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
    if (mode !== "list" || yearElemRef.current == null) return;
    const elem = yearElemRef.current.querySelector(`.${Style.cell}[data-selected="true"]`) as HTMLDivElement;
    if (elem == null) return;
    yearElemRef.current.scrollTop = elem.offsetTop + elem.offsetHeight / 2 - yearElemRef.current.clientHeight / 2;
  }, [mode]);

  useEffect(() => {
    if (mode !== "list" || monthElemRef.current == null) return;
    const elem = monthElemRef.current.querySelector(`.${Style.cell}[data-selected="true"]`) as HTMLDivElement;
    if (elem == null) return;
    monthElemRef.current.scrollTop = elem.offsetTop + elem.offsetHeight / 2 - monthElemRef.current.clientHeight / 2;
  }, [mode, monthNodes]);

  useEffect(() => {
    if (mode !== "list" || dayElemRef.current == null) return;
    const elem = (
      dayElemRef.current.querySelector(`.${Style.cell}[data-selected="true"]`)
      ?? dayElemRef.current.querySelector(`.${Style.cell}[data-today="true"]`)
    ) as HTMLDivElement;
    if (elem == null) return;
    dayElemRef.current.scrollTop = elem.offsetTop + elem.offsetHeight / 2 - dayElemRef.current.clientHeight / 2;
  }, [mode, dayNodes]);

  useEffect(() => {
    const date = getLatestDate();
    if (date == null) {
      setYear(today.getFullYear());
      setMonth(today.getMonth());
    } else {
      setYear(date.getFullYear());
      setMonth(date.getMonth());
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
        className: Style.main
      }}
    >
      <div
        className={Style.content}
        data-mode={mode}
      >
        {mode === "list" &&
          <>
            <div
              ref={yearElemRef}
              className={Style.year}
            >
              {yearNodes}
            </div>
            <div
              ref={monthElemRef}
              className={Style.month}
            >
              {monthNodes}
            </div>
          </>
        }
        {mode === "calendar" &&
          <>
            <div
              className={Style.yearmonth}
              data-reverse={props.$monthTexts === "en" || props.$monthTexts === "en-s"}
            >
              <div className={Style.label}>
                {form.editable &&
                  <div
                    className={Style.prev}
                    onClick={prevYear}
                  >
                    <VscChevronLeft />
                  </div>
                }
                <span className={Style.text}>
                  {year ?? 0}
                </span>
                {form.editable &&
                  <div
                    className={Style.next}
                    onClick={nextYear}
                  >
                    <VscChevronRight />
                  </div>
                }
              </div>
              {(props.$monthTexts == null || props.$monthTexts === "num") &&
                <span>/</span>
              }
              <div className={Style.label}>
                {form.editable &&
                  <div
                    className={Style.prev}
                    onClick={prevMonth}
                  >
                    <VscChevronLeft />
                  </div>
                }
                <span className={Style.text}>
                  {monthTexts[month ?? 0]}
                </span>
                {form.editable &&
                  <div
                    className={Style.next}
                    onClick={nextMonth}
                  >
                    <VscChevronRight />
                  </div>
                }
              </div>
            </div>
            <div
              className={Style.week}
            >
              {weekNodes}
            </div>
          </>
        }
        <div
          ref={dayElemRef}
          className={Style.date}
          data-rows={Math.round(dayNodes.length / 7)}
        >
          {dayNodes}
        </div>
      </div>
      <div
        className={Style.buttons}
      >
        {form.editable &&
          <>
            <div
              className={Style.clear}
              onClick={clear}
            >
              <VscClose />
            </div>
            <div
              className={Style.today}
              onClick={selectToday}
            >
              <VscRecord />
            </div>
          </>
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