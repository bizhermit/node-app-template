"use client";

import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState, type ForwardedRef, type FunctionComponent, type Key, type ReactElement, type ReactNode, type Ref } from "react";
import type { FormItemHook, FormItemProps, FormItemValidation, ValueType } from "../../$types";
import DateInput from "../../../../../data-items/date/input";
import DateItemUtils from "../../../../../data-items/date/utilities";
import generateArray from "../../../../../objects/array/generator";
import { addDay, getFirstDateAtMonth, getFirstDateAtYear, getLastDateAtMonth } from "../../../../../objects/date/calc";
import cloneDate from "../../../../../objects/date/clone";
import { isAfterDate, isBeforeDate, isBeforeDatetime } from "../../../../../objects/date/compare";
import { Month, Week } from "../../../../../objects/date/consts";
import { equalDate, equalYearMonth } from "../../../../../objects/date/equal";
import formatDate from "../../../../../objects/date/format";
import parseDate from "../../../../../objects/date/parse";
import { CalendarIcon, CrossIcon, LeftIcon, ListIcon, RightIcon, TodayIcon } from "../../../icon";
import Text from "../../../text";
import useForm from "../../context";
import { convertDataItemValidationToFormItemValidation, multiValidationIterator } from "../../utilities";
import { FormItemWrap } from "../common";
import { useDataItemMergedProps, useFormItemBase, useFormItemContext } from "../hooks";
import Style from "./index.module.scss";

type DatePickerMode = "calendar" | "list";
const monthTextsNum = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"] as const;

type DatePickerHook<T extends DateValue | Array<DateValue>> = FormItemHook<T>;

export const useDatePicker = <T extends DateValue | Array<DateValue>>() => useFormItemBase<DatePickerHook<T>>();

export type DatePickerBaseProps<T extends DateValue | Array<DateValue>, D extends DataItem_Date | undefined = undefined> = FormItemProps<T, D> & DateInput.FCPorps & {
  ref?: Ref<HTMLDivElement>;
  $ref?: DatePickerHook<ValueType<DateValue | Array<DateValue>, D, DateValue | Array<DateValue>>>
  | DatePickerHook<DateValue | Array<DateValue>>;
  $typeof?: DateValueType;
  $mode?: DatePickerMode;
  $firstWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  $monthTexts?: "en" | "en-s" | "ja" | "num" | [string, string, string, string, string, string, string, string, string, string, string, string];
  $weekTexts?: "en" | "ja" | [ReactNode, ReactNode, ReactNode, ReactNode, ReactNode, ReactNode, ReactNode];
  $onClickPositive?: (value: T | null | undefined) => void;
  $onClickNegative?: () => void;
  $positiveText?: ReactNode;
  $negativeText?: ReactNode;
  $skipValidation?: boolean;
  $buttonless?: boolean;
};

export type DatePickerProps_Single<D extends DataItem_Date | undefined = undefined> = DatePickerBaseProps<DateValue, D>;
export type DatePickerProps_Multiple<D extends DataItem_Date | undefined = undefined> = DatePickerBaseProps<Array<DateValue>, D>;

export type DatePickerProps<D extends DataItem_Date | undefined = undefined> =
  | (DatePickerProps_Single<D> & { $multiple?: false; })
  | (DatePickerProps_Multiple<D> & { $multiple: true; });

const today = new Date();
const threshold = 2;

interface DatePickerFC extends FunctionComponent<DatePickerProps> {
  <D extends DataItem_Date | undefined = undefined>(
    attrs: ComponentAttrsWithRef<HTMLDivElement, DatePickerProps<D>>
  ): ReactElement<any> | null;
}

