import { convertDataItemValidationToFormItemValidation, FormItemProps, FormItemValidation, FormItemWrap, useDataItemMergedProps, useForm, useFormItemContext } from "@/components/elements/form";
import React, { FunctionComponent, ReactElement, useRef } from "react";
import Style from "$/components/elements/form-items/number-box.module.scss";
import { add, numFormat } from "@bizhermit/basic-utils/dist/number-utils";
import { VscClose, VscTriangleDown, VscTriangleUp } from "react-icons/vsc";
import { isEmpty } from "@bizhermit/basic-utils/dist/string-utils";
import { minus } from "@bizhermit/basic-utils/dist/number-utils";
import Resizer from "@/components/elements/resizer";
import { convertSizeNumToStr } from "@/components/utilities/attributes";
import { NumberData } from "@/data-items/number";

export type NumberBoxProps<D extends DataItem_Number | DataItem_String | undefined = undefined> = FormItemProps<number, D, number> & {
  $max?: number;
  $min?: number;
  $sign?: "only-positive" | "only-negative";
  $float?: number;
  $preventThousandSeparate?: boolean;
  $step?: number;
  $preventKeydownIncrement?: boolean;
  $hideButtons?: boolean;
  $resize?: boolean;
  $inputMode?: "numeric" | "decimal";
  $width?: number | string;
  $maxWidth?: number | string;
  $minWidth?: number | string;
  $hideClearButton?: boolean;
};

interface NumberBoxFC extends FunctionComponent<NumberBoxProps> {
  <D extends DataItem_Number | DataItem_String | undefined = undefined>(attrs: NumberBoxProps<D>, ref?: React.ForwardedRef<HTMLDivElement>): ReactElement<any> | null;
}

const defaultWidth = 150;

