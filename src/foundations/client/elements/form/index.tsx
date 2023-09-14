"use client";

import { type FormHTMLAttributes, forwardRef, useEffect, useImperativeHandle, useMemo, useReducer, useRef, useState, type FunctionComponent, type ForwardedRef, type ReactElement } from "react";
import type { FormItemMessageDisplayMode, FormItemMountProps, FormItemProps } from "./$types";
import { attributes } from "../../utilities/attributes";
import { getValue, setValue } from "../../../data-items/utilities";
import { FormContext, type UseFormItemContextOptions } from "./context";
import { isErrorObject } from "./utilities";

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

type PlainFormProps = {
  $submitDataType: "formData";
  $onSubmit?: (((data: FormData, method: string, e: React.FormEvent<HTMLFormElement>) => (boolean | void | Promise<void>)) | boolean);
};

type BindFormProps<T extends Struct = Struct> = {
  $submitDataType?: "struct";
  $onSubmit?: (((data: T, method: string, e: React.FormEvent<HTMLFormElement>) => (boolean | void | Promise<void>)) | boolean);
  $onlyMountedData?: boolean;
};

export type FormProps<T extends Struct = Struct> = Omit<FormHTMLAttributes<HTMLFormElement>, "onSubmit" | "onReset" | "encType"> & {
  $formRef?: ReturnType<typeof useFormRef>;
  $bind?: boolean | Struct | null | undefined;
  $disabled?: boolean;
  $readOnly?: boolean;
  $messageDisplayMode?: FormItemMessageDisplayMode;
  $messageWrap?: boolean;
  $onReset?: (((e: React.FormEvent<HTMLFormElement>) => (boolean | void | Promise<void>)) | boolean);
  $preventResetWhenRebind?: boolean;
  encType?: "application/x-www-form-urlencoded" | "multipart/form-data" | "text/plain";
  $onError?: (error: Struct) => void;
  $preventEnterSubmit?: boolean;
} & (PlainFormProps | BindFormProps<T>);

interface FormFC extends FunctionComponent<FormProps> {
  <T extends Struct = Struct>(
    attrs: ComponentAttrsWithRef<HTMLFormElement, FormProps<T>>
  ): ReactElement<any> | null;
}

