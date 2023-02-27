import Style from "$/components/elements/form-items/text-box.module.scss";
import { convertDataItemValidationToFormItemValidation, FormItemProps, FormItemValidation, FormItemWrap, useDataItemMergedProps, useForm, useFormItemContext } from "@/components/elements/form";
import Resizer from "@/components/elements/resizer";
import { convertSizeNumToStr } from "@/components/utilities/attributes";
import { StringData } from "@/data-items/string";
import StringUtils from "@bizhermit/basic-utils/dist/string-utils";
import { ForwardedRef, forwardRef, FunctionComponent, ReactElement, useRef } from "react";
import { VscClose } from "react-icons/vsc";

export type TextBoxProps<D extends DataItem_String | DataItem_Number | undefined = undefined> = FormItemProps<string | number, D, string> & {
  $type?: "email" | "password" | "search" | "tel" | "text" | "url";
  $length?: number;
  $preventInputWithinLength?: boolean;
  $minLength?: number;
  $maxLength?: number;
  $charType?: StringCharType;
  $round?: boolean;
  $resize?: boolean;
  $width?: number | string;
  $maxWidth?: number | string;
  $minWidth?: number | string;
  $hideClearButton?: boolean;
  $autoComplete?: string;
};

interface TextBoxFC extends FunctionComponent<TextBoxProps> {
  <D extends DataItem_String | DataItem_Number | undefined = undefined>(attrs: TextBoxProps<D>, ref?: ForwardedRef<HTMLDivElement>): ReactElement<any> | null;
}

const TextBox: TextBoxFC = forwardRef<HTMLDivElement, TextBoxProps>(<
  D extends DataItem_String | DataItem_Number | undefined = undefined
>(p: TextBoxProps<D>, ref: ForwardedRef<HTMLDivElement>) => {
  const form = useForm();
  const iref = useRef<HTMLInputElement>(null!);
  const props = useDataItemMergedProps(form, p, {
    under: ({ dataItem, method }) => {
      const isSearch = method === "get";
      switch (dataItem.type) {
        case "number":
          return {
            $charType: "h-num" as StringCharType,
            $width: dataItem.width,
            $minWidth: dataItem.minWidth,
            $maxWidth: dataItem.maxWidth,
          };
        default:
          return {
            $length: isSearch ? undefined : dataItem.length,
            $minLength: isSearch ? undefined : dataItem.minLength,
            $maxLength: dataItem.maxLength ?? dataItem.length,
            $charType: dataItem.charType,
            $width: dataItem.width,
            $minWidth: dataItem.minWidth,
            $maxWidth: dataItem.maxWidth,
          };
      }
    },
    over: ({ dataItem, props }) => {
      switch (dataItem.type) {
        case "number":
          return {
            $validations: dataItem.validations?.map(f => convertDataItemValidationToFormItemValidation(f, props, dataItem, v => Number(v))),
          };
        default:
          return {
            $validations: dataItem.validations?.map(f => convertDataItemValidationToFormItemValidation(f, props, dataItem)),
          };
      }
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
      switch (props.$charType) {
        case "h-num":
          validations.push(v => StringData.halfWidthNumericValidation(v));
          break;
        case "f-num":
          validations.push(v => StringData.fullWidthNumericValidation(v));
          break;
        case "num":
          validations.push(v => StringData.numericValidation(v));
          break;
        case "h-alpha":
          validations.push(v => StringData.halfWidthAlphabetValidation(v));
          break;
        case "f-alpha":
          validations.push(v => StringData.fullWidthAlphabetValidation(v));
          break;
        case "alpha":
          validations.push(v => StringData.alphabetValidation(v));
          break;
        case "h-alpha-num":
          validations.push(v => StringData.halfWidthAlphaNumericValidation(v));
          break;
        case "h-alpha-num-syn":
          validations.push(v => StringData.halfWidthAlphaNumericAndSymbolsValidation(v));
          break;
        case "int":
          validations.push(v => StringData.integerValidation(v));
          break;
        case "h-katakana":
          validations.push(v => StringData.halfWidthKatakanaValidation(v));
          break;
        case "f-katakana":
          validations.push(v => StringData.fullWidthKatakanaValidation(v));
          break;
        case "katakana":
          validations.push(v => StringData.katakanaValidation(v));
          break;
        default:
          break;
      }
      return validations;
    },
    validationsDeps: [
      props.$length,
      props.$minLength,
      props.$maxLength,
      props.$charType,
    ],
  });

  const clear = () => {
    if (!ctx.editable) return;
    ctx.change(undefined);
    if (iref.current) iref.current.value = "";
  };

  const hasData = StringUtils.isNotEmpty(ctx.value);

  return (
    <FormItemWrap
      {...props}
      ref={ref}
      $context={ctx}
      data-round={props.$round}
      data-has={hasData}
      $mainProps={{
        style: {
          width: convertSizeNumToStr(props.$width),
          maxWidth: convertSizeNumToStr(props.$maxWidth),
          minWidth: convertSizeNumToStr(props.$minWidth),
        },
      }}
    >
      <input
        ref={iref}
        className={Style.input}
        name={props.name}
        type={props.$type || "text"}
        placeholder={ctx.editable ? props.placeholder : ""}
        disabled={ctx.disabled}
        readOnly={ctx.readOnly}
        maxLength={props.$maxLength ?? (props.$preventInputWithinLength ? undefined : props.$length)}
        tabIndex={props.tabIndex}
        defaultValue={ctx.value ?? ""}
        onChange={e => ctx.change(e.target.value)}
        data-round={props.$round}
        data-clear={ctx.editable && props.$hideClearButton !== true}
        autoComplete={props.$autoComplete ?? "off"}
      />
      {ctx.editable && props.$hideClearButton !== true &&
        <div
          className={Style.button}
          onClick={clear}
          data-disabled={!hasData}
          data-round={props.$round}
        >
          <VscClose />
        </div>
      }
      {props.$resize && <Resizer direction="x" />}
    </FormItemWrap>
  );
});

export default TextBox;