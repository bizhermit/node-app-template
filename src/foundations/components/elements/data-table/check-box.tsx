import type { DataTableBaseColumn, DataTableColumn } from "#/components/elements/data-table";
import CheckBox, { type CheckBoxProps } from "#/components/elements/form-items/check-box";
import { getValue, setValue } from "#/data-items/utilities";
import { type Dispatch, type SetStateAction, useEffect, useState } from "react";

type Props<T extends Struct> = DataTableBaseColumn<T> & {
  checkBoxProps?: CheckBoxProps;
  bulk?: boolean;
};

const dataTableCheckBoxColumn = <T extends Struct>(props: Props<T>): DataTableColumn<T> => {
  let setBulkChecked: Dispatch<SetStateAction<boolean>> = () => { };
  const checkedValue = props.checkBoxProps?.$checkedValue ?? true;
  const uncheckedValue = props.checkBoxProps?.$uncheckedValue ?? false;
  const dataName = props.displayName || props.name;
  const isAllChecked = (items: Array<T>) => {
    if (items == null || items.length === 0) return false;
    return items.length === items.filter(item => getValue(item, dataName) === checkedValue).length;
  };
  return {
    align: "center",
    width: "4rem",
    resize: false,
    header: props.bulk ? ({ items, setBodyRev }) => {
      const [checked, setChecked] = useState(isAllChecked(items));
      setBulkChecked = setChecked;
      useEffect(() => {
        setChecked(isAllChecked(items));
      }, [items]);
      return (
        <CheckBox
          className="mx-auto"
          $borderCheck
          $disabled={items.length === 0}
          $value={checked}
          $onChange={v => {
            setChecked(v!);
            if (v) {
              items.forEach(item => setValue(item, dataName, checkedValue));
            } else {
              items.forEach(item => setValue(item, dataName, uncheckedValue));
            }
            setBodyRev(s => s + 1);
          }}
        />
      );
    } : undefined,
    body: ({ data, items }) => {
      return (
        <CheckBox
          {...props.checkBoxProps}
          name={dataName}
          $bind={{ ...data }}
          $onChange={(a, b, d) => {
            setValue(data, dataName, a);
            if (props.bulk) {
              setBulkChecked(isAllChecked(items));
            }
            props.checkBoxProps?.$onChange?.(a, b, d);
          }}
        />
      );
    },
    ...props,
  };
};

export default dataTableCheckBoxColumn;