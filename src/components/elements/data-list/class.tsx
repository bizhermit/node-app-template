import DomClassComponent, { cloneDomElement } from "@/components/utilities/dom-class-component";
import Style from "$/components/elements/data-list.module.scss";

export type DataListClassProps<T extends Struct = Struct> = {
  value?: Array<T>;
  columns?: Array<any>;
};

type Column = {}

class DataListClass<T extends Struct = Struct> extends DomClassComponent {

  protected initialized: boolean;
  protected columns: Array<Column>;

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

    element.classList.add(Style.class);
    element.tabIndex = -1;
    element.textContent = "";

    const div = document.createElement("div");
    this.cloneBase = {
      div,
      row: cloneDomElement(div, elem => {
        elem.classList.add(Style.row);
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
      this.element.appendChild(elem);
    });
    this.headerElement = cloneDomElement(div, elem => {
      elem.classList.add(Style.header);
      this.element.appendChild(elem);
    });
    this.bodyElement = cloneDomElement(div, elem => {
      elem.classList.add(Style.body);
      this.element.appendChild(elem);
    });
    this.footerElement = cloneDomElement(div, elem => {
      elem.classList.add(Style.footer);
      this.element.appendChild(elem);
    });
    console.log(props);
  }

}

export default DataListClass;