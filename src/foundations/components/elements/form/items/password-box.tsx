import Style from "#/styles/components/elements/form/items/text-box.module.scss";
import type { FormItemProps, FormItemValidation } from "#/components/elements/form/$types";
import useForm from "#/components/elements/form/context";
import { useDataItemMergedProps, useFormItemContext } from "#/components/elements/form/item-hook";
import { FormItemWrap } from "#/components/elements/form/item-wrap";
import { TextBoxProps } from "#/components/elements/form/items/text-box";
import { convertDataItemValidationToFormItemValidation } from "#/components/elements/form/utilities";
import { convertSizeNumToStr } from "#/components/utilities/attributes";
import { StringData } from "#/data-items/string";
import StringUtils from "@bizhermit/basic-utils/dist/string-utils";
import { ForwardedRef, FunctionComponent, HTMLAttributes, ReactElement, forwardRef, useRef, useState } from "react";
import { CircleFillIcon, CircleIcon, CrossIcon } from "#/components/elements/icon";
import Resizer from "#/components/elements/resizer";

type InputMode = Extract<HTMLAttributes<HTMLInputElement>["inputMode"],
  | "email"
  | "url"
  | "numeric"
  | "text"
  | "none"
>;

export type PasswordBoxProps<D extends DataItem_String | undefined = undefined> = FormItemProps<string, D, string> & Pick<TextBoxProps<D>,
  | "$minLength"
  | "$maxLength"
  | "$round"
  | "$resize"
  | "$width"
  | "$maxWidth"
  | "$minWidth"
  | "$hideClearButton"
  | "$autoComplete"
  | "$align"
> & {
  $charType?: Extract<StringCharType,
    | "h-num"
    | "h-alpha"
    | "h-alpha-num"
    | "h-alpha-num-syn"
  >;
  $inputMode?: InputMode;
  $hideToggleButton?: boolean;
  $preventInputWithinLength?: boolean;
};

interface PasswordBoxFC extends FunctionComponent<PasswordBoxProps> {
  <D extends DataItem_String | undefined = undefined>(attrs: PasswordBoxProps<D>, ref?: ForwardedRef<HTMLDivElement>): ReactElement<any> | null;
}

const PasswordBox: PasswordBoxFC = forwardRef<HTMLDivElement, PasswordBoxProps>(<
  D extends DataItem_String | undefined = undefined
>(p: PasswordBoxProps<D>, ref: ForwardedRef<HTMLDivElement>) => {
  const form = useForm();
  const iref = useRef<HTMLInputElement>(null!);
  const props = useDataItemMergedProps(form, p, {
    under: ({ dataItem, method }) => {
      const isSearch = method === "get";
      return {
        $length: isSearch ? undefined : dataItem.length,
        $minLength: isSearch ? undefined : dataItem.minLength,
        $maxLength: dataItem.maxLength ?? dataItem.length,
        $charType: (() => {
          switch (dataItem.charType) {
            case "h-num":
            case "h-alpha":
            case "h-alpha-num":
            case "h-alpha-num-syn":
              return dataItem.charType;
            default:
              return "h-alpha-num-sync";
          }
        })() as PasswordBoxProps["$charType"],
        $inputMode: (() => {
          if (dataItem.inputMode) return dataItem.inputMode;
          switch (props.$charType ?? dataItem.charType) {
            case "h-num":
              return "numeric";
            case "h-alpha":
            case "h-alpha-num":
            case "h-alpha-num-syn":
              return "email";
            default:
              return "email";
          }
        })() as InputMode,
        $align: dataItem.align,
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
      if (props.$minLength != null) {
        validations.push(v => StringData.minLengthValidation(v, props.$minLength!));
      }
      if (props.$maxLength != null) {
        validations.push(v => StringData.maxLengthValidation(v, props.$maxLength!));
      }
      switch (props.$charType) {
        case "h-num":
          validations.push(v => StringData.halfWidthNumericValidation(v));
          break;
        case "h-alpha":
          validations.push(v => StringData.halfWidthAlphabetValidation(v));
          break;
        case "h-alpha-num":
          validations.push(v => StringData.halfWidthAlphaNumericValidation(v));
          break;
        case "h-alpha-num-syn":
          validations.push(v => StringData.halfWidthAlphaNumericAndSymbolsValidation(v));
          break;
        default:
          break;
      }
      return validations;
    },
    validationsDeps: [
      props.$minLength,
      props.$maxLength,
      props.$charType,
    ],
  });

  const [type, setType] = useState<"text" | "password">("password");

  const clear = () => {
    if (!ctx.editable) return;
    ctx.change(undefined);
    if (iref.current) iref.current.value = "";
  };

  const toggle = () => {
    if (!ctx.editable) return;
    setType(c => c === "text" ? "password" : "text");
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
        type={type}
        placeholder={ctx.editable ? props.placeholder : ""}
        disabled={ctx.disabled}
        readOnly={ctx.readOnly}
        maxLength={props.$preventInputWithinLength ? undefined : props.$maxLength}
        tabIndex={props.tabIndex}
        defaultValue={ctx.value ?? ""}
        onChange={e => ctx.change(e.target.value)}
        data-round={props.$round}
        data-clear={ctx.editable && props.$hideClearButton !== true}
        data-align={props.$align}
        autoComplete={props.$autoComplete ?? "off"}
        inputMode={props.$inputMode}
      />
      {ctx.editable && props.$hideClearButton !== true &&
        <div
          className={Style.button}
          onClick={clear}
          data-disabled={!hasData}
        >
          <CrossIcon />
        </div>
      }
      {ctx.editable && props.$hideToggleButton !== true &&
        <div
          className={Style.button}
          onClick={toggle}
          data-round={props.$round}
        >
          {type === "text" ? <CircleIcon /> : <CircleFillIcon />}
        </div>
      }
      {props.$resize && <Resizer direction="x" />}
    </FormItemWrap>
  );
});

export default PasswordBox;