const NumberBox: NumberBoxFC = React.forwardRef<HTMLDivElement, NumberBoxProps>(<
  D extends DataItem_Number | DataItem_String | undefined = undefined
>(p: NumberBoxProps<D>, ref: React.ForwardedRef<HTMLDivElement>) => {
  const iref = useRef<HTMLInputElement>(null!);
  const form = useForm();
  const props = useDataItemMergedProps(form, p, {
    under: ({ dataItem }) => {
      switch (dataItem.type) {
        case "string":
          return {
            $min: 0,
            $float: 0,
            $validations: dataItem.validations?.map(f => convertDataItemValidationToFormItemValidation(f, p, dataItem, v => String(v))),
            $width: dataItem.width,
            $minWidth: dataItem.minWidth,
            $maxWidth: dataItem.maxWidth,
          };
        default:
          return {
            $min: dataItem.min,
            $max: dataItem.max,
            $float: dataItem.float,
            $validations: dataItem.validations?.map(f => convertDataItemValidationToFormItemValidation(f, p, dataItem, v => v)),
            $width: dataItem.width,
            $minWidth: dataItem.minWidth,
            $maxWidth: dataItem.maxWidth,
          };
      }
    },
    over: ({ dataItem }) => {
      switch (dataItem.type) {
        case "string":
          return {
            $validations: dataItem.validations?.map(f => convertDataItemValidationToFormItemValidation(f, p, dataItem, v => String(v))),
          };
        default:
          return {
            $validations: dataItem.validations?.map(f => convertDataItemValidationToFormItemValidation(f, p, dataItem)),
          };
      }
    },
  });

  const toString = (v?: Nullable<number>) => {
    if (props.$preventThousandSeparate) return String(v ?? "");
    return numFormat(v, { fpad: props.$float ?? 0 }) ?? "";
  };

  const renderFormattedValue = () => {
    if (!iref.current) return;
    iref.current.value = toString(ctx.valueRef.current);
  };

  const ctx = useFormItemContext(form, props, {
    effect: () => {
      renderFormattedValue();
    },
    validations: () => {
      const validations: Array<FormItemValidation<Nullable<number>>> = [];
      const max = props.$max, min = props.$min;
      if (max != null && min != null) {
        validations.push(v => NumberData.rangeValidation(v, min, max));
      } else {
        if (min != null) {
          validations.push(v => NumberData.minValidation(v, min));
        }
        if (max != null) {
          validations.push(v => NumberData.maxValidation(v, max));
        }
      }
      return validations;
    },
  });

  const renderNumberValue = () => {
    if (!iref.current) return;
    iref.current.value = String(ctx.valueRef.current ?? "");
  };

  const changeImpl = (value?: string, preventCommit?: boolean): Nullable<number> => {
    if (isEmpty(value)) {
      if (preventCommit !== true) ctx.change(undefined);
      return undefined;
    }
    let num = ctx.valueRef.current;
    const float = props.$float ?? 0;
    const revert = () => {
      if (iref.current) renderNumberValue();
      return num;
    };
    switch (props.$sign) {
      case "only-positive":
        if (float > 0) {
          if (!new RegExp(`^[+-]?([0-9]*|0)(\.[0-9]{0,${float}})?$`).test(value)) return revert();
          num = Number(value);
        } else {
          if (!/^[+-]?[0-9]*$/.test(value)) return revert();
          if (/^[+-]?[0-9]*|0$/.test(value)) num = Math.max(0, Number(value));
        }
        break;
      case "only-negative":
        if (float > 0) {
          if (!new RegExp(`^[-]?([0-9]*|0)(\.[0-9]{0,${float}})?$`).test(value)) return revert();
          num = Number(value);
        } else {
          if (!/^[-]?[0-9]*$/.test(value)) return revert();
          if (/^[-]?[0-9]*|0$/.test(value)) num = Math.min(0, Number(value));
        }
        break;
      default:
        if (float > 0) {
          if (!new RegExp(`^[+-]?([0-9]*|0)(\.[0-9]{0,${float}})?$`).test(value)) return revert();
          num = Number(value);
        } else {
          if (!/^[+-]?[0-9]*$/.test(value)) return revert();
          if (/^[+-]?[0-9]*|0$/.test(value)) num = Number(value);
        }
        break;
    }
    if (num != null && !isNaN(num!) && preventCommit !== true) ctx.change(num);
    return num;
  };

  const steppedValue = (value: number) => {
    let val = value;
    if (props.$max != null) val = Math.min(val, props.$max);
    if (props.$min != null) val = Math.max(val, props.$min);
    return val;
  };

  const incrementValue = (format?: boolean, ctr?: boolean) => {
    const num = changeImpl(String(ctx.valueRef.current == null ? (ctr ? props.$max : props.$min ?? 0) :
      ((ctr && props.$max != null) ? props.$max :
        steppedValue(add(ctx.valueRef.current ?? 0, props.$step ?? 1)))), true)!;
    ctx.change(num);
    if (format) renderFormattedValue();
    else renderNumberValue();
  };

  const decrementValue = (format?: boolean, ctr?: boolean) => {
    const num = changeImpl(String(ctx.valueRef.current == null ? (props.$min ?? 0) :
      ((ctr && props.$min != null) ? props.$min :
        steppedValue(minus(ctx.valueRef.current ?? 0, props.$step ?? 1)))), true)!;
    ctx.change(num);
    if (format) renderFormattedValue();
    else renderNumberValue();
  };

  const mousedown = (increment: boolean, ctr: boolean) => {
    if (increment) incrementValue(true, ctr);
    else decrementValue(true, ctr);
    let roop = true;
    const end = () => {
      roop = false;
      window.removeEventListener("mouseup", end);
    };
    window.addEventListener("mouseup", end);
    const func = async () => {
      setTimeout(() => {
        if (roop) {
          if (increment) incrementValue(true, ctr);
          else decrementValue(true, ctr);
          func();
        }
      }, 30);
    };
    setTimeout(func, 500);
  };

  const keydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "ArrowUp":
        if (props.$preventKeydownIncrement || !ctx.editable) return;
        incrementValue(false, e.ctrlKey);
        e.preventDefault();
        break;
      case "ArrowDown":
        if (props.$preventKeydownIncrement || !ctx.editable) return;
        decrementValue(false, e.ctrlKey);
        e.preventDefault();
        break;
      default:
        break;
    }
  };

  const focus = () => {
    if (!ctx.editable) return;
    renderNumberValue();
  };

  const blur = () => {
    renderFormattedValue();
  };

  const clear = () => {
    if (!ctx.editable) return;
    ctx.change(undefined);
    renderFormattedValue();
  };

  const hasData = ctx.value != null;

  return (
    <FormItemWrap
      {...props}
      ref={ref}
      $context={ctx}
      $useHidden
      data-has={hasData}
      $mainProps={{
        style: {
          width: convertSizeNumToStr(props.$width ?? defaultWidth),
          maxWidth: convertSizeNumToStr(props.$maxWidth),
          minWidth: convertSizeNumToStr(props.$minWidth),
        },
      }}
    >
      <input
        ref={iref}
        type="text"
        className={Style.input}
        placeholder={ctx.editable ? props.placeholder : ""}
        disabled={ctx.disabled}
        readOnly={ctx.readOnly}
        tabIndex={props.tabIndex}
        defaultValue={toString(ctx.value)}
        onChange={e => changeImpl(e.target.value)}
        onFocus={focus}
        onBlur={blur}
        onKeyDown={keydown}
        inputMode={props.$inputMode || (props.$float ? "decimal" : "numeric")}
        autoComplete="off"
      />
      {ctx.editable && props.$hideClearButton !== true &&
        <div
          className={Style.clear}
          onClick={clear}
          data-disabled={!hasData}
        >
          <VscClose />
        </div>
      }
      {ctx.editable && !props.$hideButtons &&
        <div
          className={Style.buttons}
        >
          <div
            className={Style.button}
            onMouseDown={e => mousedown(true, e.ctrlKey)}
          >
            <VscTriangleUp />
          </div>
          <div
            className={Style.button}
            onMouseDown={e => mousedown(false, e.ctrlKey)}
          >
            <VscTriangleDown />
          </div>
        </div>
      }
      {props.$resize && <Resizer direction="x" />}
    </FormItemWrap>
  );
});

export default NumberBox;