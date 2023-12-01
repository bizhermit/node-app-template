import { ForwardedRef, FunctionComponent, ReactElement, forwardRef, useCallback, useEffect, useState, type HTMLAttributes } from "react";
import { FormItemHook, ValueType } from "../../$types";
import DateValidation from "../../../../../data-items/date/validations";
import parseDate from "../../../../../objects/date/parse";
import structKeys from "../../../../../objects/struct/keys";
import { attributes } from "../../../../utilities/attributes";
import useForm from "../../context";
import DateBox, { DateBoxProps, useDateBox } from "../date-box";
import { formItemHookNotSetError, useFormItemBase } from "../hooks";
import Style from "./index.module.scss";

type InputOmitProps = "name"
  | "inputMode"
  | "defaultValue"
  | "defaultChecked"
  | "color"
  | "onChange"
  | "children";

type DateRangeBoxHookAddon = {
  focus: (target?: "from" | "to") => void;
};
type DateRangeBoxHook<T extends DateValue> = FormItemHook<{ from: T | null | undefined; to: T | null | undefined; }, DateRangeBoxHookAddon>;

export const useDateRangeBox = <T extends DateValue>() => useFormItemBase<DateRangeBoxHook<T>>();

type DateRangeBoxProps<D extends DataItem_Date | undefined = undefined> = Omit<HTMLAttributes<HTMLDivElement>, InputOmitProps> & ({
  $ref?: DateRangeBoxHook<ValueType<DateValue, D, DateValue>> | DateRangeBoxHook<DateValue>;
  $from: DateBoxProps<D>;
  $to: DateBoxProps<D>;
} | (Omit<DateBoxProps<D>, "$onChange" | "$onEdit" | "$value" | "$defaultValue" | "$initValue" | "$dataItem" | "$ref"> & {
  $ref?: DateRangeBoxHook<ValueType<DateValue, D, DateValue>> | DateRangeBoxHook<DateValue>;
  $dataItem?: D;
  $onChange?: (
    after: { from: ValueType<DateValue, D>; to: ValueType<DateValue, D>; },
    before: { from: ValueType<DateValue, D>; to: ValueType<DateValue, D>; },
    data: { errorMessage: string | null | undefined }
  ) => void;
  $onEdit?: (
    after: { from: ValueType<DateValue, D>; to: ValueType<DateValue, D>; },
    before: { from: ValueType<DateValue, D>; to: ValueType<DateValue, D>; },
    data: { errorMessage: string | null | undefined }
  ) => void;
  $fromValue?: ValueType<DateValue, D> | null | undefined;
  $fromDefaultValue?: ValueType<DateValue, D> | null | undefined;
  $fromInitValue?: ValueType<DateValue, D> | null | undefined;
  $toValue?: ValueType<DateValue, D> | null | undefined;
  $toDefaultValue?: ValueType<DateValue, D> | null | undefined;
  $toInitValue?: ValueType<DateValue, D> | null | undefined;
}))

interface DateRangeBoxFC extends FunctionComponent<DateRangeBoxProps<DataItem_Date | undefined>> {
  <D extends DataItem_Date | undefined = undefined>(
    attrs: ComponentAttrsWithRef<HTMLDivElement, DateRangeBoxProps<D>>
  ): ReactElement<any> | null;
}

