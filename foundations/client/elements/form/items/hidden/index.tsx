"use client";

import { type ForwardedRef, type ReactElement, type FunctionComponent, forwardRef } from "react";
import type { FormItemProps } from "../../$types";
import useForm from "../../context";
import { useDataItemMergedProps, useFormItemContext } from "../hooks";
import { FormItemWrap } from "../common";
import { convertHiddenValue } from "../../utilities";

export type HiddenProps<D extends DataItem | undefined = undefined> = FormItemProps<any, D, any> & {
  $show?: boolean;
};

interface HiddenFC extends FunctionComponent<HiddenProps> {
  <D extends DataItem | undefined = undefined>(
    attrs: ComponentAttrsWithRef<HTMLDivElement, HiddenProps<D>>
  ): ReactElement<any> | null;
}

const Hidden = forwardRef<HTMLDivElement, HiddenProps>(<
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
        $hideWhenNoError
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
}) as HiddenFC;

export default Hidden;