import { ForwardedRef, FunctionComponent, ReactElement, forwardRef, useCallback, useState, type HTMLAttributes } from "react";
import { ValueType } from "../../$types";
import DateValidation from "../../../../../data-items/date/validations";
import parseDate from "../../../../../objects/date/parse";
import { attributes } from "../../../../utilities/attributes";
import useForm from "../../context";
import DateBox, { DateBoxProps, useDateBox } from "../date-box";
import Style from "./index.module.scss";

type InputOmitProps = "name"
  | "inputMode"
  | "defaultValue"
  | "defaultChecked"
  | "color"
  | "onChange"
  | "children";

type DateRangeBoxProps<D extends DataItem_Date | DataItem_String | DataItem_Number | undefined = undefined> = Omit<HTMLAttributes<HTMLDivElement>, InputOmitProps> & ({
  $from: DateBoxProps<D>;
  $to: DateBoxProps<D>;
} | (Omit<DateBoxProps<D>, "$onChange" | "$onEdit" | "$value" | "$defaultValue" | "$initValue"> & {
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
  $fromValue?: any;
  $fromDefaultValue?: any;
  $fromInitValue?: any;
  $toValue?: any;
  $toDefaultValue?: any;
  $toInitValue?: any;
}))

interface DateRangeBoxFC extends FunctionComponent<DateRangeBoxProps> {
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
    const dataItem = props.$dataItem ?? {
      $$: undefined,
      type: "date" as const,
      name: props.name,
      max: props.$max,
      min: props.$min,
      typeof: props.$typeof,
      label: props.$label,
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
          $rangePair: {
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
    const fromRangePair = from.$rangePair ?? from.$dataItem?.rangePair ?? { name: "to", position: "after" };
    const fromErr = DateValidation.context(
      parseDate(f),
      fromRangePair,
      { [fromRangePair.name]: t },
      from.$type ?? from.$dataItem?.type ?? "date",
      from.$label ?? from.$dataItem?.label,
      to.$label ?? to.$dataItem?.label,
    );
    setFromError(fromErr);
    const toRangePair = to.$rangePair ?? to.$dataItem?.rangePair ?? { name: "from", position: "before" };
    const toErr = DateValidation.context(
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
  ]);

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