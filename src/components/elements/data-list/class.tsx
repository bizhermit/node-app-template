import DomClassComponent, { cloneDomElement } from "@/components/utilities/dom-class-component";
import Style from "$/components/elements/data-list.module.scss";
import { convertSizeNumToStr } from "@/components/utilities/attributes";
import ArrayUtils from "@bizhermit/basic-utils/dist/array-utils";

type Column<T extends Struct = Struct> = {
  name: string;
  onClick: (data: Data<T>) => void;
  rows: Array<{
    columns: Array<Column<T>>;
  }>;
  cells: Array<Cell<T>>;
  disposeCell?: (cell: Cell<T>, dl: DataListClass<T>) => void;
};

type Data<T extends Struct = Struct> = {
  origin: T;
  id: number;
  rowSelected: boolean;
  cellSelected: Struct<boolean>;
};

type Cell<T extends Struct = Struct> = {
  element: HTMLDivElement;
  column: Column<T>;
  row: Row<T>;
  cache: Struct<string>;
};

type Row<T extends Struct = Struct> = {
  element: HTMLDivElement;
  data: Data<T> | null;
  index: number;
  id: number;
  cache: Struct<string>;
  init: boolean;
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
    // this.sortedItems = [];
    this.sortedItems = ArrayUtils.generateArray(30, idx => {
      return {
        id: idx,
        origin: {} as T,
        rowSelected: false,
        cellSelected: {},
      };
    });

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

    this.render();
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
    super.dispose();
  }

  protected optimizeDummySize(): void {
    this.dummyElement.style.height = convertSizeNumToStr(this.sortedItems.length * this.rowHeight + this.headerHeight + this.footerHeight + this.dummyElement.offsetTop)!;
  }

  protected optimizeMaxFirstIndex(): void {
    this.maxFirstIndex = Math.max(0, this.sortedItems.length - this.rows.length);
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
    if (!row.init) {
      // TODO: init
    }
    // TODO:
    row.element.textContent = JSON.stringify(row.index);
  }

  protected renderWhenResized() {
    let need = false;
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
            init: false,
            oddEven: 0,
            selected: false,
          };
          need = true;
          // row.element.style.visibility = "hidden"
          // TODO: cell
          this.bodyElement.appendChild(row.element);
          this.rows[i] = row;
        }
      }
    }
  }

  protected renderWhenScrolled() {
    const st = this.element.scrollTop;
    const index = Math.min(this.maxFirstIndex, Math.floor(st / this.rowHeight));
    if (this.lastScrolledTop !== st) {
      this.bodyElement.scrollTop = st - this.rowHeight * index;
      this.lastScrolledTop = st;
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

}

export default DataListClass;