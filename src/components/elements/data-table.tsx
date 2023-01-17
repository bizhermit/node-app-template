import React, { FC, FunctionComponent, HTMLAttributes, ReactElement, ReactNode, useEffect, useMemo } from "react";
import Style from "$/components/elements/data-table.module.scss";
import { attributes } from "@/components/utilities/attributes";
import { NextLinkProps } from "@/components/elements/link";
import { ButtonProps } from "@/components/elements/button";
import { CheckBoxProps } from "@/components/elements/form-items/check-box";
import { TextBoxProps } from "@/components/elements/form-items/text-box";
import { NumberBoxProps } from "@/components/elements/form-items/number-box";
import { DateBoxProps } from "@/components/elements/form-items/date-box";
import { RadioButtonsProps } from "@/components/elements/form-items/radio-buttons";
import useLoadableArray, { LoadableArray } from "@/hooks/loadable-array";
import LabelText from "@/components/elements/label-text";
import StringUtils from "@bizhermit/basic-utils/dist/string-utils";

type DataTableCellContext<T extends Struct = Struct> = {
  column: DataTableColumn;
  data: T;
  index: number;
};

type DataTableBaseColumn<T extends Struct = Struct> = {
  name: string;
  displayName?: string;
  label?: string;
  width?: number | string;
  minWidth?: number | string;
  maxWidth?: number | string;
  align?: "left" | "center" | "right";
  link?: Omit<NextLinkProps, "children" | "href"> & {
    href: (ctx: DataTableCellContext<T>) => string;
  };
  border?: boolean;
  sort?: boolean | ((data1: T, data2: T) => boolean);
  header?: React.FunctionComponent<Omit<DataTableCellContext<T>, "index">>;
  body?: React.FunctionComponent<DataTableCellContext<T>>;
  footer?: React.FunctionComponent<Omit<DataTableCellContext<T>, "index">>;
};

export type DataTableLabelColumn<T extends Struct = Struct> = DataTableBaseColumn<T>;

export type DataTableButtonColumn<T extends Struct = Struct> = DataTableBaseColumn<T> & {
  props?: Omit<ButtonProps, "$onClick">;
  onClick?: (ctx: DataTableCellContext, unlock: VoidFunc, e: React.MouseEvent<HTMLButtonElement>) => (void | Promise<void>);
};

type InputColumnOmitAttributes = "name" | "$bind" | "$source" | "$tag";
export type DataTableRadioColumn<T extends Struct = Struct> = DataTableBaseColumn<T> & {
  props?: Omit<RadioButtonsProps, InputColumnOmitAttributes>;
};

export type DataTableCheckColumn<T extends Struct = Struct> = DataTableBaseColumn<T> & {
  props?: Omit<CheckBoxProps, InputColumnOmitAttributes>;
  bulk?: boolean;
};

export type DataTableTextColumn<T extends Struct = Struct> = DataTableBaseColumn<T> & {
  props?: Omit<TextBoxProps, InputColumnOmitAttributes>;
};

export type DataTableNumberColumn<T extends Struct = Struct> = DataTableBaseColumn<T> & {
  props?: Omit<NumberBoxProps, InputColumnOmitAttributes>;
};

export type DataTableDateColumn<T extends Struct = Struct> = DataTableBaseColumn<T> & {
  props?: Omit<DateBoxProps, InputColumnOmitAttributes>;
  formatPattern?: string;
};

export type DataTableGroupColumn<T extends Struct = Struct> = {
  name?: string;
  label?: string;
  rows: Array<Array<DataTableColumn<T>>>;
};

export type DataTableColumn<T extends Struct = Struct> =
  DataTableLabelColumn<T>
  | ({ type: "button" } & DataTableButtonColumn<T>)
  | ({ type: "check" } & DataTableCheckColumn<T>)
  | ({ type: "text" } & DataTableTextColumn<T>)
  | ({ type: "number" } & DataTableNumberColumn<T>)
  | ({ type: "date" } & DataTableDateColumn<T>)
  | DataTableGroupColumn<T>;

type DataTableSort = {
  name: string;
  direction: "asc" | "desc";
};

type OmitAttributes = "children";
export type DataTableProps<T extends Struct = Struct> = Omit<HTMLAttributes<HTMLDivElement>, OmitAttributes> & {
  $columns: Array<DataTableColumn<T>>;
  $value: LoadableArray<T>;
  $idDataName?: string;
  $multiSort?: boolean;
  $sort?: Array<DataTableSort>;
  $onSort?: (sort: Array<DataTableSort>) => void;
  $header?: boolean;
  $emptyText?: boolean | ReactNode;
};

interface DataTableFC extends FunctionComponent<DataTableProps> {
  <T extends Struct = Struct>(attrs: DataTableProps<T>, ref?: React.ForwardedRef<HTMLDivElement>): ReactElement<any> | null;
}

const DefaultEmptyText: FC = () => {
  return <LabelText>データが存在しません。</LabelText>;
};

const getValue = <T extends Struct = Struct>(data: T, column: DataTableBaseColumn<T>) => {
  const names = (column.displayName || column.name).split(".");
  let v: any = data;
  for (const n of names) {
    if (v == null) return undefined;
    try {
      v = v[n];
    } catch {
      return undefined;
    }
  }
  return v;
};

const setValue = <T extends Struct = Struct>(data: T, column: DataTableBaseColumn<T>, value: any) => {
  const names = (column.displayName || column.name).split(".");
  let v: any = data;
  for (const n of names.slice(0, names.length - 1)) {
    try {
      if (v[n] == null) v[n] = {};
      v = v[n];
    } catch {
      return;
    }
  }
  try {
    v[names[names.length - 1]] = value;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  }
};

const DataTable: DataTableFC = React.forwardRef<HTMLDivElement, DataTableProps>(<T extends Struct = Struct>(props: DataTableProps<T>, ref: React.ForwardedRef<HTMLDivElement>) => {
  const [originItems] = useLoadableArray(props.$value, { preventMemorize: true });
  const items = useMemo(() => {
    return originItems;
  }, [originItems]);

  const header = useMemo(() => {
    if (!props.$header) return undefined;
    return <></>;
  }, [props.$columns]);

  const body = useMemo(() => {
    const idDn = props.$idDataName ?? "id";
    const generateCell = (index: number, data: T, column: DataTableColumn<T>) => {
      if (!column.name) column.name = StringUtils.generateUuidV4();
      if ("rows" in column) {
        return (
          <div
            key={column.name}
          >
            group
          </div>
        );
      }
      return (
        <div
          key={column.name}
          className={Style.bcell}
        >
          {getValue(data, column)}
        </div>
      );
    };
    return items.map((item, index) => {
      return (
        <div
          key={getValue(item, { name: idDn }) ?? index}
          className={Style.row}
        >
          {props.$columns?.map(col => generateCell(index, item, col))}
        </div>
      );
    });
  }, [items, props.$columns]);

  const isEmpty = useMemo(() => {
    if (!props.$emptyText || props.$value == null || !Array.isArray(props.$value)) return false;
    return items.length === 0 || props.$value.length === 0;
  }, [items, props.$emptyText]);

  return (
    <div
      {...attributes(props, Style.wrap)}
      ref={ref}
    >
      {props.$header &&
        <div className={Style.header}>
          {header}
        </div>
      }
      {isEmpty ?
        <div className={Style.empty}>
          {props.$emptyText === true ? <DefaultEmptyText /> : props.$emptyText}
        </div> :
        <div className={Style.body}>
          {body}
        </div>
      }
    </div>
  );
});

export default DataTable;