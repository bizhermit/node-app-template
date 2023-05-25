import { convertDataItemValidationToFormItemValidation, type FormItemProps, type FormItemValidation, FormItemWrap, useDataItemMergedProps, useForm, useFormItemContext } from "#/components/elements/form";
import { type FC, type ForwardedRef, forwardRef, type FunctionComponent, type ReactElement, type ReactNode, useEffect, useRef, useState } from "react";
import Style from "$/components/elements/form-items/electronic-signature.module.scss";
import { releaseCursor, setCursor } from "#/components/utilities/attributes";
import StringUtils from "@bizhermit/basic-utils/dist/string-utils";
import { ClearAllIcon, CrossIcon, RedoIcon, SaveIcon, UndoIcon } from "#/components/elements/icon";

export type ElectronicSignatureProps<
  D extends DataItem_String | DataItem_File | undefined = undefined
> = FormItemProps<string, D, string> & {
  $typeof?: FileValueType;
  $width?: number | string;
  $height?: number | string;
  $lineWidth?: number;
  $lineColor?: string | CanvasGradient | CanvasPattern;
  $backgroundColor?: string | CanvasGradient | CanvasPattern;
  $maxHistory?: number;
  $autoSave?: boolean;
  $buttonsPosition?: "hide" | "right" | "bottom" | "top" | "left";
};

interface ElectronicSignatureFC extends FunctionComponent {
  <D extends DataItem_String | DataItem_File | undefined = undefined>(attrs: ElectronicSignatureProps<D>, ref?: ForwardedRef<HTMLDivElement>): ReactElement<any> | null;
}

const ElectronicSignature: ElectronicSignatureFC = forwardRef<HTMLDivElement, ElectronicSignatureProps>(<
  D extends DataItem_String | DataItem_File | undefined = undefined
>(p: ElectronicSignatureProps<D>, ref: ForwardedRef<HTMLDivElement>) => {
  const form = useForm();
  const props = useDataItemMergedProps(form, p, {
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

  const ctx = useFormItemContext(form, props, {
    multipartFormData: props.$typeof === "file",
    preventRequiredValidation: true,
    validations: (getMessage) => {
      const validations: Array<FormItemValidation<Nullable<string>>> = [];
      if (props.$required) {
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

  const position = props.$buttonsPosition || "right";
  const canClear = StringUtils.isNotEmpty(ctx.value) && ctx.value !== nullValue.current;
  const canRedo = revision >= 0 && revision < history.current.length - 1;
  const canUndo = revision > 0;
  const canClearHist = history.current.length > 1;

  const get2DContext = () => {
    return cref.current.getContext("2d", { willReadFrequently: true })!;
  };

  const save = () => {
    if (cref.current == null) return;
    if (props.$typeof === "file") {
      // TODO: convert to png
      // ctx.change(cref.current.toDataURL());
      return;
    }
    ctx.change(cref.current.toDataURL());
  };

  const spillHistory = () => {
    if (history.current.length > Math.max(0, props.$maxHistory ?? 100)) {
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
    const lineWidth = Math.max(1, props.$lineWidth || 2);
    const lineColor = props.$lineColor || "black";
    canvas.strokeStyle = lineColor;
    canvas.fillStyle = lineColor;
    canvas.lineWidth = lineWidth;
    const rect = cref.current.getBoundingClientRect();
    const posX = rect.left, posY = rect.top;
    let lastX = 0, lastY = 0, curX = baseX - posX, curY = baseY - posY;
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
      canvas.stroke();
      canvas.closePath();
      pushHistory(canvas.getImageData(0, 0, cref.current.width, cref.current.height));
      if (props.$autoSave) save();
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
    if (props.$autoSave) save();
  };

  const redo = () => {
    if (!canRedo) return;
    const r = Math.min(history.current.length - 1, revision + 1);
    setRevision(r);
    const canvas = get2DContext();
    canvas.putImageData(history.current[r], 0, 0);
    if (props.$autoSave) save();
    return true;
  };

  const undo = () => {
    if (!canUndo) return;
    const r = Math.max(0, revision - 1);
    setRevision(r);
    const canvas = get2DContext();
    canvas.putImageData(history.current[r], 0, 0);
    if (props.$autoSave) save();
    return true;
  };

  useEffect(() => {
    nullValue.current = cref.current.toDataURL();
    if (history.current.length > 0) return;
    clearHistory();
  }, []);

  useEffect(() => {
    if (StringUtils.isNotEmpty(ctx.valueRef.current)) {
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
  }, [props.$value, props.$bind, ctx.bind]);

  useEffect(() => {
    const imageData = history.current[revision];
    if (imageData) {
      const canvas = get2DContext();
      canvas.putImageData(imageData, 0, 0);
    }
  }, [ctx.editable]);

  useEffect(() => {
    if (props.$typeof === "file" && href.current) {
      const files = (Array.isArray(ctx.value) ? ctx.value : [ctx.value]).filter(file => file != null);
      const dt = new DataTransfer();
      files.forEach(file => dt.items.add(file));
      href.current.files = dt.files;
    }
  }, [ctx.value]);

  return (
    <FormItemWrap
      {...props}
      ref={ref}
      $context={ctx}
      $preventFieldLayout
      $useHidden={props.$typeof !== "file"}
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
        width={props.$width || 500}
        height={props.$height || 200}
      />
      {ctx.editable && position !== "hide" &&
        <div
          className={Style.buttons}
        >
          {props.$autoSave !== true &&
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
});

const Button: FC<{
  disabled?: boolean;
  onClick: VoidFunc;
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