/* eslint-disable react-hooks/rules-of-hooks */
import { convertDataItemValidationToFormItemValidation, FormItemProps, FormItemWrap, useDataItemMergedProps, useForm, useFormItemContext } from "@/components/elements/form";
import useLoadableArray, { LoadableArray } from "@/hooks/loadable-array";
import React, { FC, FunctionComponent, ReactElement, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { VscChevronDown, VscClose } from "react-icons/vsc";
import Style from "$/components/elements/form-items/select-box.module.scss";
import { convertSizeNumToStr } from "@/components/utilities/attributes";
import Resizer from "@/components/elements/resizer";
import Popup from "@/components/elements/popup";
import { isEmpty } from "@bizhermit/basic-utils/dist/string-utils";
import StringUtils from "@bizhermit/basic-utils/dist/string-utils";
import { equals } from "@/data-items/utilities";

export type SelectBoxProps<
  T extends string | number = string | number,
  D extends DataItem_String | DataItem_Number | undefined = undefined,
  S extends Struct = Struct
> = FormItemProps<T, D, undefined, { afterData: S | undefined; beforeData: S | undefined; }> & {
  $labelDataName?: string;
  $valueDataName?: string;
  $source?: LoadableArray<S>;
  $preventSourceMemorize?: boolean;
  $hideClearButton?: boolean;
  $resize?: boolean;
  $width?: number | string;
  $maxWidth?: number | string;
  $minWidth?: number | string;
  $emptyItem?: boolean | { value: T; label: string; };
};

interface SelectBoxFC extends FunctionComponent<SelectBoxProps> {
  <T extends string | number = string | number, D extends DataItem_String | DataItem_Number | undefined = undefined, S extends Struct = Struct>(attrs: SelectBoxProps<T, D, S>, ref?: React.ForwardedRef<HTMLDivElement>): ReactElement<any> | null;
}

const defaultWidth = 200;

const SelectBox: SelectBoxFC = React.forwardRef<HTMLDivElement, SelectBoxProps>(<
  T extends string | number = string | number,
  D extends DataItem_String | DataItem_Number | undefined = undefined,
  S extends Struct = Struct
>(p: SelectBoxProps<T, D, S>, ref: React.ForwardedRef<HTMLDivElement>) => {
  const form = useForm();
  const props = useDataItemMergedProps(form, p, {
    under: ({ dataItem }) => {
      return {
        $source: dataItem.source as LoadableArray<S>,
      };
    },
    over: ({ dataItem, props }) => {
      return {
        $validations: dataItem.validations?.map(f => convertDataItemValidationToFormItemValidation(f, props, dataItem)),
      };
    },
  });

  const vdn = props.$valueDataName ?? "value";
  const ldn = props.$labelDataName ?? "label";
  const [source, loading] = useLoadableArray(props.$source, {
    preventMemorize: props.$preventSourceMemorize,
  });
  const [bindSource, setBindSource] = useState(source);

  const ctx = useFormItemContext(form, props, {
    generateChangeCallbackData: (a, b) => {
      return {
        afterData: source.find(item => equals(item[vdn], a)),
        beforeData: source.find(item => equals(item[vdn], b)),
      };
    },
    generateChangeCallbackDataDeps: [source],
  });

  const iref = useRef<HTMLInputElement>(null!);
  const [showPicker, setShowPicker] = useState(false);
  const doScroll = useRef(false);
  const [width, setWidth] = useState(0);
  const [maxHeight, setMaxHeight] = useState(0);
  const lref = useRef<HTMLDivElement>(null!);
  const [label, setLabel] = useState("");

  const renderLabel = () => {
    const item = source.find(item => equals(item[vdn], ctx.valueRef.current));
    if (item == null) {
      if (iref.current) iref.current.value = "";
      setLabel("");
      return;
    }
    if (iref.current) iref.current.value = String(item[ldn] || "");
    setLabel(String(item[ldn] || ""));
    return;
  };

  const changeText = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!ctx.editable) return;
    const text = e.currentTarget.value;
    if (isEmpty(text)) {
      setBindSource(source);
      return;
    }
    setBindSource(source.filter(item => {
      return StringUtils.contains(item[ldn], text);
    }));
    doScroll.current = false;
    setShowPicker(true);
  };

  const clear = () => {
    if (!ctx.editable) return;
    if (props.$emptyItem) {
      if (!(typeof props.$emptyItem === "boolean")) {
        ctx.change(props.$emptyItem.value);
        return;
      }
    }
    ctx.change(undefined);
  };

  const picker = () => {
    if (!ctx.editable) return;
    if (showPicker) return;
    setBindSource(source);
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
        doScroll.current = true;
        setBindSource(source);
        setShowPicker(true);
        break;
      case "ArrowUp":
      case "ArrowDown":
        if (showPicker && lref.current) {
          scrollToSelectedItem();
        } else {
          doScroll.current = true;
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
      ctx.change(data[vdn]);
      setShowPicker(false);
      iref.current?.focus();
    } catch {
      return;
    }
  };

  const clickItem = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ctx.editable) return;
    selectItem(isListItem(e.target as HTMLElement));
  };

  const keydownItem = (e: React.KeyboardEvent<HTMLDivElement>) => {
    switch (e.key) {
      case "Escape":
        iref.current.focus();
        setShowPicker(false);
        break;
      case "Enter":
        selectItem(isListItem(e.target as HTMLElement));
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
    renderLabel();
  };

  useEffect(() => {
    setBindSource(source);
    ctx.change(ctx.valueRef.current, true);
  }, [source]);

  useEffect(() => {
    renderLabel();
  }, [ctx.value, source]);

  const isEmptyValue = ctx.value == null || ctx.value === "";
  const hasLabel = StringUtils.isNotEmpty(label);
  const hasData = !(ctx.value == null || ctx.value === "");

  return (
    <FormItemWrap
      {...props}
      ref={ref}
      $context={ctx}
      $useHidden
      data-has={hasLabel}
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
        defaultValue={label}
        type="text"
        disabled={ctx.disabled || loading}
        readOnly={!ctx.editable}
        placeholder={ctx.editable ? props.placeholder : ""}
        tabIndex={props.tabIndex}
        onClick={picker}
        onChange={changeText}
        onKeyDown={keydown}
        autoComplete="off"
        data-has={!isEmptyValue}
      />
      {ctx.editable && !loading &&
        <>
          {props.$hideClearButton !== true &&
            <div
              className={Style.button}
              onClick={clear}
              data-disabled={!hasData}
            >
              <VscClose />
            </div>
          }
          <div
            className={Style.button}
            onClick={() => {
              doScroll.current = true;
              picker();
            }}
            data-disabled={showPicker}
          >
            <VscChevronDown />
          </div>
        </>
      }
      {props.$resize && <Resizer direction="x" />}
      <Popup
        className="es-4 c-input r-2"
        $show={showPicker && ctx.editable && !loading}
        $onToggle={setShowPicker}
        $anchor="parent"
        $position={{
          x: "inner",
          y: "outer",
        }}
        $animationDuration={80}
        style={{ width }}
        $preventUnmount
        $animationDirection="vertical"
        $onToggled={(open) => {
          if (open) {
            if (!doScroll.current) return;
            doScroll.current = false;
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
            if (props.$emptyItem) {
              const emptyValue = bindSource[0]?.[vdn];
              if (emptyValue != null && emptyValue !== "") {
                if (typeof props.$emptyItem === "boolean") {
                  bindSource.unshift({
                    [vdn]: undefined,
                    [ldn]: "",
                  } as S);
                } else {
                  if (emptyValue !== props.$emptyItem.value) {
                    bindSource.unshift({
                      [vdn]: props.$emptyItem.value,
                      [ldn]: props.$emptyItem.label,
                    } as S);
                  }
                }
              }
            }
            return bindSource.map((item, index) => {
              const v = item[vdn];
              return (
                <ListItem
                  key={v ?? "_empty"}
                  empty={v == null || v === ""}
                  index={index}
                  selected={v === ctx.valueRef.current}
                >
                  {item[ldn]}
                </ListItem>
              );
            });
          }, [bindSource, ctx.value])}
        </div>
      </Popup>
    </FormItemWrap>
  );
});

const ListItem: FC<{
  index: number;
  empty: boolean;
  selected: boolean;
  children?: ReactNode;
}> = (props) => {
  return (
    <div
      className={Style.item}
      data-index={props.index}
      data-selected={props.selected}
      data-empty={props.empty}
      tabIndex={0}
    >
      {props.children}
    </div>
  );
};

export default SelectBox;