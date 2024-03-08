import { ButtonHTMLAttributes, forwardRef, useEffect, useRef, useState, type HTMLAttributes } from "react";
import joinCn from "../../utilities/join-class-name";
import { isNotReactNode } from "../../utilities/react-node";
import useForm from "../form/context";
import { DownIcon } from "../icon";
import type { ButtonOptions } from "./index";
import Style from "./index.module.scss";

type SelectButtonSourceItem = Pick<ButtonHTMLAttributes<HTMLButtonElement>,
  | "type"
  | "formMethod"
  | "disabled"
  | "children"
> & Pick<ButtonOptions,
  | "$color"
  | "$icon"
  | "$iconPosition"
  | "$fillLabel"
  | "$fitContent"
  | "$noPadding"
  | "$notDependsOnForm"
  | "onClick"
>;

export type SelectButtonOptions = {
  $source: [SelectButtonSourceItem, ...Array<SelectButtonSourceItem>];
  $disabled?: boolean;
} & Pick<ButtonOptions,
  | "$size"
  | "$color"
  | "$round"
  | "$outline"
  | "$text"
  | "$iconPosition"
  | "$fillLabel"
  | "$fitContent"
  | "$noPadding"
  | "$focusWhenMounted"
  | "$notDependsOnForm"
>;

type OmitAttrs = "children" | "onClick";
export type SelectButtonProps = OverwriteAttrs<Omit<HTMLAttributes<HTMLDivElement>, OmitAttrs>, SelectButtonOptions>;

const SelectButton = forwardRef<HTMLDivElement, SelectButtonProps>(({
  className,
  $disabled,
  $size,
  $color,
  $round,
  $outline,
  $text,
  $iconPosition,
  $fillLabel,
  $fitContent,
  $noPadding,
  $focusWhenMounted,
  $notDependsOnForm,
  $source,
  ...props
}, $ref) => {
  const bref = useRef<HTMLButtonElement>(null!);
  const [buttonIndex, setButtonIndex] = useState(0);
  const button = $source[buttonIndex];

  const form = useForm();
  const submitDisabled = $notDependsOnForm !== true && (
    form.disabled ||
    (button.type === "submit" && button.formMethod !== "delete" && (form.hasError || form.submitting)) ||
    (button.type === "reset" && (form.readOnly || form.submitting))
  );

  const disabledRef = useRef(false);
  const [disabled, setDisabled] = useState(disabledRef.current);

  const click = (e: React.MouseEvent<HTMLButtonElement>) => {
    if ($disabled || button.disabled || disabledRef.current || submitDisabled) {
      e.preventDefault();
      return;
    }
    setDisabled(disabledRef.current = true);
    const unlock = () => setDisabled(disabledRef.current = false);
    const res = button.onClick?.(unlock, e);
    if (res == null || typeof res === "boolean") {
      if (res !== true) unlock();
    }
  };

  const formEnable = !form.disabled && !form.readOnly;

  useEffect(() => {
    if ($focusWhenMounted && formEnable) {
      bref.current?.focus();
    }
  }, [formEnable]);

  return (
    <div
      {...props}
      className={joinCn(Style.select, className)}
      ref={$ref}
    >
      <button
        className={joinCn(Style.wrap, className)}
        ref={bref}
        type={button.type ?? "button"}
        disabled={$disabled || button.disabled || submitDisabled || disabled}
        onClick={click}
        data-color={$color}
        data-size={$size || "m"}
        data-wide={!$fitContent && button.children != null}
        data-round={$round}
      >
        <div
          className={Style.main}
          data-outline={$outline}
          data-text={$text}
          data-icon={button.$icon != null && ($iconPosition || "left")}
        >
          {button.$icon != null && <div className={Style.icon}>{button.$icon}</div>}
          <div
            className={Style.label}
            data-fill={$fillLabel}
            data-pt={isNotReactNode(button.children)}
            data-pad={!$noPadding}
          >
            {button.children}
          </div>
        </div>
      </button>
      <div
        className={Style.pull}
        data-color={$color}
        data-outline={$outline}
        data-text={$text}
        data-disabled={$disabled || button.disabled || submitDisabled || disabled}
      >
        <DownIcon className={Style.down} />
      </div>
    </div>
  );
});

export default SelectButton;
