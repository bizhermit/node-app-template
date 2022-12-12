import { FormItemProps, FormItemValidation, FormItemWrap, formValidationMessages, useForm } from "@/components/elements/form";
import React, { Key, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import Style from "$/components/elements/form-items/date-picker.module.scss";
import { convertDate } from "@bizhermit/basic-utils/dist/datetime-utils";
import { VscCalendar, VscChevronLeft, VscChevronRight, VscClose, VscListFlat, VscRecord } from "react-icons/vsc";
import { dateFormat } from "@bizhermit/basic-utils/dist/datetime-utils";
import DatetimeUtils from "@bizhermit/basic-utils/dist/datetime-utils";
import ArrayUtils from "@bizhermit/basic-utils/dist/array-utils";
import LabelText from "@/components/elements/label-text";
import { convertDateToValue, dateContextValidation, DateInputPorps, getJudgeValidDateFunc, getMaxDate, convertToMaxTime, getMinDate, convertToMinTime, maxDateValidation, minDateValidation, rangeDateValidation } from "@/components/elements/form-items/date-input-utils";

type DatePickerMode = "calendar" | "list";
const monthTextsNum = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"] as const;

export type DatePickerCommonProps = DateInputPorps & {
  $mode?: DatePickerMode;
  $firstWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  $monthTexts?: "en" | "en-s" | "ja" | "num" | [string, string, string, string, string, string, string, string, string, string, string, string];
  $weekTexts?: "en" | "ja" | [ReactNode, ReactNode, ReactNode, ReactNode, ReactNode, ReactNode, ReactNode];
  $onClickNegative?: () => void;
  $positiveText?: ReactNode;
  $negativeText?: ReactNode;
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
    return getMinDate(props);
  }, [props.$min]);
  const maxDate = useMemo(() => {
    return getMaxDate(props);
  }, [props.$max]);
  const judgeValid = useMemo(() => {
    return getJudgeValidDateFunc(props);
  }, [props.$validDays, props.$validDaysMode]);
  const [showYear, setShowYear] = useState(false);
  const [showMonth, setShowMonth] = useState(false);

  const form = useForm<string | number | Date | Array<string | number | Date> | any>({
    ...props,
    $messagePosition: props.$messagePosition ?? "bottom-hide",
  }, {
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
      const maxTime = convertToMaxTime(maxDate, type);
      const minTime = convertToMinTime(minDate, type);
      if (maxTime != null && minTime != null) {
        const compare = rangeDateValidation(minTime, maxTime, type);
        if (multiable) {
          validations.push(v => multiValidationIterator(v, compare));
        } else {
          validations.push(compare);
        }
      } else {
        if (maxTime != null) {
          const compare = maxDateValidation(maxTime, type);
          if (multiable) {
            validations.push(v => multiValidationIterator(v, compare));
          } else {
            validations.push(compare);
          }
        }
        if (minTime != null) {
          const compare = minDateValidation(minTime, type);
          if (multiable) {
            validations.push(v => multiValidationIterator(v, compare));
          } else {
            validations.push(compare);
          }
        }
      }
      const rangePair = props.$rangePair;
      if (rangePair != null) {
        const { compare, getPairDate, validation } = dateContextValidation(rangePair);
        if (multiable) {
          validations.push((v, d) => {
            if (d == null) return "";
            const pairDate = convertDate(getPairDate(d));
            if (pairDate == null) return "";
            return multiValidationIterator(v, (val) => compare(val, pairDate));
          });
        } else {
          validations.push(validation);
        }
      }
      if (props.$validDays) {
        const judge = (value: string | number | Date | null) => {
          const date = convertDate(value);
          if (date == null) return "";
          return judgeValid(date) ? "" : "選択可能な日付ではありません。";
        };
        if (multiable) {
          validations.push(v => {
            return multiValidationIterator(v, judge);
          });
        } else {
          validations.push(judge);
        }
      }
      return validations;
    },
    validationsDeps: [
      multiable,
      maxDate,
      minDate,
      type,
      props.$rangePair?.name,
      props.$rangePair?.position,
      props.$rangePair?.disallowSame,
      judgeValid,
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
    let findCount = 0, findToday = false;
    const isToday = (num: number) => {
      if (findToday) return false;
      return findToday = num === today.getFullYear();
    };
    const isSelected = (num: number) => {
      if (days.length === findCount) return false;
      const ret = days.find(v => convertDate(v)?.getFullYear() === num) != null;
      if (ret) findCount++;
      return ret;
    };
    const select = (num: number, selected: boolean) => {
      if (!multiable) {
        form.change(convertDateToValue(new Date(num, 0, 1), props.$typeof));
        return;
      }
      if (selected) {
        const vals = [...getArrayValue()];
        const index = vals.findIndex(v => convertDate(v)?.getFullYear() === num);
        vals.splice(index, 1);
        form.change(vals);
        return;
      }
      const vals = [...getArrayValue()];
      vals.push(convertDateToValue(new Date(num, 0, 1), props.$typeof));
      form.change(vals.sort((d1, d2) => {
        return DatetimeUtils.isBefore(convertDate(d1)!, convertDate(d2)!) ? 1 : -1;
      }));
    };
    const nodes = [];
    for (let i = min; i <= max; i++) {
      const selected = type === "year" ? isSelected(i) : year === i;
      nodes.push(
        <div
          key={i}
          className={Style.cell}
          data-selected={selected}
          data-selectable="true"
          data-today={isToday(i)}
          onClick={() => {
            if (type === "year") {
              if (form.editable) {
                select(i, selected);
              }
            }
            setYear(i);
          }}
        >
          {i}
        </div>
      );
    }
    return nodes;
  }, [
    year, form.editable,
    type === "year" ? days : undefined,
    type === "year" ? maxDate : undefined,
    type === "year" ? minDate : undefined,
  ]);

  const monthNodes = useMemo(() => {
    if (year == null || month == null || type === "year") return [];
    let findCount = 0, findToday = false;
    const isToday = (date: Date) => {
      if (findToday) return false;
      return findToday = DatetimeUtils.equalYearMonth(date, today);
    };
    const isSelected = (date: Date) => {
      if (days.length === findCount) return false;
      const ret = days.find(v => DatetimeUtils.equalYearMonth(v, date)) != null;
      if (ret) findCount++;
      return ret;
    };
    let afterMin = false;
    let beforeMax = true;
    const minFirstDate = DatetimeUtils.getFirstDateAtMonth(minDate);
    const maxLastDate = DatetimeUtils.getLastDateAtMonth(maxDate);
    const isInRange = (date: Date) => {
      if (type !== "month") return true;
      if (!afterMin && !DatetimeUtils.isBeforeDate(minFirstDate, date)) {
        afterMin = true;
      }
      if (beforeMax && DatetimeUtils.isAfterDate(maxLastDate, date)) {
        beforeMax = false;
      }
      return afterMin && beforeMax;
    };
    const select = (date: Date, selected: boolean) => {
      if (!multiable) {
        form.change(convertDateToValue(date, props.$typeof));
        return;
      }
      if (selected) {
        const vals = [...getArrayValue()];
        const index = vals.findIndex(v => DatetimeUtils.equalYearMonth(convertDate(v), date));
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
    return ArrayUtils.generateArray(12, num => {
      const cursor = new Date(year, num, 1);
      const selected = type === "month" ? isSelected(cursor) : month === num;
      const inRange = isInRange(cursor);
      return (
        <div
          key={num}
          className={Style.cell}
          data-selectable={inRange}
          data-selected={selected}
          data-today={isToday(cursor)}
          onClick={() => {
            if (type === "month") {
              if (form.editable && inRange) {
                select(cursor, selected);
              }
              return;
            }
            setMonth(num);
          }}
        >
          {monthTexts[num]}
        </div>
      );
    });
  }, [
    month, year, form.editable, monthTexts,
    type === "month" ? days : undefined,
    type === "month" ? maxDate : undefined,
    type === "month" ? minDate : undefined,
  ]);

  const dayNodes = useMemo(() => {
    if (year == null || month == null || type !== "date") return [];
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
    let afterMin = false;
    let beforeMax = true;
    const isInRange = (date: Date) => {
      if (!judgeValid(date)) return false;
      if (!afterMin && !DatetimeUtils.isBeforeDate(minDate, date)) {
        afterMin = true;
      }
      if (beforeMax && DatetimeUtils.isAfterDate(maxDate, date)) {
        beforeMax = false;
      }
      return afterMin && beforeMax;
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
      const inRange = isInRange(date);
      return (
        <div
          key={key}
          className={Style.cell}
          data-state={state}
          data-selectable={inRange}
          data-selected={selected}
          data-today={isToday(date)}
          onClick={(form.editable && inRange) ?
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
  }, [month, year, days, form.editable, minDate, maxDate, mode, type, judgeValid]);

  const weekNodes = useMemo(() => {
    if (type !== "date") return [];
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
  }, [props.$firstWeek, type]);

  const prevYear = () => {
    if (year == null) return;
    setYear(year - 1);
  };

  const nextYear = () => {
    if (year == null) return;
    setYear(year + 1);
  };

  const clickYear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMonth(false);
    setShowYear(true);
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

  const clickMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowYear(false);
    setShowMonth(true);
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

  const todayIsInRange = useMemo(() => {
    if (type === "year") {
      return true;
    }
    if (type === "month") {
      const minFirstDate = DatetimeUtils.getFirstDateAtMonth(minDate);
      const maxLastDate = DatetimeUtils.getLastDateAtMonth(maxDate);
      return !DatetimeUtils.isAfterDate(today, minFirstDate) && !DatetimeUtils.isBeforeDate(today, maxLastDate);
    }
    return !DatetimeUtils.isAfterDate(today, minDate) && !DatetimeUtils.isBeforeDate(today, maxDate) && judgeValid(today);
  }, [minDate, maxDate, type]);

  const selectToday = () => {
    setYear(today.getFullYear());
    setMonth(today.getMonth());
    if (!todayIsInRange) return;
    let date: Date;
    switch (type) {
      case "year":
        date = DatetimeUtils.getFirstDateAtYear(DatetimeUtils.copy(today));
        break;
      case "month":
        date = DatetimeUtils.getFirstDateAtMonth(DatetimeUtils.copy(today));
        break;
      default:
        date = DatetimeUtils.copy(today);
        break;
    }
    if (multiable) {
      form.change([convertDateToValue(date, props.$typeof)]);
      return;
    }
    form.change(convertDateToValue(date, props.$typeof));
  };

  const toggleMode = () => {
    if (type === "year") return;
    if (mode === "calendar") {
      setMode("list");
      setShowYear(false);
      setShowMonth(false);
      return;
    }
    setMode("calendar");
  };

  useEffect(() => {
    setDays(
      getArrayValue()
        .map(v => convertDate(v)!)
        .filter(v => v != null)
      ?? []
    );
    if (showYear) setShowYear(false);
    if (showMonth) setShowMonth(false);
  }, [form.value]);

  useEffect(() => {
    if (yearElemRef.current == null || (mode === "calendar" && !showYear)) return;
    const elem = (
      yearElemRef.current.querySelector(`.${Style.cell}[data-selected="true"]`)
      ?? yearElemRef.current.querySelector(`.${Style.cell}[data-today="true"]`)
    ) as HTMLDivElement;
    if (elem == null) return;
    yearElemRef.current.scrollTop = elem.offsetTop + elem.offsetHeight / 2 - 100;
  }, [mode, yearNodes, showYear, form.editable]);

  useEffect(() => {
    if (monthElemRef.current == null || (mode === "calendar" && !showMonth)) return;
    const elem = (
      monthElemRef.current.querySelector(`.${Style.cell}[data-selected="true"]`)
      ?? monthElemRef.current.querySelector(`.${Style.cell}[data-today="true"]`)
    ) as HTMLDivElement;
    if (elem == null) return;
    monthElemRef.current.scrollTop = elem.offsetTop + elem.offsetHeight / 2 - 100;
  }, [mode, monthNodes, showMonth, form.editable]);

  useEffect(() => {
    if (mode !== "list" || dayElemRef.current == null) return;
    const elem = (
      dayElemRef.current.querySelector(`.${Style.cell}[data-selected="true"]`)
      ?? dayElemRef.current.querySelector(`.${Style.cell}[data-today="true"]`)
    ) as HTMLDivElement;
    if (elem == null) return;
    dayElemRef.current.scrollTop = elem.offsetTop + elem.offsetHeight / 2 - dayElemRef.current.clientHeight / 2;
  }, [mode, dayNodes, form.editable]);

  useEffect(() => {
    if (type === "year") {
      setMode("list");
    } else {
      if (multiable) {
        setMode("calendar");
      }
    }
  }, [type]);

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
        className: Style.main,
        onClick: () => {
          setShowYear(false);
          setShowMonth(false);
        },
      }}
    >
      <div
        className={Style.content}
        data-mode={mode}
        data-type={type}
      >
        {mode === "list" &&
          <>
            <div
              ref={yearElemRef}
              className={Style.year}
            >
              {yearNodes}
            </div>
            {type !== "year" &&
              <div
                ref={monthElemRef}
                className={Style.month}
              >
                {monthNodes}
              </div>
            }
          </>
        }
        {mode === "calendar" &&
          <>
            <div
              className={Style.yearmonth}
              data-reverse={props.$monthTexts === "en" || props.$monthTexts === "en-s"}
            >
              <div className={Style.label}>
                <div
                  className={Style.prev}
                  onClick={prevYear}
                >
                  <VscChevronLeft />
                </div>
                <span
                  className={Style.text}
                  onClick={clickYear}
                >
                  {year ?? 0}
                </span>
                <div
                  className={Style.next}
                  onClick={nextYear}
                >
                  <VscChevronRight />
                </div>
                <div
                  ref={yearElemRef}
                  className={Style.year}
                  data-show={showYear}
                >
                  {yearNodes}
                </div>
              </div>
              {(props.$monthTexts == null || props.$monthTexts === "num") && type === "date" && <span>/</span>}
              {type === "date" &&
                <div className={Style.label}>
                  <div
                    className={Style.prev}
                    onClick={prevMonth}
                  >
                    <VscChevronLeft />
                  </div>
                  <span
                    className={Style.text}
                    onClick={clickMonth}
                  >
                    {monthTexts[month ?? 0]}
                  </span>
                  <div
                    className={Style.next}
                    onClick={nextMonth}
                  >
                    <VscChevronRight />
                  </div>
                  <div
                    ref={monthElemRef}
                    className={Style.month}
                    data-show={showMonth}
                  >
                    {monthNodes}
                  </div>
                </div>
              }
            </div>
            {type === "date" &&
              <div
                className={Style.week}
              >
                {weekNodes}
              </div>
            }
            {type === "month" &&
              <div className={Style.month}>
                {monthNodes}
              </div>
            }
          </>
        }
        {type === "date" &&
          <div
            ref={dayElemRef}
            className={Style.date}
            data-rows={Math.round(dayNodes.length / 7)}
          >
            {dayNodes}
          </div>
        }
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
        {type !== "year" && !multiable && form.editable &&
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