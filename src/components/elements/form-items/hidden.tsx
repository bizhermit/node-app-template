import { FormItemProps, FormItemWrap, useDataItemMergedProps, useForm, useFormItemContext } from "@/components/elements/form";
import { type ForwardedRef, type ReactElement, type FunctionComponent, forwardRef } from "react";

export type HiddenProps<D extends DataItem | undefined = undefined> = FormItemProps<any, D, any>;

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
    />
  );
});

export default Hidden;