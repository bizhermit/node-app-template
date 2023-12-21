import { createContext, useCallback, useContext, useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";
import equals from "../../../objects/equal";
import { generateUuidV4 } from "../../../objects/string/generator";
import { setValue } from "../../../objects/struct/set";
import type { FormItemMessageDisplayMode, FormItemMessageFunc, FormItemMessages, FormItemMountProps, FormItemProps, FormItemValidation } from "./$types";

type Data = { [v: string | number | symbol]: any };
type ErrorData = { [v: string]: string };

export type UseFormItemContextOptions<T = any, U extends Data = {}> = {
  receive?: (v: any) => (T | null | undefined);
  effect?: (value: T | null | undefined) => void;
  effectDeps?: Array<any>;
  multiple?: boolean;
  multipartFormData?: boolean;
  validations?: (ctx: {
    getMessage: FormItemMessageFunc;
    label: string;
    required: boolean | undefined;
    messages: Partial<FormItemMessages> | undefined;
  }) => Array<FormItemValidation<T | null | undefined>>;
  validationsDeps?: Array<any>;
  preventRequiredValidation?: boolean;
  interlockValidation?: boolean;
  generateChangeCallbackData?: (after?: T | null | undefined, before?: T | null | undefined) => U;
  generateChangeCallbackDataDeps?: Array<any>;
  messages?: Partial<FormItemMessages>;
};

type FormContextProps = {
  bind?: Data;
  disabled?: boolean;
  readOnly?: boolean;
  method?: string;
  errors: ErrorData;
  setErrors: Dispatch<SetStateAction<ErrorData>>;
  exErrors: ErrorData;
  setExErrors: Dispatch<SetStateAction<ErrorData>>;
  hasError: boolean;
  mount: (
    id: string,
    itemProps: FormItemProps<any, any, any, any>,
    mountItemProps: FormItemMountProps,
    options: UseFormItemContextOptions<any, any>
  ) => string;
  unmount: (name: string) => void;
  validation: (returnId: string) => string | null | undefined;
  messagePosition: FormItemMessageDisplayMode;
  messageWrap?: boolean;
  getValue: <T>(name: string) => T;
  setValue: (name: string, value: any, absolute?: boolean) => void;
  render: (name?: string) => void;
  effectSameNameItem: (id: string, value: any) => void;
  getErrorMessages: (name?: string) => Array<string>;
};

export const FormContext = createContext<FormContextProps>({
  bind: undefined,
  disabled: false,
  readOnly: false,
  errors: {},
  setErrors: () => { },
  exErrors: {},
  setExErrors: () => { },
  hasError: false,
  mount: () => "",
  unmount: () => { },
  validation: () => undefined,
  messagePosition: "bottom-hide",
  // eslint-disable-next-line comma-spacing
  getValue: <T,>() => undefined as T,
  setValue: () => { },
  render: () => { },
  effectSameNameItem: () => { },
  getErrorMessages: () => [],
});

const useForm = () => {
  return useContext(FormContext);
};

type Value<D extends DataItem | any> =
  D extends DataItem ? (DataItemValueType<D, true, "client"> | undefined) : (D | undefined);

export const useFormValue = <D>(dataItemOrName: D | string, init?: Value<D> | (() => Value<D>)) => {
  const id = useRef(generateUuidV4());
  const name = typeof dataItemOrName === "string" ?
    dataItemOrName : (dataItemOrName as D extends DataItem ? D : { name?: string; }).name;
  const form = useForm();
  const [_, rerender] = useState(0);

  const set = useCallback((value: Value<D> | ((c: Value<D>) => Value<D>)) => {
    if (!name) return;
    form.setValue(
      name,
      typeof value === "function" ?
        (value as ((c: Value<D>) => Value<D>))(form.getValue(name)) :
        value
    );
  }, []);

  useEffect(() => {
    if (!name) return;

    form.mount(id.current, {
      name,
    }, {
      change: v => {
        if (equals(form.getValue(name), v)) return;
        rerender(c => c + 1);
        setValue(form.bind, name, v);
      },
      validation: () => undefined,
    }, {
      effect: () => rerender(c => c + 1),
    });

    if (init != null) {
      if (form.getValue(name) == null) {
        const iv = typeof init === "function" ? (init as (() => Value<D>))() : init;
        if (iv != null) form.setValue(name, iv);
      }
    }

    return () => {
      form.unmount(id.current);
    };
  }, [form.bind]);

  return {
    value: name ? form.getValue(name) as Value<D> : undefined,
    set,
    name,
  } as const;
};

export default useForm;