"use client";

import type { FormItemProps } from "#/components/elements/form/$types";
import { useForm } from "#/components/elements/form/context";
import { useDataItemMergedProps, useFormItemContext } from "#/components/elements/form/item-hook";
import { FormItemWrap } from "#/components/elements/form/item-wrap";
import { convertHiddenValue } from "#/components/elements/form/utilities";
import { type ForwardedRef, type ReactElement, type FunctionComponent, forwardRef } from "react";

export type HiddenProps<D extends DataItem | undefined = undefined> = FormItemProps<any, D, any> & {
  $show?: boolean;
};

interface HiddenFC extends FunctionComponent<HiddenProps> {
  <D extends DataItem | undefined = undefined>(attrs: HiddenProps<D>, ref?: ForwardedRef<HTMLDivElement>): ReactElement<any> | null;
}

const Hidden: HiddenFC = forwardRef<HTMLDivElement, HiddenProps>(<
  D extends DataItem | undefined = undefined
>(p: HiddenProps<D>, ref: ForwardedRef<HTMLDivElement>) => {
  const form = useForm();
  const props = useDataItemMergedProps(form, p);
  const ctx = useFormItemContext(form, props);

  return (
    props.$show ?
      <FormItemWrap
        {...props}
        ref={ref}
        $context={ctx}
        $useHidden
        $preventFieldLayout
        $tag={undefined}
        $mainProps={{
          style: { display: "none" }
        }}
      /> :
      (props.name == null ? <></> :
        <input
          name={props.name}
          type="hidden"
          value={convertHiddenValue(ctx.value)}
        />
      )
  );
});

export default Hidden;