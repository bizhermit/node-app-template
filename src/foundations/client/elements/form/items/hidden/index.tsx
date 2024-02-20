"use client";

import { forwardRef, type ForwardedRef, type FunctionComponent, type ReactElement } from "react";
import useForm from "../../context";
import { convertHiddenValue } from "../../utilities";
import { FormItemWrap } from "../common";
import { useDataItemMergedProps, useFormItemContext } from "../hooks";

type HiddenOptions = {
  $show?: boolean;
};

type OmitAttrs = "$focusWhenMounted";
export type HiddenProps<D extends DataItem | undefined = undefined> =
  OverwriteAttrs<Omit<F.ItemProps<any, D, any>, OmitAttrs>, HiddenOptions>;

interface HiddenFC extends FunctionComponent<HiddenProps> {
  <D extends DataItem | undefined = undefined>(
    attrs: ComponentAttrsWithRef<HTMLDivElement, HiddenProps<D>>
  ): ReactElement<any> | null;
}

const Hidden = forwardRef(<
  D extends DataItem | undefined = undefined
>(p: HiddenProps<D>, ref: ForwardedRef<HTMLDivElement>) => {
  const form = useForm();
  const { $show, ...$p } = useDataItemMergedProps(form, p);
  const { ctx, props } = useFormItemContext(form, $p);

  return (
    $show ?
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
