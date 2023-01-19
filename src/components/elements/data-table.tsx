import React, { CSSProperties, FC, FunctionComponent, HTMLAttributes, ReactElement, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Style from "$/components/elements/data-table.module.scss";
import { attributes, convertSizeNumToStr, joinClassNames } from "@/components/utilities/attributes";
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
import Resizer from "@/components/elements/resizer";

type DataTableCellContext<T extends Struct = Struct> = {
  column: DataTableColumn<T>;
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
  sort?: boolean | ((data1: T, data2: T) => (-1 | 0 | 1));
  resize?: boolean;
  header?: React.FunctionComponent<Omit<DataTableCellContext<T>, "index" | "data">>;
  body?: React.FunctionComponent<DataTableCellContext<T>>;
  footer?: React.FunctionComponent<Omit<DataTableCellContext<T>, "index" | "data">>;
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
  | ({ type?: "label" } & DataTableLabelColumn<T>)
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
  $sorts?: Array<DataTableSort>;
  $onSort?: (sort: Array<DataTableSort>) => (void | boolean);
  $header?: boolean;
  $emptyText?: boolean | ReactNode;
  $color?: Color;
  $rowHeight?: number | string;
  $rowMinHeight?: number | string;
  $rowMaxHeight?: number | string;
  $headerHeight?: number | string;
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

const defaultColumnWidth = "10rem";
const getColumnStyle = (column: DataTableColumn<any>, nestLevel = 0): CSSProperties => {
  if ("rows" in column) return {};
  let w = column.width;
  if (nestLevel > 0 && w == null) w = defaultColumnWidth;
  if (w == null) {
    return {
      flex: "1",
      minWidth: convertSizeNumToStr(column.minWidth) ?? defaultColumnWidth,
      maxWidth: convertSizeNumToStr(column.maxWidth),
    };
  }
  w = convertSizeNumToStr(w);
  return {
    flex: "none",
    width: w,
    minWidth: convertSizeNumToStr(column.minWidth),
    maxWidth: convertSizeNumToStr(column.maxWidth),
  };
};

const findColumn = (columns: Array<DataTableColumn<any>>, column: DataTableColumn<any>) => {
  const find = (cols?: Array<DataTableColumn<any>>) => {
    if (cols == null) return undefined;
    for (const col of cols) {
      if ("rows" in col) {
        for (const rcols of col.rows) {
          const c = find(rcols) as DataTableBaseColumn<any> | undefined;
          if (c != null) return c;
        }
        continue;
      }
      if (col.name === column.name) return col as DataTableBaseColumn<any>;
    }
    return undefined;
  };
  return find(columns);
};

const getCellAlign = (column: DataTableColumn<any>) => {
  if ("rows" in column) return undefined;
  if (column.align) return column.align;
  switch (column.type) {
    case "check":
    case "date":
      return "center";
    case "number":
      return "right";
    default:
      return "left";
  }
};

const switchSortDirection = (currentDirection: "" | "asc" | "desc" | undefined, noReset?: boolean) => {
  if (!currentDirection) return "asc";
  if (currentDirection === "asc") return "desc";
  if (noReset) return "asc";
  return "";
};

const DataTable: DataTableFC = React.forwardRef<HTMLDivElement, DataTableProps>(<T extends Struct = Struct>(props: DataTableProps<T>, ref: React.ForwardedRef<HTMLDivElement>) => {
  const [originItems] = useLoadableArray(props.$value, { preventMemorize: true });
  const items = useMemo(() => {
    return originItems;
  }, [originItems]);
  const [sorts, setSorts] = useState<Array<DataTableSort>>(() => {
    return props.$sorts ?? [];
  });

  useEffect(() => {
    setSorts(props.$sorts ?? []);
  }, [props.$sorts]);

  const [headerRev, setHeaderRev] = useState(0);
  const [bodyRev, setBodyRev] = useState(0);

  const columns = useRef<Array<DataTableColumn<T>>>(null!);
  columns.current = useMemo(() => {
    const clone = (columns?: Array<DataTableColumn<T>>): Array<DataTableColumn<T>> => {
      return columns?.map(col => {
        if ("rows" in col) {
          return {
            ...col,
            rows: col.rows.map(cols => clone(cols)),
          };
        }
        const buf = findColumn(columns, col);
        return {
          ...col,
          width: buf?.width ?? col.width,
          minWidth: buf?.minWidth ?? col.minWidth,
          maxWidth: buf?.maxWidth ?? col.maxWidth,
        };
      }) ?? [];
    };
    return clone(props.$columns);
  }, [props.$columns]);

  const changeSort = useCallback((column: DataTableBaseColumn<T>, currentSort?: DataTableSort) => {
    const d = switchSortDirection(currentSort?.direction);
    const newSorts: Array<DataTableSort> = props.$multiSort ? sorts.filter(s => s.name !== column.name) : [];
    if (d) newSorts.push({ name: column.name, direction: d });
    const ret = props.$onSort?.(newSorts);
    if (ret === false) return;
    setSorts(newSorts);
  }, [sorts, props.$multiSort, props.$onSort]);

  const header = useMemo(() => {
    if (!props.$header) return undefined;
    const generateCell = (column: DataTableColumn<T>, nestLevel = 0) => {
      if (!column.name) column.name = StringUtils.generateUuidV4();
      if ("rows" in column) {
        return (
          <div
            key={column.name}
            className={Style.rcell}
          >
            {column.rows.map((row, index) => {
              if (row.length === 0) {
                return (
                  <div
                    key={index}
                    className={Style.hrow}
                  >
                    <div className={Style.hcell}>
                      <div className={Style.label}>
                        {column.label}
                      </div>
                    </div>
                  </div>
                );
              }
              return (
                <div
                  key={index}
                  className={Style.hrow}
                >
                  {row?.map(c => generateCell(c))}
                </div>
              );
            })}
          </div>
        );
      }
      const sort = sorts.find(s => s.name === column.name);
      return (
        <div
          key={column.name}
          className={Style.hcell}
          style={getColumnStyle(column, nestLevel)}
          onClick={column.sort ? () => {
            changeSort(column, sort);
          } : undefined}
        >
          <div className={Style.content}>
            {column.header ?
              <column.header
                column={column}
              /> :
              <div className={Style.label}>
                {column.label}
              </div>
            }
          </div>
          {column.sort && <div className={Style.sort} data-direction={sort?.direction || ""} />}
          {column.resize &&
            <Resizer
              direction="x"
              resized={({ width }) => {
                column.width = width;
                setHeaderRev(r => r + 1);
                setBodyRev(r => r + 1);
              }}
            />
          }
        </div>
      );
    };
    return (
      <div
        className={Style.hrow}
        style={{
          height: convertSizeNumToStr(props.$headerHeight),
        }}
      >
        {columns.current?.map(col => generateCell(col))}
      </div>
    );
  }, [
    headerRev,
    columns.current,
    props.$headerHeight,
    sorts,
    changeSort,
  ]);

  const body = useMemo(() => {
    const idDn = props.$idDataName ?? "id";
    const rowStyle: CSSProperties = {
      height: convertSizeNumToStr(props.$rowHeight),
      minHeight: convertSizeNumToStr(props.$rowMinHeight),
      maxHeight: convertSizeNumToStr(props.$rowMaxHeight),
    };
    const generateCell = (index: number, data: T, column: DataTableColumn<T>, nestLevel = 0) => {
      if (!column.name) column.name = StringUtils.generateUuidV4();
      if ("rows" in column) {
        return (
          <div
            key={column.name}
            className={Style.rcell}
          >
            {column.rows.map((row, index) => {
              if (row.length === 0) return <></>;
              return (
                <div
                  key={index}
                  className={Style.brow}
                >
                  {row?.map(c => generateCell(index, data, c))}
                </div>
              );
            })}
          </div>
        );
      }
      return (
        <div
          key={column.name}
          className={Style.bcell}
          data-align={getCellAlign(column)}
          style={getColumnStyle(column, nestLevel)}
        >
          {column.body ?
            <column.body
              index={index}
              column={column}
              data={data}
            /> :
            <div className={Style.label}>
              {getValue(data, column)}
            </div>
          }
        </div>
      );
    };
    return items.map((item, index) => {
      return (
        <div
          key={getValue(item, { name: idDn }) ?? index}
          className={Style.brow}
          style={rowStyle}
        >
          {columns.current?.map(col => generateCell(index, item, col))}
        </div>
      );
    });
  }, [
    bodyRev,
    items,
    columns.current,
    props.$rowHeight,
    props.$rowMinHeight,
    props.$rowMaxHeight,
  ]);

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
        <div className={joinClassNames(Style.header, `c-${props.$color || "main"}`)}>
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