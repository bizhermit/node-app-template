import DomClassComponent, { cloneDomElement } from "@/components/utilities/dom-class-component";
import Style from "$/components/elements/data-list.module.scss";
import { convertSizeNumToStr } from "@/components/utilities/attributes";
import { getValue, setValue } from "@/data-items/utilities";
import NumberUtils from "@bizhermit/basic-utils/dist/number-utils";
import DatetimeUtils from "@bizhermit/basic-utils/dist/datetime-utils";

export type DataListColumn<T extends Struct = Struct> = {
  name: string;
  displayName?: string;
  dataType?: "string" | "number" | "date";
  label?: string;
  width?: number | string | null;
  minWidth?: number | string | null;
  maxWidth?: number | string | null;
  align?: "left" | "center" | "right";
  fill?: boolean;
  fixed?: boolean;
  border?: boolean;
  sort?: ((data1: T, data2: T) => number) | boolean;
  sortNeutral?: boolean;
  resize?: boolean;
  wrap?: boolean;
  rows?: Array<{
    columns: Array<DataListColumn<T>>;
  }>;
  onClick?: (data: Data<T>) => void;
  toDisplay?: ((originData: T, column: Column<T>) => string) | null;
};

type Column<T extends Struct = Struct> = {
  name: string;
  displayName: string;
  label: string;
  width: number | string | null | undefined;
  minWidth: number | string | null | undefined;
  maxWidth: number | string | null | undefined;
  align: "left" | "center" | "right";
  fill: boolean;
  fixed: boolean;
  border: boolean;
  sort: ((data1: T, data2: T) => number) | null | undefined;
  sortNeutral: boolean;
  resize: boolean;
  wrap: boolean;
  rows: Array<{
    columns: Array<Column<T>>;
  }> | null | undefined;
  cells: Array<Cell<T>>;
  onClick: ((data: Data<T>) => void) | null | undefined;
  disposeCell: ((cell: Cell<T>, dl: DataListClass<T>) => void) | null | undefined;
  toDisplay: ((originData: T, column: Column<T>) => string) | null | undefined;
  origin: DataListColumn<T> | null | undefined;
};

type Data<T extends Struct = Struct> = {
  origin: T;
  display: { [key in keyof T]: string };
  id: number;
  init: boolean;
  rowSelected: boolean;
  cellSelected: Struct<boolean>;
};

type Cell<T extends Struct = Struct> = {
  element: HTMLDivElement;
  elements: Array<HTMLDivElement>;
  column: Column<T>;
  row: Row<T>;
  cache: {
    display: string;
    selected: boolean;
  };
};

type Row<T extends Struct = Struct> = {
  element: HTMLDivElement;
  data: Data<T> | null;
  index: number;
  id: number;
  cache: Struct<string>;
  selected: boolean;
  oddEven: 0 | 1;
  cells: Array<Cell<T>>;
};

export type DataListClassProps<T extends Struct = Struct> = {
  value?: Array<T>;
  columns?: Array<any>;
};

class DataListClass<T extends Struct = Struct> extends DomClassComponent {

  protected initialized: boolean;
  protected resizeObserver: ResizeObserver;

  protected originColumns: Array<DataListColumn<T>> | null | undefined;
  protected columns: Array<Column<T>>;
  protected rows: Array<Row<T>>;
  protected items: Array<Data<T>>;
  protected sortedItems: Array<Data<T>>;

  protected firstIndex: number;
  protected maxFirstIndex: number;
  protected lastScrolledTop: number;

  protected headerHeight: number;
  protected footerHeight: number;
  protected rowHeight: number;

  protected cloneBase: {
    div: HTMLDivElement;
    row: HTMLDivElement;
    cell: HTMLDivElement;
    cellRow: HTMLDivElement | null;
    label: HTMLDivElement;
  };
  protected headerElement: HTMLDivElement;
  protected footerElement: HTMLDivElement;
  protected bodyElement: HTMLDivElement;
  protected dummyElement: HTMLDivElement;

