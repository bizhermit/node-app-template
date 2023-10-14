"use client";

import type { ReactNode } from "react";
import type { FormItemProps, ValueType } from "../../$types";
import useForm from "../../context";
import { useDataItemMergedProps } from "../hooks";
import Text from "../../../text";
import { attributes } from "../../../../utilities/attributes";

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