import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";
import type { DataTableBaseColumn, DataTableColumn } from ".";
import { getValue, setValue } from "../../../data-items/utilities";
import CheckBox, { type CheckBoxProps } from "../form/items/check-box";

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
      const itemsRef = useRef(items);

      useEffect(() => {
        setChecked(isAllChecked(itemsRef.current = items));
      }, [items]);

      return (
        <CheckBox
          style={{ marginLeft: "auto", marginRight: "auto" }}
          $borderCheck
          $disabled={items.length === 0}
          $value={checked}
          $onEdit={v => {
            setChecked(v!);
            if (v) {
              itemsRef.current.forEach(item => setValue(item, dataName, checkedValue));
            } else {
              itemsRef.current.forEach(item => setValue(item, dataName, uncheckedValue));
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
          // $bind={{ ...data }}
          $value={getValue(data, dataName)}
          $onEdit={(a, b, d) => {
            setValue(data, dataName, a);
            if (props.bulk) {
              setBulkChecked(isAllChecked(items));
            }
            props.checkBoxProps?.$onEdit?.(a, b, d);
          }}
        />
      );
    },
    ...props,
  };
};

export default dataTableCheckBoxColumn;