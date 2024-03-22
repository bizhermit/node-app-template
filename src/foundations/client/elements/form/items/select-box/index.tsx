"use client";

import { forwardRef, useEffect, useMemo, useRef, useState, type FC, type ForwardedRef, type FunctionComponent, type ReactElement, type ReactNode } from "react";
import equals from "../../../../../objects/equal";
import { isEmpty, isNotEmpty } from "../../../../../objects/string/empty";
import { nonNullStruct } from "../../../../../objects/struct/convert";
import { getValue } from "../../../../../objects/struct/get";
import { setValue } from "../../../../../objects/struct/set";
import useLoadableArray, { type LoadableArray } from "../../../../hooks/loadable-array";
import { convertSizeNumToStr } from "../../../../utilities/size";
import { CrossIcon, DownIcon } from "../../../icon";
import Popup from "../../../popup";
import Resizer from "../../../resizer";
import useForm from "../../context";
import { convertDataItemValidationToFormItemValidation } from "../../utilities";
import getSourceFromDataItem from "../../utilities/source";
import { FormItemWrap } from "../common";
import { useDataItemMergedProps, useFormItemBase, useFormItemContext } from "../hooks";
import Style from "./index.module.scss";

type Data = { [v: string]: any };

type SelectBoxHookAddon<Q extends Data = Data> = {
  getData: () => (Q | null | undefined);
};
type SelectBoxHook<
  T extends string | number | boolean,
  Q extends Data = Data
> = F.ItemHook<T, SelectBoxHookAddon<Q>>;

export const useSelectBox = <
  T extends string | number | boolean,
  Q extends Data = Data
>() => useFormItemBase<SelectBoxHook<T, Q>>(e => {
  return {
    getData: () => {
      throw e;
    },
  };
});

type SelectBoxOptions<
  T extends string | number | boolean = string | number | boolean,
  D extends DataItem_String | DataItem_Number | DataItem_Boolean<any, any> | undefined = undefined,
  S extends Data = Data
> = {
  $ref?: SelectBoxHook<F.VType<T, D, T>, S> | SelectBoxHook<string | number, S>;
  $labelDataName?: string;
  $valueDataName?: string;
  $source?: LoadableArray<S>;
  $preventSourceMemorize?: boolean;
  $reloadSourceWhenOpen?: boolean;
  $hideClearButton?: boolean;
  $resize?: boolean;
  $width?: number | string;
  $maxWidth?: number | string;
  $minWidth?: number | string;
  $emptyItem?: boolean | string | { value: T | null | undefined; label: string; };
  $initValue?: F.VType<T, D, undefined> | null | undefined;
  $align?: "left" | "center" | "right";
  $disallowInput?: boolean;
  $tieInNames?: Array<string | { dataName: string; hiddenName: string; }>;
};

type OmitAttrs = "";
export type SelectBoxProps<
  T extends string | number | boolean = string | number | boolean,
  D extends DataItem_String | DataItem_Number | DataItem_Boolean<any, any> | undefined = undefined,
  S extends Data = Data
> = OverwriteAttrs<Omit<F.ItemProps<T, D, undefined, { afterData: S | undefined; beforeData: S | undefined; }>, OmitAttrs>, SelectBoxOptions<T, D, S>>;

interface SelectBoxFC extends FunctionComponent<SelectBoxProps> {
  <T extends string | number | boolean = string | number | boolean, D extends DataItem_String | DataItem_Number | DataItem_Boolean<any, any> | undefined = undefined, S extends { [v: string]: any } = { [v: string]: any }>(
    attrs: ComponentAttrsWithRef<HTMLDivElement, SelectBoxProps<T, D, S>>
  ): ReactElement<any> | null;
}

