import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import formatDate from "../../../objects/date/format";
import formatNum from "../../../objects/number/format";
import { appendedColorStyle, attributesWithoutChildren, joinClassNames } from "../../utilities/attributes";
import Style from "./index.module.scss";

export type StructKey = {
  key: string;
  label?: ReactNode;
  color?: Color;
  align?: "left" | "center" | "right";
  format?: (value: any | null | undefined) => ReactNode;
  children?: Array<StructKey>;
};

type OmitAttributes = "color" | "children";
export type StructViewProps = Omit<HTMLAttributes<HTMLTableElement>, OmitAttributes> & {
  $keys?: Array<StructKey>;
  $value?: Struct;
  $color?: Color;
  $baseColor?: Color;
  $outline?: boolean;
};

const emptyText = "(empty)";

const switchNode = (item: StructKey, value: any): ReactNode => {
  const align = item.align;
  if (value == null) {
    return (
      <span
        className={joinClassNames(Style.label, "fgc-dull")}
        data-align={align}
      >
        {emptyText}
      </span>
    );
  }
  if (value instanceof Date) {
    return (
      <span className={Style.label} data-align={align}>
        {formatDate(value, "yyyy/MM/dd")}
      </span>
    );
  }
  const t = typeof value;
  if (t === "function") {
    return switchNode(item, value());
  }
  if (t === "object") {
    if (Array.isArray(value)) {
      return (
        <div>
          {value.map((item, index) => {
            return (
              <div key={index}>{JSON.stringify(item)}</div>
            );
          })}
        </div>
      );
    }
    return (
      <StructView
        $keys={item.children}
        $value={value}
      />
    );
  }
  if (t === "number" || t === "bigint") {
    return (
      <span className={Style.label} data-align={align || "right"}>
        {formatNum(value)}
      </span>
    );
  }
  if (t === "boolean") {
    return <span className={Style.label} data-align={align}>{String(value)}</span>;
  }
  return <span className={Style.label} data-align={align}>{value}</span>;
};

const StructView = forwardRef<HTMLTableElement, StructViewProps>((props, ref) => {
  if (props.$value == null || Object.keys(props.$value).length === 0) return <></>;
  return (
    <table
      {...attributesWithoutChildren(props, Style.table)}
      style={appendedColorStyle(props, true)}
      ref={ref}
      data-outline={props.$outline}
    >
      <tbody>
        {(() => {
          if (props.$keys != null) return props.$keys;
          if (props.$value == null) return [];
          return Object.keys(props.$value).map(key => {
            return {
              key,
            } as StructKey;
          });
        })().map(item => {
          const v = props.$value?.[item.key];
          const node = (() => {
            if (item.format != null) {
              return item.format(v);
            }
            return switchNode(item, v);
          })();
          return (
            <tr key={item.key} className={Style.row}>
              <th className={Style.hcell}>
                {item.label ?? item.key}
              </th>
              <td className={Style.bcell}>
                {node}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
});

export default StructView;