  constructor(protected element: HTMLDivElement, props: DataListClassProps<T>) {
    super();
    this.initialized = false;
    this.columns = [];
    this.rows = [];
    this.items = [];
    this.sortedItems = [];

    this.firstIndex = -1;
    this.maxFirstIndex = -1;
    this.lastScrolledTop = -1;

    this.headerHeight = 30;
    this.footerHeight = 30;
    this.rowHeight = 30;

    element.classList.add(Style.class);
    element.tabIndex = -1;
    element.textContent = "";

    const div = document.createElement("div");
    this.cloneBase = {
      div,
      row: cloneDomElement(div, elem => {
        elem.classList.add(Style.row);
        elem.style.height = convertSizeNumToStr(this.rowHeight)!;
      }),
      cell: cloneDomElement(div, elem => {
        elem.classList.add(Style.cell);
      }),
      cellRow: null,
      label: cloneDomElement(div, elem => {
        elem.classList.add(Style.label);
      }),
    };

    this.dummyElement = cloneDomElement(div, elem => {
      elem.classList.add(Style.dummy);
      elem.style.height = convertSizeNumToStr(this.rowHeight * this.sortedItems.length)!;
      this.element.appendChild(elem);
    });
    this.headerElement = cloneDomElement(div, elem => {
      elem.classList.add(Style.header);
      elem.style.height = convertSizeNumToStr(this.headerHeight)!;
      this.element.appendChild(elem);
    });
    this.bodyElement = cloneDomElement(div, elem => {
      elem.classList.add(Style.body);
      elem.style.top = convertSizeNumToStr(this.headerHeight)!;
      elem.style.height = `calc(100% - ${convertSizeNumToStr(this.headerHeight + this.footerHeight)})`;
      this.element.appendChild(elem);
    });
    this.footerElement = cloneDomElement(div, elem => {
      elem.classList.add(Style.footer);
      elem.style.height = convertSizeNumToStr(this.footerHeight)!;
      elem.style.top = `calc(100% - ${convertSizeNumToStr(this.footerHeight)})`;
      this.element.appendChild(elem);
    });

    let et: NodeJS.Timeout | null = null;
    this.addEvent(this.element, "scroll", () => {
      if (et) return;
      et = setTimeout(() => {
        this.renderWhenScrolled();
        et = null;
      }, 5);
    }, { passive: true });

    this.resizeObserver = new ResizeObserver(() => {
      this.renderWhenResized();
    });
    this.resizeObserver.observe(element);

    this.setColumns(props.columns);
    this.setValue(props.value);
    this.render();
    this.initialized = true;
  }

  protected findColumn(func: (column: Column<T>) => boolean): Column<T> | null {
    let ret: Column<T> | null = null;
    const search = (columns: Array<Column<T>>) => {
      for (const column of columns) {
        if (func(column)) ret = column;
        if (ret != null) return;
        if (column.rows) {
          for (const colrow of column.rows) {
            search(colrow.columns);
            if (ret != null) return;
          }
        }
      }
    };
    search(this.columns);
    return ret;
  }

  protected columnIterator = (func: (column: Column<T>) => void) => {
    const f = (columns: Array<Column<T>>) => {
      if (columns == null) return;
      columns.forEach(column => {
        func(column);
        column.rows?.forEach(row => {
          f(row.columns);
        });
      });
    };
    f(this.columns);
  };

  protected disposeRows(maxRowLen?: number): void {
    const len = maxRowLen || 0;
    for (let i = this.rows.length - 1; i >= len; i--) {
      const row = this.rows[i];
      for (const cell of row.cells) {
        this.removeEvent(cell.element);
        if (cell.column.disposeCell) {
          cell.column.disposeCell(cell, this);
        }
        cell.column.cells.pop();
      }
      this.removeEvent(row.element);
      this.bodyElement.removeChild(row.element);
      this.rows.pop();
    }
  }

