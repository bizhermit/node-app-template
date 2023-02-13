import { DataTableBaseColumn, DataTableColumn } from "@/components/elements/data-table";
import CheckBox, { CheckBoxProps } from "@/components/elements/form-items/check-box";
import { getValue, setValue } from "@/data-items/utilities";
import React, { useEffect, useState } from "react";

type Props<T extends Struct> = DataTableBaseColumn<T> & {
  checkBoxProps?: CheckBoxProps;
  bulkCheck?: boolean;
};

const dataTableCheckBoxColumn = <T extends Struct>(props: Props<T>): DataTableColumn<T> => {
  let setBulkChecked: React.Dispatch<React.SetStateAction<boolean>> = () => { };
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
    header: props.bulkCheck ? ({ items, setBodyRev }) => {
      const [checked, setChecked] = useState(isAllChecked(items));
      setBulkChecked = setChecked;
      useEffect(() => {
        setChecked(isAllChecked(items));
      }, [items]);
      return (
        <CheckBox
          className="mx-auto"
          $outline
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
          name={dataName}
          $bind={{ ...data }}
          $onChange={v => {
            setValue(data, dataName, v);
            if (props.bulkCheck) {
              setBulkChecked(isAllChecked(items));
            }
          }}
        />
      );
    },
    ...props,
  };
};

export default dataTableCheckBoxColumn;