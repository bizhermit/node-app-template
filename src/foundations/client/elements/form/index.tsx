"use client";

import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useReducer, useRef, useState, type FormHTMLAttributes, type ForwardedRef, type FunctionComponent, type ReactElement } from "react";
import clone from "../../../objects/clone";
import { getValue } from "../../../objects/struct/get";
import { setValue } from "../../../objects/struct/set";
import joinCn from "../../utilities/join-class-name";
import { FormContext, type UseFormItemContextOptions } from "./context";
import Style from "./index.module.scss";
import { isErrorObject } from "./utilities";

type FormDataStruct = { [v: string | number | symbol]: any };
type ErrorStruct = { [v: string]: string };

type FormRef = {
  getValue: <T>(name: string) => T;
  setValue: (name: string, value: any, absolute?: boolean) => void;
  render: (name?: string) => void;
  validation: () => string | null | undefined;
  submit: () => void;
  reset: () => void;
};

export const useFormRef = () => {
  const ref = useRef<FormRef>({
    getValue: () => undefined as any,
    setValue: () => { },
    render: () => { },
    validation: () => undefined,
    submit: () => undefined,
    reset: () => { },
  });
  return ref.current;
};

type SubmitCtxProps = {
  method: string;
  keepLock: () => () => void;
};

type PlainFormOptins = {
  $type: "formData";
  $appendNotMountedValue?: undefined;
  onSubmit?: ((data: FormData, ctx: SubmitCtxProps, e: React.FormEvent<HTMLFormElement>) => (void | boolean | Promise<void>)) | boolean;
};

type StructFormOptions<T extends FormDataStruct = FormDataStruct> = {
  $type?: "struct" | null | undefined;
  $appendNotMountedValue?: boolean;
  onSubmit?: ((data: T, ctx: SubmitCtxProps, e: React.FormEvent<HTMLFormElement>) => (void | boolean | Promise<void>)) | boolean;
};

type FormOptions<T extends FormDataStruct = FormDataStruct> = {
  $formRef?: ReturnType<typeof useFormRef>;
  $bind?: boolean | FormDataStruct | null | undefined;
  $disabled?: boolean;
  $readOnly?: boolean;
  $messageDisplayMode?: F.MessagePosition;
  $messageWrap?: boolean;
  $preventEnterSubmit?: boolean;
  $layout?: "flex" | "grid";
  encType?: "application/x-www-form-urlencoded" | "multipart/form-data" | "text/plain";
  onReset?: ((e: React.FormEvent<HTMLFormElement>) => (boolean | void | Promise<void>)) | boolean;
  // $onError?: (error: ErrorStruct) => void;
} & (PlainFormOptins | StructFormOptions<T>);

export type FormProps<T extends FormDataStruct = FormDataStruct>
  = OverwriteAttrs<FormHTMLAttributes<HTMLFormElement>, FormOptions<T>>;

interface FormFC extends FunctionComponent<FormProps> {
  <T extends FormDataStruct = FormDataStruct>(
    attrs: ComponentAttrsWithRef<HTMLFormElement, FormProps<T>>
  ): ReactElement<any> | null;
}