  public dispose(): void {
    this.disposeRows();
    if (this.resizeObserver) this.resizeObserver.disconnect();
    super.dispose();
  }

  protected optimizeDummySize(): void {
    this.dummyElement.style.height = convertSizeNumToStr(this.sortedItems.length * this.rowHeight + this.headerHeight + this.footerHeight + this.dummyElement.offsetTop)!;
  }

  protected optimizeMaxFirstIndex(): void {
    this.maxFirstIndex = Math.max(0, this.sortedItems.length - this.rows.length);
  }

  protected renderCell(cell: Cell<T>): void {
    const display = getValue(cell.row.data?.display!, cell.column.displayName);
    if (cell.cache.display !== display) {
      cell.cache.display = cell.elements[0].textContent = display;
    }
  }

  protected renderRow(row: Row<T>) {
    const data = row.data;
    if (data == null) {
      if (row.element.style.visibility !== "hidden") {
        row.element.style.visibility = "hidden";
      }
      return;
    }
    if (row.element.style.visibility) {
      row.element.style.removeProperty("visibility");
    }
    if (!data.init) {
      this.columnIterator(column => {
        setValue(data.display, column.displayName, (() => {
          if (column.toDisplay) {
            return column.toDisplay(data.origin, column);
          }
          return String(getValue(data.origin, column.displayName) ?? "");
        })());
      });
    }
    row.cells.forEach(cell => {
      this.renderCell(cell);
    });
  }

  protected generateRowElement = (row: Row<T>) => {
    const f = (pElem: HTMLDivElement, col: Column<T>) => {
      const cell: Cell<T> = {
        row,
        cache: {
          display: "",
          selected: false,
        },
        column: col,
        element: cloneDomElement(this.cloneBase.cell, elem => {
          elem.setAttribute("data-align", col.align);
          if (col.fill) elem.setAttribute("data-fill", "");
          if (col.fixed) elem.setAttribute("data-fixed", "");
          if (col.width != null) elem.style.width = convertSizeNumToStr(col.width)!;
          if (col.minWidth != null) elem.style.width = convertSizeNumToStr(col.minWidth)!;
          if (col.maxWidth != null) elem.style.maxWidth = convertSizeNumToStr(col.maxWidth)!;
        }),
        elements: [],
      };
      row.cells.push(cell);
      col.cells.push(cell);
      if (col.rows) {
        cell.element.setAttribute("data-row", "");
        col.rows.forEach(row => {
          if (this.cloneBase.cellRow == null) {
            this.cloneBase.cellRow = cloneDomElement(this.cloneBase.div, elem => {
              elem.classList.add(Style.crow);
            });
          }
          const relem = cloneDomElement(this.cloneBase.cellRow);
          cell.elements.push(relem);
          row.columns.forEach(c => {
            f(relem, c);
          });
        });
      } else {
        const lelem = cloneDomElement(this.cloneBase.label);
        cell.elements.push(lelem);
        cell.element.appendChild(lelem);
      }
      pElem.appendChild(cell.element);
    };
    this.columns.forEach(col => {
      f(row.element, col);
    });
  };

  protected renderWhenResized() {
    let abs = false;
    const maxRowLen = Math.min(Math.max(0, Math.ceil(this.bodyElement.clientHeight / this.rowHeight || 0)) + 1, Math.max(1, this.sortedItems.length));
    if (this.rows.length !== maxRowLen) {
      for (let i = 0; i < maxRowLen; i++) {
        let row = this.rows[i];
        if (row == null) {
          row = {
            element: cloneDomElement(this.cloneBase.row),
            id: i,
            data: null,
            index: -1,
            cache: {},
            cells: [],
            oddEven: 0,
            selected: false,
          };
          abs = true;
          row.element.style.visibility = "hidden";
          this.generateRowElement(row);
          this.bodyElement.appendChild(row.element);
          this.rows[i] = row;
        }
      }
      this.disposeRows(maxRowLen);
    }
    this.optimizeMaxFirstIndex();
    this.renderWhenScrolled(abs);
  }

