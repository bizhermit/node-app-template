"use client";

import { forwardRef, useCallback, useEffect, useMemo, useState, type ForwardedRef, type FunctionComponent, type HTMLAttributes, type ReactElement } from "react";
import DateValidation from "../../../../../data-items/date/validations";
import parseDate from "../../../../../objects/date/parse";
import structKeys from "../../../../../objects/struct/keys";
import joinCn from "../../../../utilities/join-class-name";
import rmAttrs from "../../../../utilities/remove-attrs";
import useForm from "../../context";
import DateBox, { useDateBox, type DateBoxProps } from "../date-box";
import { formItemHookNotSetError, useFormItemBase } from "../hooks";
import Style from "./index.module.scss";

type DateRangeBoxHookAddon = {
  focus: (target?: "from" | "to") => void;
};
type DateRangeBoxHook<T extends DateValue> = F.ItemHook<{ from: T | null | undefined; to: T | null | undefined; }, DateRangeBoxHookAddon>;

export const useDateRangeBox = <T extends DateValue>() => useFormItemBase<DateRangeBoxHook<T>>();

type DateBoxOmitProps = "$onChange" | "$onEdit" | "$value" | "$defaultValue" | "$initValue" | "$dataItem" | "$ref";
type DateRangeBoxOptions<D extends DataItem_Date | undefined = undefined> = {
  $ref?: DateRangeBoxHook<F.VType<DateValue, D, DateValue>> | DateRangeBoxHook<DateValue>;
  $from: DateBoxProps<D>;
  $to: DateBoxProps<D>;
} | (Omit<DateBoxProps<D>, DateBoxOmitProps> & {
  $ref?: DateRangeBoxHook<F.VType<DateValue, D, DateValue>> | DateRangeBoxHook<DateValue>;
  $dataItem?: D;
  $onChange?: (
    after: { from: F.VType<DateValue, D>; to: F.VType<DateValue, D>; },
    before: { from: F.VType<DateValue, D>; to: F.VType<DateValue, D>; },
    data: { errorMessage: string | null | undefined }
  ) => void;
  $onEdit?: (
    after: { from: F.VType<DateValue, D>; to: F.VType<DateValue, D>; },
    before: { from: F.VType<DateValue, D>; to: F.VType<DateValue, D>; },
    data: { errorMessage: string | null | undefined }
  ) => void;
  $fromValue?: F.VType<DateValue, D> | null | undefined;
  $fromDefaultValue?: F.VType<DateValue, D> | null | undefined;
  $fromInitValue?: F.VType<DateValue, D> | null | undefined;
  $toValue?: F.VType<DateValue, D> | null | undefined;
  $toDefaultValue?: F.VType<DateValue, D> | null | undefined;
  $toInitValue?: F.VType<DateValue, D> | null | undefined;
});

type OmitAttrs = "name"
  | "inputMode"
  | "defaultValue"
  | "defaultChecked"
  | "color"
  | "onChange"
  | "children";
type DateRangeBoxProps<D extends DataItem_Date | undefined = undefined> =
  OverwriteAttrs<Omit<HTMLAttributes<HTMLDivElement>, OmitAttrs>, DateRangeBoxOptions<D>>;

interface DateRangeBoxFC extends FunctionComponent<DateRangeBoxProps<DataItem_Date | undefined>> {
  <D extends DataItem_Date | undefined = undefined>(
    attrs: ComponentAttrsWithRef<HTMLDivElement, DateRangeBoxProps<D>>
  ): ReactElement<any> | null;
}