const Form = forwardRef<HTMLFormElement, FormProps>(<T extends FormDataStruct = FormDataStruct>({
  className,
  $type,
  $formRef,
  $bind,
  $disabled,
  $readOnly,
  $messageDisplayMode,
  $messageWrap,
  $preventEnterSubmit,
  $layout,
  $appendNotMountedValue,
  onSubmit,
  onReset,
  // $onError,
  ...props
}: FormProps<T>, $ref: ForwardedRef<HTMLFormElement>) => {
  const ref = useRef<HTMLFormElement>(null!);
  useImperativeHandle($ref, () => ref.current);
  const method = props.method ?? "get";

  const bind = useMemo(() => {
    if ($bind === false) return undefined;
    if ($bind == null || $bind === true) return {};
    return $bind;
  }, [$bind]);

  const disabledRef = useRef(true);
  const [disabled, setDisabled] = useReducer((_: boolean, action: boolean) => {
    return disabledRef.current = action;
  }, disabledRef.current);
  const submittingRef = useRef(false);
  const [submitting, setSubmitting] = useReducer((_: boolean, action: boolean) => {
    return submittingRef.current = action;
  }, submittingRef.current);

  const items = useRef<{ [v: string]: F.ItemMountProps & { props: F.ItemProps; options: UseFormItemContextOptions; } }>({});
  const [errors, setErrors] = useState<ErrorStruct>({});
  const [exErrors, setExErrors] = useState<ErrorStruct>({});

  const mount = (
    id: string,
    itemProps: F.ItemProps,
    mountItemProps: F.ItemMountProps,
    options: UseFormItemContextOptions
  ) => {
    items.current[id] = { ...mountItemProps, props: itemProps, options, };
    return id;
  };

  const unmount = (id: string) => {
    delete items.current[id];
    setErrors(cur => {
      if (!(id in cur)) return cur;
      const ret = { ...cur };
      delete ret[id];
      return ret;
    });
    setExErrors(cur => {
      if (!(id in cur)) return cur;
      const ret = { ...cur };
      delete ret[id];
      return ret;
    });
  };

  const hasError = useMemo(() => {
    return Object.keys(errors).find(k => isErrorObject(errors[k])) != null
      || Object.keys(exErrors).find(k => isErrorObject(exErrors[k])) != null;
  }, [errors, exErrors]);

  const validation = (returnId?: string) => {
    let errMsg: string | null | undefined;
    Object.keys(items.current).forEach(id => {
      const ret = items.current[id]?.validation();
      if (returnId === id) errMsg = ret;
    });
    return errMsg;
  };

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.stopPropagation();
    if ($disabled || disabledRef.current || submittingRef.current || hasError) {
      e.preventDefault();
      return;
    }
    setSubmitting(true);
    if (props.encType) {
      e.currentTarget.enctype = props.encType;
    } else {
      const hasMultipartFormData = (() => {
        if (props.encType) return false;
        const item = Object.keys(items.current).find(id => {
          return items.current[id].options?.multipartFormData === true;
        });
        return item != null;
      })();
      if (hasMultipartFormData) {
        e.currentTarget.enctype = "multipart/form-data";
      } else {
        e.currentTarget.removeAttribute("enctype");
      }
    }
    if (onSubmit === false) {
      e.preventDefault();
      setSubmitting(false);
      return;
    }
    if (onSubmit == null || onSubmit === true) return;
    let keepLock = false;
    const ret = onSubmit(
      (() => {
        if ($type === "formData") return new FormData(e.currentTarget);
        if ($appendNotMountedValue) return clone(bind);
        const ret = {};
        Object.keys(items.current).forEach(k => {
          const n = items.current[k].props.name;
          if (!n) return;
          setValue(ret, n, getValue(bind, n));
        });
        return ret;
      })() as FormData & T,
      {
        method: ((e.nativeEvent as any).submitter as HTMLButtonElement)?.getAttribute("formmethod") || method,
        keepLock: () => {
          keepLock = true;
          return () => setSubmitting(false);
        }
      },
      e
    );
    if (ret == null || ret === false) {
      e.preventDefault();
      if (!keepLock) setSubmitting(false);
      return;
    }
    if (ret === true) return;
    e.preventDefault();
    if ("finally" in ret) {
      ret.finally(() => {
        if (!keepLock) setSubmitting(false);
      });
    }
  };

  const resetItems = (callback?: () => void) => {
    setTimeout(() => {
      Object.keys(items.current).forEach(id => {
        const item = items.current[id];
        if (item.props.$preventFormBind) return;
        item.change(
          item.options?.receive ?
            item.options.receive(item.props.$defaultValue) :
            item.props.$defaultValue,
          false
        );
      });
      callback?.();
    }, 0);
  };

  const reset = (e: React.FormEvent<HTMLFormElement>) => {
    e.stopPropagation();
    if ($disabled || disabledRef.current || $readOnly || submittingRef.current) {
      e.preventDefault();
      return;
    }
    setDisabled(true);
    e.preventDefault();
    if (onReset == null || onReset === true) {
      resetItems(() => setDisabled(false));
      return;
    }
    if (onReset === false) {
      setDisabled(false);
      return;
    }
    const ret = onReset(e);
    if (ret == null || ret === true) {
      resetItems(() => setDisabled(false));
      return;
    }
    if (ret === false) {
      setDisabled(false);
      return;
    }
    if ("finally" in ret) {
      ret.finally(() => setDisabled(false));
    }
  };

  const get = (name: string) => {
    return bind == null ? undefined : getValue(bind, name);
  };

  const set = (name: string, v: any) => {
    if (bind == null) return;
    let isSet = false;
    Object.keys(items.current).forEach(id => {
      const item = items.current[id];
      if (item.props.name !== name) return;
      item.change(item.options.receive ? item.options.receive(v) : v, false);
      isSet = true;
    });
    if (!isSet) setValue(bind, name, v);
  };

  const render = (name?: string) => {
    if (name) {
      Object.keys(items.current).forEach(id => {
        if (items.current[id].props.name !== name) return;
        const item = items.current[id];
        if (item == null || item.props.name == null) return;
        item.options?.effect?.(getValue(bind, item.props.name));
      });
      return;
    }
    Object.keys(items.current).forEach(id => {
      const item = items.current[id];
      if (item.props.name == null) return;
      item.options?.effect?.(getValue(bind, item.props.name));
    });
  };

  const effectSameNameItem = (id: string, value: any) => {
    const name = items.current[id].props.name;
    if (!name) return;
    Object.keys(items.current).forEach(key => {
      if (key === id) return;
      const item = items.current[key];
      if (item.props.name !== name) return;
      item.options.effect?.(value);
    });
  };

  const getErrorMessages = (name?: string) => {
    if (name) {
      const id = Object.keys(items.current).find(id => items.current[id].props.name === name);
      if (id == null) return [];
      if (id in errors) return [errors[id]];
      return [];
    }
    return Object.keys(items.current).map(id => errors[id]).filter(err => err);
  };

  // useEffect(() => {
  //   if ($onError) {
  //     const ret: ErrorStruct = {};
  //     Object.keys(errors).forEach(id => {
  //       const e = errors[id];
  //       if (isErrorObject(e)) ret[id] = e;
  //     });
  //     Object.keys(exErrors).forEach(id => {
  //       const e = exErrors[id];
  //       if (isErrorObject(e)) ret[id] = e;
  //     });
  //     $onError(ret);
  //   }
  // }, [errors, exErrors]);

  useEffect(() => {
    setDisabled(false);
  }, []);

  if ($formRef) {
    $formRef.getValue = get;
    $formRef.setValue = set;
    $formRef.render = render;
    $formRef.validation = validation;
    $formRef.reset = () => ref.current?.reset?.();
    $formRef.submit = () => ref.current?.submit?.();
  }

  return (
    <FormContext.Provider value={{
      bind,
      disabled: $disabled || disabled || submitting,
      readOnly: !!$readOnly,
      submitting,
      method,
      errors,
      setErrors,
      exErrors,
      setExErrors,
      hasError,
      mount,
      unmount,
      validation,
      messagePosition: $messageDisplayMode ?? "bottom-hide",
      messageWrap: $messageWrap,
      getValue: get,
      setValue: set,
      render,
      effectSameNameItem,
      getErrorMessages,
    }}>
      <form
        {...props}
        className={joinCn(Style.main, className)}
        ref={ref}
        method={method}
        data-layout={$layout}
        onSubmit={submit}
        onReset={reset}
        onKeyDown={$preventEnterSubmit ? (e) => {
          if (e.key === "Enter") {
            if ((e.target as HTMLElement).tagName !== "BUTTON") {
              e.preventDefault();
            }
          }
          props.onKeyDown?.(e);
        } : props.onKeyDown}
      />
    </FormContext.Provider>
  );
}) as FormFC;

export default Form;
