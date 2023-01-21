import React, { CSSProperties, FC, FunctionComponent, HTMLAttributes, ReactElement, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Style from "$/components/elements/data-table.module.scss";
import { attributes, convertSizeNumToStr, joinClassNames } from "@/components/utilities/attributes";
import NextLink from "@/components/elements/link";
import useLoadableArray, { LoadableArray } from "@/hooks/loadable-array";
import LabelText from "@/components/elements/label-text";
import Resizer from "@/components/elements/resizer";
import DatetimeUtils from "@bizhermit/basic-utils/dist/datetime-utils";
import NumberUtils from "@bizhermit/basic-utils/dist/number-utils";

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
  href?: (ctx: DataTableCellContext<T>) => string;
  hrefOptions?: {
    target?: React.HTMLAttributeAnchorTarget;
    decoration?: boolean;
    rel?: string;
  };
  border?: boolean;
  sort?: boolean | ((data1: T, data2: T) => (-1 | 0 | 1));
  resize?: boolean;
  header?: React.FunctionComponent<Omit<DataTableCellContext<T>, "index" | "data">>;
  body?: React.FunctionComponent<DataTableCellContext<T>>;
  footer?: React.FunctionComponent<Omit<DataTableCellContext<T>, "index" | "data">>;
};

export type DataTableLabelColumn<T extends Struct = Struct> = DataTableBaseColumn<T>;

export type DataTableNumberColumn<T extends Struct = Struct> = DataTableBaseColumn<T> & {
  thousandSseparator?: boolean;
  floatPadding?: number;
};

export type DataTableDateColumn<T extends Struct = Struct> = DataTableBaseColumn<T> & {
  formatPattern?: string;
};

export type DataTableGroupColumn<T extends Struct = Struct> = {
  name: string;
  label?: string;
  rows: Array<Array<DataTableColumn<T>>>;
};

export type DataTableColumn<T extends Struct = Struct> =
  | ({ type?: "label" } & DataTableLabelColumn<T>)
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
  $preventSort?: boolean;
  $header?: boolean;
  $emptyText?: boolean | ReactNode;
  $color?: Color;
  $rowHeight?: number | string;
  $rowMinHeight?: number | string;
  $rowMaxHeight?: number | string;
  $headerHeight?: number | string;
  $scroll?: boolean;
  $outline?: boolean;
  $rowBorder?: boolean;
  $cellBorder?: boolean;
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

const findColumn = (columns: Array<DataTableColumn<any>>, columnName: string) => {
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
      if (col.name === columnName) return col as DataTableBaseColumn<any>;
    }
    return undefined;
  };
  return find(columns);
};

const getCellAlign = (column: DataTableColumn<any>) => {
  if ("rows" in column) return undefined;
  if (column.align) return column.align;
  switch (column.type) {
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

const equals = (v1: unknown, v2: unknown) => {
  if (v1 == null && v2 == null) return true;
  return v1 === v2;
};

const DataTable: DataTableFC = React.forwardRef<HTMLDivElement, DataTableProps>(<T extends Struct = Struct>(props: DataTableProps<T>, ref: React.ForwardedRef<HTMLDivElement>) => {
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
        const buf = findColumn(columns, col.name);
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
  const [sorts, setSorts] = useState<Array<DataTableSort>>(() => {
    return props.$sorts ?? [];
  });
  const [originItems] = useLoadableArray(props.$value, { preventMemorize: true });
  const items = useMemo(() => {
    if (props.$preventSort) return originItems;
    const sortCols = sorts.map(s => {
      const col = findColumn(columns.current, s.name);
      if (!col) return undefined;
      return { ...s, column: col };
    }).filter(col => col != null);
    return [...originItems].sort((item1, item2) => {
      for (const scol of sortCols) {
        const v1 = getValue(item1, scol!);
        const v2 = getValue(item2, scol!);
        const dnum = scol?.direction === "desc" ? -1 : 1;
        if (typeof scol!.column.sort === "function") {
          const ret = scol!.column.sort(v1, v2);
          if (ret === 0) continue;
          return ret * dnum;
        }
        if (equals(v1, v2)) continue;
        return (v1 < v2 ? -1 : 1) * dnum;
      }
      return 0;
    });
  }, [originItems, sorts]);

  useEffect(() => {
    setSorts(props.$sorts ?? []);
  }, [props.$sorts]);

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
                    data-border={props.$rowBorder}
                  >
                    <div
                      className={Style.hcell}
                      data-border={props.$cellBorder}
                    >
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
                  data-border={props.$rowBorder}
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
          data-border={props.$cellBorder}
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
        data-border={props.$rowBorder}
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
    props.$rowBorder,
    props.$cellBorder,
  ]);

  const body = useMemo(() => {
    const idDn = props.$idDataName ?? "id";
    const rowStyle: CSSProperties = {
      height: convertSizeNumToStr(props.$rowHeight),
      minHeight: convertSizeNumToStr(props.$rowMinHeight),
      maxHeight: convertSizeNumToStr(props.$rowMaxHeight),
    };
    const generateCell = (index: number, data: T, column: DataTableColumn<T>, nestLevel = 0) => {
      if ("rows" in column) {
        return (
          <div
            key={column.name}
            className={Style.rcell}
          >
            {column.rows.map((row, index) => {
              if (row.length === 0) return undefined;
              return (
                <div
                  key={index}
                  className={Style.brow}
                  data-border={props.$rowBorder}
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
          style={getColumnStyle(column, nestLevel)}
          data-align={getCellAlign(column)}
          data-border={props.$cellBorder}
        >
          <NextLink
            href={column.href?.({ column, data, index })}
            target={column.hrefOptions?.target}
            rel={column.hrefOptions?.rel}
            className={column.hrefOptions?.decoration === false ? "no-decoration" : undefined}
          >
            {column.body ?
              <column.body
                index={index}
                column={column}
                data={data}
              /> :
              <div className={Style.label}>
                {(() => {
                  const v = getValue(data, column);
                  switch (column.type) {
                    case "date":
                      return DatetimeUtils.format(v, column.formatPattern ?? "yyyy/MM/dd");
                    case "number":
                      return NumberUtils.format(v, {
                        thou: column.thousandSseparator ?? true,
                        fpad: column.floatPadding ?? 0,
                      });
                    default:
                      return v;
                  }
                })()}
              </div>
            }
          </NextLink>
        </div>
      );
    };
    return items.map((item, index) => {
      return (
        <div
          key={getValue(item, { name: idDn }) ?? index}
          className={Style.brow}
          style={rowStyle}
          data-border={props.$rowBorder}
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
    props.$rowBorder,
    props.$cellBorder,
  ]);

  const isEmpty = useMemo(() => {
    if (!props.$emptyText || props.$value == null || !Array.isArray(props.$value)) return false;
    return items.length === 0 || props.$value.length === 0;
  }, [items, props.$emptyText]);

  return (
    <div
      {...attributes(props, Style.wrap)}
      ref={ref}
      data-border={props.$outline}
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
        <div
          className={Style.body}
          data-scroll={props.$scroll}
        >
          {body}
        </div>
      }
    </div>
  );
});

export const dataTableRowNumberColumn: DataTableColumn<any> = {
  name: "_rownum",
  align: "center",
  width: "5rem",
  body: props => <LabelText>{props.index + 1}</LabelText>,
} as const;

export default DataTable;