const DateRangeBox = forwardRef<HTMLDivElement, DateRangeBoxProps>(<
  D extends DataItem_Date | undefined = undefined
>(props: DateRangeBoxProps<D>, ref: ForwardedRef<HTMLDivElement>) => {
  const form = useForm();
  const isFormItem = form.bind != null;
  const fromRef = useDateBox();
  const toRef = useDateBox();
  const [fromError, setFromError] = useState<string | undefined>();
  const [toError, setToError] = useState<string | undefined>();

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
      // ...props.$dataItem,
    };
    const fromSuffixName = "from";
    const toSuffixName = "to";
    const name = props.name || dataItem.name;
    const fromName = `${name}_${fromSuffixName}`;
    const toName = `${name}_${toSuffixName}`;
    return {
      from: {
        ...props,
        name: fromName,
        $value: props.$fromValue,
        $defaultValue: props.$fromDefaultValue,
        $initValue: props.$fromInitValue,
        $interlockValidation: isFormItem,
        $dataItem: {
          ...dataItem,
          name: fromName,
          rangePair: {
            name: toName,
            position: "after",
            disallowSame: props.$rangePair?.disallowSame,
          },
        } as const,
        ...(props.$onEdit && {
          $onEdit: (a: ValueType<DateValue, D>, b: ValueType<DateValue, D>, data: any) => {
            props.$onEdit?.(
              { from: a, to: toRef.getValue() as ValueType<DateValue, D> },
              { from: b, to: toRef.getValue() as ValueType<DateValue, D> },
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
        $dataItem: {
          ...dataItem,
          name: toName,
          rangePair: {
            name: fromName,
            position: "before",
            disallowSame: props.$rangePair?.disallowSame,
          },
        } as const,
        ...(props.$onEdit && {
          $onEdit: (a: ValueType<DateValue, D>, b: ValueType<DateValue, D>, data: any) => {
            props.$onChange?.(
              { from: fromRef.getValue() as ValueType<DateValue, D>, to: a },
              { from: toRef.getValue() as ValueType<DateValue, D>, to: b },
              data,
            );
          },
        }),
      },
    } as const;
  })();

  const contextValidation = useCallback((f: ValueType<DateValue, D>, t: ValueType<DateValue, D>) => {
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

  const fromChange = useCallback((a: ValueType<DateValue, D>, b: ValueType<DateValue, D>, data: any) => {
    const fromErr = isFormItem ? undefined : contextValidation(a, toRef.getValue() as ValueType<DateValue, D>)?.fromErr;
    if ("$onChange" in props) {
      props.$onChange?.(
        { from: a, to: toRef.getValue() as ValueType<DateValue, D> },
        { from: b, to: toRef.getValue() as ValueType<DateValue, D> },
        { errorMessage: data.errorMessage ?? fromErr },
      );
    }
  }, [
    contextValidation,
    from.$preventMemorizeOnChange ? (props as any).$onChange : undefined,
    from.$preventMemorizeOnChange ? (props as any).$from.$onChange : undefined,
  ]);

  const toChange = useCallback((a: ValueType<DateValue, D>, b: ValueType<DateValue, D>, data: any) => {
    const toErr = isFormItem ? undefined : contextValidation(fromRef.getValue() as ValueType<DateValue, D>, a).toErr;
    if ("$onChange" in props) {
      props.$onChange?.(
        { from: fromRef.getValue() as ValueType<DateValue, D>, to: a },
        { from: toRef.getValue() as ValueType<DateValue, D>, to: b },
        { errorMessage: data.errorMessage ?? toErr },
      );
    }
  }, [
    contextValidation,
    to.$preventMemorizeOnChange ? (props as any).$onChange : undefined,
    to.$preventMemorizeOnChange ? (props as any).$to?.$onChange : undefined,
  ]);

  if (props.$ref) {
    props.$ref.focus = (target = "from") => target === "to" ? toRef.focus() : fromRef.focus();
    props.$ref.getValue = () => ({
      from: fromRef.getValue() as ValueType<DateValue, D, DateValue>,
      to: toRef.getValue() as ValueType<DateValue, D, DateValue>
    });
    props.$ref.setValue = (v) => {
      fromRef.setValue(v?.from);
      toRef.setValue(v?.to);
    };
    props.$ref.setDefaultValue = () => {
      fromRef.setDefaultValue();
      toRef.setDefaultValue();
    };
    props.$ref.clear = () => {
      fromRef.clear();
      toRef.clear();
    };
    props.$ref.hasError = () => fromRef.hasError() || toRef.hasError();
    props.$ref.getErrorMessage = () => fromRef.getErrorMessage() || toRef.getErrorMessage();
  }

  useEffect(() => {
    return () => {
      if (props.$ref) {
        structKeys(props.$ref).forEach(k => {
          props.$ref![k] = () => {
            throw formItemHookNotSetError;
          };
        });
      }
    };
  }, []);

  return (
    <div
      {...attributes(props, Style.wrap)}
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