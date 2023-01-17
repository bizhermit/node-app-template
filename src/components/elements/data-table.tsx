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
  $columns: Array<DataTableColumn>;
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
    return <></>;
  }, [items]);

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