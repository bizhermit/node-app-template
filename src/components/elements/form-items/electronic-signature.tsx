import { FormItemProps, FormItemWrap, useForm } from "@/components/elements/form";
import React, { FC, ReactNode, useEffect, useRef } from "react";
import Style from "$/components/elements/form-items/electronic-signature.module.scss";
import { convertSizeNumToStr, releaseCursor, setCursor } from "@/utilities/attributes";

export type ElectronicSignatureProps = FormItemProps<string> & {
  $width?: number | string;
  $height?: number | string;
  $lineWidth?: number;
  $lineColor?: string | CanvasGradient | CanvasPattern;
  $backgroundColor?: string | CanvasGradient | CanvasPattern;
  $maxHistory?: number;
  $autoSave?: boolean;
};

const ElectronicSignature = React.forwardRef<HTMLDivElement, ElectronicSignatureProps>((props, ref) => {
  const cref = useRef<HTMLCanvasElement>(null!);
  const revision = useRef<number>(-1);
  const history = useRef<Array<ImageData>>([]);

  const form = useForm(props);

  const saveImpl = () => {
    if (cref.current == null) return;
    form.change(cref.current.toDataURL());
  };

  const clearHistory = () => {
    history.current.splice(0, history.current.length);
    const ctx = cref.current.getContext("2d")!;
    history.current.push(ctx.getImageData(0, 0, cref.current.width, cref.current.height));
    spillHistory();
    revision.current = history.current.length - 1;
  };

  const popHistory = () => {
    const popLen = history.current.length - 1 - revision.current;
    if (popLen > 0) {
      history.current.splice(revision.current + 1, popLen);
    }
  };

  const spillHistory = () => {
    const maxLen = Math.max(0, props.$maxHistory ?? 100);
    if (history.current.length > maxLen) history.current.splice(0, 1);
  };

  const pushHistory = (imageData: ImageData) => {
    history.current.push(imageData);
    spillHistory();
    revision.current = history.current.length - 1;
  };

  const drawStart = (baseX: number, baseY: number, isTouch?: boolean) => {
    if (!form.editable || cref.current == null) return;
    const ctx = cref.current.getContext("2d")!;
    const lineWidth = Math.max(1, props.$lineWidth || 2);
    const lineColor = props.$lineColor || "black";
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
      if (props.$autoSave) saveImpl();
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

  const clearImpl = (history?: boolean) => {
    if (cref.current == null) return;
    const ctx = cref.current.getContext("2d")!;
    popHistory();
    ctx.clearRect(0, 0, cref.current.width, cref.current.height);
    pushHistory(ctx.getImageData(0, 0, cref.current.width, cref.current.height));
    if (history) clearHistory();
    if (props.$autoSave) saveImpl();
  };

  const redoImpl = () => {
    if (revision.current >= history.current.length - 1) return false;
    revision.current = Math.min(history.current.length - 1, revision.current + 1);
    const ctx = cref.current.getContext("2d")!;
    ctx.putImageData(history.current[revision.current], 0, 0);
    if (props.$autoSave) saveImpl();
    return true;
  };

  const undoImpl = () => {
    if (revision.current <= 0) return false;
    revision.current = Math.max(0, revision.current - 1);
    const ctx = cref.current.getContext("2d")!;
    ctx.putImageData(history.current[revision.current], 0, 0);
    if (props.$autoSave) saveImpl();
    return true;
  };

  useEffect(() => {
    if (history.current.length > 0) return;
    clearHistory();
  }, []);

  return (
    <FormItemWrap
      {...props}
      ref={ref}
      $$form={form}
      $preventFieldLayout
      $mainProps={{
        className: Style.main,
      }}
    >
      <canvas
        ref={cref}
        className={Style.canvas}
        onMouseDown={mouseDown}
        onTouchStart={touchStart}
        width={props.$width || 400}
        height={props.$height || 200}
      />
      {form.editable &&
        <div
          className={Style.buttons}
        >
          <Button
            onClick={() => {
              saveImpl();
            }}
          >
            save
          </Button>
          <Button
            onClick={() => {
              undoImpl();
            }}
          >
            undo
          </Button>
          <Button
            onClick={() => {
              redoImpl();
            }}
          >
            redo
          </Button>
          <Button
            onClick={() => {
              clearImpl();
            }}
          >
            clear
          </Button>
          <Button
            onClick={() => {
              clearImpl(true)
            }}
          >
            clear(histry)
          </Button>
        </div>
      }
    </FormItemWrap>
  );
});

const Button: FC<{
  onClick: VoidFunc;
  children?: ReactNode;
}> = ({ onClick, children }) => {
  return (
    <button
      className={Style.button}
      type="button"
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default ElectronicSignature;