"use client";

import Style from "#/styles/components/elements/form/items/text-box.module.scss";
import type { FormItemProps } from "#/components/elements/form/$types";
import useForm from "#/components/elements/form/context";
import { useDataItemMergedProps, useFormItemContext } from "#/components/elements/form/item-hook";
import { FormItemWrap } from "#/components/elements/form/item-wrap";
import StringUtils from "@bizhermit/basic-utils/dist/string-utils";
import { type ReactElement, forwardRef, type ForwardedRef, useRef, type FunctionComponent } from "react";
import { CrossIcon } from "#/components/elements/icon";
import { isEmpty } from "@bizhermit/basic-utils/dist/string-utils";

export type CreditCardNumberBoxProps<
  D extends DataItem_String | undefined = undefined
> = FormItemProps<string, D, string> & {
  $hideClearButton?: boolean;
  $autoComplete?: string;
};

interface CreditCardNumberBoxFC extends FunctionComponent<CreditCardNumberBoxProps> {
  <D extends DataItem_String | undefined = undefined>(
    attrs: ComponentAttrsWithRef<HTMLDivElement, CreditCardNumberBoxProps<D>>
  ): ReactElement<any> | null;
}

const CreditCardNumberBox = forwardRef<HTMLDivElement, CreditCardNumberBoxProps>(<
  D extends DataItem_String | undefined = undefined
>(p: CreditCardNumberBoxProps<D>, ref: ForwardedRef<HTMLDivElement>) => {
  const form = useForm();
  const iref = useRef<HTMLInputElement>(null!);
  const props = useDataItemMergedProps(form, p, {});

  const toCreditCardNumber = (v?: Nullable<string>) => {
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

  const ctx = useFormItemContext(form, props, {
    effect: renderFormattedValue,
  });

  const changeImpl = (value?: string, preventCommit?: boolean): Nullable<string> => {
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

  const hasData = StringUtils.isNotEmpty(ctx.value);

  return (
    <FormItemWrap
      {...props}
      ref={ref}
      $context={ctx}
      data-has={hasData}
    >
      <input
        ref={iref}
        className={Style.input}
        name={props.name}
        type="tel"
        placeholder={ctx.editable ? props.placeholder : ""}
        disabled={ctx.disabled}
        readOnly={ctx.readOnly}
        maxLength={19}
        tabIndex={props.tabIndex}
        defaultValue={ctx.value ?? ""}
        onChange={e => changeImpl(e.target.value)}
        data-clear={ctx.editable && props.$hideClearButton !== true}
        autoComplete={props.$autoComplete ?? "off"}
        inputMode="tel"
      />
      {ctx.editable && props.$hideClearButton !== true &&
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