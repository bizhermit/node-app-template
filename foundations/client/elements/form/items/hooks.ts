import StringUtils from "@bizhermit/basic-utils/dist/string-utils";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { FormItemHook, FormItemMessages, FormItemProps, FormItemValidation, ValueType } from "../$types";
import { equals, getValue, setValue } from "../../../../data-items/utilities";
import type useForm from "../context";
import { type UseFormItemContextOptions } from "../context";
import { isErrorObject } from "../utilities";

const formValidationMessages: FormItemMessages = {
  default: "入力エラーです。",
  required: "{label}を入力してください。",
  typeMissmatch: "{label}の型が不適切です。",
};

export const useDataItemMergedProps = <
  T,
  D extends DataItem | undefined,
  P extends FormItemProps<T, D, any, any>
>(form: ReturnType<typeof useForm>, props: P, merge?: {
  under?: (ctx: { props: P; dataItem: Exclude<P["$dataItem"], undefined>; method?: string; }) => Partial<P>;
  over?: (ctx: { props: P; dataItem: Exclude<P["$dataItem"], undefined>; method?: string; }) => Partial<P>;
}) => {
  const p = {
    ...useMemo(() => {
      const dataItem = props.$dataItem as Exclude<D, undefined>;
      if (dataItem == null) return {};
      return {
        name: dataItem.name,
        $label: dataItem.label,
        $required: form.method === "get" ? false : dataItem.required,
        ...merge?.under?.({ props, dataItem, method: form.method }),
      };
    }, [props.$dataItem]),
    ...props,
  };
  return {
    ...p,
    ...useMemo(() => {
      const dataItem = props.$dataItem as Exclude<D, undefined>;
      if (dataItem == null || merge?.over == null) return {};
      return merge.over({ props: p, dataItem, method: form.method });
    }, [props.$dataItem]),
  } as P;
};

export const useFormItemContext = <
  T,
  D extends DataItem | undefined,
  V = undefined,
  U extends Struct = any,
  P extends FormItemProps<T, D, V, U> = FormItemProps<T, D, V, U>
