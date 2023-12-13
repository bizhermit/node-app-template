"use client";

import { forwardRef, useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type Dispatch, type FC, type ForwardedRef, type FunctionComponent, type HTMLAttributes, type ReactElement, type ReactNode, type SetStateAction } from "react";
import formatDate from "../../../objects/date/format";
import equals from "../../../objects/equal";
import formatNum from "../../../objects/number/format";
import { generateUuidV4 } from "../../../objects/string/generator";
import { getValue } from "../../../objects/struct/get";
import useLoadableArray from "../../hooks/loadable-array";
import { appendedColorStyle, attributes, convertSizeNumToStr } from "../../utilities/attributes";
import Button from "../button";
import { DoubleLeftIcon, DoubleRightIcon, LeftIcon, RightIcon } from "../icon";
import NextLink, { type NextLinkProps } from "../link";
import Resizer from "../resizer";
import Text from "../text";
import Style from "./index.module.scss";

export type DataTableCellContext<T extends Struct = Struct> = {
  column: DataTableColumn<T>;
  data: T;
  index: number;
  pageFirstIndex: number;
  items: Array<T>;
  setHeaderRev: Dispatch<SetStateAction<number>>;
  setBodyRev: Dispatch<SetStateAction<number>>;
};

export type DataTableBaseColumn<T extends Struct = Struct> = {
  name: string;
  displayName?: string;
  label?: string;
  width?: number | string;
  minWidth?: number | string;
  maxWidth?: number | string;
  align?: "left" | "center" | "right";
  link?: (ctx: DataTableCellContext<T>) => NextLinkProps;
  border?: boolean;
  sort?: boolean | ((data1: T, data2: T) => (-1 | 0 | 1));
  sortNeutral?: boolean;
  resize?: boolean;
  sticky?: boolean;
  wrap?: boolean;
  padding?: boolean;
  prefix?: string;
  suffix?: string;
  header?: FunctionComponent<Omit<DataTableCellContext<T>, "index" | "data" | "pageFirstIndex"> & { children: ReactElement; }>;
  body?: FunctionComponent<DataTableCellContext<T> & { children: ReactNode; rev: number }>;
  footer?: FunctionComponent<Omit<DataTableCellContext<T>, "index" | "data" | "pageFirstIndex"> & { children: ReactElement; }>;
  pointer?: boolean;
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
  border?: boolean;
  rowBorder?: boolean;
};

export type DataTableColumn<T extends Struct = Struct> =
  | ({ type?: "label" } & DataTableLabelColumn<T>)
  | ({ type: "number" } & DataTableNumberColumn<T>)
  | ({ type: "date" } & DataTableDateColumn<T>)
  | DataTableGroupColumn<T>;

type DataTableSortDirection = "asc" | "desc";
type DataTableSort = {
  name: string;
  direction: DataTableSortDirection;
};

const defaultPerPage = 20;
type Pagination = {
  index: number;
  perPage: number;
};

type OmitAttributes = "children";
export type DataTableProps<T extends Struct = Struct> = Omit<HTMLAttributes<HTMLDivElement>, OmitAttributes> & {
  $columns?: Array<DataTableColumn<T>>;
  $value?: LoadableArray<T>;
  $idDataName?: string;
  $multiSort?: boolean;
  $sorts?: Array<DataTableSort>;
  $onSort?: (sort: Array<DataTableSort>) => (void | boolean);
  $preventSort?: boolean;
  $page?: boolean | number;
  $perPage?: number;
  $total?: number;
  $pagePosition?: "top" | "bottom" | "both";
  $onChangePage?: (index: number) => (void | boolean);
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
  $onClick?: (ctx: DataTableCellContext<T>, element: { cell: HTMLDivElement; row: HTMLDivElement; })
    => (void | boolean | Promise<void>);
  $rowPointer?: boolean;
  $radio?: boolean;
  $stripes?: boolean;
  $dragScroll?: boolean | "vertical" | "horizontal";
};

interface DataTableFC extends FunctionComponent<DataTableProps> {
  <T extends Struct = Struct>(
    attrs: ComponentAttrsWithRef<HTMLDivElement, DataTableProps<T>>
  ): ReactElement<any> | null;
}

const DefaultEmptyText: FC = () => {
  return <Text>データが存在しません。</Text>;
};

