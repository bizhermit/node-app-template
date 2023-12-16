"use client";

import { forwardRef, type ForwardedRef, type FunctionComponent, type ReactElement } from "react";
import type { FormItemProps } from "../../$types";
import useForm from "../../context";
import { convertHiddenValue } from "../../utilities";
import { FormItemWrap } from "../common";
import { useDataItemMergedProps, useFormItemContext } from "../hooks";

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
        $ctx={ctx}
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