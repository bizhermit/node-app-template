import Button, { ButtonProps } from "@/components/elements/button";
import { FC, ReactElement, ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { createRoot, Root } from "react-dom/client";
import Style from "$/hooks/message-box.module.scss";
import useToggleAnimation from "@/hooks/toggle-animation";
import { convertSizeNumToStr, joinClassNames } from "@/components/utilities/attributes";

const MessageBox: FC<{
  showed: boolean;
  children?: ReactNode;
}> = (props) => {
  const ref = useRef<HTMLDivElement>(null!);
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
        if (ref.current) {
          ref.current.style.top = convertSizeNumToStr((document.body.clientHeight - ref.current.offsetHeight) / 2)!;
          ref.current.style.left = convertSizeNumToStr((document.body.clientWidth - ref.current.offsetWidth) / 2)!;
        }
        if (mref.current) {
          mref.current.style.removeProperty("display");
        }
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

  return (
    <>
      <div
        ref={mref}
        className={Style.mask1}
        tabIndex={0}
        onKeyDown={keydownMask1}
        style={{ opacity: "0" }}
      />
      <div
        ref={ref}
        className={Style.main}
        style={style}
      >
        {mount && props.children}
      </div>
      <div
        className={Style.mask2}
        tabIndex={0}
        onKeyDown={keydownMask2}
      />
    </>
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

type MessageBoxButtonProps = Omit<ButtonProps, "$onClick">;

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

const getAlertComponent = (props: AlertProps): MessageBoxContentComponent => {
  const color = props.color;
  const btnProps: ButtonProps = {
    children: "OK",
    $outline: true,
    $color: color,
    ...props.buttonProps
  };

  return ({ close }) => (
    <>
      {props.header != null &&
        <div className={joinClassNames(Style.header, color ? `c-${color}` : "")}>
          {props.header}
        </div>
      }
      <div className={Style.body}>
        <div className={Style.content}>
          {props.body}
        </div>
      </div>
      <div className={Style.footer}>
        <Button
          {...btnProps}
          $onClick={() => {
            close();
          }}
        />
      </div>
    </>
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
    <>
      {props.header != null &&
        <div className={joinClassNames(Style.header, color ? `c-${color}` : "")}>
          {props.header}
        </div>
      }
      <div className={Style.body}>
        <div className={Style.content}>
          {props.body}
        </div>
      </div>
      <div className={Style.footer}>
        <Button
          {...negativeBtnProps}
          $onClick={() => {
            close(false);
          }}
        />
        <Button
          {...positiveBtnProps}
          $onClick={() => {
            close(true);
          }}
        />
      </div>
    </>
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
        root.current?.unmount();
      }
      if (elemRef.current) {
        if (document.body.contains(elemRef.current)) {
          document.body.removeChild(elemRef.current);
        }
      }
    });
  }, []);

  const show = useCallback(async <T = void>(Component: MessageBoxContentComponent<T>) => {
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
      const MessageBoxComponent: FC<{ showed: boolean; }> = (props) => (
        <MessageBox showed={props.showed}>
          <Component close={(params: any) => {
            root.current?.render(<MessageBoxComponent showed={false} />);
            if (!showed.current) unmount();
            showed.current = false;
            resolve(params as T);
          }} />
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
    alert: (message: string | AlertProps) => {
      const props = convertToProps(message, { color: "main-light" });
      return show(getAlertComponent(props));
    },
    confirm: (message: string | ConfirmProps) => {
      const props = convertToProps(message, { color: "main" });
      return show(getConfirmComponent(props));
    }
  };
};

export default useMessageBox;