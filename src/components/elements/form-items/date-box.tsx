import { FormItemProps, FormItemValidation, FormItemWrap, useForm } from "@/components/elements/form";
import DatetimeUtils from "@bizhermit/basic-utils/dist/datetime-utils";
import { dateFormat } from "@bizhermit/basic-utils/dist/datetime-utils";
import { convertDate } from "@bizhermit/basic-utils/dist/datetime-utils";
import React, { useMemo } from "react";

type DateBoxType = "date" | "month" | "year";

type DateBoxCommonProps = {
  $type?: DateBoxType;
  $min?: string | number | Date;
  $max?: string | number | Date;
  $rangePair?: {
    name: string;
    position: "before" | "after";
    disallowSame?: boolean;
  }
};

type DateBoxStringProps = FormItemProps<string> & {
  $typeof?: "string";
};

type DateBoxNumberProps = FormItemProps<number> & {
  $typeof: "number";
};

type DateBoxDateProps = FormItemProps<Date> & {
  $typeof: "date";
};

export type DateBoxProps = (DateBoxStringProps | DateBoxNumberProps | DateBoxDateProps) & DateBoxCommonProps;

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

const toStr = (time?: number, type?: DateBoxType) => {
  if (time == null) return "";
  if (type === "year") return dateFormat(time, "yyyy年");
  if (type === "month") return dateFormat(time, "yyyy/MM");
  return dateFormat(time, "yyyy/MM/dd");
};

const DateBox = React.forwardRef<HTMLDivElement, DateBoxProps>((props, ref) => {
  const type = props.$type ?? "date";
  const minDate = useMemo(() => {
    return convertDate(props.$min) ?? new Date(1900, 0, 1);
  }, [props.$min]);
  const maxDate = useMemo(() => {
    return convertDate(props.$max) ?? new Date(2100, 0, 0);
  }, [props.$max]);

  const form = useForm<string | number | Date | any>(props, {
    interlockValidation: props.$rangePair != null,
    validations: () => {
      const validations: Array<FormItemValidation<any>> = [];
      const maxTime = convertDate((() => {
        switch (type) {
          case "year":
            return DatetimeUtils.getLastDateAtYear(maxDate);
          case "month":
            return DatetimeUtils.getLastDateAtMonth(maxDate);
          default:
            return maxDate;
        }
      })())?.getTime();
      const minTime = convertDate((() => {
        switch (type) {
          case "year":
            return DatetimeUtils.getFirstDateAtYear(minDate);
          case "month":
            return DatetimeUtils.getFirstDateAtMonth(minDate);
          default:
            return minDate;
        }
      })())?.getTime();
      if (maxTime != null && minTime != null) {
        const maxDateStr = toStr(maxTime, type);
        const minDateStr = toStr(minTime, type);
        const compare = (v: any) => {
          const time = convertDate(v)?.getTime();
          if (time == null) return "";
          if (time < minTime || maxTime < time) return `${minDateStr}～${maxDateStr}の範囲で入力してください。`;
          return "";
        };
        validations.push(compare);
      } else {
        if (maxTime != null) {
          const maxDateStr = toStr(maxTime);
          const compare = (v: any) => {
            const time = convertDate(v)?.getTime();
            if (time == null) return "";
            if (time > maxTime) return `${maxDateStr}以前で入力してください。`;
            return "";
          };
          validations.push(compare);
        }
        if (minTime != null) {
          const minDateStr = toStr(minTime);
          const compare = (v: any) => {
            const time = convertDate(v)?.getTime();
            if (time == null) return "";
            if (time < minTime) return `${minDateStr}以降で入力してください。`;
            return "";
          };
          validations.push(compare);
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
        validations.push((v, d) => {
          if (d == null) return "";
          const pairDate = getPairDate(d);
          if (pairDate == null) return "";
          return compare(v, pairDate);
        });
      }
      return validations;
    },
  });

  return (
    <FormItemWrap
      {...props}
      $$form={form}
      ref={ref}
      $useHidden
    >
      <span>datebox</span>
    </FormItemWrap>
  );
});

export default DateBox;