const Form = forwardRef<HTMLFormElement, FormProps>(<
  T extends Struct = Struct
>(props: FormProps<T>, $ref: ForwardedRef<HTMLFormElement>) => {
  const ref = useRef<HTMLFormElement>(null!);
  useImperativeHandle($ref, () => ref.current);
  const method = props.method ?? "get";

  const bind = useMemo(() => {
    if (props.$bind === false) return undefined;
    if (props.$bind == null || props.$bind === true) return {};
    return props.$bind;
  }, [props.$bind]);

  const disabledRef = useRef(false);
  const [disabled, setDisabled] = useReducer((_: boolean, action: boolean) => {
    return disabledRef.current = action;
  }, false);
  const items = useRef<Struct<FormItemMountProps & { props: FormItemProps; options: UseFormItemContextOptions; }>>({});
  const [errors, setErrors] = useState<Struct>({});
  const [exErrors, setExErrors] = useState<Struct>({});

  const mount = (
    id: string,
    itemProps: FormItemProps,
    mountItemProps: FormItemMountProps,
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
    return Object.keys(errors).find(key => isErrorObject(errors[key])) != null
      || Object.keys(exErrors).find(key => isErrorObject(exErrors[key])) != null;
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
    if (props.$disabled || disabledRef.current || hasError) {
      e.preventDefault();
      return;
    }
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
    setDisabled(true);
    if (props.$onSubmit == null) {
      setDisabled(false);
      return;
    }
    if (typeof props.$onSubmit === "boolean") {
      if (props.$onSubmit !== true) {
        e.preventDefault();
      }
      setDisabled(false);
      return;
    }
    const ret = props.$onSubmit(
      (props.$submitDataType === "formData" ? new FormData(e.currentTarget) : (() => {
        if (!props.$onlyMountedData) {
          return { ...bind };
        }
        const ret: Struct = {};
        Object.keys(items.current).forEach(key => {
          const name = items.current[key].props.name;
          if (!name) return;
          setValue(ret, name, getValue(bind, name));
        });
        return ret;
      })()) as any,
      ((e.nativeEvent as any).submitter as HTMLButtonElement)?.getAttribute("formmethod") || method,
      e
    );
    if (ret == null || typeof ret === "boolean") {
      if (ret !== true) {
        e.preventDefault();
      }
      setDisabled(false);
      return;
    }
    e.preventDefault();
    if ("then" in ret) {
      ret.then(() => {
        setDisabled(false);
      });
    }
  };

  const resetItems = () => {
    setTimeout(() => {
      Object.keys(items.current).forEach(id => {
        const item = items.current[id];
        item.change(item.props.$defaultValue, false);
      });
    }, 0);
  };

  const reset = (e: React.FormEvent<HTMLFormElement>) => {
    if (props.$disabled || disabledRef.current) {
      e.preventDefault();
      return;
    }
    setDisabled(true);
    if (props.$onReset == null || typeof props.$onReset === "boolean") {
      if (props.$onReset === false) {
        e.preventDefault();
      } else {
        resetItems();
      }
      setDisabled(false);
      return;
    }
    const ret = props.$onReset(e);
    if (ret == null || typeof ret === "boolean") {
      if (ret === false) {
        e.preventDefault();
      } else {
        resetItems();
      }
      setDisabled(false);
      return;
    }
    e.preventDefault();
    if ("then" in ret) {
      ret.then(() => {
        setDisabled(false);
      });
    }
  };

  const get = (name: string) => {
    if (bind == null) return undefined;
    return getValue(bind, name);
  };

  const set = (name: string, value: any) => {
    if (bind == null) return;
    Object.keys(items.current).forEach(id => {
      if (items.current[id].props.name !== name) return;
      items.current[id]?.change(value, false);
    });
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

  useEffect(() => {
    if (props.$onError) {
      const e = { ...errors };
      Object.keys(e).forEach(id => {
        if (isErrorObject(e[id])) return;
        delete e[id];
      });
      const exE = { ...exErrors };
      Object.keys(exE).forEach(id => {
        if (isErrorObject(exE[id])) return;
        delete exE[id];
      });
      props.$onError({ ...exE, ...e });
    }
  }, [errors, exErrors]);

  useEffect(() => {
    if (props.$preventResetWhenRebind !== true) {
      ref.current?.reset?.();
    }
  }, [bind]);

  if (props.$formRef) {
    props.$formRef.getValue = get;
    props.$formRef.setValue = set;
    props.$formRef.render = render;
    props.$formRef.validation = validation;
    props.$formRef.reset = () => ref.current?.reset?.();
    props.$formRef.submit = () => ref.current?.submit?.();
  }

  return (
    <FormContext.Provider value={{
      bind,
      disabled: props.$disabled || disabled,
      readOnly: props.$readOnly,
      method,
      errors,
      setErrors,
      exErrors,
      setExErrors,
      hasError,
      mount,
      unmount,
      validation,
      messageDisplayMode: props.$messageDisplayMode ?? "tooltip",
      messageWrap: props.$messageWrap,
      getValue: get,
      setValue: set,
      render,
      effectSameNameItem,
      getErrorMessages,
    }}>
      <form
        {...attributes(props)}
        ref={ref}
        method={method}
        onSubmit={submit}
        onReset={reset}
        onKeyDown={props.$preventEnterSubmit ? (e) => {
          if (e.code === "Enter") {
            if ((e.target as HTMLElement).tagName !== "BUTTON") {
              e.preventDefault();
            }
          }
        } : undefined}
      />
    </FormContext.Provider>
  );
}) as FormFC;

export default Form;