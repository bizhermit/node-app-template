import { useCallback, useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";
import type { DataTableBaseColumn, DataTableColumn } from ".";
import { getValue } from "../../../objects/struct/get";
import { setValue } from "../../../objects/struct/set";
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
      return (
        <BulkCheckBox
          dataName={dataName}
          items={items}
          checkedValue={checkedValue}
          uncheckedValue={uncheckedValue}
          isAllChecked={isAllChecked}
          setBodyRev={setBodyRev}
          setBulkCheckedCallback={(setter) => {
            setBulkChecked = setter;
          }}
        />
      );
    } : undefined,
    body: ({ data, items }) => {
      return (
        <CheckBoxCell
          dataName={dataName}
          bulk={props.bulk}
          data={data}
          items={items}
          checkBoxProps={props.checkBoxProps}
          setBulkChecked={setBulkChecked}
          isAllChecked={isAllChecked}
        />
      );
    },
    ...props,
  };
};

const BulkCheckBox = <T extends { [key: string]: any }>({
  dataName,
  items,
  checkedValue,
  uncheckedValue,
  isAllChecked,
  setBodyRev,
  setBulkCheckedCallback,
}: {
  dataName: string;
  items: Array<T>;
  checkedValue: any;
  uncheckedValue: any;
  isAllChecked: (items: Array<T>) => boolean;
  setBodyRev: Dispatch<SetStateAction<number>>;
  setBulkCheckedCallback: (setter: Dispatch<SetStateAction<boolean>>) => void;
}) => {
  const [checked, setChecked] = useState(isAllChecked(items));
  setBulkCheckedCallback(setChecked);
  const itemsRef = useRef(items);

  useEffect(() => {
    setChecked(isAllChecked(itemsRef.current = items));
  }, [items]);

  return (
    <CheckBox
      style={{ marginLeft: "auto", marginRight: "auto" }}
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
};

const CheckBoxCell = <T extends { [key: string]: any }>({
  dataName,
  bulk,
  data,
  items,
  checkBoxProps,
  setBulkChecked,
  isAllChecked
}: {
  dataName: string;
  bulk?: boolean;
  data: T;
  items: Array<T>;
  checkBoxProps?: CheckBoxProps;
  setBulkChecked: (checked: boolean) => void;
  isAllChecked: (items: Array<T>) => boolean;
}) => {
  const v = getValue(data, dataName);
  const [val, setVal] = useState(v);

  const onEdit = useCallback((a: any, b: any, d: any) => {
    setVal(a);
    setValue(data, dataName, a);
    if (bulk) {
      setBulkChecked(isAllChecked(items));
    }
    checkBoxProps?.$onEdit?.(a, b, d);
  }, [items, setBulkChecked]);

  useEffect(() => {
    setVal(v);
  }, [v]);

  return (
    <CheckBox
      {...checkBoxProps}
      name={dataName}
      // $bind={{ ...data }}
      $value={val}
      $preventMemorizeOnEdit
      $onEdit={onEdit}
    />
  );
};

export default dataTableCheckBoxColumn;