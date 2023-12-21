import formatDate from "../../../objects/date/format";
import formatNum from "../../../objects/number/format";
import { getValue } from "../../../objects/struct/get";
import DomClassComponent, { cloneDomElement } from "../../utilities/dom-class-component";
import { convertSizeNumToStr } from "../../utilities/size";
import Style from "./index.module.scss";

type DataType = { [v: string | number | symbol]: any };
type DataListCellAlign = "left" | "center" | "right";

export type DataListColumn<T extends DataType = DataType> = {
  name: string;
  displayName?: string;
  dataType?: "string" | "number" | "date";
  label?: string;
  width?: number | null;
  minWidth?: number | null;
  maxWidth?: number | null;
  align?: DataListCellAlign;
  headerAlign?: DataListCellAlign;
  footerAlign?: DataListCellAlign;
  fill?: boolean;
  fixed?: boolean;
  border?: boolean;
  sort?: ((data1: T, data2: T) => number) | boolean;
  sortNeutral?: boolean;
  resize?: boolean;
  wrap?: boolean;
  rows?: Array<{
    columns: Array<DataListColumn<T>>;
    header?: boolean;
    body?: boolean;
    footer?: boolean;
  }>;
  onClick?: (data: Data<T>) => void;
  toDisplay?: ((originData: T, column: Column<T>) => string) | null;
};

type Column<T extends DataType = DataType> = {
  name: string;
  displayName: string;
  label: string;
  width: number | null | undefined;
  minWidth: number | null | undefined;
  maxWidth: number | null | undefined;
  align: DataListCellAlign;
  headerAlign: DataListCellAlign;
  footerAlign: DataListCellAlign;
  fill: boolean;
  fixed: boolean;
  border: boolean | null | undefined;
  sort: ((data1: T, data2: T) => number) | null | undefined;
  sortNeutral: boolean;
  resize: boolean;
  wrap: boolean;
  rows: Array<{
    columns: Array<Column<T>>;
    header: boolean;
    body: boolean;
    footer: boolean;
  }> | null | undefined;
  cells: Array<Cell<T>>;
  headerCell: Cell<T> | null;
  sortElement?: HTMLDivElement,
  footerCell: Cell<T> | null;
  onClick: ((data: Data<T>) => void) | null | undefined;
  disposeCell: ((cell: Cell<T>, dl: DataListClass<T>) => void) | null | undefined;
  disposeHeaderCell: ((cell: Cell<T>, dl: DataListClass<T>) => void) | null | undefined;
  disposeFooterCell: ((cell: Cell<T>, dl: DataListClass<T>) => void) | null | undefined;
  toDisplay: ((originData: T, column: Column<T>) => string) | null | undefined;
  origin: DataListColumn<T> | null | undefined;
};

type Data<T extends DataType = DataType> = {
  origin: T;
  display: { [key: string]: string };
  id: number;
  init: boolean;
  rowSelected: boolean;
  cellSelected: { [v: string]: boolean };
};

type Cell<T extends DataType = DataType> = {
  element: HTMLDivElement;
  elements: Array<HTMLDivElement>;
  column: Column<T>;
  row: Row<T> | null;
  cache: {
    display: string;
    selected: boolean;
  };
};

type Row<T extends DataType = DataType> = {
  element: HTMLDivElement;
  data: Data<T> | null;
  index: number;
  id: number;
  cache: { [v: string]: boolean };
  selected: boolean;
  oddEven: 0 | 1;
  cells: Array<Cell<T>>;
};

export type DataListClassProps<T extends DataType = DataType> = {
  value?: Array<T>;
  columns?: Array<any>;
  header?: boolean;
  headerHeight?: number;
  footer?: boolean;
  footerHeight?: number;
  rowHeight?: number;
  outline?: boolean;
  rowBorder?: boolean;
  cellBorder?: boolean;
  color?: Color;
};

class DataListClass<T extends DataType = DataType> extends DomClassComponent {

  protected initialized: boolean;
  protected resizeObserver: ResizeObserver;

