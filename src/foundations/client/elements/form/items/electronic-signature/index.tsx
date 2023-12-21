"use client";

import { forwardRef, useEffect, useRef, useState, type FC, type ForwardedRef, type FunctionComponent, type ReactElement, type ReactNode } from "react";
import type { FormItemHook, FormItemProps, FormItemValidation, ValueType } from "../../$types";
import { isNotEmpty } from "../../../../../objects/string/empty";
import { releaseCursor, setCursor } from "../../../../utilities/cursor";
import { ClearAllIcon, CrossIcon, RedoIcon, SaveIcon, UndoIcon } from "../../../icon";
import useForm from "../../context";
import { convertDataItemValidationToFormItemValidation } from "../../utilities";
import { FormItemWrap } from "../common";
import { useDataItemMergedProps, useFormItemBase, useFormItemContext } from "../hooks";
import Style from "./index.module.scss";

type ElectronicSignatureHookAddon = {
  save: () => void;
  redo: () => void;
  undo: () => void;
  clearCanvas: (history?: boolean) => void;
};
type ElectronicSignatureHook<T extends string | File> = FormItemHook<T, ElectronicSignatureHookAddon>;

export const useElectronicSignature = <T extends string | File>() => useFormItemBase<ElectronicSignatureHook<T>>((e) => {
  return {
    save: () => {
      throw e;
    },
    redo: () => {
      throw e;
    },
    undo: () => {
      throw e;
    },
    clearCanvas: () => {
      throw e;
    },
  };
});

type ElectronicSignatureOptions<
  D extends DataItem_String | DataItem_File | undefined = undefined
> = {
  $ref?: ElectronicSignatureHook<ValueType<string, D, string>> | ElectronicSignatureHook<string | File>;
  $typeof?: FileValueType;
  $width?: number | string;
  $height?: number | string;
  $lineWidth?: number;
  $lineColor?: string | CanvasGradient | CanvasPattern;
  // $backgroundColor?: string | CanvasGradient | CanvasPattern;
  $maxHistory?: number;
  $autoSave?: boolean;
  $buttonsPosition?: "hide" | "right" | "bottom" | "top" | "left";
};

type OmitAttrs = "tabIndex" | "placeholder";
export type ElectronicSignatureProps<
  D extends DataItem_String | DataItem_File | undefined = undefined
> = OverwriteAttrs<Omit<FormItemProps<string, D, string>, OmitAttrs>, ElectronicSignatureOptions<D>>

interface ElectronicSignatureFC extends FunctionComponent {
  <D extends DataItem_String | DataItem_File | undefined = undefined>(
    attrs: ComponentAttrsWithRef<HTMLDivElement, ElectronicSignatureProps<D>>
  ): ReactElement<any> | null;
}

