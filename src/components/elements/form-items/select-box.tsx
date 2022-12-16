import { equals, FormItemProps, FormItemWrap, useForm } from "@/components/elements/form";
import useLoadableArray, { LoadableArray } from "@/hooks/loadable-array";
import React, { FC, FunctionComponent, ReactElement, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { VscChevronDown, VscClose } from "react-icons/vsc";
import Style from "$/components/elements/form-items/select-box.module.scss";
import { convertSizeNumToStr } from "@/utilities/attributes";
import Resizer from "@/components/elements/resizer";
import Popup from "@/components/elements/popup";
import { isEmpty } from "@bizhermit/basic-utils/dist/string-utils";
import StringUtils from "@bizhermit/basic-utils/dist/string-utils";

export type SelectBoxProps<T extends string | number = string | number> = FormItemProps<T, { afterData: Struct; beforeData: Struct; }> & {
  $labelDataName?: string;
  $valueDataName?: string;
  $source?: LoadableArray<Struct>;
  $preventSourceMemorize?: boolean;
  $hideClearButton?: boolean;
  $resize?: boolean;
  $width?: number | string;
  $maxWidth?: number | string;
  $minWidth?: number | string;
  $appendEmpltySourceItem?: boolean;
};

interface SelectBoxFC extends FunctionComponent {
  <T extends string | number = string | number>(attrs: SelectBoxProps<T>, ref?: React.ForwardedRef<HTMLDivElement>): ReactElement<any> | null;
}

const defaultWidth = 200;

const SelectBox: SelectBoxFC = React.forwardRef<HTMLDivElement, SelectBoxProps>(<T extends string | number = string | number>(props: SelectBoxProps<T>, ref: React.ForwardedRef<HTMLDivElement>) => {
  const vdn = props.$valueDataName ?? "value";
  const ldn = props.$labelDataName ?? "label";

  const [source, loading] = useLoadableArray(props.$source, {
    preventMemorize: props.$preventSourceMemorize,
  });
  const [bindSource, setBindSource] = useState(source);
  useEffect(() => {
    setBindSource(source);
  }, [source]);

  const iref = useRef<HTMLInputElement>(null!);
  const [showPicker, setShowPicker] = useState(false);
  const [width, setWidth] = useState(0);
  const [maxHeight, setMaxHeight] = useState(0);
  const lref = useRef<HTMLDivElement>(null!);

  const renderLabel = () => {
    if (iref.current == null) return;
    const item = source.find(item => equals(item[vdn], form.valueRef.current));
    if (item == null) {
      iref.current.value = "";
      return undefined;
    }
    iref.current.value = String(item[ldn] || "");
    return item[ldn];
  };

  const form = useForm(props, {
    generateChangeCallbackData: (a, b) => {
      return {
        afterData: source.find(item => equals(item[vdn], a)),
        beforeData: source.find(item => equals(item[vdn], b)),
      };
    }
  });

  const changeText = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!form.editable) return;
    const text = e.currentTarget.value;
    if (isEmpty(text)) {
      setBindSource(source);
      return;
    }
    setBindSource(source.filter(item => {
      return StringUtils.contains(item[ldn], text);
    }));
    setShowPicker(true);
  };

  const clear = () => {
    if (!form.editable) return;
    form.change(undefined);
  };

  const picker = () => {
    if (!form.editable) return;
    if (showPicker) return;
    setWidth((iref.current.parentElement as HTMLElement).offsetWidth);
    const rect = iref.current.getBoundingClientRect();
    setMaxHeight((Math.max(document.body.clientHeight - rect.bottom, rect.top) - 10));
    setShowPicker(true);
  };

  const scrollToSelectedItem = () => {
    if (lref.current == null) return;
    let elem = lref.current.querySelector(`div[data-selected="true"]`) as HTMLElement;
    if (elem == null) elem = lref.current.querySelector("div[data-index]") as HTMLElement;
    if (elem) {
      lref.current.scrollTop = elem.offsetTop + elem.offsetHeight;
      elem.focus();
    } else {
      lref.current.focus();
    }
  };

  const keydown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    switch (e.key) {
      case "Escape":
        setShowPicker(false);
        break;
      case "F2":
        setShowPicker(true);
        break;
      case "ArrowUp":
      case "ArrowDown":
        if (showPicker && lref.current) {
          scrollToSelectedItem();
        } else {
          setShowPicker(true);
        }
        e.stopPropagation();
        e.preventDefault();
        break;
      default:
        break;
    }
  };

  const isListItem = (element: HTMLElement) => {
    let elem = element;
    while (elem != null) {
      if (elem.tagName === "DIV" && elem.hasAttribute("data-index")) break;
      elem = elem.parentElement as HTMLElement;
    }
    return elem;
  };

  const selectItem = (elem: HTMLElement) => {
    if (elem == null) return;
    try {
      const index = Number(elem.getAttribute("data-index"));
      const data = bindSource[index];
      form.change(data[vdn]);
      setShowPicker(false);
      iref.current?.focus();
    } catch {
      return;
    }
  };

  const clickItem = (e: React.MouseEvent<HTMLDivElement>) => {
    selectItem(isListItem(e.target as HTMLElement));
  };

  const keydownItem = (e: React.KeyboardEvent<HTMLDivElement>) => {
    switch (e.key) {
      case "Escape":
        iref.current.focus();
        setShowPicker(false);
        break;
      case "Enter":
        const elem = isListItem(e.target as HTMLElement);
        selectItem(elem);
        e.preventDefault();
        break;
      case "ArrowUp":
        const prevElem = document.activeElement?.previousElementSibling as HTMLElement;
        if (prevElem) {
          const st = prevElem.offsetTop;
          const curSt = lref.current.scrollTop;
          if (st < curSt) lref.current.scrollTop = st;
          prevElem.focus();
        }
        e.preventDefault();
        e.stopPropagation();
        break;
      case "ArrowDown":
        const nextElem = document.activeElement?.nextElementSibling as HTMLElement;
        if (nextElem) {
          const st = nextElem.offsetTop - lref.current.clientHeight + nextElem.offsetHeight;
          const curSt = lref.current.scrollTop;
          if (st > curSt) lref.current.scrollTop = st;
          nextElem.focus();
        }
        e.preventDefault();
        e.stopPropagation();
        break;
      default:
        break;
    }
  };

  const blur = (e: React.FocusEvent) => {
    if (e.relatedTarget === iref.current || e.relatedTarget === lref.current || e.relatedTarget?.parentElement === lref.current) return;
    setShowPicker(false);
  };

  useEffect(() => {
    renderLabel();
  }, [form.value]);

  return (
    <FormItemWrap
      {...props}
      ref={ref}
      $$form={form}
      $useHidden
      $mainProps={{
        style: {
          width: convertSizeNumToStr(props.$width ?? defaultWidth),
          maxWidth: convertSizeNumToStr(props.$maxWidth),
          minWidth: convertSizeNumToStr(props.$minWidth),
        },
        onBlur: blur,
      }}
    >
      <input
        ref={iref}
        className={Style.input}
        type="text"
        disabled={form.disabled}
        readOnly={!form.editable}
        placeholder={form.editable ? props.placeholder : ""}
        tabIndex={props.tabIndex}
        onFocus={picker}
        onChange={changeText}
        onKeyDown={keydown}
      />
      {form.editable &&
        <>
          {props.$hideClearButton !== true &&
            <div
              className={Style.icon}
              onClick={clear}
            >
              <VscClose />
            </div>
          }
          <div
            className={Style.icon}
            onClick={picker}
          >
            <VscChevronDown />
          </div>
        </>
      }
      {props.$resize && <Resizer direction="x" />}
      <Popup
        className="es-4 c-input r-2"
        $show={showPicker}
        $onToggle={setShowPicker}
        $anchor="parent"
        $position={{
          x: "inner",
          y: "outer",
        }}
        $animationDuration={50}
        style={{ width }}
        $preventUnmount
        $onToggled={(open) => {
          if (open) {
            if (document.activeElement === iref.current) return;
            scrollToSelectedItem();
          }
        }}
      >
        <div
          className={Style.list}
          ref={lref}
          style={{ maxHeight }}
          tabIndex={-1}
          onClick={clickItem}
          onKeyDown={keydownItem}
        >
          {useMemo(() => {
            if (props.$appendEmpltySourceItem && bindSource[0]?.[vdn] !== "") {
              const emptyItem: Struct = {};
              emptyItem[vdn] = "";
              emptyItem[ldn] = "";
              bindSource.unshift(emptyItem);
            }
            return bindSource.map((item, index) => {
              const v = item[vdn];
              return (
                <ListItem
                  key={v ?? index}
                  index={index}
                  selected={v === form.valueRef.current}
                >
                  {item[ldn]}
                </ListItem>
              );
            });
          }, [bindSource, form.value])}
        </div>
      </Popup>
    </FormItemWrap>
  );
});

const ListItem: FC<{
  index: number;
  selected: boolean;
  children?: ReactNode;
}> = (props) => {
  return (
    <div
      className={Style.item}
      data-index={props.index}
      data-selected={props.selected}
      tabIndex={0}
    >
      {props.children}
    </div>
  );
};

export default SelectBox;