const defaultColumnWidth = "10rem";
const getColumnStyle = (column: DataTableColumn<any>, nestLevel = 0): CSSProperties => {
  if ("rows" in column) return {};
  let w = column.width;
  if (nestLevel > 0 && w == null) w = defaultColumnWidth;
  if (w == null) {
    w = convertSizeNumToStr(column.minWidth) ?? defaultColumnWidth;
    return {
      flex: "1",
      width: w,
      minWidth: w,
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

const switchSortDirection = (currentDirection: "" | "asc" | "desc" | undefined, noNeutral?: boolean) => {
  if (!currentDirection) return "asc";
  if (currentDirection === "asc") return "desc";
  if (noNeutral) return "asc";
  return "";
};

const calcRowNumberColumnWidth = (maxRowNumber = 0) => {
  return Math.max(String(maxRowNumber).length * 1.6, 4) + 0.8;
};

const rowNumberColumnName = "_rownum";
export const dataTableRowNumberColumn: DataTableColumn<any> = {
  name: rowNumberColumnName,
  width: `${calcRowNumberColumnWidth(0)}rem`,
  align: "center",
  resize: false,
  sticky: true,
  body: props => <Text>{(props.index + props.pageFirstIndex) + 1}</Text>,
} as const;

const DataTable = forwardRef<HTMLDivElement, DataTableProps>(<
  T extends Struct = Struct
>(props: DataTableProps<T>, ref: ForwardedRef<HTMLDivElement>) => {
  const uniqueKey = useRef(generateUuidV4());
  const [headerRev, setHeaderRev] = useState(0);
  const [bodyRev, setBodyRev] = useState(0);
  const [pagination, setPagination] = useState<Pagination | undefined>(() => {
    if (props.$page == null) return undefined;
    if (typeof props.$page === "boolean") {
      if (props.$page) {
        return {
          index: 0,
          perPage: props.$perPage ?? defaultPerPage,
        };
      }
      return undefined;
    }
    return {
      index: props.$page,
      perPage: defaultPerPage,
    };
  });
  const rowBorder = props.$rowBorder ?? true;
  const cellBorder = props.$cellBorder ?? false;

  const columns = useRef<Array<DataTableColumn<T>>>(null!);
  columns.current = useMemo(() => {
    const clone = (cols?: Array<DataTableColumn<T>>): Array<DataTableColumn<T>> => {
      return cols?.map(col => {
        if ("rows" in col) {
          return {
            ...col,
            rows: col.rows.map(cols => clone(cols)),
          };
        }
        const buf = findColumn(columns.current, col.name);
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
  const { items, total, rowNumColWidth } = useMemo(() => {
    let rowNumColWidth = `${calcRowNumberColumnWidth(0)}rem`;
    const rowNumCol = findColumn(columns.current, rowNumberColumnName) as typeof dataTableRowNumberColumn;
    const items = (() => {
      if (props.$preventSort) return originItems;
      const sortCols = sorts.map(s => {
        const col = findColumn(columns.current, s.name);
        if (!col) return undefined;
        return { ...s, column: col };
      }).filter(col => col != null);
      return [...originItems].sort((item1, item2) => {
        for (const scol of sortCols) {
          const v1 = getValue(item1, (scol as DataTableBaseColumn<T>)!.displayName || scol!.name!);
          const v2 = getValue(item2, (scol as DataTableBaseColumn<T>)!.displayName || scol!.name!);
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
    })();
    const { firstIndex, lastIndex } = (() => {
      if (pagination == null) {
        return {
          firstIndex: 0,
          lastIndex: items.length,
        };
      }
      return {
        firstIndex: pagination.index * pagination.perPage,
        lastIndex: Math.min(items.length, (pagination.index + 1) * pagination.perPage),
      };
    })();
    if (rowNumCol) {
      rowNumCol.width = rowNumColWidth = `${calcRowNumberColumnWidth(lastIndex)}rem`;
    }
    return {
      rowNumColWidth,
      items: (pagination && props.$total == null) ? items.slice(firstIndex, lastIndex) : items,
      total: props.$total ?? originItems.length,
    };
  }, [originItems, sorts, columns, pagination, props.$total]);

  useEffect(() => {
    setPagination(state => {
      if (state == null) return state;
      const lastIndex = Math.floor(Math.max(0, total - 1) / state.perPage);
      if (lastIndex >= state.index) return state;
      return {
        ...state,
        index: lastIndex,
      };
    });
  }, [total, pagination?.perPage]);

  useEffect(() => {
    setSorts(props.$sorts ?? []);
  }, [props.$sorts]);

  const changeSort = useCallback((column: DataTableBaseColumn<T>, currentSort?: DataTableSort) => {
    const d = switchSortDirection(currentSort?.direction, column.sortNeutral === false);
    const newSorts: Array<DataTableSort> = props.$multiSort ? sorts.filter(s => s.name !== column.name) : [];
    if (d) newSorts.push({ name: column.name, direction: d });
    const ret = props.$onSort?.(newSorts);
    if (ret === false) return;
    setSorts(newSorts);
  }, [sorts, props.$multiSort, props.$onSort]);

  const headerRef = useRef<HTMLDivElement>(null!);
  const bodyRef = useRef<HTMLDivElement>(null!);
  const calcStickyPosition = (absolute = false) => {
    const zIdxBase = 1000;
    let widthSum = 0, count = zIdxBase, changed = absolute;
    const cach: Array<string> = [];
    headerRef.current?.querySelectorAll(`:scope>.${Style.hrow}>.${Style.hcell}[data-sticky="true"]`).forEach((elem) => {
      const left = convertSizeNumToStr(widthSum)!;
      changed = changed || (elem as HTMLDivElement).style.left !== left;
      cach.push((elem as HTMLDivElement).style.left = left);
      (elem as HTMLDivElement).style.zIndex = String(count++);
      widthSum += (elem as HTMLDivElement).offsetWidth;
    });
    if (!changed) return;
    bodyRef.current?.querySelectorAll(`:scope>.${Style.brow}`).forEach((elem) => {
      elem.querySelectorAll(`:scope>.${Style.bcell}[data-sticky="true"]`).forEach((elem, idx) => {
        (elem as HTMLDivElement).style.left = cach[idx];
        (elem as HTMLDivElement).style.zIndex = String(zIdxBase + idx);
      });
    });
  };

  const header = useMemo(() => {
    if (!props.$header) return undefined;
    const generateCell = (column: DataTableColumn<T>, nestLevel = 0) => {
      if ("rows" in column) {
        return (
          <div
            key={column.name}
            className={Style.rcell}
            data-border={column.border ?? cellBorder}
          >
            {column.rows.map((row, index) => {
              if (row.length === 0) {
                return (
                  <div
                    key={index}
                    className={Style.grow}
                    data-border={column.rowBorder ?? rowBorder}
                  >
                    <div
                      className={Style.hcell}
                      data-border={column.border ?? cellBorder}
                    >
                      <DataTableCellLabel>
                        {column.label}
                      </DataTableCellLabel>
                    </div>
                  </div>
                );
              }
              return (
                <div
                  key={index}
                  className={Style.hrow}
                  data-border={column.rowBorder ?? rowBorder}
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
          data-border={column.border ?? cellBorder}
          data-sticky={nestLevel === 0 && column.sticky}
        >
          <div className={Style.content}>
            {column.header ?
              <column.header
                column={column}
                items={items}
                setHeaderRev={setHeaderRev}
                setBodyRev={setBodyRev}
              >
                <DataTableCellLabel>
                  {column.label}
                </DataTableCellLabel>
              </column.header> :
              <DataTableCellLabel>
                {column.label}
              </DataTableCellLabel>
            }
          </div>
          {column.sort && <div className={Style.sort} data-direction={sort?.direction || ""} />}
          {(column.resize ?? true) &&
            <Resizer
              direction="x"
              resized={({ width }) => {
                column.width = width;
                setHeaderRev(r => r + 1);
                setBodyRev(r => r + 1);
                calcStickyPosition(column.sticky === true);
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
        data-border={rowBorder}
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
    rowBorder,
    cellBorder,
    rowNumColWidth,
    items,
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
            data-border={column.border ?? cellBorder}
          >
            {column.rows.map((row, index) => {
              if (row.length === 0) return undefined;
              return (
                <div
                  key={index}
                  className={Style.grow}
                  data-border={column.rowBorder ?? rowBorder}
                >
                  {row?.map(c => generateCell(index, data, c))}
                </div>
              );
            })}
          </div>
        );
      }

      const CellLabel: FC = () => (
        <DataTableCellLabel
          wrap={column.wrap}
          padding={column.padding}
        >
          {column.prefix}
          {(() => {
            const v = getValue(data, column.displayName || column.name);
            switch (column.type) {
              case "date":
                return formatDate(v, column.formatPattern ?? "yyyy/MM/dd");
              case "number":
                return formatNum(v, {
                  thou: column.thousandSseparator ?? true,
                  fpad: column.floatPadding ?? 0,
                });
              default:
                return v;
            }
          })()}
          {column.suffix}
        </DataTableCellLabel>
      );
      const pageFirstIndex = pagination ? pagination.index * pagination.perPage : 0;
      const content = column.body ?
        <column.body
          index={index}
          column={column}
          data={data}
          pageFirstIndex={pageFirstIndex}
          items={items}
          setHeaderRev={setHeaderRev}
          setBodyRev={setBodyRev}
          rev={bodyRev}
        >
          <CellLabel />
        </column.body> :
        <CellLabel />;
      return (
        <div
          key={column.name}
          className={Style.bcell}
          style={getColumnStyle(column, nestLevel)}
          data-align={getCellAlign(column)}
          data-border={column.border ?? cellBorder}
          data-name={column.name}
          data-pointer={column.pointer}
          data-sticky={nestLevel === 0 && column.sticky}
        >
          {column.link ?
            <NextLink
              className={Style.link}
              {...column.link({
                column,
                data,
                index,
                pageFirstIndex,
                items,
                setHeaderRev,
                setBodyRev,
              })}
            >
              {content}
            </NextLink> : content
          }
        </div>
      );
    };
    return items.map((item, index) => {
      return (
        <div
          key={`${getValue(item, idDn) ?? index}__${bodyRev}`}
          className={Style.brow}
          style={rowStyle}
          data-border={rowBorder}
          data-stripes={props.$stripes}
          data-pointer={props.$rowPointer}
        >
          {props.$radio &&
            <input
              className={Style.radio}
              type="radio"
              name={uniqueKey.current}
            />
          }
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
    rowBorder,
    cellBorder,
    props.$stripes,
    props.$rowPointer,
    rowNumColWidth,
  ]);

  const isEmpty = useMemo(() => {
    if (!props.$emptyText || props.$value == null || !Array.isArray(props.$value)) return false;
    return items.length === 0 || props.$value.length === 0;
  }, [items, props.$emptyText]);

  useEffect(() => {
    if (props.$page == null) return;
    if (typeof props.$page === "boolean") {
      if (props.$page) {
        setPagination(state => {
          return {
            index: state?.index ?? 0,
            perPage: props.$perPage ?? state?.perPage ?? defaultPerPage,
          };
        });
        return;
      }
      setPagination(undefined);
      return;
    }
    setPagination(state => {
      return {
        index: (props.$page as number),
        perPage: props.$perPage ?? state?.perPage ?? defaultPerPage,
      };
    });
  }, [props.$page, props.$perPage]);

  const clickPage = (pageIndex: number) => {
    setPagination(state => {
      const pindex = Math.min(Math.max(0, pageIndex), Math.floor(Math.max(0, total - 1) / state!.perPage));
      if (props.$onChangePage) {
        const res = props.$onChangePage(pindex);
        if (res !== true) return state;
      }
      return {
        ...state!,
        index: pindex,
      };
    });
  };

  const pageNodes = () => {
    if (pagination == null) return undefined;
    const { index, perPage } = pagination;
    const lastIndex = Math.floor(Math.max(0, total - 1) / perPage);
    return (
      <>
        <Button
          disabled={index <= 0}
          $size="s"
          $outline
          $color={props.$color}
          onClick={() => clickPage(0)}
          $icon={<DoubleLeftIcon />}
        />
        <Button
          disabled={index <= 0}
          $size="s"
          $outline
          $color={props.$color}
          onClick={() => clickPage(index - 1)}
          $icon={<LeftIcon />}
        />
        <div className={Style.number}>
          <span>{index + 1}</span>
          <span>/</span>
          <span>{lastIndex + 1}</span>
        </div>
        <Button
          disabled={index >= lastIndex}
          $size="s"
          $outline
          $color={props.$color}
          onClick={() => clickPage(index + 1)}
          $icon={<RightIcon />}
        />
        <Button
          disabled={index >= lastIndex}
          $size="s"
          $outline
          $color={props.$color}
          onClick={() => clickPage(lastIndex)}
          $icon={<DoubleRightIcon />}
        />
      </>
    );
  };

  const clickBody = (e: React.MouseEvent<HTMLDivElement>) => {
    let elem: HTMLElement | null = e.target as HTMLElement;
    let cellElem: HTMLElement | null = null;
    const checkRadio = (elem: HTMLElement) => {
      const radioElem = elem.querySelector(`input[name="${uniqueKey.current}"]`) as HTMLInputElement;
      if (radioElem) {
        radioElem.checked = true;
      }
    };
    do {
      if (elem.classList.contains(Style.bcell)) cellElem = elem;
      if (elem.classList.contains(Style.brow)) {
        checkRadio(elem);
        break;
      }
      elem = elem?.parentElement;
    } while (elem);
    if (cellElem == null || elem == null) return;
    checkRadio(elem);
    if (props.$onClick == null) return;
    const index = [].slice.call(elem.parentElement!.childNodes).indexOf(elem as never);
    const column = findColumn(columns.current, cellElem.getAttribute("data-name")!)!;
    props.$onClick({
      column,
      data: items[index],
      index,
      items,
      pageFirstIndex: pagination ? pagination.index * pagination.perPage : 0,
      setHeaderRev,
      setBodyRev,
    }, {
      row: elem as HTMLDivElement,
      cell: cellElem as HTMLDivElement,
    });
  };

  useEffect(() => {
    calcStickyPosition(true);
  }, [body]);

  const dragScrollEvent = !props.$dragScroll ? undefined : (e: React.MouseEvent<HTMLElement>) => {
    if (e.ctrlKey) return;
    const headElem = e.currentTarget.querySelector(`:scope>.${Style.header}`);
    let elem = e.target as HTMLElement;
    while (elem != null) {
      if (
        elem === headElem ||
        elem.tagName === "A" ||
        elem.tagName === "BUTTON" ||
        (elem.classList.contains(Style.bcell) && elem.getAttribute("data-pointer") === "true")
      ) return;
      if (elem === e.currentTarget) break;
      elem = elem.parentElement!;
    }
    const rootElem = e.currentTarget as HTMLDivElement;
    const lastPosX = rootElem.scrollLeft, lastPosY = rootElem.scrollTop, posX = e.clientX, posY = e.clientY;
    let et: NodeJS.Timeout | null = null;
    const move = (e: MouseEvent) => {
      if (et) return;
      et = setTimeout(() => {
        if (props.$dragScroll !== "vertical") {
          rootElem.scrollLeft = posX - e.clientX + lastPosX;
        }
        if (props.$dragScroll !== "horizontal") {
          rootElem.scrollTop = posY - e.clientY + lastPosY;
        }
        et = null;
      }, 20);
    };
    document.onselectstart = () => false;
    rootElem.setAttribute("data-dragging", "");
    const end = () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", end);
      rootElem.removeAttribute("data-dragging");
      document.onselectstart = () => true;
    };
    window.addEventListener("mouseup", end, { passive: true });
    window.addEventListener("mousemove", move, { passive: true });
  };

  return (
    <div
      {...attributes(props, Style.wrap)}
      ref={ref}
    >
      {pagination && props.$pagePosition !== "bottom" &&
        <div className={Style.pagination}>
          {pageNodes()}
        </div>
      }
      <div
        className={Style.table}
        data-border={props.$outline}
        onMouseDown={dragScrollEvent}
        data-drag-scroll={!!props.$dragScroll}
      >
        {props.$header &&
          <div
            className={Style.header}
            style={appendedColorStyle({ $color: props.$color })}
            ref={headerRef}
          >
            {header}
          </div>
        }
        {isEmpty ?
          <div className={Style.empty}>
            {props.$emptyText === true ? <DefaultEmptyText /> : props.$emptyText}
          </div> :
          <div
            className={Style.body}
            ref={bodyRef}
            data-scroll={props.$scroll}
            onClick={clickBody}
          >
            {body}
          </div>
        }
      </div>
      {pagination && props.$pagePosition !== "top" &&
        <div className={Style.pagination}>
          {pageNodes()}
        </div>
      }
    </div>
  );
}) as DataTableFC;

export const DataTableCellLabel: FC<{
  wrap?: boolean;
  padding?: boolean;
  children?: ReactNode;
}> = ({ wrap, padding, children }) => {
  return (
    <div
      className={Style.label}
      data-wrap={wrap === true}
      data-padding={padding !== false}
    >
      {children}
    </div>
  );
};

export default DataTable;