const DatePicker = forwardRef<HTMLDivElement, DatePickerProps>(<
  D extends DataItem_Date | undefined = undefined
>(p: DatePickerProps<D>, $ref: ForwardedRef<HTMLDivElement>) => {
  const ref = useRef<HTMLDivElement>(null!);
  useImperativeHandle($ref, () => ref.current);

  const form = useForm();
  const props = useDataItemMergedProps(form, p, {
    under: ({ dataItem }) => {
      return {
        $type: dataItem.type,
        $typeof: dataItem.typeof,
        $min: dataItem.min,
        $max: dataItem.max,
        $rangePair: dataItem.rangePair,
      };
    },
    over: ({ dataItem, props }) => {
      return {
        $messagePosition: "bottom-hide",
        $validations: dataItem.validations?.map(f => convertDataItemValidationToFormItemValidation((value, ctx) => {
          if (value == null || !Array.isArray(value)) return f(parseDate(value), ctx);
          return value.map(v => f(parseDate(v), ctx))[0];
        }, props, dataItem)),
      } as DatePickerProps<D>;
    },
  });

  const yearElemRef = useRef<HTMLDivElement>(null!);
  const monthElemRef = useRef<HTMLDivElement>(null!);
  const dayElemRef = useRef<HTMLDivElement>(null!);
  const [year, setYear] = useState<number>();
  const [month, setMonth] = useState<number>();
  const [days, setDays] = useState<Array<Date>>([]);
  const [showYear, setShowYear] = useState(false);
  const [showMonth, setShowMonth] = useState(false);

  const type = props.$type ?? "date";
  const multiple = props.$multiple === true;
  const [mode, setMode] = useState<DatePickerMode>(() => {
    if (type === "year") return "list";
    if (multiple) return "calendar";
    return props.$mode || "calendar";
  });
  const monthTexts = useMemo(() => {
    if (props.$monthTexts == null || props.$monthTexts === "num") return monthTextsNum;
    if (props.$monthTexts === "en") return Month.en;
    if (props.$monthTexts === "en-s") return Month.en;
    if (props.$monthTexts === "ja") return Month.ja;
    if (props.$monthTexts.length !== 12) return monthTextsNum;
    return props.$monthTexts;
  }, [props.$monthTexts]);
  const weekTexts = useMemo(() => {
    if (props.$weekTexts == null || props.$weekTexts === "ja") return Week.ja_s;
    if (props.$weekTexts === "en") return Week.en_s;
    if (props.$weekTexts.length !== 7) return Week.ja_s;
    return props.$weekTexts;
  }, [props.$weekTexts]);
  const minDate = useMemo(() => {
    return DateInput.getMinDate(props);
  }, [props.$min]);
  const maxDate = useMemo(() => {
    return DateInput.getMaxDate(props);
  }, [props.$max]);
  const judgeValid = useMemo(() => {
    return DateInput.selectableValidation(props);
  }, [props.$validDays, props.$validDaysMode]);

  const initValue = useMemo(() => {
    return DateInput.getInitValue(props);
  }, [props.$initValue]);

  const ctx = useFormItemContext(form, props, {
    interlockValidation: props.$rangePair != null,
    multiple: props.$multiple,
    validations: (_, label) => {
      if (props.$skipValidation) return [];
      const validations: Array<FormItemValidation<any>> = [];
      const maxTime = DateItemUtils.dateAsLast(maxDate, type);
      const minTime = DateItemUtils.dateAsFirst(minDate, type);
      if (maxTime != null && minTime != null) {
        const compare = DateInput.rangeValidation(minTime, maxTime, type, label);
        if (multiple) {
          validations.push(v => multiValidationIterator(v, compare));
        } else {
          validations.push(compare);
        }
      } else {
        if (maxTime != null) {
          const compare = DateInput.maxValidation(maxTime, type, label);
          if (multiple) {
            validations.push(v => multiValidationIterator(v, compare));
          } else {
            validations.push(compare);
          }
        }
        if (minTime != null) {
          const compare = DateInput.minValidation(minTime, type, label);
          if (multiple) {
            validations.push(v => multiValidationIterator(v, compare));
          } else {
            validations.push(compare);
          }
        }
      }
      const rangePair = props.$rangePair;
      if (rangePair != null) {
        const { compare, getPairDate, validation } = DateInput.contextValidation(rangePair, type, label);
        if (multiple) {
          validations.push((v, d) => {
            if (d == null) return undefined;
            const pairDate = getPairDate(d);
            if (pairDate == null) return undefined;
            return multiValidationIterator(v, (val) => compare(val, pairDate));
          });
        } else {
          validations.push(validation);
        }
      }
      if (props.$validDays) {
        const judge = (value: DateValue | null) => {
          const date = parseDate(value);
          if (date == null) return undefined;
          return judgeValid(date) ? undefined : "選択可能な日付ではありません。";
        };
        if (multiple) {
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
      multiple,
      maxDate,
      minDate,
      type,
      props.$rangePair?.name,
      props.$rangePair?.position,
      props.$rangePair?.disallowSame,
      judgeValid,
      props.$skipValidation,
    ],
  });

  const getArrayValue = () => {
    const v = ctx.valueRef.current;
    if (v == null) return [];
    if (Array.isArray(v)) return v;
    return [v];
  };

  const getLatestDate = () => {
    if (multiple) return undefined;
    const vals = getArrayValue();
    const val = vals[vals.length - 1];
    if (val == null) return undefined;
    return parseDate(val);
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
      const ret = days.find(v => parseDate(v)?.getFullYear() === num) != null;
      if (ret) findCount++;
      return ret;
    };
    const select = (num: number, selected: boolean) => {
      if (!multiple) {
        const v = DateInput.convertDateToValue(new Date(num, 0, 1), props.$typeof);
        ctx.change(v);
        if (props.$buttonless) {
          setTimeout(() => {
            props.$onClickPositive?.(v as never);
          }, 0);
        }
        return;
      }
      if (selected) {
        const vals = [...getArrayValue()];
        const index = vals.findIndex(v => parseDate(v)?.getFullYear() === num);
        vals.splice(index, 1);
        ctx.change(vals);
        return;
      }
      const vals = [...getArrayValue()];
      vals.push(DateInput.convertDateToValue(new Date(num, 0, 1), props.$typeof));
      ctx.change(vals.sort((d1, d2) => {
        return isBeforeDatetime(parseDate(d1)!, parseDate(d2)!) ? 1 : -1;
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
              if (ctx.editable) {
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
    year, ctx.editable,
    type === "year" ? days : undefined,
    type === "year" ? maxDate : undefined,
    type === "year" ? minDate : undefined,
  ]);

  const monthNodes = useMemo(() => {
    if (year == null || month == null || type === "year") return [];
    let findCount = 0, findToday = false;
    const isToday = (date: Date) => {
      if (findToday) return false;
      return findToday = equalYearMonth(date, today);
    };
    const isSelected = (date: Date) => {
      if (days.length === findCount) return false;
      const ret = days.find(v => equalYearMonth(v, date)) != null;
      if (ret) findCount++;
      return ret;
    };
    let afterMin = false;
    let beforeMax = true;
    const minFirstDate = getFirstDateAtMonth(minDate);
    const maxLastDate = getLastDateAtMonth(maxDate);
    const isInRange = (date: Date) => {
      if (!afterMin && !isBeforeDate(minFirstDate, date)) {
        afterMin = true;
      }
      if (beforeMax && isAfterDate(maxLastDate, date)) {
        beforeMax = false;
      }
      return afterMin && beforeMax;
    };
    const select = (date: Date, selected: boolean) => {
      if (!multiple) {
        const v = DateInput.convertDateToValue(date, props.$typeof);
        ctx.change(v);
        if (props.$buttonless) {
          setTimeout(() => {
            props.$onClickPositive?.(v as never);
          }, 0);
        }
        return;
      }
      if (selected) {
        const vals = [...getArrayValue()];
        const index = vals.findIndex(v => equalYearMonth(parseDate(v), date));
        vals.splice(index, 1);
        ctx.change(vals);
        return;
      }
      const vals = [...getArrayValue()];
      vals.push(DateInput.convertDateToValue(date, props.$typeof));
      ctx.change(vals.sort((d1, d2) => {
        return isBeforeDatetime(parseDate(d1)!, parseDate(d2)!) ? 1 : -1;
      }));
    };
    return generateArray(12, num => {
      const cursor = new Date(year, num, 1);
      const selected = type === "month" ? isSelected(cursor) : month === num;
      const inRange = type === "month" ? isInRange(cursor) :
        isInRange(cursor) || isInRange(getLastDateAtMonth(cursor));
      return (
        <div
          key={num}
          className={Style.cell}
          data-selectable={inRange}
          data-selected={selected}
          data-today={isToday(cursor)}
          onClick={() => {
            if (type === "month") {
              if (ctx.editable && inRange) {
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
    month, year, ctx.editable, monthTexts,
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
      return findToday = equalDate(date, today);
    };
    const isSelected = (date: Date) => {
      if (days.length === findCount) return false;
      const ret = days.find(v => equalDate(v, date)) != null;
      if (ret) findCount++;
      return ret;
    };
    let afterMin = false;
    let beforeMax = true;
    const isInRange = (date: Date) => {
      if (!judgeValid(date)) return false;
      if (!afterMin && !isBeforeDate(minDate, date)) {
        afterMin = true;
      }
      if (beforeMax && isAfterDate(maxDate, date)) {
        beforeMax = false;
      }
      return afterMin && beforeMax;
    };
    const select = (dateStr: string, selected: boolean) => {
      const date = parseDate(dateStr)!;
      if (!multiple) {
        const v = DateInput.convertDateToValue(date, props.$typeof);
        ctx.change(v);
        if (props.$buttonless) {
          setTimeout(() => {
            props.$onClickPositive?.(v as never);
          }, 0);
        }
        return;
      }
      if (selected) {
        const vals = [...getArrayValue()];
        const index = vals.findIndex(v => equalDate(parseDate(v), date));
        vals.splice(index, 1);
        ctx.change(vals);
        return;
      }
      const vals = [...getArrayValue()];
      vals.push(DateInput.convertDateToValue(date, props.$typeof));
      ctx.change(vals.sort((d1, d2) => {
        return isBeforeDatetime(parseDate(d1)!, parseDate(d2)!) ? 1 : -1;
      }));
    };
    const generateCellNode = (key: Key, date: Date, state: string) => {
      const dateStr = formatDate(cursor)!;
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
          data-week={cursor.getDay()}
          onClick={(ctx.editable && inRange) ?
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
      addDay(cursor, beforeLength * -1);
      const m = cursor.getMonth();
      while (cursor.getMonth() === m) {
        nodes.push(
          generateCellNode(
            `b${cursor.getDate()}`,
            cursor,
            "before"
          )
        );
        addDay(cursor, 1);
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
      addDay(cursor, 1);
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
        addDay(cursor, 1);
      }
    }
    return nodes;
  }, [month, year, days, ctx.editable, minDate, maxDate, mode, type, judgeValid]);

  const weekNodes = useMemo(() => {
    if (type !== "date") return [];
    const nodes = [];
    for (let i = 0; i < 7; i++) {
      const week = (i + (props.$firstWeek ?? 0)) % 7;
      nodes.push(
        <div
          key={week}
          className={Style.cell}
          data-week={week}
        >
          {weekTexts[week]}
        </div>
      );
    }
    return nodes;
  }, [props.$firstWeek, type]);

  const prevYearDisabled = !ctx.editable || year == null || year - 1 < minDate.getFullYear();
  const prevYear = () => {
    if (prevYearDisabled) return;
    setYear(year - 1);
  };

  const nextYearDisabled = !ctx.editable || year == null || year + 1 > maxDate.getFullYear();
  const nextYear = () => {
    if (nextYearDisabled) return;
    setYear(year + 1);
  };

  const clickYear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMonth(false);
    setShowYear(true);
  };

  const prevMonthDisabled = !ctx.editable || month == null || year == null || (() => {
    let m = month - 1;
    const y = m < 0 ? year - 1 : year;
    m = (m + 12) % 12;
    return y * 100 + m < minDate.getFullYear() * 100 + minDate.getMonth();
  })();
  const prevMonth = () => {
    if (prevMonthDisabled) return;
    const m = month - 1;
    if (m < 0) setYear(year - 1);
    setMonth((m + 12) % 12);
  };

  const nextMonthDisabled = !ctx.editable || month == null || year == null || (() => {
    let m = month + 1;
    const y = m >= 12 ? year + 1 : year;
    m = m % 12;
    return y * 100 + m > maxDate.getFullYear() * 100 + maxDate.getMonth();
  })();
  const nextMonth = () => {
    if (nextMonthDisabled) return;
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
    setYear(initValue.getFullYear());
    setMonth(initValue.getMonth());
    if (multiple) {
      ctx.change([]);
      return;
    }
    ctx.change(undefined);
  };

  const todayIsInRange = useMemo(() => {
    if (type === "year") {
      return true;
    }
    if (type === "month") {
      const minFirstDate = getFirstDateAtMonth(minDate);
      const maxLastDate = getLastDateAtMonth(maxDate);
      return !isAfterDate(today, minFirstDate) && !isBeforeDate(today, maxLastDate);
    }
    return !isAfterDate(today, minDate) && !isBeforeDate(today, maxDate) && judgeValid(today);
  }, [minDate, maxDate, type]);

  const selectToday = () => {
    setYear(today.getFullYear());
    setMonth(today.getMonth());
    if (!todayIsInRange) return;
    let date: Date;
    switch (type) {
      case "year":
        date = getFirstDateAtYear(cloneDate(today));
        break;
      case "month":
        date = getFirstDateAtMonth(cloneDate(today));
        break;
      default:
        date = cloneDate(today);
        break;
    }
    if (multiple) {
      ctx.change([DateInput.convertDateToValue(date, props.$typeof)]);
      return;
    }
    ctx.change(DateInput.convertDateToValue(date, props.$typeof));
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
        .map(v => parseDate(v)!)
        .filter(v => v != null)
      ?? []
    );
    if (showYear) setShowYear(false);
    if (showMonth) setShowMonth(false);
  }, [ctx.value]);

  useEffect(() => {
    if (yearElemRef.current == null || (mode === "calendar" && !showYear)) return;
    const elem = (
      yearElemRef.current.querySelector(`.${Style.cell}[data-selected="true"]`)
      ?? yearElemRef.current.querySelector(`.${Style.cell}[data-today="true"]`)
    ) as HTMLDivElement;
    if (elem == null) return;
    yearElemRef.current.scrollTop = elem.offsetTop + elem.offsetHeight / 2 - (yearElemRef.current.hasAttribute("data-show") ? 100 : yearElemRef.current.clientHeight / 2);
  }, [mode, yearNodes, showYear, ctx.editable]);

  useEffect(() => {
    if (monthElemRef.current == null || (mode === "calendar" && !showMonth)) return;
    const elem = (
      monthElemRef.current.querySelector(`.${Style.cell}[data-selected="true"]`)
      ?? monthElemRef.current.querySelector(`.${Style.cell}[data-today="true"]`)
    ) as HTMLDivElement;
    if (elem == null) return;
    monthElemRef.current.scrollTop = elem.offsetTop + elem.offsetHeight / 2 - (monthElemRef.current.hasAttribute("data-show") ? 100 : monthElemRef.current.clientHeight / 2);
  }, [mode, monthNodes, showMonth, ctx.editable]);

  useEffect(() => {
    if (mode !== "list" || dayElemRef.current == null) return;
    const elem = (
      dayElemRef.current.querySelector(`.${Style.cell}[data-selected="true"]`)
      ?? dayElemRef.current.querySelector(`.${Style.cell}[data-today="true"]`)
    ) as HTMLDivElement;
    if (elem == null) return;
    dayElemRef.current.scrollTop = elem.offsetTop + elem.offsetHeight / 2 - dayElemRef.current.clientHeight / 2;
  }, [mode, dayNodes, ctx.editable]);

  useEffect(() => {
    if (type === "year") {
      setMode("list");
    } else {
      if (multiple) {
        setMode("calendar");
      }
    }
  }, [type]);

  useEffect(() => {
    const date = getLatestDate();
    if (date == null) {
      setYear(initValue.getFullYear());
      setMonth(initValue.getMonth());
    } else {
      setYear(date.getFullYear());
      setMonth(date.getMonth());
    }
  }, [
    props.$value,
    // props.$bind,
    ctx.bind,
  ]);

  useEffect(() => {
    if (props.$focusWhenMounted) {
      ref.current?.focus();
    }
  }, []);

  if (props.$ref) {
    props.$ref.focus = () => ref.current?.focus();
  }

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
                  data-disabled={prevYearDisabled}
                  onClick={prevYear}
                >
                  <LeftIcon />
                </div>
                <span
                  className={Style.text}
                  onClick={clickYear}
                >
                  {year ?? 0}
                </span>
                <div
                  className={Style.next}
                  data-disabled={nextYearDisabled}
                  onClick={nextYear}
                >
                  <RightIcon />
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
                    data-disabled={prevMonthDisabled}
                    onClick={prevMonth}
                  >
                    <LeftIcon />
                  </div>
                  <span
                    className={Style.text}
                    onClick={clickMonth}
                  >
                    {monthTexts[month ?? 0]}
                  </span>
                  <div
                    className={Style.next}
                    data-disabled={nextMonthDisabled}
                    onClick={nextMonth}
                  >
                    <RightIcon />
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
      {!props.$buttonless &&
        <div className={Style.buttons}>
          {ctx.editable &&
            <>
              <div
                className={Style.clear}
                onClick={clear}
              >
                <CrossIcon />
              </div>
              <div
                className={Style.today}
                onClick={selectToday}
              >
                <TodayIcon />
              </div>
            </>
          }
          {props.$onClickNegative != null &&
            <div
              className={Style.negative}
              onClick={props.$onClickNegative}
            >
              <Text>{props.$negativeText ?? "キャンセル"}</Text>
            </div>
          }
          {props.$onClickPositive != null &&
            <div
              className={Style.positive}
              onClick={() => {
                props.$onClickPositive?.(ctx.value as never);
              }}
            >
              <Text>{props.$positiveText ?? "OK"}</Text>
            </div>
          }
          {type !== "year" && !multiple && ctx.editable &&
            <div
              className={Style.switch}
              onClick={toggleMode}
            >
              {mode === "list" ? <CalendarIcon /> : <ListIcon />}
            </div>
          }
        </div>
      }
    </FormItemWrap>
  );
}) as DatePickerFC;

export default DatePicker;