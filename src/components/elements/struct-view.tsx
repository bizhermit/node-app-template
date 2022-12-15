import React, { HTMLAttributes, ReactNode, useMemo } from "react";
import Style from "$/components/elements/struct-view.module.scss";
import { attributesWithoutChildren } from "@/utilities/attributes";
import LabelText from "@/components/elements/label-text";

export type StructKey = {
  key: string;
  label?: ReactNode;
  children?: Array<StructKey>;
};

export type StructViewProps = HTMLAttributes<HTMLDivElement> & {
  $keys?: Array<StructKey>;
  $struct?: Struct;
  $captionPosition?: "top" | "left" | "right" | "bottom";
  $color?: Color;
  children?: ReactNode;
};

const StructView = React.forwardRef<HTMLDivElement, StructViewProps>((props, ref) => {

  const keys = (() => {
    if (props.$keys != null) return props.$keys;
    if (props.$struct == null) return [];
    return Object.keys(props.$struct).map(key => {
      return {
        key,
      } as StructKey;
    });
  })();

  return (
    <div
      {...attributesWithoutChildren(props, Style.wrap)}
      ref={ref}
      data-pos={props.$captionPosition || "top"}
    >
      {props.children &&
        <div className={Style.header}>
          <LabelText>{props.children}</LabelText>
        </div>
      }
      <table className={Style.table}>
        <tbody>
          {keys.map(item => {
            const v = props.$struct?.[item.key];
            return (
              <tr>
                <th>
                  {item.label ?? item.key}
                </th>
                <td>
                  <LabelText>{v ?? <span className="pt-t fgc-dull">(empty)</span>}</LabelText>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  );
});

export default StructView;