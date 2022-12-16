import { equals, FormItemProps, FormItemWrap, useForm } from "@/components/elements/form";
import useLoadableArray, { LoadableArray } from "@/hooks/loadable-array";
import React, { FunctionComponent, ReactElement } from "react";
import { VscChevronDown, VscClose } from "react-icons/vsc";
import Style from "$/components/elements/form-items/select-box.module.scss";

export type SelectBoxProps<T extends string | number = string | number> = FormItemProps<T, { afterData: Struct; beforeData: Struct; }> & {
  $labelDataName?: string;
  $valueDataName?: string;
  $source?: LoadableArray<Struct>;
  $preventSourceMemorize?: boolean;
  $hideClearButton?: boolean;
};

interface SelectBoxFC extends FunctionComponent {
  <T extends string | number = string | number>(attrs: SelectBoxProps<T>, ref?: React.ForwardedRef<HTMLDivElement>): ReactElement<any> | null;
}

const SelectBox: SelectBoxFC = React.forwardRef<HTMLDivElement, SelectBoxProps>(<T extends string | number = string | number>(props: SelectBoxProps<T>, ref: React.ForwardedRef<HTMLDivElement>) => {
  const vdn = props.$valueDataName ?? "value";
  const ldn = props.$labelDataName ?? "label";
  const [source, loading] = useLoadableArray(props.$source, {
    preventMemorize: props.$preventSourceMemorize,
  });

  const form = useForm(props, {
    generateChangeCallbackData: (a, b) => {
      return {
        afterData: source.find(item => equals(item[vdn], a)),
        beforeData: source.find(item => equals(item[vdn], b)),
      };
    }
  });

  return (
    <FormItemWrap
      {...props}
      ref={ref}
      $$form={form}
      $useHidden
    >
      <input
        className={Style.input}
        disabled={form.disabled}
        readOnly={!form.editable}
        type="text"
      />
      {form.editable &&
        <>
          {props.$hideClearButton !== true &&
            <div className={Style.icon}>
              <VscClose />
            </div>
          }
          <div className={Style.icon}>
            <VscChevronDown />
          </div>
        </>
      }
    </FormItemWrap>
  );
});

export default SelectBox;