"use client";

import { forwardRef, useEffect, useRef, type ForwardedRef, type FunctionComponent, type ReactElement } from "react";
import NumberValidation from "../../../../../data-items/number/validations";
import { add, minus } from "../../../../../objects/number/calc";
import formatNum from "../../../../../objects/number/format";
import parseNum from "../../../../../objects/number/parse";
import { isEmpty } from "../../../../../objects/string/empty";
import { convertSizeNumToStr } from "../../../../utilities/size";
import { CrossIcon, DownIcon, UpIcon } from "../../../icon";
import Resizer from "../../../resizer";
import useForm from "../../context";
import { convertDataItemValidationToFormItemValidation } from "../../utilities";
import { FormItemWrap } from "../common";
import { useDataItemMergedProps, useFormItemBase, useFormItemContext } from "../hooks";
import Style from "./index.module.scss";

type NumberBoxHookAddon = {
  up: (ctrl?: boolean) => number;
  down: (ctrl?: boolean) => number;
  add: (v: number) => number;
};
type NumberBoxHook<T extends number = number> = F.ItemHook<T, NumberBoxHookAddon>;

export const useNumberBox = <T extends number = number>() => useFormItemBase<NumberBoxHook<T>>(e => {
  return {
    up: () => {
      throw e;
    },
    down: () => {
      throw e;
    },
    add: () => {
      throw e;
    },
  };
});

type NumberBoxOptions<D extends DataItem_Number | undefined = undefined> = {
  $ref?: NumberBoxHook<F.VType<number, D, number>> | NumberBoxHook<number>;
  $min?: number;
  $max?: number;
  $minLength?: number;
  $maxLength?: number;
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
  $align?: "left" | "center" | "right";
  $disallowInput?: boolean;
};

type OmitAttrs = "";
export type NumberBoxProps<D extends DataItem_Number | undefined = undefined> =
  OverwriteAttrs<Omit<F.ItemProps<number, D, number>, OmitAttrs>, NumberBoxOptions<D>>;

interface NumberBoxFC extends FunctionComponent<NumberBoxProps> {
  <D extends DataItem_Number | undefined = undefined>(
    attrs: ComponentAttrsWithRef<HTMLDivElement, NumberBoxProps<D>>
  ): ReactElement<any> | null;
}