const SelectBox = forwardRef(<
  T extends string | number | boolean = string | number | boolean,
  D extends DataItem_String | DataItem_Number | DataItem_Boolean<any, any> | undefined = undefined,
  S extends Data = Data
>(p: SelectBoxProps<T, D, S>, ref: ForwardedRef<HTMLDivElement>) => {
  const form = useForm();
  const {
    style,
    tabIndex,
    placeholder,
    $labelDataName,
    $valueDataName,
    $source,
    $preventSourceMemorize,
    $reloadSourceWhenOpen,
    $hideClearButton,
    $resize,
    $width,
    $maxWidth,
    $minWidth,
    $emptyItem,
    $initValue,
    $align,
    $disallowInput,
    $tieInNames,
    $focusWhenMounted,
    ...$p
  } = useDataItemMergedProps(form, p, {
    under: ({ dataItem, props }) => {
      const $source = getSourceFromDataItem<S>(
        dataItem,
        { vdn: props.$valueDataName, ldn: props.$labelDataName }
      );
      if (dataItem.type === "boolean") {
        return { $source };
      }
      return {
        $source,
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

  const vdn = $valueDataName ?? "value";
  const ldn = $labelDataName ?? "label";
  const [source, loading, reloadSource] = useLoadableArray($source, {
    preventMemorize: $preventSourceMemorize,
  });
  const [bindSource, setBindSource] = useState(source);
  const emptyItem = (() => {
    if ($emptyItem == null || $emptyItem === false) {
      return undefined;
    }
    switch (typeof $emptyItem) {
      case "boolean":
        return {
          [vdn]: undefined,
          [ldn]: "",
        } as S;
      case "string":
        return {
          [vdn]: undefined,
          [ldn]: $emptyItem || "",
        } as S;
      default:
        return {
          [vdn]: $emptyItem.value,
          [ldn]: $emptyItem.label,
        } as S;
    }
  })();

  const { ctx, props, $ref } = useFormItemContext(form, $p, {
    generateChangeCallbackData: (a, b) => {
      return {
        afterData: source.find(item => equals(item[vdn], a)),
        beforeData: source.find(item => equals(item[vdn], b)),
      };
    },
    generateChangeCallbackDataDeps: [source],
    messages: {
      required: "{label}を選択してください。",
    },
  });

  const iref = useRef<HTMLInputElement>(null!);
  const [showPicker, setShowPicker] = useState(false);
  const doScroll = useRef(false);
  const [maxHeight, setMaxHeight] = useState(0);
  const lref = useRef<HTMLDivElement>(null!);
  const [label, setLabel] = useState("");
  const [selectedData, setSelectedData] = useState<S>();
  const mref = useRef<HTMLDivElement>(null!);
  const [openLoading, setOpenLoading] = useState(false);

  const renderLabel = () => {
    const item = source.find(item => equals(item[vdn], ctx.valueRef.current)) ?? emptyItem;
    setSelectedData(item);
    if ($tieInNames != null) {
      $tieInNames.forEach(tieItem => {
        const { dataName, hiddenName } = typeof tieItem === "string" ?
          { dataName: tieItem, hiddenName: tieItem } : tieItem;
        // setValue(props.$bind, hiddenName, item?.[dataName]);
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
      return String(item[ldn] ?? "").indexOf(text) > -1;
    }));
    openPicker({
      scroll: false,
      preventBindSource: true,
    });
  };

  const clear = () => {
    if (!ctx.editable) return;
    if (
      $emptyItem != null &&
      $emptyItem !== false &&
      !(typeof $emptyItem === "boolean" || typeof $emptyItem === "string")
    ) {
      ctx.change($emptyItem.value);
      return;
    }
    ctx.change(undefined);
  };

  const closePicker = () => {
    setShowPicker(false);
  };

  const openPicker = (opts?: {
    scroll?: boolean;
    preventBindSource?: boolean;
  }) => {
    if (!ctx.editable) return closePicker();
    if (showPicker) return;
    if (opts?.scroll != null) doScroll.current = opts.scroll;
    if (!opts?.preventBindSource) setBindSource(source);
    const rect = iref.current.getBoundingClientRect();
    setMaxHeight((Math.max(window.innerHeight - rect.bottom, rect.top) - 10));
    setShowPicker(true);
    if ($reloadSourceWhenOpen) {
      if (typeof $source !== "function") return;
      setOpenLoading(true);
      reloadSource({
        callback: ({ ok, interruptted }) => {
          if (!ok && interruptted) return;
          setOpenLoading(false);
          if (document.activeElement === mref.current) scrollToSelectedItem();
        },
      });
    }
  };

  const scrollToSelectedItem = () => {
    if (lref.current == null) return;
    let elem = lref.current.querySelector(`div[data-selected="true"]`) as HTMLElement;
    if (elem == null || elem.getAttribute("data-empty") === "true") {
      elem = lref.current.querySelector(`div[data-init="true"]`) as HTMLElement;
    }
    if (elem == null) elem = lref.current.querySelector("div[data-index]") as HTMLElement;
    if (elem) {
      lref.current.scrollTop = elem.offsetTop + elem.offsetHeight / 2 - lref.current.clientHeight / 2;
      elem.focus();
    } else {
      lref.current.focus();
    }
  };

  const selectItemByText = () => {
    if (!iref.current) return;
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

  const keydown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    switch (e.key) {
      case "Escape":
        closePicker();
        renderLabel();
        break;
      case "Enter":
        closePicker();
        selectItemByText();
        break;
      case "F2":
        openPicker({ scroll: true });
        break;
      case "ArrowUp":
      case "ArrowDown":
        if (showPicker && lref.current) {
          scrollToSelectedItem();
        } else {
          openPicker({
            scroll: true,
            preventBindSource: true,
          });
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
      closePicker();
      iref.current?.focus();
    } catch {
      return;
    }
  };

  const clickItem = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ctx.editable || openLoading) return;
    selectItem(isListItem(e.target as HTMLElement));
  };

  const keydownItem = (e: React.KeyboardEvent<HTMLDivElement>) => {
    switch (e.key) {
      case "Escape":
        iref.current.focus();
        closePicker();
        break;
      case "Enter":
        if (!openLoading) selectItem(isListItem(e.target as HTMLElement));
        e.preventDefault();
        break;
      case "ArrowUp":
        if (!openLoading) {
          const prevElem = document.activeElement?.previousElementSibling as HTMLElement;
          if (prevElem) {
            const st = prevElem.offsetTop;
            const curSt = lref.current.scrollTop;
            if (st < curSt) lref.current.scrollTop = st;
            prevElem.focus();
          }
        }
        e.preventDefault();
        e.stopPropagation();
        break;
      case "ArrowDown":
        if (!openLoading) {
          const nextElem = document.activeElement?.nextElementSibling as HTMLElement;
          if (nextElem) {
            const st = nextElem.offsetTop - lref.current.clientHeight + nextElem.offsetHeight;
            const curSt = lref.current.scrollTop;
            if (st > curSt) lref.current.scrollTop = st;
            nextElem.focus();
          }
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
      (mref.current != null && e.relatedTarget === mref.current) ||
      (lref.current != null && (e.relatedTarget === lref.current || e.relatedTarget?.parentElement === lref.current))
    ) return;
    closePicker();
    selectItemByText();
  };

  useEffect(() => {
    setBindSource(source);
    ctx.change(ctx.valueRef.current, false, true);
  }, [source]);

  useEffect(() => {
    renderLabel();
  }, [ctx.value, source]);

  const isEmptyValue = ctx.value == null || ctx.value === "";
  const hasLabel = isNotEmpty(label);
  const hasData = !(ctx.value == null || ctx.value === "");
  const formEnable = !form.disabled && !form.readOnly;

  useEffect(() => {
    if ($focusWhenMounted && formEnable) {
      iref.current?.focus();
    }
  }, [formEnable]);

  if ($ref) {
    $ref.focus = () => iref.current?.focus();
    $ref.getData = () => {
      const v = ctx.valueRef.current;
      return source.find(item => item[vdn] === v) as S;
    };
  }

  const widthStyles = nonNullStruct({
    width: convertSizeNumToStr($width),
    maxWidth: convertSizeNumToStr($maxWidth),
    minWidth: convertSizeNumToStr($minWidth),
  });

  return (
    <FormItemWrap
      {...props}
      style={{
        ...widthStyles,
        ...style,
      }}
      ref={ref}
      $ctx={ctx}
      $useHidden
      $hasData={hasLabel}
      $mainProps={{
        onBlur: blur,
      }}
      data-width={widthStyles != null}
    >
      <input
        ref={iref}
        className={Style.input}
        defaultValue={label}
        type="text"
        disabled={ctx.disabled || loading}
        readOnly={$disallowInput || !ctx.editable}
        placeholder={ctx.editable ? placeholder : ""}
        tabIndex={tabIndex}
        onClick={() => openPicker()}
        onChange={changeText}
        onKeyDown={keydown}
        autoComplete="off"
        data-has={!isEmptyValue}
        data-align={$align}
        data-editable={ctx.editable}
        data-input={!$disallowInput}
        data-button={ctx.editable && !loading && ($hideClearButton !== true || true)}
      />
      {ctx.editable && !loading &&
        <>
          {$hideClearButton !== true &&
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
              openPicker({
                scroll: true,
                preventBindSource: true,
              });
            }}
            data-disabled={!ctx.editable || loading || showPicker}
          >
            <DownIcon />
          </div>
        </>
      }
      {$resize && <Resizer $direction="x" />}
      {$tieInNames != null &&
        $tieInNames.map(item => {
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
        $onToggle={(show, { anchorElement, popupElement }) => {
          if (show && anchorElement && popupElement) {
            popupElement.style.width = convertSizeNumToStr(anchorElement.offsetWidth);
          }
          setShowPicker(show);
        }}
        $anchor="parent"
        $position={{
          x: "inner",
          y: "outer",
        }}
        $animationDuration={80}
        $preventUnmount
        $animationDirection="vertical"
        $onToggled={(open) => {
          if (open) {
            if (!doScroll.current) return;
            doScroll.current = false;
            scrollToSelectedItem();
          } else {
            setBindSource(source);
          }
        }}
        $mask="transparent"
        $preventFocus
      >
        {<div
          ref={mref}
          className={Style.mask}
          data-show={openLoading}
          tabIndex={-1}
        />}
        <div
          className={Style.list}
          ref={lref}
          style={{ maxHeight }}
          tabIndex={-1}
          onClick={clickItem}
          onKeyDown={keydownItem}
        >
          {useMemo(() => {
            if (emptyItem) {
              const emptyValue = bindSource[0]?.[vdn];
              if (!equals(emptyValue, emptyItem[vdn])) {
                bindSource.unshift(emptyItem as S);
              }
            }
            const emptyValue = emptyItem?.[vdn];
            return bindSource.map((item, index) => {
              const v = item[vdn];
              const isEmpty = emptyItem != null && equals(v, emptyValue);
              return (
                <ListItem
                  key={v ?? "_empty"}
                  empty={isEmpty}
                  init={v === $initValue}
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
}) as SelectBoxFC;

const ListItem: FC<{
  index: number;
  empty: boolean;
  init: boolean;
  selected: boolean;
  children?: ReactNode;
}> = (props) => {
  return (
    <div
      className={Style.item}
      data-index={props.index}
      data-init={props.init}
      data-selected={props.selected}
      data-empty={props.empty}
      tabIndex={0}
    >
      {props.children}
    </div>
  );
};

export default SelectBox;
