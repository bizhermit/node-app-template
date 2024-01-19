"use client";

import type { HTMLAttributes, ReactNode } from "react";
import Text from "../../../text";
import useForm from "../../context";
import { useDataItemMergedProps } from "../hooks";

type ValueTextOptions<
  T extends string | number | boolean | Date | null | undefined = string | number | boolean | Date | null | undefined,
  D extends DataItem_String | DataItem_Number | DataItem_Boolean<any, any> | DataItem_Date | undefined = undefined
> = {
  $format?: (v: F.VType<T, D, undefined>) => ReactNode;
};

type OmitAttrs = "children";
export type ValueTextProps<
  T extends string | number | boolean | Date | null | undefined = string | number | boolean | Date | null | undefined,
  D extends DataItem_String | DataItem_Number | DataItem_Boolean<any, any> | DataItem_Date | undefined = undefined
> = OverwriteAttrs<
  Omit<HTMLAttributes<HTMLDivElement> & Pick<F.ItemProps<string | number | boolean, D, undefined>, "name" | "$dataItem">, OmitAttrs>,
  ValueTextOptions<T, D>
>;

const ValueText = <
  T extends string | number | boolean | Date | null | undefined = string | number | boolean | Date | null | undefined,
  D extends DataItem_String | DataItem_Number | DataItem_Boolean<any, any> | DataItem_Date | undefined = undefined
>(p: ValueTextProps<T, D>) => {
  const form = useForm();
  const { name, $dataItem: _, $format, ...props } = useDataItemMergedProps(form, p);
  const value = name ? form.getValue(name) : undefined;

  return (
    <div {...props}>
      <Text>
        {$format ? $format(value as any) : String(value ?? "")}
      </Text>
    </div>
  );
};

export default ValueText;