const NumberBox = forwardRef(<
  D extends DataItem_Number | undefined = undefined
>(p: NumberBoxProps<D>, ref: ForwardedRef<HTMLDivElement>) => {
  const iref = useRef<HTMLInputElement>(null!);
  const form = useForm();
  const {
    tabIndex,
    placeholder,
    $min,
    $max,
    $minLength,
    $maxLength,
    $sign,
    $float,
    $preventThousandSeparate,
    $step,
    $preventKeydownIncrement,
    $hideButtons,
    $resize,
    $inputMode,
    $width,
    $maxWidth,
    $minWidth,
    $hideClearButton,
    $align,
    $disallowInput,
    $focusWhenMounted,
    ...$p
  } = useDataItemMergedProps(form, p, {
    under: ({ dataItem, method }) => {
      const isSearch = method === "get";
      return {
        $min: dataItem.min,
        $max: dataItem.max,
        $minLength: isSearch ? undefined : dataItem.minLength,
        $maxLength: dataItem.maxLength,
        $float: dataItem.float,
        $validations: dataItem.validations?.map(f => convertDataItemValidationToFormItemValidation(f, p, dataItem, v => v)),
        $align: dataItem.align,
        $width: dataItem.width,
        $minWidth: dataItem.minWidth,
        $maxWidth: dataItem.maxWidth,
      };
    },
    over: ({ dataItem }) => {
      return {
        $validations: dataItem.validations?.map(f => convertDataItemValidationToFormItemValidation(f, p, dataItem)),
      };
    },
  });

  const toString = (v: number | null | undefined) => {
    return formatNum(v, {
      thou: !$preventThousandSeparate,
      fpad: $float ?? 0,
    }) ?? "";
  };

  const renderFormattedValue = () => {
    if (!iref.current) return;
    iref.current.value = toString(ctx.valueRef.current);
  };

  const { ctx, props, $ref } = useFormItemContext(form, $p, {
    receive: parseNum,
    effect: () => {
      renderFormattedValue();
    },
    validations: ({ label }) => {
      const validations: Array<F.Validation<number | null | undefined>> = [];
      if ($max != null && $min != null) {
        validations.push(v => NumberValidation.range(v, $min, $max, label));
      } else {
        if ($min != null) {
          validations.push(v => NumberValidation.min(v, $min, label));
        }
        if ($max != null) {
          validations.push(v => NumberValidation.max(v, $max, label));
        }
      }
      return validations;
    },
    validationsDeps: [
      $min,
      $max,
    ]
  });

  const renderNumberValue = () => {
    if (!iref.current) return;
    iref.current.value = formatNum(ctx.valueRef.current, { fpad: $float ?? 0, thou: false }) || "";
  };

  const changeImpl = (value?: string, preventCommit?: boolean): number | null | undefined => {
    if (isEmpty(value)) {
      if (preventCommit !== true) ctx.change(undefined);
      return undefined;
    }
    let num = ctx.valueRef.current;
    const float = $float ?? 0;
    const revert = () => {
      if (iref.current) renderNumberValue();
      return num;
    };
    switch ($sign) {
      case "only-positive":
        if (float > 0) {
          if (!new RegExp(`^[+]?([0-9]*|0)(\.[0-9]{0,${float}})?$`).test(value)) return revert();
          num = Number(value);
        } else {
          if (!/^[+]?[0-9]*$/.test(value)) return revert();
          if (/^[+]?[0-9]*|0$/.test(value)) num = Math.max(0, Number(value));
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
    if (iref.current) {
      if (iref.current.value !== value) iref.current.value = value;
    }
    return num;
  };

  const steppedValue = (value: number) => {
    let val = value;
    if ($max != null) val = Math.min(val, $max);
    if ($min != null) val = Math.max(val, $min);
    return val;
  };

  const incrementValue = (format?: boolean, ctr?: boolean, edit: boolean = true) => {
    const num = changeImpl(String(ctx.valueRef.current == null ? (ctr ? $max : $min ?? 0) :
      ((ctr && $max != null) ? $max :
        steppedValue(add(ctx.valueRef.current ?? 0, $step ?? 1)))), true)!;
    ctx.change(num, edit);
    if (format) renderFormattedValue();
    else renderNumberValue();
    return num;
  };

  const decrementValue = (format?: boolean, ctr?: boolean, edit: boolean = true) => {
    const num = changeImpl(String(ctx.valueRef.current == null ? ($min ?? 0) :
      ((ctr && $min != null) ? $min :
        steppedValue(minus(ctx.valueRef.current ?? 0, $step ?? 1)))), true)!;
    ctx.change(num, edit);
    if (format) renderFormattedValue();
    else renderNumberValue();
    return num;
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
        if ($preventKeydownIncrement || !ctx.editable) return;
        incrementValue(false, e.ctrlKey);
        e.preventDefault();
        break;
      case "ArrowDown":
        if ($preventKeydownIncrement || !ctx.editable) return;
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

  useEffect(() => {
    if ($focusWhenMounted) iref.current?.focus();
  }, []);

  if ($ref) {
    $ref.focus = () => iref.current?.focus();
    $ref.up = (ctrl) => incrementValue(true, ctrl, false);
    $ref.down = (ctrl) => decrementValue(true, ctrl, false);
    $ref.add = (num) => {
      const v = steppedValue(add(ctx.valueRef.current ?? 0, num));
      ctx.change(v, false);
      return v;
    };
  }

  return (
    <FormItemWrap
      {...props}
      ref={ref}
      $ctx={ctx}
      $useHidden
      $hasData={hasData}
      $mainProps={{
        style: {
          width: convertSizeNumToStr($width),
          maxWidth: convertSizeNumToStr($maxWidth),
          minWidth: convertSizeNumToStr($minWidth),
        },
      }}
    >
      <input
        ref={iref}
        type="text"
        className={Style.input}
        placeholder={ctx.editable ? placeholder : ""}
        disabled={ctx.disabled}
        readOnly={$disallowInput || ctx.readOnly}
        tabIndex={tabIndex}
        minLength={$minLength}
        maxLength={$maxLength}
        defaultValue={toString(ctx.value)}
        onChange={e => changeImpl(e.target.value)}
        onFocus={focus}
        onBlur={blur}
        onKeyDown={keydown}
        inputMode={$inputMode || ($float ? "decimal" : "numeric")}
        autoComplete="off"
        data-align={$align || "right"}
        data-button={ctx.editable && ($hideClearButton !== true || !$hideButtons)}
      />
      {ctx.editable && $hideClearButton !== true &&
        <div
          className={Style.clear}
          onClick={clear}
          data-disabled={!hasData}
        >
          <CrossIcon />
        </div>
      }
      {ctx.editable && !$hideButtons &&
        <div
          className={Style.buttons}
        >
          <div
            className={Style.button}
            onMouseDown={e => mousedown(true, e.ctrlKey)}
          >
            <UpIcon />
          </div>
          <div
            className={Style.button}
            onMouseDown={e => mousedown(false, e.ctrlKey)}
          >
            <DownIcon />
          </div>
        </div>
      }
      {$resize && <Resizer $direction="x" />}
    </FormItemWrap>
  );
}) as NumberBoxFC;

export default NumberBox;