const ElectronicSignature = forwardRef(<
  D extends DataItem_String | DataItem_File | undefined = undefined
>(p: ElectronicSignatureProps<D>, ref: ForwardedRef<HTMLDivElement>) => {
  const form = useForm();
  const {
    $typeof,
    $width,
    $height,
    $lineWidth,
    $lineColor,
    // $backgroundColor,
    $maxHistory,
    $autoSave,
    $buttonsPosition,
    $focusWhenMounted,
    ...$p
  } = useDataItemMergedProps(form, p, {
    under: ({ dataItem }) => {
      switch (dataItem.type) {
        case "file":
          return {
            $typeof: dataItem.typeof,
          };
        default:
          return {};
      }
    },
    over: ({ dataItem, props }) => {
      const common: FormItemProps = {
        $messagePosition: "bottom-hide"
      };
      switch (dataItem.type) {
        case "file":
          return {
            ...common,
            $validations: dataItem.validations?.map(f => convertDataItemValidationToFormItemValidation(f, props, dataItem)),
          } as ElectronicSignatureProps<D>;
        default:
          return {
            ...common,
            $validations: dataItem.validations?.map(f => convertDataItemValidationToFormItemValidation(f, props, dataItem)),
          } as ElectronicSignatureProps<D>;
      }
    },
  });

  const href = useRef<HTMLInputElement>(null!);
  const cref = useRef<HTMLCanvasElement>(null!);
  const [revision, setRevision] = useState(-1);
  const history = useRef<Array<ImageData>>([]);
  const nullValue = useRef("");

  const { ctx, props, $ref } = useFormItemContext(form, $p, {
    multipartFormData: $typeof === "file",
    preventRequiredValidation: true,
    validations: ({ getMessage, required }) => {
      const validations: Array<FormItemValidation<string | null | undefined>> = [];
      if (required) {
        validations.push(v => {
          if (v == null || v === "" || v === nullValue.current) {
            return getMessage("required");
          }
          return undefined;
        });
      }
      return validations;
    },
    messages: {
      required: "記入してください。",
    },
  });

  const position = $buttonsPosition || "right";
  const canClear = isNotEmpty(ctx.value) && ctx.value !== nullValue.current;
  const canRedo = revision >= 0 && revision < history.current.length - 1;
  const canUndo = revision > 0;
  const canClearHist = history.current.length > 1;

  const get2DContext = () => {
    return cref.current.getContext("2d", { willReadFrequently: true })!;
  };

  const save = () => {
    if (cref.current == null) return;
    if ($typeof === "file") {
      // TODO: convert to png
      // ctx.change(cref.current.toDataURL());
      return;
    }
    ctx.change(cref.current.toDataURL());
  };

  const spillHistory = () => {
    if (history.current.length > Math.max(0, $maxHistory ?? 100)) {
      history.current.splice(0, 1);
    }
  };

  const clearHistory = () => {
    history.current.splice(0, history.current.length);
    const canvas = get2DContext();
    history.current.push(canvas.getImageData(0, 0, cref.current.width, cref.current.height));
    spillHistory();
    setRevision(0);
  };

  const popHistory = () => {
    const popLen = history.current.length - 1 - revision;
    if (popLen > 0) {
      history.current.splice(revision + 1, popLen);
    }
  };

  const pushHistory = (imageData: ImageData) => {
    history.current.push(imageData);
    spillHistory();
    setRevision(history.current.length - 1);
  };

  const drawStart = (baseX: number, baseY: number, isTouch?: boolean) => {
    if (!ctx.editable || cref.current == null) return;
    const canvas = get2DContext();
    const lineWidth = Math.max(1, $lineWidth || 2);
    const lineColor = $lineColor || "black";
    canvas.strokeStyle = lineColor;
    canvas.fillStyle = lineColor;
    canvas.lineWidth = lineWidth;
    const rect = cref.current.getBoundingClientRect();
    const posX = rect.left, posY = rect.top;
    let lastX = 0, lastY = 0, curX = baseX - posX, curY = baseY - posY;
    document.body.inert = true;
    const moveImpl = (x: number, y: number) => {
      lastX = curX;
      lastY = curY;
      curX = x - posX;
      curY = y - posY;
      canvas.beginPath();
      canvas.moveTo(lastX, lastY);
      canvas.lineTo(curX, curY);
      canvas.lineWidth = lineWidth;
      canvas.stroke();
      canvas.closePath();
    };
    const endImpl = () => {
      document.body.inert = false;
      canvas.stroke();
      canvas.closePath();
      pushHistory(canvas.getImageData(0, 0, cref.current.width, cref.current.height));
      if ($autoSave) save();
    };
    if (isTouch) {
      const move = (e: TouchEvent) => moveImpl(e.touches[0].clientX, e.touches[0].clientY);
      const end = () => {
        endImpl();
        window.removeEventListener("touchmove", move);
        window.removeEventListener("touchend", end);
      };
      window.addEventListener("touchend", end);
      window.addEventListener("touchmove", move);
    } else {
      setCursor("default");
      const move = (e: MouseEvent) => moveImpl(e.clientX, e.clientY);
      const end = () => {
        endImpl();
        window.removeEventListener("mousemove", move);
        window.removeEventListener("mouseup", end);
        releaseCursor();
      };
      window.addEventListener("mouseup", end);
      window.addEventListener("mousemove", move);
    }
    popHistory();
    canvas.beginPath();
    canvas.fillRect(curX - lineWidth / 2, curY - lineWidth / 2, lineWidth, lineWidth);
    canvas.closePath();
  };

  const mouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    drawStart(e.clientX, e.clientY);
  };
  const touchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const touch = e.touches[0];
    drawStart(touch.clientX, touch.clientY, true);
  };

  const clearCanvas = (history?: boolean) => {
    if (cref.current == null) return;
    const canvas = get2DContext();
    popHistory();
    canvas.clearRect(0, 0, cref.current.width, cref.current.height);
    pushHistory(canvas.getImageData(0, 0, cref.current.width, cref.current.height));
    if (history) clearHistory();
    if ($autoSave) save();
  };

  const redo = () => {
    if (!canRedo) return;
    const r = Math.min(history.current.length - 1, revision + 1);
    setRevision(r);
    const canvas = get2DContext();
    canvas.putImageData(history.current[r], 0, 0);
    if ($autoSave) save();
    return true;
  };

  const undo = () => {
    if (!canUndo) return;
    const r = Math.max(0, revision - 1);
    setRevision(r);
    const canvas = get2DContext();
    canvas.putImageData(history.current[r], 0, 0);
    if ($autoSave) save();
    return true;
  };

  useEffect(() => {
    nullValue.current = cref.current.toDataURL();
    if (history.current.length > 0) return;
    clearHistory();
  }, []);

  useEffect(() => {
    if (isNotEmpty(ctx.valueRef.current)) {
      const canvas = get2DContext();
      const img = new Image();
      img.src = ctx.valueRef.current;
      img.onload = () => {
        canvas.drawImage(img, 0, 0);
      };
    } else {
      clearCanvas();
    }
    if (!("$value" in props)) {
      clearHistory();
    }
  }, [
    props.$value,
    // props.$bind,
    ctx.bind,
  ]);

  useEffect(() => {
    const imageData = history.current[revision];
    if (imageData) {
      const canvas = get2DContext();
      canvas.putImageData(imageData, 0, 0);
    }
  }, [ctx.editable]);

  useEffect(() => {
    if ($typeof === "file" && href.current) {
      const files = (Array.isArray(ctx.value) ? ctx.value : [ctx.value]).filter(file => file != null);
      const dt = new DataTransfer();
      files.forEach(file => dt.items.add(file));
      href.current.files = dt.files;
    }
  }, [ctx.value]);

  useEffect(() => {
    if ($focusWhenMounted) cref.current?.focus();
  }, []);

  if ($ref) {
    $ref.focus = () => cref.current?.focus();
    $ref.save = () => save();
    $ref.redo = () => redo();
    $ref.undo = () => undo();
    $ref.clearCanvas = (hist) => clearCanvas(hist);
  }

  return (
    <FormItemWrap
      {...props}
      ref={ref}
      $ctx={ctx}
      $preventFieldLayout
      $useHidden={$typeof !== "file"}
      $mainProps={{
        className: Style.main,
        "data-position": position,
      }}
    >
      <canvas
        ref={cref}
        className={Style.canvas}
        onMouseDown={mouseDown}
        onTouchStart={touchStart}
        width={$width || 500}
        height={$height || 200}
      />
      {ctx.editable && position !== "hide" &&
        <div
          className={Style.buttons}
        >
          {$autoSave !== true &&
            <Button
              onClick={() => {
                save();
              }}
            >
              <SaveIcon />
            </Button>
          }
          <Button
            disabled={!canUndo}
            onClick={() => {
              undo();
            }}
          >
            <UndoIcon />
          </Button>
          <Button
            disabled={!canRedo}
            onClick={() => {
              redo();
            }}
          >
            <RedoIcon />
          </Button>
          <Button
            disabled={!canClear}
            onClick={() => {
              clearCanvas();
            }}
          >
            <CrossIcon />
          </Button>
          <Button
            disabled={!canClearHist}
            onClick={() => {
              clearCanvas(true);
            }}
          >
            <ClearAllIcon />
          </Button>
        </div>
      }
      {props.name &&
        <input
          className={Style.file}
          ref={href}
          type="file"
          name={props.name}
        />
      }
    </FormItemWrap>
  );
}) as ElectronicSignatureFC;

const Button: FC<{
  disabled?: boolean;
  onClick: () => void;
  children?: ReactNode;
}> = ({ disabled, onClick, children }) => {
  return (
    <button
      className={Style.button}
      type="button"
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default ElectronicSignature;