import { useCallback, useEffect, useRef, useState, type FC, type ReactElement, type ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";
import useToggleAnimation from "../../hooks/toggle-animation";
import { appendedColorStyle, convertSizeNumToStr } from "../../utilities/attributes";
import { dialogDown, dialogUp } from "../../utilities/top-layer";
import Button, { type ButtonProps } from "../button";
import Text from "../text";
import Style from "./index.module.scss";

type ShowOptions = {
  preventEscape?: boolean;
};

type MessageBoxFCProps = ShowOptions & {
  onClose?: (params?: any) => void;
  showed: boolean;
  children?: ReactNode;
};

const MessageBox: FC<MessageBoxFCProps> = (props) => {
  const ref = useRef<HTMLDialogElement>(null!);
  const mref = useRef<HTMLDivElement>(null!);
  const [showed, setShowed] = useState(false);
  const [mount, setMount] = useState(false);

  const keydownMask1 = (e: React.KeyboardEvent) => {
    if (e.shiftKey && e.key === "Tab") e.preventDefault();
  };

  const keydownMask2 = (e: React.KeyboardEvent) => {
    if (!e.shiftKey && e.key === "Tab") e.preventDefault();
  };

  const style = useToggleAnimation({
    elementRef: ref,
    open: showed,
    animationDuration: 50,
    onToggle: (open) => {
      if (open) {
        ref.current?.showModal?.();
        // ref.current?.show();
        dialogUp();
        if (ref.current) {
          ref.current.style.top = convertSizeNumToStr((window.innerHeight - ref.current.offsetHeight) / 2)!;
          ref.current.style.left = convertSizeNumToStr((window.innerWidth - ref.current.offsetWidth) / 2)!;
        }
        if (mref.current) {
          mref.current.style.removeProperty("display");
        }
      } else {
        dialogDown();
      }
    },
    onToggling: (ctx) => {
      if (mref.current) {
        mref.current.style.opacity = String(ctx.opacity);
      }
    },
    onToggled: (open) => {
      if (open) {
        if (mref.current) {
          mref.current.style.opacity = "1";
        }
        if (ref.current) {
          ref.current.querySelector("button")?.focus();
        }
      } else {
        setMount(false);
        ref.current?.close?.();
        if (mref.current) {
          mref.current.style.display = "none";
          mref.current.style.opacity = "0";
        }
      }
    },
  }, []);

  useEffect(() => {
    const show = props.showed === true;
    if (show) setMount(true);
    setShowed(props.showed);
  }, [props.showed]);

  useEffect(() => {
    return () => {
      ref.current?.close?.();
    };
  }, []);

  return (
    <dialog
      ref={ref}
      className={Style.wrap}
      style={style}
      onCancel={e => {
        e.preventDefault();
        if (props.preventEscape) return;
        props.onClose?.(false);
      }}
    >
      <div
        ref={mref}
        className={Style.mask1}
        tabIndex={0}
        onKeyDown={keydownMask1}
        style={{ opacity: "0" }}
      />
      <div className={Style.main}>
        {mount && props.children}
      </div>
      {showed &&
        <div
          className={Style.mask2}
          tabIndex={0}
          onKeyDown={keydownMask2}
        />
      }
    </dialog>
  );
};

interface MessageBoxContentComponent<T = void> {
  (props: {
    close: (params?: T | undefined) => void;
  }): ReactElement;
}

type MessageBoxProps = {
  header?: ReactNode;
  body: ReactNode;
  color?: Color;
};

type MessageBoxButtonProps = Omit<ButtonProps, "onClick">;

type AlertProps = MessageBoxProps & {
  buttonProps?: MessageBoxButtonProps;
};

type ConfirmProps = MessageBoxProps & {
  positiveButtonText?: string;
  positiveButtonProps?: MessageBoxButtonProps;
  negativeButtonProps?: MessageBoxButtonProps;
};

const convertToProps = (message: string | MessageBoxProps, initProps: Partial<MessageBoxProps>) => {
  const props = (() => {
    if (typeof message === "string") {
      return {
        ...initProps,
        body: message,
      };
    }
    return {
      ...initProps,
      ...message
    };
  })();
  if (typeof props.body === "string") {
    props.body = props.body
      .split(/\r\n|\r|\n/g)
      .map((text, index) => <span key={index}>{text}</span>);
  }
  return props;
};

const MessageBoxContent: FC<MessageBoxProps & {
  children: ReactNode;
}> = (props) => {
  return (
    <>
      {props.header != null &&
        <div
          className={Style.header}
          style={appendedColorStyle({ $color: props.color })}
        >
          <Text>
            {props.header}
          </Text>
        </div>
      }
      <div className={Style.body}>
        <div className={Style.content}>
          {props.body}
        </div>
      </div>
      <div className={Style.footer}>
        {props.children}
      </div>
    </>
  );
};

const getAlertComponent = (props: AlertProps): MessageBoxContentComponent<boolean> => {
  const color = props.color;
  const btnProps: ButtonProps = {
    children: "OK",
    $outline: true,
    $color: color,
    ...props.buttonProps
  };

  return ({ close }) => (
    <MessageBoxContent
      {...props}
      color={color}
    >
      <Button
        {...btnProps}
        onClick={() => {
          close(true);
        }}
      />
    </MessageBoxContent>
  );
};

const getConfirmComponent = (props: ConfirmProps): MessageBoxContentComponent<boolean> => {
  const color = props.color;
  const positiveBtnProps: ButtonProps = {
    children: props.positiveButtonText || "OK",
    $color: color,
    ...props.positiveButtonProps,
  };
  const negativeBtnProps: ButtonProps = {
    children: "キャンセル",
    $outline: true,
    $color: color,
    ...props.negativeButtonProps,
  };

  return ({ close }) => (
    <MessageBoxContent
      {...props}
      color={color}
    >
      <Button
        {...negativeBtnProps}
        onClick={() => {
          close(false);
        }}
      />
      <Button
        {...positiveBtnProps}
        onClick={() => {
          close(true);
        }}
      />
    </MessageBoxContent>
  );
};

const useMessageBox = (options?: { preventUnmountClose?: boolean; }) => {
  const elemRef = useRef<HTMLDivElement>();
  const root = useRef<Root>();
  const showed = useRef(false);
  const preventUnmountClose = options?.preventUnmountClose === true;

  const unmount = useCallback(() => {
    showed.current = false;
    setTimeout(() => {
      if (root.current) {
        const internalRootKey = Object.keys(root.current).find(key => key.startsWith("_"));
        if (internalRootKey == null || (root.current as any)[internalRootKey] != null) {
          root.current.unmount();
        }
        root.current = undefined;
      }
      if (elemRef.current) {
        if (document.body.contains(elemRef.current)) {
          document.body.removeChild(elemRef.current);
          elemRef.current = undefined;
        }
      }
    });
  }, []);

  const show = useCallback(async <T = void>(Component: MessageBoxContentComponent<T>, showOptions?: ShowOptions) => {
    if (typeof window === "undefined") return new Promise<void>(resolve => resolve());
    if (elemRef.current == null) {
      elemRef.current = document.createElement("div");
      document.body.appendChild(elemRef.current);
    }
    if (root.current == null) {
      root.current = createRoot(elemRef.current);
    }
    showed.current = true;
    return new Promise<T>(resolve => {
      const close = (params: any) => {
        root.current?.render(<MessageBoxComponent showed={false} />);
        if (!showed.current) unmount();
        showed.current = false;
        resolve(params as T);
      };
      const MessageBoxComponent: FC<{ showed: boolean; }> = (props) => (
        <MessageBox
          {...showOptions}
          showed={props.showed}
          onClose={close}
        >
          <Component close={close} />
        </MessageBox>
      );
      root.current?.render(<MessageBoxComponent showed={true} />);
    });
  }, []);

  useEffect(() => {
    return () => {
      if (showed.current && preventUnmountClose) {
        showed.current = false;
        return;
      }
      unmount();
    };
  }, []);

  return {
    show,
    alert: (message: string | AlertProps, showOptions?: ShowOptions) => {
      const props = convertToProps(message, { color: "main-light" });
      return show(getAlertComponent(props), showOptions);
    },
    confirm: (message: string | ConfirmProps, showOptions?: ShowOptions) => {
      const props = convertToProps(message, { color: "main" });
      return show(getConfirmComponent(props), showOptions);
    }
  };
};

export default useMessageBox;