  protected renderWhenScrolled(absolute?: boolean) {
    const st = this.element.scrollTop;
    const index = Math.min(this.maxFirstIndex, Math.floor(st / this.rowHeight));
    if (this.lastScrolledTop !== st) {
      this.bodyElement.scrollTop = st - this.rowHeight * index;
      this.lastScrolledTop = st;
    }
    if (absolute !== true) {
      if (this.firstIndex === index) return;
    }
    for (let i = 0, il = this.rows.length; i < il; i++) {
      const row = this.rows[i];
      row.data = this.sortedItems[row.index = index + i];
      this.renderRow(row);
    }
    this.firstIndex = index;
  }

  public render() {
    this.optimizeDummySize();
    this.optimizeMaxFirstIndex();
    this.renderWhenResized();
    this.renderWhenScrolled();
  }

  public setColumns(columns: Array<DataListColumn<T>> | null | undefined): void {
    if (this.originColumns === columns) return;
    this.originColumns = columns;
    this.disposeRows();
    this.columns = [];
    const f = (oCols: Array<DataListColumn<T>>, cols: Array<Column<T>>) => {
      oCols.forEach(oCol => {
        const col: Column<T> = {
          name: oCol.name,
          displayName: oCol.displayName || oCol.name,
          label: oCol.label ?? "",
          align: oCol.align ?? "left",
          wrap: oCol.wrap === true,
          border: oCol.border !== false,
          fixed: oCol.fixed === true,
          ...(() => {
            const fill = oCol.fill === true;
            if (fill) {
              return {
                fill,
                width: null,
                minWidth: null,
                maxWidth: null,
                resize: false,
              };
            }
            return {
              fill,
              width: oCol.width ?? 100,
              minWidth: oCol.minWidth ?? oCol.width ?? 100,
              maxWidth: oCol.maxWidth,
              resize: oCol.resize !== false,
            };
          })(),
          sort: typeof oCol.sort === "boolean" ?
            () => 0 : // TODO
            oCol.sort,
          sortNeutral: oCol.sortNeutral === true,
          toDisplay: oCol.toDisplay ?? (() => {
            switch (oCol.dataType) {
              case "number":
                return (data, col) => {
                  return NumberUtils.format(getValue(data, col.displayName)) ?? "";
                };
              case "date":
                return (data, col) => {
                  return DatetimeUtils.format(getValue(data, col.displayName), "yyyy/MM/dd") ?? "";
                };
              default:
                return undefined;
            }
          })(),
          onClick: oCol.onClick,
          rows: null,
          disposeCell: null,
          cells: [],
          origin: oCol,
        };
        cols.push(col);
        if (oCol.rows) {
          col.rows = [];
          oCol.rows.forEach(row => {
            const rcols: Array<Column<T>> = [];
            col.rows!.push({
              columns: rcols,
            });
            f(row.columns, rcols);
          });
        }
      });
    };
    f(columns ?? [{
      name: "json",
      fill: true,
      toDisplay: (d) => JSON.stringify(d),
    }], this.columns);

    if (this.initialized) {
      this.items.forEach(item => item.init = false);
      this.render();
    }
  }

  protected bind(items: Array<T> | null | undefined): void {
    this.items = [];
    if (items == null) return;
    items.forEach((item, index) => {
      this.items[index] = {
        id: index,
        origin: item,
        display: {} as T,
        init: false,
        rowSelected: false,
        cellSelected: {},
      };
    });
    this.sortedItems = [...this.items];
  }

  public setValue(items: Array<T> | null | undefined): void {
    this.bind(items);
    this.firstIndex = -1;
    if (this.initialized) this.render();
  }

}

export default DataListClass;