  protected originColumns: Array<DataListColumn<T>> | null | undefined;
  protected columns: Array<Column<T>>;
  protected headerCells: Array<Cell<T>>;
  protected footerCells: Array<Cell<T>>;
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
  protected headerElement: HTMLDivElement | undefined;
  protected footerElement: HTMLDivElement | undefined;
  protected bodyElement: HTMLDivElement;
  protected dummyElement: HTMLDivElement;

  protected color: Color;
  protected header: boolean;
  protected footer: boolean;
  protected outline: boolean;
  protected rowBorder: boolean;
  protected cellBorder: boolean;

  constructor(protected element: HTMLDivElement, props: DataListClassProps<T>) {
    super();
    this.color = props.color || "main";
    this.header = props.header !== false;
    this.footer = props.footer === true;
    this.outline = props.outline !== false;
    this.rowBorder = props.rowBorder !== false;
    this.cellBorder = props.cellBorder !== false;

    this.initialized = false;
    this.columns = [];
    this.headerCells = [];
    this.footerCells = [];
    this.rows = [];
    this.items = [];
    this.sortedItems = [];

    this.firstIndex = -1;
    this.maxFirstIndex = -1;
    this.lastScrolledTop = -1;

    this.headerHeight = this.header ? (props.headerHeight || 30) : 0;
    this.footerHeight = this.footer ? (props.footerHeight || 30) : 0;
    this.rowHeight = props.rowHeight || 30;

    element.classList.add(Style.class);
    element.tabIndex = -1;
    element.textContent = "";
    if (this.outline) element.setAttribute("data-border", "");

    const div = document.createElement("div");
    this.cloneBase = {
      div,
      row: cloneDomElement(div, elem => {
        elem.classList.add(Style.row);
        elem.style.height = convertSizeNumToStr(this.rowHeight)!;
        if (this.rowBorder) elem.setAttribute("data-border", "");
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
    this.headerElement = this.header ? cloneDomElement(div, elem => {
      elem.classList.add(Style.header, Style.row);
      elem.style.height = convertSizeNumToStr(this.headerHeight)!;
      elem.style.setProperty("--s-color", `var(--c-${this.color})`);
      elem.style.setProperty("--s-color_", `var(--c-${this.color}_)`);
      this.element.appendChild(elem);
    }) : undefined;
    this.bodyElement = cloneDomElement(div, elem => {
      elem.classList.add(Style.body);
      elem.style.top = convertSizeNumToStr(this.headerHeight)!;
      elem.style.height = `calc(100% - ${convertSizeNumToStr(this.headerHeight + this.footerHeight)})`;
      this.element.appendChild(elem);
    });
    this.footerElement = this.footer ? cloneDomElement(div, elem => {
      elem.classList.add(Style.footer, Style.row);
      elem.style.setProperty("--s-color", `var(--c-${this.color})`);
      elem.style.setProperty("--s-color_", `var(--c-${this.color}_)`);
      elem.style.height = convertSizeNumToStr(this.footerHeight)!;
      elem.style.top = `calc(100% - ${convertSizeNumToStr(this.footerHeight)})`;
      this.element.appendChild(elem);
    }) : undefined;

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
        this.removeEvent(cell.element);
        cell.column.cells.pop();
      }
      this.removeEvent(row.element);
      this.bodyElement.removeChild(row.element);
      this.rows.pop();
    }
  }

  protected disposeHeader(): void {
    this.headerCells.forEach(cell => {
      cell.column.disposeHeaderCell?.(cell, this);
      this.removeEvent(cell.element);
      cell.column.headerCell = null;
      if (cell.column.sortElement) this.removeEvent(cell.column.sortElement);
    });
    this.headerCells = [];
    if (this.headerElement) this.headerElement.textContent = "";
  }

  protected disposeFooter(): void {
    this.footerCells.forEach(cell => {
      cell.column.disposeFooterCell?.(cell, this);
      this.removeEvent(cell.element);
      cell.column.footerCell = null;
    });
    this.footerCells = [];
    if (this.footerElement) this.footerElement.textContent = "";
  }

  public dispose(): void {
    this.disposeRows();
    this.disposeHeader();
    this.disposeFooter();
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
    const display = cell.row!.data?.display[cell.column.displayName] ?? "";
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
      data.init = true;
      this.columnIterator(column => {
        data.display[column.displayName] = (() => {
          if (column.toDisplay) {
            return column.toDisplay(data.origin, column);
          }
          return String(getValue(data.origin, column.displayName) ?? "");
        })();
      });
    }
    row.cells.forEach(cell => {
      this.renderCell(cell);
    });
  }

