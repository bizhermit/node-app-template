import { FormItemProps, FormItemValidation, FormItemWrap, useForm } from "@/components/elements/form";
import React, { ChangeEvent, useRef } from "react";
import Style from "$/components/elements/form-items/number-box.module.scss";
import { numFormat } from "@bizhermit/basic-utils/dist/number-utils";
import { VscTriangleDown, VscTriangleUp } from "react-icons/vsc";

type NumberBoxProps = FormItemProps<number> & {
  $max?: number;
  $min?: null;
  $sign?: "only-positive" | "only-negative";
  $float?: number;
  $preventThousandSeparate?: boolean;
  $step?: number;
  $preventKeydownIncrement?: boolean;
  $hideButtons?: boolean;
  $resize?: boolean;
};

const NumberBox = React.forwardRef<HTMLDivElement, NumberBoxProps>((props, ref) => {
  const iref = useRef<HTMLInputElement>(null!);

  const toString = (v: number) => {
    if (props.$preventThousandSeparate) return String(v ?? "");
    return numFormat(v, { fpad: props.$float ?? 0 }) ?? "";
  };

  const replaceFormatted = (v?: Nullable<number>) => {
    // if (iref.current) iref.current.value = val == null ? "" : toString(v);
  };

  const form = useForm(props, {
    effect: (v) => {
      replaceFormatted(v);
    },
    validations: () => {
      const validations: Array<FormItemValidation<Nullable<number>>> = [];
      const max = props.$max, min = props.$min;
      if (max != null && min != null) {
        validations.push(v => {
          if (v != null && (v > max || v < min)) return `${min}以上${max}以下で入力してください。`;
          return "";
        });
      } else {
        if (max != null) {
          validations.push(v => {
            if (v != null && v > max) return `${max}以下で入力してください。`;
            return "";
          });
        }
        if (min != null) {
          validations.push(v => {
            if (v != null && v < min) return `${min}以上で入力してください。`;
            return "";
          });
        }
      }
      return validations;
    },
  });

  const change = (e: ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    console.log(v);
  };

  const incrementValue = (format?: boolean) => {
    // const v = changeValue(String(add(nbuf.current ?? 0, attrs.$incrementInterval ?? 1)));
    // if (!format || StringUtils.isEmpty(v)) iref.current.value = v;
    // else iref.current.value = toString(Number(v));
    // set.current(nbuf.current);
  };

  const decrementValue = (format?: boolean) => {
    // const v = changeValue(String(minus(nbuf.current ?? 0, attrs.$incrementInterval ?? 1)));
    // if (!format || StringUtils.isEmpty(v)) iref.current.value = v;
    // else iref.current.value = toString(Number(v));
    // set.current(nbuf.current);
  };

  const mousedown = (increment: boolean) => {
    if (increment) incrementValue(true);
    else decrementValue(true);
    let roop = true;
    const end = () => {
      roop = false;
      window.removeEventListener("mouseup", end);
    };
    window.addEventListener("mouseup", end);
    const func = async () => {
      setTimeout(() => {
        if (roop) {
          if (increment) incrementValue(true);
          else decrementValue(true);
          func();
        }
      }, 30);
    };
    setTimeout(func, 500);
  };

  const keydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "ArrowUp":
        if (props.$preventKeydownIncrement) return;
        if (form.editable) incrementValue();
        break;
      case "ArrowDown":
        if (props.$preventKeydownIncrement) return;
        if (form.editable) decrementValue();
        break;
      case "Enter":
        // if (form.editable) set.current(nbuf.current);
        break;
      case "Tab":
        // if (form.editable) set.current(nbuf.current);
        break;
      case "Escape":
        // iref.current.value = ibuf.current = String(NumberUtils.removeThousandsSeparator(toString(nbuf.current = buf.current)) ?? "");
        break;
      default:
        break;
    }
  };

  const focus = () => {
    if (!form.editable) return;
    // iref.current.value = ibuf.current = iref.current.value?.replace(/,/g, "") ?? "";
  };

  const blur = () => {
    // set.current(nbuf.current);
    // if (iref.current) iref.current.value = toString(nbuf.current);
  };

  return (
    <FormItemWrap
      {...props}
      ref={ref}
      $$form={form}
      $useHidden
      data-has={Boolean(form.value)}
    >
      <input
        ref={iref}
        type="text"
        className={Style.input}
        placeholder={form.editable ? props.placeholder : ""}
        disabled={form.disabled}
        readOnly={form.readOnly}
        tabIndex={props.tabIndex}
        defaultValue={form.value ?? ""}
        onChange={change}
        onFocus={focus}
        onBlur={blur}
        onKeyDown={keydown}
      />
      {form.editable &&
        <div
          className={Style.buttons}
        >
          <div
            className={Style.button}
            onMouseDown={() => mousedown(true)}
          >
            <VscTriangleUp />
          </div>
          <div
            className={Style.button}
            onMouseDown={() => mousedown(false)}
          >
            <VscTriangleDown />
          </div>
        </div>
      }
    </FormItemWrap>
  );
});

export default NumberBox;