>(form: ReturnType<typeof useForm>, props: P, options?: UseFormItemContextOptions<ValueType<T, D, V>, U>) => {
  const id = useRef(StringUtils.generateUuidV4());
  const [error, setError] = useState<string | null | undefined>(undefined);

  const valueRef = useRef<ValueType<T, D, V> | null | undefined>((() => {
    if (props == null) return undefined;
    if ("$value" in props) return props.$value;
    if (props.name) {
      // if (props.$bind) {
      //   const v = getValue(props.$bind, props.name);
      //   if (v != null) return v;
      // }
      if (form.bind) {
        const v = getValue(form.bind, props.name);
        if (v != null) return v;
      }
    }
    if ("$defaultValue" in props) return props.$defaultValue;
    return undefined;
  })());
  const [value, setValueImpl] = useState(valueRef.current);
  const setCurrentValue = (value: ValueType<T, D, V> | null | undefined) => {
    setValueImpl(valueRef.current = value);
  };
  const setBind = useCallback((value: ValueType<T, D, V> | null | undefined) => {
    if (!props.name) return;
    // if (props.$bind) {
    //   setValue(props.$bind, props.name, value);
    // }
    if (form.bind && !props.$preventFormBind) {
      setValue(form.bind, props.name, value);
    }
  }, [
    props.name,
    // props.$bind,
    form.bind,
    props.$preventFormBind
  ]);
  useMemo(() => {
    setBind(value);
  }, []);

  const getMessage = useCallback((key: keyof FormItemMessages, ...texts: Array<string>) => {
    let m = props.$messages?.[key] ?? options?.messages?.[key] ?? formValidationMessages[key];
    m = m.replace(/\{label\}/g, props.$label || "値");
    texts.forEach((t, i) => m = m.replace(new RegExp(`\\{${i}\\}`, "g"), `${t ?? ""}`));
    return m;
  }, [
    props.$label
  ]);

  const validations = useMemo(() => {
    const rets: Array<FormItemValidation<ValueType<T, D, V> | null | undefined>> = [];
    if (props.$required && !options?.preventRequiredValidation) {
      if (options?.multiple) {
        rets.push(v => {
          if (v == null) return getMessage("required");
          if (!Array.isArray(v)) return getMessage("typeMissmatch");
          if (v.length === 0 || v[0] === null) return getMessage("required");
          return undefined;
        });
      } else {
        rets.push((v) => {
          if (v == null || v === "") return getMessage("required");
          return undefined;
        });
      }
    }
    if (options?.validations) {
      rets.push(...options.validations(getMessage, props.$label || "値"));
    }
    if (props?.$validations) {
      if (Array.isArray(props.$validations)) {
        rets.push(...props.$validations);
      } else {
        rets.push(props.$validations);
      }
    }
    return rets;
  }, [
    props.$required,
    options?.multiple,
    props?.$validations,
    getMessage,
    ...(options?.validationsDeps ?? []),
  ]);

  const validation = useCallback(() => {
    const value = valueRef.current;
    const msgs: Array<string | null | undefined> = [];
    const bind = (() => {
      if (props == null) return {};
      // if ("$bind" in props) return props.$bind;
      if (!props.$preventFormBind) return form.bind;
      return {};
    })();
    for (let i = 0, il = validations.length; i < il; i++) {
      const result = validations[i](value, bind, i, getMessage);
      if (result == null || result === false) continue;
      if (typeof result === "string") msgs.push(result);
      else msgs.push(getMessage("default"));
      break;
    }
    const msg = msgs[0];
    setError(msg);
    if (!props?.$preventFormBind) {
      form.setErrors(cur => {
        if (cur[id.current] === msg) return cur;
        if (isErrorObject(msg)) {
          return {
            ...cur,
            [id.current]: msg,
          };
        }
        if (!(id.current in cur)) return cur;
        const ret = { ...cur };
        delete ret[id.current];
        return ret;
      });
    }
    return msg;
  }, [
    validations,
    form.bind,
    props?.name,
    // props?.$bind,
    props?.$preventFormBind,
    getMessage,
  ]);

  useEffect(() => {
    form.setExErrors(cur => {
      if (isErrorObject(props?.$error)) {
        if (equals(cur[id.current], props.$error)) return cur;
        return {
          ...cur,
          [id.current]: props.$error,
        };
      }
      if (!(id.current in cur)) return cur;
      const ret = { ...cur };
      delete ret[id.current];
      return ret;
    });
  }, [props?.$error]);

  const change = useCallback((value: ValueType<T, D, V> | null | undefined, edit = true, absolute?: boolean) => {
    if (equals(valueRef.current, value) && !absolute) return;
    const before = valueRef.current;
    setCurrentValue(value);
    setBind(value);
    const errorMessage = (props?.$interlockValidation || options?.interlockValidation) ?
      form.validation(id.current) : validation();
    if (props.$onChange != null || (props.$onEdit != null && edit)) {
      const data = options?.generateChangeCallbackData?.(valueRef.current, before) as U;
      props?.$onChange?.(valueRef.current, before, { ...data, errorMessage });
      if (edit) {
        props?.$onEdit?.(valueRef.current, before, { ...data, errorMessage });
      }
    }
    if (edit) {
      form.effectSameNameItem(id.current, value);
    } else {
      options?.effect?.(valueRef.current);
    }
  }, [
    setBind,
    props?.$preventMemorizeOnChange ? props?.$onChange : undefined,
    props?.$preventMemorizeOnEdit ? props.$onEdit : undefined,
    validation,
    ...(options?.generateChangeCallbackDataDeps ?? []),
  ]);

  useEffect(() => {
    const name = props?.name;
    if (props == null || name == null || form.bind == null || "$bind" in props || "$value" in props || props.$preventFormBind) return;
    const before = valueRef.current;
    setCurrentValue(getValue(form.bind, name));
    const errorMessage = validation();
    props.$onChange?.(
      valueRef.current,
      before,
      { ...options?.generateChangeCallbackData?.(valueRef.current, before) as U, errorMessage },
    );
    options?.effect?.(valueRef.current);
  }, [form.bind, props?.$preventFormBind]);

  // useEffect(() => {
  //   const name = props?.name;
  //   if (props == null || name == null || props.$bind == null || "$value" in props) return;
  //   const before = valueRef.current;
  //   setCurrentValue(getValue(props.$bind, name));
  //   const errorMessage = validation();
  //   props.$onChange?.(
  //     valueRef.current,
  //     before,
  //     { ...options?.generateChangeCallbackData?.(valueRef.current, before) as U, errorMessage },
  //   );
  //   options?.effect?.(valueRef.current);
  // }, [props?.$bind]);

  useEffect(() => {
    if (props == null || !("$value" in props) || equals(valueRef.current, props.$value)) return;
    setCurrentValue(props.$value);
    setBind(props.$value);
    options?.effect?.(valueRef.current);
    validation();
  }, [props?.$value, setBind]);

  useEffect(() => {
    if (props) {
      form.mount(id.current, props, {
        validation,
        change,
      }, options ?? { effect: () => { } });
      return () => {
        form.unmount(id.current);
      };
    }
  }, [validation, change]);

  useEffect(() => {
    options?.effect?.(valueRef.current);
  }, [...(options?.effectDeps ?? [])]);

  useEffect(() => {
    validation();
  }, [validation]);

  const disabled = props?.$disabled || form.disabled;
  const readOnly = props?.$readOnly || form.readOnly;

  return {
    ...form,
    disabled,
    readOnly,
    editable: !disabled && !readOnly,
    change,
    valueRef,
    value,
    validation,
    hasValidator: validations.length > 0,
    error: error ?? props?.$error,
    setError,
    effect: options?.effect,
    messageDisplayMode: props?.$messagePosition ?? form.messageDisplayMode ?? "bottom-hide",
    messageWrap: props?.$messageWrap ?? form.messageWrap,
    getMessage,
  };
};

// eslint-disable-next-line no-console
const printNotSetWarn = () => console.warn("useFormItem not set");

export const useFormItem = <T = any>() => useFormItemBase<FormItemHook<T, {}>>(() => ({}));

export const useFormItemBase = <H extends FormItemHook<any, any>>(
  addons?: (warningMessage: typeof printNotSetWarn) => Omit<H, keyof FormItemHook<any, {}>>
) => {
  return useMemo<H>(() => {
    return {
      focus: () => {
        printNotSetWarn();
      },
      getValue: () => {
        printNotSetWarn();
        return undefined as any;
      },
      setValue: () => {
        printNotSetWarn();
      },
      setDefaultValue: () => {
        printNotSetWarn();
      },
      clear: () => {
        printNotSetWarn();
      },
      ...(addons?.(printNotSetWarn) as any),
    };
  }, []);
};