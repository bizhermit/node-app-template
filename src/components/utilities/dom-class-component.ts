type DomEventProps<K extends keyof HTMLElementEventMap> = {
  element: HTMLElement | Window;
  type: K;
  listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any;
};

class DomClassComponent {

  protected events: Array<DomEventProps<any>>;

  constructor() {
    this.events = [];
  }

  public dispose(): void {
    this.events.forEach(props => {
      try {
        props.element.removeEventListener(props.type, props.listener);
      } catch { }
    });
  }

  public addEvent<T extends HTMLElement | Window, K extends keyof HTMLElementEventMap>(element: T, type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions) {
    if (element == null) return element;
    this.events.push({ element, type, listener });
    element.addEventListener(type, listener as any, options);
    return element;
  }

  public removeEvent<T extends HTMLElement | Window, K extends keyof HTMLElementEventMap>(element: T, type?: K, listener?: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any) {
    if (element == null) return element;
    for (let i = this.events.length - 1; i >= 0; i--) {
      const props = this.events[i];
      if (props.element !== element) continue;
      if (type != null && props.type !== type) continue;
      if (listener != null && props.listener !== listener) continue;
      try {
        props.element.removeEventListener(props.type, props.listener);
        this.events.splice(i, 1);
      } catch { }
    }
    return element;
  }

  public removeEventIterator(func: (props: DomEventProps<any>) => boolean | void) {
    for (let i = this.events.length - 1; i >= 0; i--) {
      const props = this.events[i];
      if (func(props) === true) {
        try {
          props.element.removeEventListener(props.type, props.listener);
        } catch { }
        this.events.splice(i, 1);
      }
    }
    return this;
  }

}

export const cloneDomElement = <T extends HTMLElement>(element: T, func?: (elem: T) => void) => {
  const elem = element?.cloneNode(true) as T;
  if (elem) func?.(elem);
  return elem;
};

export const pressPositiveKey = (e: KeyboardEvent, func: (e: KeyboardEvent) => void, stopEvent?: boolean) => {
  if (e.key === " " || e.key === "Enter") {
    func(e);
    if (stopEvent === true) {
      e.stopPropagation();
      e.preventDefault();
    }
  }
};

export default DomClassComponent;