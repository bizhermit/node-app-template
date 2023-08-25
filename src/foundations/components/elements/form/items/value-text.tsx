"use client";

import type { FormItemProps, ValueType } from "#/components/elements/form/$types";
import useForm from "#/components/elements/form/context";
import { useDataItemMergedProps } from "#/components/elements/form/item-hook";
import Text from "#/components/elements/text";
import { attributes } from "#/components/utilities/attributes";
import type { ReactNode } from "react";

export type ValueTextProps<
  T extends string | number | boolean | Date | null | undefined = string | number | boolean | Date | null | undefined,
  D extends DataItem_String | DataItem_Number | DataItem_Boolean | DataItem_Date | undefined = undefined
> = FormItemProps<string | number | boolean, D, undefined> & {
  $format?: (v: ValueType<T, D, undefined>) => ReactNode;
};

const ValueText = <
  T extends string | number | boolean | Date | null | undefined = string | number | boolean | Date | null | undefined,
  D extends DataItem_String | DataItem_Number | DataItem_Boolean | DataItem_Date | undefined = undefined
>(p: ValueTextProps<T, D>) => {
  const form = useForm();
  const props = useDataItemMergedProps(form, p);
  const value = props.name ? form.getValue(props.name) : undefined;

  return (
    <div {...attributes(props)}>
      <Text>
        {props.$format ? props.$format(value as any) : String(value ?? "")}
      </Text>
    </div>
  );
};

export default ValueText;