import { convertDataItemValidationToFormItemValidation, FormItemProps, FormItemValidation, FormItemWrap, formValidationMessages, useForm } from "@/components/elements/form";
import React, { FC, FunctionComponent, ReactElement, ReactNode, useEffect, useRef, useState } from "react";
import Style from "$/components/elements/form-items/electronic-signature.module.scss";
import { releaseCursor, setCursor } from "@/components/utilities/attributes";
import { VscClearAll, VscClose, VscDiscard, VscRedo, VscSave } from "react-icons/vsc";
import StringUtils from "@bizhermit/basic-utils/dist/string-utils";

export type ElectronicSignatureProps<D extends DataItem_String | DataItem_File | undefined = undefined> = FormItemProps<string, null, D> & {
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
  <D extends DataItem_String | DataItem_File | undefined = undefined>(attrs: ElectronicSignatureProps<D>, ref?: React.ForwardedRef<HTMLDivElement>): ReactElement<any> | null;
}

const ElectronicSignature: ElectronicSignatureFC = React.forwardRef<HTMLDivElement, ElectronicSignatureProps>(<
  D extends DataItem_String | DataItem_File | undefined = undefined
>(p: ElectronicSignatureProps<D>, ref: React.ForwardedRef<HTMLDivElement>) => {
  const cref = useRef<HTMLCanvasElement>(null!);
  const [revision, setRevision] = useState(-1);
  const history = useRef<Array<ImageData>>([]);
  const nullValue = useRef("");

  const form = useForm({
    $messagePosition: "bottom-hide",
    ...p,
  } as ElectronicSignatureProps<D>, {
    setDataItem: (d) => {
      switch (d.type) {
        case "file":
          return {
            $validations: d.validations?.map(f => convertDataItemValidationToFormItemValidation(f, p, d, v => v)),
          };
        default:
          return {
            $validations: d.validations?.map(f => convertDataItemValidationToFormItemValidation(f, p, d, v => v)),
          };
      }
    },
    preventRequiredValidation: () => true,
    validations: (props) => {
      const validations: Array<FormItemValidation<Nullable<string>>> = [];
      if (props.$required) {
        validations.push(v => {
          if (v == null || v === "" || v === nullValue.current) {
            return formValidationMessages.required;
          }
          return "";
        });
      }
      return validations;
    },
  });

  const position = form.props.$buttonsPosition || "right";
  const canClear = StringUtils.isNotEmpty(form.value) && form.value !== nullValue.current;
  const canRedo = revision >= 0 && revision < history.current.length - 1;
  const canUndo = revision > 0;
  const canClearHist = history.current.length > 1;

  const save = () => {
    if (cref.current == null) return;
    form.change(cref.current.toDataURL());
  };

  const spillHistory = () => {
    if (history.current.length > Math.max(0, form.props.$maxHistory ?? 100)) {
      history.current.splice(0, 1);
    }
  };

  const clearHistory = () => {
    history.current.splice(0, history.current.length);
    const ctx = getContext();
    history.current.push(ctx.getImageData(0, 0, cref.current.width, cref.current.height));
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

  const getContext = () => {
    return cref.current.getContext("2d", { willReadFrequently: true })!;
  };

  const drawStart = (baseX: number, baseY: number, isTouch?: boolean) => {
    if (!form.editable || cref.current == null) return;
    const ctx = getContext();
    const lineWidth = Math.max(1, form.props.$lineWidth || 2);
    const lineColor = form.props.$lineColor || "black";
    ctx.strokeStyle = lineColor;
    ctx.fillStyle = lineColor;
    ctx.lineWidth = lineWidth;
    const rect = cref.current.getBoundingClientRect();
    const posX = rect.left, posY = rect.top;
    let lastX = 0, lastY = 0, curX = baseX - posX, curY = baseY - posY;
    const moveImpl = (x: number, y: number) => {
      lastX = curX;
      lastY = curY;
      curX = x - posX;
      curY = y - posY;
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(curX, curY);
      ctx.lineWidth = lineWidth;
      ctx.stroke();
      ctx.closePath();
    };
    const endImpl = () => {
      ctx.stroke();
      ctx.closePath();
      pushHistory(ctx.getImageData(0, 0, cref.current.width, cref.current.height));
      if (form.props.$autoSave) save();
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
    ctx.beginPath();
    ctx.fillRect(curX - lineWidth / 2, curY - lineWidth / 2, lineWidth, lineWidth);
    ctx.closePath();
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
    const ctx = getContext();
    popHistory();
    ctx.clearRect(0, 0, cref.current.width, cref.current.height);
    pushHistory(ctx.getImageData(0, 0, cref.current.width, cref.current.height));
    if (history) clearHistory();
    if (form.props.$autoSave) save();
  };

  const redo = () => {
    if (!canRedo) return;
    const r = Math.min(history.current.length - 1, revision + 1);
    setRevision(r);
    const ctx = getContext();
    ctx.putImageData(history.current[r], 0, 0);
    if (form.props.$autoSave) save();
    return true;
  };

  const undo = () => {
    if (!canUndo) return;
    const r = Math.max(0, revision - 1);
    setRevision(r);
    const ctx = getContext();
    ctx.putImageData(history.current[r], 0, 0);
    if (form.props.$autoSave) save();
    return true;
  };

  useEffect(() => {
    nullValue.current = cref.current.toDataURL();
    if (history.current.length > 0) return;
    clearHistory();
  }, []);

  useEffect(() => {
    if (StringUtils.isNotEmpty(form.valueRef.current)) {
      const ctx = getContext();
      const img = new Image();
      img.src = form.valueRef.current;
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
      };
    } else {
      clearCanvas();
    }
    if (!("$value" in form.props)) {
      clearHistory();
    }
  }, [form.props.$value, form.props.$bind, form.bind]);

  useEffect(() => {
    const imageData = history.current[revision];
    if (imageData) {
      const ctx = getContext();
      ctx.putImageData(imageData, 0, 0);
    }
  }, [form.editable]);

  return (
    <FormItemWrap
      ref={ref}
      $$form={form}
      $preventFieldLayout
      $useHidden
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
        width={form.props.$width || 500}
        height={form.props.$height || 200}
      />
      {form.editable && position !== "hide" &&
        <div
          className={Style.buttons}
        >
          {form.props.$autoSave !== true &&
            <Button
              onClick={() => {
                save();
              }}
            >
              <VscSave />
            </Button>
          }
          <Button
            disabled={!canUndo}
            onClick={() => {
              undo();
            }}
          >
            <VscDiscard />
          </Button>
          <Button
            disabled={!canRedo}
            onClick={() => {
              redo();
            }}
          >
            <VscRedo />
          </Button>
          <Button
            disabled={!canClear}
            onClick={() => {
              clearCanvas();
            }}
          >
            <VscClose />
          </Button>
          <Button
            disabled={!canClearHist}
            onClick={() => {
              clearCanvas(true);
            }}
          >
            <VscClearAll />
          </Button>
        </div>
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