"use client";

import { forwardRef, useEffect, useRef, type ForwardedRef, type FunctionComponent, type ReactElement } from "react";
import StringValidation from "../../../../../data-items/string/validations";
import { isEmpty, isNotEmpty } from "../../../../../objects/string/empty";
import { CrossIcon } from "../../../icon";
import useForm from "../../context";
import { FormItemWrap } from "../common";
import { useDataItemMergedProps, useFormItemContext } from "../hooks";
import Style from "./index.module.scss";

type CreditCardNumberBoxOptions = {
  $hideClearButton?: boolean;
  $autoComplete?: string;
};

export type CreditCardNumberBoxProps<
  D extends DataItem_String | undefined = undefined
> = OverwriteAttrs<F.ItemProps<string, D, string>, CreditCardNumberBoxOptions>;

interface CreditCardNumberBoxFC extends FunctionComponent<CreditCardNumberBoxProps> {
  <D extends DataItem_String | undefined = undefined>(
    attrs: ComponentAttrsWithRef<HTMLDivElement, CreditCardNumberBoxProps<D>>
  ): ReactElement<any> | null;
}

const CreditCardNumberBox = forwardRef<HTMLDivElement, CreditCardNumberBoxProps>(<
  D extends DataItem_String | undefined = undefined
>(p: CreditCardNumberBoxProps<D>, r: ForwardedRef<HTMLDivElement>) => {
  const form = useForm();
  const iref = useRef<HTMLInputElement>(null!);
  const {
    tabIndex,
    placeholder,
    $hideClearButton,
    $autoComplete,
    $focusWhenMounted,
    ...$p
  } = useDataItemMergedProps(form, p, {});

  const toCreditCardNumber = (v: string | null | undefined) => {
    return (v?.replace(/\s/g, "") ?? "")
      .split("")
      .reduce((ccnumStr, numStr, index) => {
        return ccnumStr + numStr + (0 < index && index < 15 && (index + 1) % 4 === 0 ? " " : "");
      }, "");
  };

  const renderFormattedValue = () => {
    if (!iref.current) return;
    iref.current.value = toCreditCardNumber(ctx.valueRef.current);
  };

  const { ctx, props, $ref } = useFormItemContext(form, $p, {
    effect: renderFormattedValue,
    validations: ({ label }) => {
      const validations: Array<F.Validation<string | null | undefined>> = [];
      validations.push(v => StringValidation.minLength(v, 14, label));
      validations.push(v => StringValidation.maxLength(v, 16, label));
      return validations;
    },
  });

  const changeImpl = (value?: string, preventCommit?: boolean): string | null | undefined => {
    if (isEmpty(value)) {
      if (preventCommit !== true) ctx.change(undefined);
      return undefined;
    }
    const revert = () => {
      if (iref.current) iref.current.value = toCreditCardNumber(ctx.valueRef.current);
      return ctx.valueRef.current;
    };
    const v = value.replace(/\s/g, "");
    if (!/^[0-9]*$/.test(v)) return revert();
    const buf = String(ctx.valueRef.current || "");
    if (preventCommit !== true) ctx.change(v);
    if (iref.current) {
      let fv = toCreditCardNumber(v);
      if (v.length <= buf.length) fv = fv.trim();
      if (iref.current.value !== fv) {
        iref.current.value = fv;
      }
    }
    return v;
  };

  const clear = () => {
    if (!ctx.editable) return;
    ctx.change(undefined);
    if (iref.current) iref.current.value = "";
  };

  const hasData = isNotEmpty(ctx.value);
  const formEnable = !form.disabled && !form.readOnly;

  useEffect(() => {
    if ($focusWhenMounted && formEnable) {
      iref.current?.focus();
    }
  }, [formEnable]);

  if ($ref) {
    $ref.focus = () => iref.current?.focus();
  }

  return (
    <FormItemWrap
      {...props}
      ref={r}
      $ctx={ctx}
      $hasData={hasData}
    >
      <input
        ref={iref}
        className={Style.input}
        name={props.name}
        type="tel"
        placeholder={ctx.editable ? placeholder : ""}
        disabled={ctx.disabled}
        readOnly={ctx.readOnly}
        maxLength={19}
        tabIndex={tabIndex}
        defaultValue={ctx.value ?? ""}
        onChange={e => changeImpl(e.target.value)}
        data-button={ctx.editable && $hideClearButton !== true}
        autoComplete={$autoComplete ?? "off"}
        inputMode="tel"
      />
      {ctx.editable && $hideClearButton !== true &&
        <div
          className={Style.button}
          onClick={clear}
          data-disabled={!hasData}
        >
          <CrossIcon />
        </div>
      }
    </FormItemWrap>
  );
}) as CreditCardNumberBoxFC;

export default CreditCardNumberBox;
