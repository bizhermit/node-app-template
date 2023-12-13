import type { ReactNode } from "react";
import { DataTableCellLabel, type DataTableBaseColumn, type DataTableCellContext, type DataTableColumn } from ".";
import Button, { ButtonOptions } from "../button";

type Props<T extends Struct> = DataTableBaseColumn<T> & Omit<ButtonOptions, "onClick" | "$focusWhenMounted" | "$notDependsOnForm"> & {
  onClick?: (ctx: DataTableCellContext<T>, unlock: (preventFocus?: boolean) => void, event: React.MouseEvent<HTMLButtonElement>) => (void | boolean | Promise<void>);
  buttonText?: ReactNode;
};

const dataTableButtonColumn = <T extends Struct>(props: Props<T>): DataTableColumn<T> => {
  return {
    align: "center",
    width: "10rem",
    resize: false,
    body: (bprops) => {
      return (
        <DataTableCellLabel
          padding={props.padding}
        >
          <Button
            onClick={(unlock, event) => props.onClick?.(bprops, unlock, event)}
            $outline={props.$outline}
            $size={props.$size ?? "s"}
            $color={props.$color}
            $icon={props.$icon}
            $fillLabel={props.$fillLabel}
            $iconPosition={props.$iconPosition}
            $fitContent={props.$fitContent ?? true}
            $noPadding={props.$noPadding}
            $round={props.$round}
          >
            {props.buttonText ?? bprops.children}
          </Button>
        </DataTableCellLabel>
      );
    },
    ...props,
  };
};

export default dataTableButtonColumn;