  protected generateCellElement(col: Column<T>, mode: "header" | "footer" | "body"): HTMLDivElement {
    return cloneDomElement(this.cloneBase.cell, elem => {
      switch (mode) {
        case "header":
          elem.setAttribute("data-align", "left");
          break;
        case "footer":
          elem.setAttribute("data-align", "left");
          break;
        default:
          elem.setAttribute("data-align", col.align);
          if (col.rows == null) elem.classList.add(Style.bcell);
          break;
      }
      if (col.fill) elem.setAttribute("data-fill", "");
      if (col.fixed) elem.setAttribute("data-fixed", "");
      if (col.width != null) elem.style.width = convertSizeNumToStr(col.width)!;
      if (col.minWidth != null) elem.style.width = convertSizeNumToStr(col.minWidth)!;
      if (col.maxWidth != null) elem.style.maxWidth = convertSizeNumToStr(col.maxWidth)!;
      if (col.border == null) {
        if (this.cellBorder) elem.setAttribute("data-border", "");
      } else {
        if (col.border) elem.setAttribute("data-border", "");
      }
    });
  }

  protected generateColumnElement(pElem: HTMLDivElement, col: Column<T>, row: Row<T> | null, mode: "header" | "footer" | "body"): void {
    const cell: Cell<T> = {
      row,
      cache: {
        display: "",
        selected: false,
      },
      column: col,
      element: this.generateCellElement(col, mode),
      elements: [],
    };
    switch (mode) {
      case "header":
        this.headerCells.push(col.headerCell = cell);
        break;
      case "footer":
        this.footerCells.push(col.footerCell = cell);
        break;
      default:
        row?.cells.push(cell);
        col.cells.push(cell);
        break;
    }
    if (col.rows) {
      cell.element.setAttribute("data-row", "");
      col.rows.forEach(crow => {
        switch (mode) {
          case "header":
            if (!crow.header) return;
            break;
          case "footer":
            if (!crow.footer) return;
            break;
          default:
            if (!crow.body) return;
            break;
        }
        if (this.cloneBase.cellRow == null) {
          this.cloneBase.cellRow = cloneDomElement(this.cloneBase.div, elem => {
            elem.classList.add(Style.crow);
          });
        }
        const relem = cloneDomElement(this.cloneBase.cellRow, elem => {
          if (this.rowBorder) elem.setAttribute("data-border", "");
        });
        cell.elements.push(relem);
        cell.element.appendChild(relem);
        crow.columns.forEach(c => {
          this.generateColumnElement(relem, c, row, mode);
        });
      });
    } else {
      const lelem = cloneDomElement(this.cloneBase.label);
      cell.elements.push(lelem);
      cell.element.appendChild(lelem);
      switch (mode) {
        case "header":
          cell.elements[0].textContent = col.label;
          if (col.sort != null) {
            cell.element.appendChild(cloneDomElement(this.cloneBase.div, (sortElem => {
              col.sortElement = sortElem;
              sortElem.classList.add(Style.sort);
              // TODO: add sort event
            })));
          }
          break;
        case "footer":
          break;
        default:
          break;
      }
    }
    pElem.appendChild(cell.element);
  }

  protected generateHeader(): void {
    if (!this.header) return;
    this.columns.forEach(col => {
      this.generateColumnElement(this.headerElement!, col, null, "header");
    });
  }

  protected generateFooter(): void {
    if (!this.footer) return;
    this.columns.forEach(col => {
      this.generateColumnElement(this.footerElement!, col, null, "header");
    });
  }

