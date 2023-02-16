import Button, { ButtonProps } from "@/components/elements/button";
import { DataTableBaseColumn, DataTableCellContext, DataTableColumn } from "@/components/elements/data-table";
import { ReactNode } from "react";

type Props<T extends Struct> = DataTableBaseColumn<T> & {
  onClick?: (ctx: DataTableCellContext<T>, unlock: (preventFocus?: boolean) => void, event: React.MouseEvent<HTMLButtonElement>) => (void | boolean | Promise<void>);
  outline?: Pick<ButtonProps, "$outline">["$outline"];
  size?: Pick<ButtonProps, "$size">["$size"];
  color?: Pick<ButtonProps, "$color">["$color"];
  icon?: Pick<ButtonProps, "$icon">["$icon"];
  fillLabel?: Pick<ButtonProps, "$fillLabel">["$fillLabel"];
  iconPosition?: Pick<ButtonProps, "$iconPosition">["$iconPosition"];
  fitContent?: Pick<ButtonProps, "$fitContent">["$fitContent"];
  round?: Pick<ButtonProps, "$round">["$round"];
  buttonText?: ReactNode;
};

const dataTableButtonColumn = <T extends Struct>(props: Props<T>): DataTableColumn<T> => {
  return {
    align: "center",
    width: "10rem",
    resize: false,
    body: (bprops) => {
      return (
        <Button
          $onClick={(unlock, event) => props.onClick?.(bprops, unlock, event)}
          $outline={props.outline}
          $size={props.size ?? "s"}
          $color={props.color}
          $icon={props.icon}
          $fillLabel={props.fillLabel}
          $iconPosition={props.iconPosition}
          $fitContent={props.fitContent ?? true}
          $round={props.round}
        >
          {props.buttonText ?? bprops.children}
        </Button>
      );
    },
    ...props,
  };
};

export default dataTableButtonColumn;