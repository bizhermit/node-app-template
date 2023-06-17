import Style from "#/styles/components/elements/struct-view.module.scss";
import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { attributesWithoutChildren, joinClassNames } from "#/components/utilities/attributes";
import DatetimeUtils from "@bizhermit/basic-utils/dist/datetime-utils";
import NumberUtils from "@bizhermit/basic-utils/dist/number-utils";

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

const switchNode = (item: StructKey, value: any, color?: Color, baseColor?: Color): ReactNode => {
  const c = item.color || color || "main";
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
        {DatetimeUtils.format(value, "yyyy/MM/dd")}
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
        $color={c}
        $baseColor={baseColor}
      />
    );
  }
  if (t === "number" || t === "bigint") {
    return (
      <span className={Style.label} data-align={align || "right"}>
        {NumberUtils.format(value)}
      </span>
    );
  }
  if (t === "boolean") {
    return <span className={Style.label} data-align={align}>{String(value)}</span>;
  }
  return <span className={Style.label} data-align={align}>{value}</span>;
};

const StructView = forwardRef<HTMLTableElement, StructViewProps>((props, ref) => {
  const color = props.$color || "main";
  const baseColor = props.$baseColor || "base";

  if (props.$value == null || Object.keys(props.$value).length === 0) return <></>;
  return (
    <table
      {...attributesWithoutChildren(props, Style.table, `c-${baseColor}`, `bdc-${color}`)}
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
            return switchNode(item, v, color);
          })();
          return (
            <tr key={item.key} className={Style.row}>
              <th className={`${Style.hcell} c-${color}`}>
                {item.label ?? item.key}
              </th>
              <td className={`${Style.bcell} bdc-${color}`}>
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