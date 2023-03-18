type DomEventProps = {
  element: HTMLElement | Window;
  type: keyof HTMLElementEventMap;
  listener: EventListenerOrEventListenerObject;
};

class DomClassComponent {
  protected events: Array<DomEventProps>;

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

  public addEvent<T extends HTMLElement | Window>(element: T, type: keyof HTMLElementEventMap, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) {
    if (element == null) return element;
    this.events.push({ element, type, listener });
    element.addEventListener(type, listener, options);
    return element;
  }

  public removeEvent<T extends HTMLElement | Window>(element: T, type?: keyof HTMLElementEventMap, listener?: EventListenerOrEventListenerObject) {
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

  public removeEventIterator(func: (props: DomEventProps) => boolean | void) {
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
  if (element == null) return undefined;
  const elem = element.cloneNode(true) as T;
  func?.(elem);
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