const DateRangeBox = forwardRef(<D extends DataItem_Date | undefined = undefined>({
  className,
  $ref,
  ...props
}: DateRangeBoxProps<D>, ref: ForwardedRef<HTMLDivElement>) => {
  const form = useForm();
  const isFormItem = form.bind != null;
  const fromRef = useDateBox();
  const toRef = useDateBox();
  const [fromError, setFromError] = useState<string | undefined>();
  const [toError, setToError] = useState<string | undefined>();

  const memorizedDataItem = useMemo(() => {
    return {
      from: {} as Partial<DataItem_Date>,
      to: {} as Partial<DataItem_Date>,
    };
  }, [(props as any)?.$dataItem]);

  const { from, to } = (() => {
    if ("$from" in props) {
      return {
        from: props.$from,
        to: props.$to,
      };
    }
    const dataItem = {
      $$: undefined,
      type: "date" as const,
      name: props.name ?? "no_name",
      max: props.$max,
      min: props.$min,
      typeof: props.$typeof,
      label: props.$label,
      ...props.$dataItem,
    };
    const fromSuffixName = "from";
    const toSuffixName = "to";
    const name = props.name || dataItem.name;
    const fromName = `${name}_${fromSuffixName}`;
    const toName = `${name}_${toSuffixName}`;
    const setFromDataItemValue = (k: string | number, v: any) => {
      (memorizedDataItem.from as { [v: string]: any })[k] = v;
    };
    const setToDataItemValue = (k: string | number, v: any) => {
      (memorizedDataItem.to as { [v: string]: any })[k] = v;
    };
    structKeys(memorizedDataItem.from).forEach(k => {
      delete memorizedDataItem.from[k];
    });
    structKeys(memorizedDataItem.to).forEach(k => {
      delete memorizedDataItem.to[k];
    });
    structKeys((dataItem as { [k: string]: any })).forEach(k => {
      const v = (dataItem as { [v: string]: any })[k];
      setFromDataItemValue(k, v);
      setToDataItemValue(k, v);
    });
    setFromDataItemValue("name", fromName);
    setFromDataItemValue("rangePair", {
      name: toName,
      position: "after",
      disallowSame: props.$rangePair?.disallowSame,
    });
    setToDataItemValue("name", toName);
    setToDataItemValue("rangePair", {
      name: fromName,
      position: "before",
      disallowSame: props.$rangePair?.disallowSame,
    });

    return {
      from: {
        ...props,
        name: fromName,
        $value: props.$fromValue,
        $defaultValue: props.$fromDefaultValue,
        $initValue: props.$fromInitValue,
        $interlockValidation: isFormItem,
        $dataItem: memorizedDataItem.from,
        ...(props.$onEdit && {
          $onEdit: (a: F.VType<DateValue, D>, b: F.VType<DateValue, D>, data: any) => {
            props.$onEdit?.(
              { from: a, to: toRef.getValue() as F.VType<DateValue, D> },
              { from: b, to: toRef.getValue() as F.VType<DateValue, D> },
              data,
            );
          },
        }),
      },
      to: {
        ...props,
        name: toName,
        $value: props.$toValue,
        $defaultValue: props.$toDefaultValue,
        $initValue: props.$toInitValue,
        $interlockValidation: isFormItem,
        $dataItem: memorizedDataItem.to,
        ...(props.$onEdit && {
          $onEdit: (a: F.VType<DateValue, D>, b: F.VType<DateValue, D>, data: any) => {
            props.$onChange?.(
              { from: fromRef.getValue() as F.VType<DateValue, D>, to: a },
              { from: toRef.getValue() as F.VType<DateValue, D>, to: b },
              data,
            );
          },
        }),
      },
    } as const;
  })();

  const contextValidation = useCallback((f: F.VType<DateValue, D>, t: F.VType<DateValue, D>) => {
    const fromRangePair = from.$rangePair ?? from.$dataItem?.rangePair ?? { name: to.name!, position: "after" };
    const fromErr = !fromRangePair.name ? undefined : DateValidation.context(
      parseDate(f),
      fromRangePair,
      { [fromRangePair.name]: t },
      from.$type ?? from.$dataItem?.type ?? "date",
      from.$label ?? from.$dataItem?.label,
      to.$label ?? to.$dataItem?.label,
    );
    setFromError(fromErr);
    const toRangePair = to.$rangePair ?? to.$dataItem?.rangePair ?? { name: from.name!, position: "before" };
    const toErr = !toRangePair.name ? undefined : DateValidation.context(
      parseDate(t),
      toRangePair,
      { [toRangePair.name]: f },
      to.$type ?? to.$dataItem?.type ?? "date",
      to.$label ?? to.$dataItem?.label,
      from.$label ?? from.$dataItem?.label,
    );
    setToError(toErr);
    return { fromErr, toErr } as const;
  }, [
    isFormItem,
  ]);

  const fromChange = useCallback((a: F.VType<DateValue, D>, b: F.VType<DateValue, D>, data: any) => {
    const fromErr = isFormItem ? undefined : contextValidation(a, toRef.getValue() as F.VType<DateValue, D>)?.fromErr;
    if ("$onChange" in props) {
      props.$onChange?.(
        { from: a, to: toRef.getValue() as F.VType<DateValue, D> },
        { from: b, to: toRef.getValue() as F.VType<DateValue, D> },
        { errorMessage: data.errorMessage ?? fromErr },
      );
    }
  }, [
    contextValidation,
    from.$preventMemorizeOnChange ? (props as any).$onChange : undefined,
    from.$preventMemorizeOnChange ? (props as any).$from.$onChange : undefined,
  ]);

  const toChange = useCallback((a: F.VType<DateValue, D>, b: F.VType<DateValue, D>, data: any) => {
    const toErr = isFormItem ? undefined : contextValidation(fromRef.getValue() as F.VType<DateValue, D>, a).toErr;
    if ("$onChange" in props) {
      props.$onChange?.(
        { from: fromRef.getValue() as F.VType<DateValue, D>, to: a },
        { from: toRef.getValue() as F.VType<DateValue, D>, to: b },
        { errorMessage: data.errorMessage ?? toErr },
      );
    }
  }, [
    contextValidation,
    to.$preventMemorizeOnChange ? (props as any).$onChange : undefined,
    to.$preventMemorizeOnChange ? (props as any).$to?.$onChange : undefined,
  ]);

  if ($ref) {
    $ref.focus = (target = "from") => target === "to" ? toRef.focus() : fromRef.focus();
    $ref.getValue = () => ({
      from: fromRef.getValue() as F.VType<DateValue, D, DateValue>,
      to: toRef.getValue() as F.VType<DateValue, D, DateValue>
    });
    $ref.setValue = (v) => {
      fromRef.setValue(v?.from);
      toRef.setValue(v?.to);
    };
    $ref.setDefaultValue = () => {
      fromRef.setDefaultValue();
      toRef.setDefaultValue();
    };
    $ref.clear = () => {
      fromRef.clear();
      toRef.clear();
    };
    $ref.hasError = () => fromRef.hasError() || toRef.hasError();
    $ref.getErrorMessage = () => fromRef.getErrorMessage() || toRef.getErrorMessage();
  }

  useEffect(() => {
    return () => {
      if ($ref) {
        structKeys($ref).forEach(k => {
          $ref![k] = () => {
            throw formItemHookNotSetError;
          };
        });
      }
    };
  }, []);

  return (
    <div
      {...rmAttrs(props)}
      className={joinCn(Style.wrap, className)}
      ref={ref}
    >
      <DateBox
        {...from as any}
        $ref={fromRef}
        $onChange={fromChange}
        $preventMemorizeOnChange
        $error={fromError}
      />
      <div className={Style.join}>
        -
      </div>
      <DateBox
        {...to as any}
        $ref={toRef}
        $onChange={toChange}
        $preventMemorizeOnChange
        $error={toError}
      />
    </div>
  );
}) as DateRangeBoxFC;

export default DateRangeBox;