  protected generateRowElement = (row: Row<T>) => {
    this.columns.forEach(col => {
      this.generateColumnElement(row.element, col, row, "body");
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
            element: cloneDomElement(this.cloneBase.row, elem => {
              elem.classList.add(Style.brow);
              elem.style.visibility = "hidden";
            }),
            id: i,
            data: null,
            index: -1,
            cache: {},
            cells: [],
            oddEven: 0,
            selected: false,
          };
          abs = true;
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
    this.renderWhenScrolled(true);
  }

  public setColumns(columns: Array<DataListColumn<T>> | null | undefined): void {
    if (this.originColumns === columns) return;
    this.originColumns = columns;
    this.disposeRows();
    this.disposeHeader();
    this.disposeFooter();
    this.columns = [];
    const f = (oCols: Array<DataListColumn<T>>, cols: Array<Column<T>>, pCol?: Column<T>) => {
      let sumWidth = 0;
      let hasFill = false;
      oCols.forEach((oCol, index) => {
        const displayName = oCol.displayName || oCol.name;
        const col: Column<T> = {
          name: oCol.name,
          displayName,
          label: oCol.label ?? "",
          align: oCol.align ?? (() => {
            switch (oCol.dataType) {
              case "number":
                return "right";
              default:
                return "left";
            }
          })(),
          headerAlign: oCol.headerAlign ?? "left",
          footerAlign: oCol.footerAlign ?? "left",
          wrap: oCol.wrap === true,
          border: oCol.border,
          fixed: oCol.fixed === true,
          ...(() => {
            let fill = !hasFill && oCol.fill === true;
            if (pCol != null && !hasFill && oCols.length - 1 === index) {
              fill = true;
            }
            hasFill = hasFill || fill;
            if (fill) {
              return {
                fill,
                width: null,
                minWidth: oCol.minWidth ?? 100,
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
          sort: (() => {
            if (oCol.sort === false) return undefined;
            if (oCol.sort != null && oCol.sort !== true) return oCol.sort;
            return (d1, d2) => {
              const v1 = getValue(d1, displayName);
              const v2 = getValue(d2, displayName);
              if (v1 == null && v2 == null) return 0;
              if (v1 == null) return -1;
              if (v2 == null) return 1;
              return v1 < v2 ? -1 : 1;
            };
          })(),
          sortNeutral: oCol.sortNeutral === true,
          toDisplay: oCol.toDisplay ?? (() => {
            switch (oCol.dataType) {
              case "number":
                return (data, col) => {
                  return formatNum(data[col.displayName]) ?? "";
                };
              case "date":
                return (data, col) => {
                  return formatDate(data[col.displayName], "yyyy/MM/dd") ?? "";
                };
              default:
                return undefined;
            }
          })(),
          onClick: oCol.onClick,
          rows: null,
          disposeCell: null,
          disposeHeaderCell: null,
          disposeFooterCell: null,
          cells: [],
          headerCell: null,
          footerCell: null,
          origin: oCol,
        };
        sumWidth += Math.max(col.width ?? 0, col.minWidth ?? 0);
        cols.push(col);
        if (oCol.rows) {
          col.rows = [];
          let maxWidth = 0;
          oCol.rows.forEach(row => {
            const rcols: Array<Column<T>> = [];
            col.rows!.push({
              columns: rcols,
              header: row.header !== false,
              body: row.body !== false,
              footer: row.footer !== false,
            });
            const ret = f(row.columns, rcols, col);
            maxWidth = Math.max(maxWidth, ret.width);
          });
          if (col.fill) {
            col.minWidth = maxWidth;
          } else {
            col.width = oCol.width ?? maxWidth;
            col.minWidth = oCol.minWidth ?? maxWidth;
          }
        }
      });
      return {
        width: sumWidth,
        hasFill,
      };
    };
    f(columns ?? [{
      name: "json",
      fill: true,
      toDisplay: (d) => JSON.stringify(d),
    }], this.columns);

    this.generateHeader();
    this.generateFooter();

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
    const st = (this.sortedItems.length - this.rows.length + 1) * this.rowHeight;
    if (this.element.scrollTop > st) {
      this.element.scrollTop = st;
    }
    if (this.initialized) this.render();
  }

}

export default DataListClass;