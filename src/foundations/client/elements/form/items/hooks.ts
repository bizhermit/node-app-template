import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import equals from "../../../../objects/equal";
import { generateUuidV4 } from "../../../../objects/string/generator";
import { getValue } from "../../../../objects/struct/get";
import structKeys from "../../../../objects/struct/keys";
import { setValue } from "../../../../objects/struct/set";
import type useForm from "../context";
import { type UseFormItemContextOptions } from "../context";
import { isErrorObject } from "../utilities";

const formValidationMessages: F.Message = {
  default: "入力エラーです。",
  required: "{label}を入力してください。",
  typeMissmatch: "{label}の型が不適切です。",
};

export const useDataItemMergedProps = <
  T,
  D extends DataItem | undefined,
  P extends F.ItemProps<T, D, any, any>
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

export const useFormItemContext = <T, D extends DataItem | undefined, V = undefined, U extends { [v: string | number | symbol]: any } = any, P extends F.ItemProps<T, D, V, U> = F.ItemProps<T, D, V, U>>(form: ReturnType<typeof useForm>, {
  $label,
  $dataItem,
  $disabled,
  $readOnly,
  $messages,
  $error,
  $required,
  $validations,
  $interlockValidation,
  // $bind,
  // $defaultValue,
  // $value,
  $onChange,
  $preventMemorizeOnChange,
  $onEdit,
  $preventMemorizeOnEdit,
  $preventFormBind,
  $ref,
  $messagePosition,
  $messageWrap,
  ...props
}: P, opts?: UseFormItemContextOptions<F.VType<T, D, V>, U>) => {
  const init = useRef(false);
  const id = useRef(generateUuidV4());
  const [error, setError] = useState<string | null | undefined>(undefined);

  const receive = (v: any) => {
    return opts?.receive ? opts.receive(v) : v;
  };

  const valueRef = useRef<F.VType<T, D, V> | null | undefined>((() => {
    return receive((() => {
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
  })());
  const [value, setValueImpl] = useState(valueRef.current);
  const setCurrentValue = (value: F.VType<T, D, V> | null | undefined) => {
    setValueImpl(valueRef.current = value);
  };
  const setBind = useCallback((value: F.VType<T, D, V> | null | undefined) => {
    if (!props.name) return;
    // if (props.$bind) {
    //   setValue(props.$bind, props.name, value);
    // }
    if (form.bind && !$preventFormBind) {
      setValue(form.bind, props.name, value);
    }
  }, [
    props.name,
    // props.$bind,
    form.bind,
    $preventFormBind,
  ]);
  if (!init.current) setBind(value);

  const getMessage = useCallback((key: keyof F.Message, ...texts: Array<string>) => {
    let m = $messages?.[key] ?? opts?.messages?.[key] ?? formValidationMessages[key];
    m = m.replace(/\{label\}/g, $label || "値");
    texts.forEach((t, i) => m = m.replace(new RegExp(`\\{${i}\\}`, "g"), `${t ?? ""}`));
    return m;
  }, [
    $label,
    // $messages,
  ]);

  const validations = useMemo(() => {
    const rets: Array<F.Validation<F.VType<T, D, V> | null | undefined>> = [];
    if ($required && !opts?.preventRequiredValidation) {
      if (opts?.multiple) {
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
    if (opts?.validations) {
      rets.push(...opts.validations({
        getMessage,
        label: $label || "値",
        required: $required,
        messages: $messages,
      }));
    }
    if ($validations) {
      if (Array.isArray($validations)) {
        rets.push(...$validations);
      } else {
        rets.push($validations);
      }
    }
    return rets;
  }, [
    $required,
    opts?.multiple,
    $validations,
    getMessage,
    ...(opts?.validationsDeps ?? []),
  ]);

  const validation = useCallback(() => {
    const value = valueRef.current;
    const msgs: Array<string | null | undefined> = [];
    const bind = (() => {
      if (props == null) return {};
      // if ("$bind" in props) return props.$bind;
      if (!$preventFormBind) return form.bind;
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
    if (!$preventFormBind) {
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
    // props.$bind,
    $preventFormBind,
    getMessage,
  ]);

  useEffect(() => {
    form.setExErrors(cur => {
      if (isErrorObject($error)) {
        if (equals(cur[id.current], $error)) return cur;
        return {
          ...cur,
          [id.current]: $error,
        };
      }
      if (!(id.current in cur)) return cur;
      const ret = { ...cur };
      delete ret[id.current];
      return ret;
    });
  }, [$error]);

  const change = useCallback((value: F.VType<T, D, V> | null | undefined, edit = true, absolute?: boolean) => {
    if (equals(valueRef.current, value) && !absolute) return;
    const before = valueRef.current;
    setCurrentValue(value);
    setBind(value);
    const errorMessage = ($interlockValidation || ($interlockValidation !== false && opts?.interlockValidation)) ?
      form.validation(id.current) : validation();
    if ($onChange != null || ($onEdit != null && edit)) {
      const data = opts?.generateChangeCallbackData?.(valueRef.current, before) as U;
      $onChange?.(valueRef.current, before, { ...data, errorMessage });
      if (edit) {
        $onEdit?.(valueRef.current, before, { ...data, errorMessage });
      }
    }
    if (edit) {
      form.effectSameNameItem(id.current, value);
    } else {
      opts?.effect?.(valueRef.current);
    }
  }, [
    setBind,
    $preventMemorizeOnChange ? $onChange : undefined,
    $preventMemorizeOnEdit ? $onEdit : undefined,
    validation,
    ...(opts?.generateChangeCallbackDataDeps ?? []),
  ]);

  const valueEffect = (v: any) => {
    const before = valueRef.current;
    setCurrentValue(v);
    if (init.current || $onChange) {
      const errorMessage = validation();
      $onChange?.(
        valueRef.current,
        before,
        { ...opts?.generateChangeCallbackData?.(valueRef.current, before) as U, errorMessage },
      );
    }
    opts?.effect?.(valueRef.current);
  };

  useEffect(() => {
    const name = props?.name;
    if (props == null || name == null || form.bind == null || "$bind" in props || "$value" in props || $preventFormBind) return;
    valueEffect(getValue(form.bind, name));
  }, [
    form.bind,
    $preventFormBind,
  ]);

  // useEffect(() => {
  //   const name = props?.name;
  //   if (props == null || name == null || props.$bind == null || "$value" in props) return;
  //   valueEffect(getValue(props.$bind, name))
  // }, [
  //   props.$bind,
  // ]);

  useEffect(() => {
    if (props == null || !("$value" in props) || equals(valueRef.current, props.$value)) return;
    setBind(props.$value);
    valueEffect(props.$value);
  }, [
    props?.$value,
    setBind,
  ]);

  useEffect(() => {
    init.current = true;
    if (props) {
      form.mount(id.current, props, {
        validation,
        change,
      }, opts ?? { effect: () => { } });
      return () => {
        init.current = false;
        form.unmount(id.current);
      };
    }
    return () => {
      init.current = false;
    };
  }, [validation, change]);

  useEffect(() => {
    opts?.effect?.(valueRef.current);
  }, [...(opts?.effectDeps ?? [])]);

  useEffect(() => {
    validation();
  }, [validation]);

  const disabled = $disabled || form.disabled;
  const readOnly = $readOnly || form.readOnly;

  if ($ref) {
    $ref.getValue = () => valueRef.current;
    $ref.setValue = (v: any) => change(
      receive(v == null ? undefined :
        opts?.multiple ? (Array.isArray(v) ? v : [v]) as any :
          Array.isArray(v) ? v[0] : v
      ), false
    );
    $ref.setDefaultValue = () => $ref?.setValue(props.$defaultValue);
    $ref.clear = () => change(undefined, false);
    $ref.hasError = () => isErrorObject(error ?? $error);
    $ref.getErrorMessage = () => error ?? $error;
  }

  useEffect(() => {
    return () => {
      if ($ref) {
        structKeys($ref).forEach(k => {
          $ref![k] = () => {
            throw formItemHookNotSetError;
          };
        });
      }
    };
  }, []);

  return {
    ctx: {
      ...form,
      disabled,
      readOnly,
      editable: !disabled && !readOnly,
      change,
      valueRef,
      value,
      validation,
      error: error ?? $error,
      setError,
      effect: opts?.effect,
      messagePosition: $messagePosition ?? form.messagePosition ?? "bottom-hide",
      messageWrap: $messageWrap ?? form.messageWrap,
    },
    props,
    $ref: $ref as P["$ref"],
    $dataItem,
    $preventFormBind,
  } as const;
};

// eslint-disable-next-line no-console
export const formItemHookNotSetError = new Error("useFormItem not set");

export const useFormItem = <T = any>() => useFormItemBase<F.ItemHook<T, {}>>(() => ({}));

export const useFormItemBase = <H extends F.ItemHook<any, any>>(
  addons?: (warningMessage: typeof formItemHookNotSetError) => Omit<H, keyof F.ItemHook<any, {}>>
) => {
  return useMemo<H>(() => {
    return {
      focus: () => {
        throw formItemHookNotSetError;
      },
      getValue: () => {
        throw formItemHookNotSetError;
      },
      setValue: () => {
        throw formItemHookNotSetError;
      },
      setDefaultValue: () => {
        throw formItemHookNotSetError;
      },
      clear: () => {
        throw formItemHookNotSetError;
      },
      hasError: () => {
        throw formItemHookNotSetError;
      },
      getErrorMessage: () => {
        throw formItemHookNotSetError;
      },
      ...(addons?.(formItemHookNotSetError) as any),
    };
  }, []);
};