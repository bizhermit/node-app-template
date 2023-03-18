import DomClassComponent from "@/components/utilities/dom-class-component";
import Style from "$/components/elements/data-list.module.scss";

export type DataListClassProps<T extends Struct = Struct> = {
  value?: Array<T>;
  columns?: Array<any>;
};

class DataListClass<T extends Struct = Struct> extends DomClassComponent {
  constructor(protected element: HTMLDivElement, props: DataListClassProps<T>) {
    super();
    element.classList.add(Style.class);
    console.log(props);
  }
}

export default DataListClass;