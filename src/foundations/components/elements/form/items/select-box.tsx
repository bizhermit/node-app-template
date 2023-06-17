"use client";

import Style from "#/styles/components/elements/form-items/select-box.module.scss";
import useLoadableArray from "#/hooks/loadable-array";
import { type FC, type ForwardedRef, forwardRef, type FunctionComponent, type ReactElement, type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { convertSizeNumToStr } from "#/components/utilities/attributes";
import Resizer from "#/components/elements/resizer";
import Popup from "#/components/elements/popup";
import { isEmpty } from "@bizhermit/basic-utils/dist/string-utils";
import StringUtils from "@bizhermit/basic-utils/dist/string-utils";
import { equals, getValue, setValue } from "#/data-items/utilities";
import { CrossIcon, DownIcon } from "#/components/elements/icon";
import { FormItemProps } from "#/components/elements/form/$types";
import { useForm } from "#/components/elements/form/context";
import { useDataItemMergedProps, useFormItemContext } from "#/components/elements/form/item-hook";
import { convertDataItemValidationToFormItemValidation } from "#/components/elements/form/utilities";
import { FormItemWrap } from "#/components/elements/form/item-wrap";

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
  $emptyItem?: boolean | string | { value: T | null | undefined; label: string; };
  $align?: "left" | "center" | "right";
  $disallowInput?: boolean;
  $tieInNames?: Array<string | { dataName: string; hiddenName: string; }>;
};

interface SelectBoxFC extends FunctionComponent<SelectBoxProps> {
  <T extends string | number = string | number, D extends DataItem_String | DataItem_Number | undefined = undefined, S extends Struct = Struct>
    (attrs: SelectBoxProps<T, D, S>, ref?: ForwardedRef<HTMLDivElement>): ReactElement<any> | null;
}

const SelectBox: SelectBoxFC = forwardRef<HTMLDivElement, SelectBoxProps>(<
  T extends string | number = string | number,
  D extends DataItem_String | DataItem_Number | undefined = undefined,
  S extends Struct = Struct
>(p: SelectBoxProps<T, D, S>, ref: ForwardedRef<HTMLDivElement>) => {
  const form = useForm();
  const props = useDataItemMergedProps(form, p, {
    under: ({ dataItem }) => {
      return {
        $source: dataItem.source as LoadableArray<S>,
        $align: dataItem.align,
        $width: dataItem.width,
        $minWidth: dataItem.minWidth,
        $maxWidth: dataItem.maxWidth,
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
    messages: {
      required: "値を選択してください。",
    },
  });

  const iref = useRef<HTMLInputElement>(null!);
  const [showPicker, setShowPicker] = useState(false);
  const doScroll = useRef(false);
  const [width, setWidth] = useState(0);
  const [maxHeight, setMaxHeight] = useState(0);
  const lref = useRef<HTMLDivElement>(null!);
  const [label, setLabel] = useState("");
  const [selectedData, setSelectedData] = useState<S>();

  const renderLabel = () => {
    const item = source.find(item => equals(item[vdn], ctx.valueRef.current));
    setSelectedData(item);
    if (props.$tieInNames != null) {
      props.$tieInNames.forEach(tieItem => {
        const { dataName, hiddenName } =
        typeof tieItem === "string" ? { dataName: tieItem, hiddenName: tieItem } : tieItem;
        setValue(props.$bind, hiddenName, item?.[dataName]);
        setValue(ctx.bind, hiddenName, item?.[dataName]);
      });
    }
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
    if (props.$emptyItem != null && !(typeof props.$emptyItem === "boolean" || typeof props.$emptyItem === "string")) {
      ctx.change(props.$emptyItem.value);
      return;
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
    if (
      (iref.current != null && e.relatedTarget === iref.current) ||
      (lref.current != null && (e.relatedTarget === lref.current || e.relatedTarget?.parentElement === lref.current))
    ) return;
    setShowPicker(false);
    const label = iref.current.value;
    const item = source.find(item => equals(item[ldn], label));
    if (item) {
      if (!equals(item[vdn], ctx.valueRef.current)) {
        ctx.change(item[vdn]);
        return;
      }
    }
    renderLabel();
  };

  useEffect(() => {
    setBindSource(source);
    ctx.change(ctx.valueRef.current, false, true);
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
          width: convertSizeNumToStr(props.$width),
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
        readOnly={props.$disallowInput || !ctx.editable}
        placeholder={ctx.editable ? props.placeholder : ""}
        tabIndex={props.tabIndex}
        onClick={picker}
        onChange={changeText}
        onKeyDown={keydown}
        autoComplete="off"
        data-has={!isEmptyValue}
        data-align={props.$align}
        data-editable={ctx.editable}
        data-input={!props.$disallowInput}
      />
      {ctx.editable && !loading &&
        <>
          {props.$hideClearButton !== true &&
            <div
              className={Style.button}
              onClick={clear}
              data-disabled={!ctx.editable || loading || !hasData}
            >
              <CrossIcon />
            </div>
          }
          <div
            className={Style.button}
            onClick={() => {
              doScroll.current = true;
              picker();
            }}
            data-disabled={!ctx.editable || loading || showPicker}
          >
            <DownIcon />
          </div>
        </>
      }
      {props.$resize && <Resizer direction="x" />}
      {props.$tieInNames != null &&
        props.$tieInNames.map(item => {
          const { dataName, hiddenName } =
            typeof item === "string" ? { dataName: item, hiddenName: item } : item;
          return (
            <input
              type="hidden"
              key={hiddenName}
              name={hiddenName}
              value={getValue(selectedData, dataName) ?? ""}
            />
          );
        })
      }
      <Popup
        className={Style.popup}
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
            if (props.$emptyItem != null) {
              const emptyValue = bindSource[0]?.[vdn];
              if (emptyValue != null && emptyValue !== "") {
                switch (typeof props.$emptyItem) {
                  case "boolean":
                    if (props.$emptyItem) {
                      bindSource.unshift({
                        [vdn]: undefined,
                        [ldn]: "",
                      } as S);
                    }
                    break;
                  case "string":
                    bindSource.unshift({
                      [vdn]: undefined,
                      [ldn]: props.$emptyItem || "",
                    } as S);
                    break;
                  default:
                    if (props.$emptyItem && emptyValue !== props.$emptyItem.value) {
                      bindSource.unshift({
                        [vdn]: props.$emptyItem.value,
                        [ldn]: props.$emptyItem.label,
                      } as S);
                    }
                    break;
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