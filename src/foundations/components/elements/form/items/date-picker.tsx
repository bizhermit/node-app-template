"use client";

import Style from "#/styles/components/elements/form-items/date-picker.module.scss";
import { type ForwardedRef, forwardRef, type FunctionComponent, type Key, type ReactElement, type ReactNode, useEffect, useMemo, useRef, useState, type Ref } from "react";
import { convertDate } from "@bizhermit/basic-utils/dist/datetime-utils";
import { dateFormat } from "@bizhermit/basic-utils/dist/datetime-utils";
import DatetimeUtils from "@bizhermit/basic-utils/dist/datetime-utils";
import ArrayUtils from "@bizhermit/basic-utils/dist/array-utils";
import Text from "#/components/elements/text";
import { DateData, DateInput } from "#/data-items/date";
import { CalendarIcon, CrossIcon, LeftIcon, ListIcon, RightIcon, TodayIcon } from "#/components/elements/icon";
import type { FormItemProps, FormItemValidation } from "#/components/elements/form/$types";
import { useForm } from "#/components/elements/form/context";
import { useDataItemMergedProps, useFormItemContext } from "#/components/elements/form/item-hook";
import { convertDataItemValidationToFormItemValidation, multiValidationIterator } from "#/components/elements/form/utilities";
import { FormItemWrap } from "#/components/elements/form/item-wrap";

type DatePickerMode = "calendar" | "list";
const monthTextsNum = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"] as const;

