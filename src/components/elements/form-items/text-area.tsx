import { convertDataItemValidationToFormItemValidation, type FormItemProps, type FormItemValidation, FormItemWrap, useDataItemMergedProps, useForm, useFormItemContext } from "@/components/elements/form";
import { type ForwardedRef, forwardRef, type FunctionComponent, type ReactElement, useRef } from "react";
import Style from "$/components/elements/form-items/text-area.module.scss";
import Resizer from "@/components/elements/resizer";
import { convertSizeNumToStr } from "@/components/utilities/attributes";
import StringUtils from "@bizhermit/basic-utils/dist/string-utils";
import { StringData } from "@/data-items/string";

export type TextAreaProps<D extends DataItem_String | undefined = undefined> = FormItemProps<string, D, string> & {
  $length?: number;
  $preventInputWithinLength?: boolean;
  $minLength?: number;
  $maxLength?: number;
  $resize?: boolean | "x" | "y" | "xy";
  $width?: number | string;
  $maxWidth?: number | string;
  $minWidth?: number | string;
  $height?: number | string;
  $maxHeight?: number | string;
  $minHeight?: number | string;
  $autoComplete?: string;
};

interface TextAreaFC extends FunctionComponent<TextAreaProps> {
  <D extends DataItem_String | undefined = undefined>(attrs: TextAreaProps<D>, ref?: ForwardedRef<HTMLDivElement>): ReactElement<any> | null;
}

const TextArea: TextAreaFC = forwardRef<HTMLDivElement, TextAreaProps>(<
  D extends DataItem_String | undefined = undefined
>(p: TextAreaProps<D>, ref: ForwardedRef<HTMLDivElement>) => {
  const iref = useRef<HTMLTextAreaElement>(null!);
  const form = useForm();
  const props = useDataItemMergedProps(form, p, {
    under: ({ dataItem, method }) => {
      const isSearch = method === "get";
      return {
        $length: isSearch ? undefined : dataItem.length,
        $minLength: isSearch ? undefined : dataItem.minLength,
        $maxLength: dataItem.maxLength ?? dataItem.length,
        $width: dataItem.width,
        $minWidth: dataItem.minWidth,
        $maxWidth: dataItem.maxWidth,
      };
    },
    over: ({ dataItem, props }) => {
      return {
        $validations: dataItem.validations?.map(f => convertDataItemValidationToFormItemValidation(f, props, dataItem)),
      };
    },
  });

  const ctx = useFormItemContext(form, props, {
    effect: (v) => {
      if (iref.current) iref.current.value = v || "";
    },
    validations: () => {
      const validations: Array<FormItemValidation<Nullable<string>>> = [];
      if (props.$length != null) {
        validations.push(v => StringData.lengthValidation(v, props.$length!));
      } else {
        if (props.$minLength != null) {
          validations.push(v => StringData.minLengthValidation(v, props.$minLength!));
        }
        if (props.$maxLength != null) {
          validations.push(v => StringData.maxLengthValidation(v, props.$maxLength!));
        }
      }
      return validations;
    },
    validationsDeps: [
      props.$length,
      props.$minLength,
      props.$maxLength,
    ],
  });

  return (
    <FormItemWrap
      {...props}
      ref={ref}
      $context={ctx}
      data-has={StringUtils.isNotEmpty(ctx.value)}
      $mainProps={{
        style: {
          width: convertSizeNumToStr(props.$width),
          maxWidth: convertSizeNumToStr(props.$maxWidth),
          minWidth: convertSizeNumToStr(props.$minWidth),
          height: convertSizeNumToStr(props.$height),
          maxHeight: convertSizeNumToStr(props.$maxHeight),
          minHeight: convertSizeNumToStr(props.$minHeight),
        }
      }}
    >
      <textarea
        ref={iref}
        className={Style.input}
        name={props.name}
        placeholder={ctx.editable ? props.placeholder : ""}
        disabled={ctx.disabled}
        readOnly={ctx.readOnly}
        maxLength={props.$maxLength ?? (props.$preventInputWithinLength ? undefined : props.$length)}
        tabIndex={props.tabIndex}
        defaultValue={ctx.value ?? ""}
        onChange={e => ctx.change(e.target.value)}
        autoComplete={props.$autoComplete ?? "off"}
      />
      {props.$resize &&
        <Resizer direction={typeof props.$resize === "boolean" ? "xy" : props.$resize} />
      }
    </FormItemWrap>
  );
});

export default TextArea;