export type DatePickerBaseProps<T, D extends DataItem_Date | DataItem_String | DataItem_Number | undefined = undefined> = FormItemProps<T, D> & DateInput.FCPorps & {
  ref?: Ref<HTMLDivElement>;
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

export type DatePickerProps_TypeString_Single<D extends DataItem_String | undefined = undefined> = DatePickerBaseProps<string, D>;
export type DatePickerProps_TypeString_Multiple<D extends DataItem_String | undefined = undefined> = DatePickerBaseProps<Array<string>, D>;
export type DatePickerProps_TypeString<D extends DataItem_String | undefined = undefined> = (DatePickerProps_TypeString_Single<D> & { $multiple?: false; })
  | (DatePickerProps_TypeString_Multiple<D> & { $multiple: true; });

export type DatePickerProps_TypeNumber_Single<D extends DataItem_Number | undefined = undefined> = DatePickerBaseProps<number, D>;
export type DatePickerProps_TypeNumber_Multiple<D extends DataItem_Number | undefined = undefined> = DatePickerBaseProps<Array<number>, D>;
export type DatePickerProps_TypeNumber<D extends DataItem_Number | undefined = undefined> = (DatePickerProps_TypeNumber_Single<D> & { $multiple?: false; })
  | (DatePickerProps_TypeNumber_Multiple<D> & { $multiple: true; });

export type DatePickerProps_TypeDate_Single<D extends DataItem_Date | undefined = undefined> = DatePickerBaseProps<Date, D>;
export type DatePickerProps_TypeDate_Multiple<D extends DataItem_Date | undefined = undefined> = DatePickerBaseProps<Array<Date>, D>;
export type DatePickerProps_TypeDate<D extends DataItem_Date | undefined = undefined> = (DatePickerProps_TypeDate_Single<D> & { $multiple?: false; })
  | (DatePickerProps_TypeDate_Multiple<D> & { $multiple: true; });

export type DatePickerProps<D extends DataItem_Date | DataItem_String | DataItem_Number | undefined = undefined> = D extends undefined ?
  (
    (DatePickerProps_TypeString & { $typeof?: "string" }) | (DatePickerProps_TypeNumber & { $typeof: "number" }) | (DatePickerProps_TypeDate & { $typeof: "date" })
  ) :
  (
    D extends { type: infer T } ? (
      T extends DataItem_Date["type"] ? (DatePickerProps_TypeDate<Exclude<D, DataItem_String | DataItem_Number>> & { $typeof?: "date" }) :
      T extends DataItem_Number["type"] ? (DatePickerProps_TypeNumber<Exclude<D, DataItem_Date | DataItem_String>> & { $typeof?: "number" }) :
      (DatePickerProps_TypeString<Exclude<D, DataItem_Date | DataItem_Number>> & { $typeof?: "string" })
    ) : (DatePickerProps_TypeString & { $typeof?: "string" }) | (DatePickerProps_TypeNumber & { $typeof: "number" }) | (DatePickerProps_TypeDate & { $typeof: "date" })
  );

const today = new Date();
const threshold = 2;

interface DatePickerFC extends FunctionComponent<DatePickerProps> {
  <D extends DataItem_Date | DataItem_String | DataItem_Number | undefined = undefined>(attrs: DatePickerProps<D>, ref?: ForwardedRef<HTMLDivElement>): ReactElement<any> | null;
}

const DatePicker: DatePickerFC = forwardRef<HTMLDivElement, DatePickerProps>(<
  D extends DataItem_Date | DataItem_String | DataItem_Number | undefined = undefined
>(p: DatePickerProps<D>, ref: ForwardedRef<HTMLDivElement>) => {
  const form = useForm();
  const props = useDataItemMergedProps(form, p, {
    under: ({ dataItem }) => {
      switch (dataItem.type) {
        case "number":
          return {
            $typeof: "number",
          } as DatePickerProps<D>;
        case "date":
        case "month":
        case "year":
          return {
            $type: dataItem.type,
            $typeof: dataItem.typeof,
            $min: dataItem.min,
            $max: dataItem.max,
            $rangePair: dataItem.rangePair,
          } as DatePickerProps<D>;
        default:
          return {
            $typeof: "string",
          } as DatePickerProps<D>;
      }
    },
    over: ({ dataItem, props }) => {
      const common: FormItemProps = {
        $messagePosition: "bottom-hide",
      };
      switch (dataItem.type) {
        case "number":
          return {
            ...common,
            $validations: dataItem.validations?.map(f => convertDataItemValidationToFormItemValidation((value, key, ctx, data, index, pctx) => {
              if (value == null || !Array.isArray(value)) return f(value, key, ctx, data, index, pctx);
              return value.map(v => f(v, key, ctx, data, index, pctx))[0];
            }, props, dataItem)),
          } as DatePickerProps<D>;
        case "date":
        case "month":
        case "year":
          return {
            ...common,
            $validations: dataItem.validations?.map(f => convertDataItemValidationToFormItemValidation((value, key, ctx, data, index, pctx) => {
              if (value == null || !Array.isArray(value)) return f(convertDate(value), key, ctx, data, index, pctx);
              return value.map(v => f(convertDate(v), key, ctx, data, index, pctx))[0];
            }, props, dataItem)),
          } as DatePickerProps<D>;
        default:
          return {
            ...common,
            $validations: dataItem.validations?.map(f => convertDataItemValidationToFormItemValidation((value, key, ctx, data, index, pctx) => {
              if (value == null || !Array.isArray(value)) return f(value, key, ctx, data, index, pctx);
              return value.map(v => f(v, key, ctx, data, index, pctx))[0];
            }, props, dataItem)),
          } as DatePickerProps<D>;
      }
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
    validations: () => {
      if (props.$skipValidation) return [];
      const validations: Array<FormItemValidation<any>> = [];
      const maxTime = DateData.dateAsLast(maxDate, type);
      const minTime = DateData.dateAsFirst(minDate, type);
      if (maxTime != null && minTime != null) {
        const compare = DateInput.rangeValidation(minTime, maxTime, type);
        if (multiple) {
          validations.push(v => multiValidationIterator(v, compare));
        } else {
          validations.push(compare);
        }
      } else {
        if (maxTime != null) {
          const compare = DateInput.maxValidation(maxTime, type);
          if (multiple) {
            validations.push(v => multiValidationIterator(v, compare));
          } else {
            validations.push(compare);
          }
        }
        if (minTime != null) {
          const compare = DateInput.minValidation(minTime, type);
          if (multiple) {
            validations.push(v => multiValidationIterator(v, compare));
          } else {
            validations.push(compare);
          }
        }
      }
      const rangePair = props.$rangePair;
      if (rangePair != null) {
        const { compare, getPairDate, validation } = DateInput.contextValidation(rangePair, type);
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
        const judge = (value: string | number | Date | null) => {
          const date = convertDate(value);
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
        const index = vals.findIndex(v => convertDate(v)?.getFullYear() === num);
        vals.splice(index, 1);
        ctx.change(vals);
        return;
      }
      const vals = [...getArrayValue()];
      vals.push(DateInput.convertDateToValue(new Date(num, 0, 1), props.$typeof));
      ctx.change(vals.sort((d1, d2) => {
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
      if (!afterMin && !DatetimeUtils.isBeforeDate(minFirstDate, date)) {
        afterMin = true;
      }
      if (beforeMax && DatetimeUtils.isAfterDate(maxLastDate, date)) {
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
        const index = vals.findIndex(v => DatetimeUtils.equalYearMonth(convertDate(v), date));
        vals.splice(index, 1);
        ctx.change(vals);
        return;
      }
      const vals = [...getArrayValue()];
      vals.push(DateInput.convertDateToValue(date, props.$typeof));
      ctx.change(vals.sort((d1, d2) => {
        return DatetimeUtils.isBefore(convertDate(d1)!, convertDate(d2)!) ? 1 : -1;
      }));
    };
    return ArrayUtils.generateArray(12, num => {
      const cursor = new Date(year, num, 1);
      const selected = type === "month" ? isSelected(cursor) : month === num;
      const inRange = type === "month" ? isInRange(cursor) :
        isInRange(cursor) || isInRange(DatetimeUtils.getLastDateAtMonth(cursor));
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
        const index = vals.findIndex(v => DatetimeUtils.equalDate(convertDate(v), date));
        vals.splice(index, 1);
        ctx.change(vals);
        return;
      }
      const vals = [...getArrayValue()];
      vals.push(DateInput.convertDateToValue(date, props.$typeof));
      ctx.change(vals.sort((d1, d2) => {
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
        .map(v => convertDate(v)!)
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
});

export default DatePicker;