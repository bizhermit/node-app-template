"use client";

import { forwardRef, useEffect, useMemo, useRef, type ForwardedRef, type FunctionComponent, type HTMLAttributes, type ReactElement } from "react";
import useLoadableArray from "../../hooks/loadable-array";
import { attributes } from "../../utilities/attributes";
import Resizer, { type ResizeDirection } from "../resizer";
import DataListClass, { type DataListColumn } from "./class";
import Style from "./index.module.scss";

type OmitAttributes = "children";
type DataListProps<T extends Struct = Struct> = Omit<HTMLAttributes<HTMLDivElement>, OmitAttributes> & {
  $columns?: Array<DataListColumn<T>>;
  $value?: LoadableArray<T>;
  $header?: boolean;
  $headerHeight?: number;
  $footer?: boolean;
  $footerHeight?: number;
  $rowHeight?: number;
  $outline?: boolean;
  $rowBorder?: boolean;
  $cellBorder?: boolean;
  $resize?: ResizeDirection;
};

interface DataListFC extends FunctionComponent<DataListProps> {
  <T extends Struct = Struct>(
    attrs: ComponentAttrsWithRef<HTMLDivElement, DataListProps<T>>
  ): ReactElement<any> | null;
}

const DataList: DataListFC = forwardRef<HTMLDivElement, DataListProps>(<
  T extends Struct = Struct
>(props: DataListProps<T>, ref: ForwardedRef<HTMLDivElement>) => {
  const eref = useRef<HTMLDivElement>(null!);
  const dl = useRef<DataListClass<T>>(null!);
  const initRef = useRef(false);

  const [originItems] = useLoadableArray(props.$value, { preventMemorize: true });
  const { items } = useMemo(() => {
    return {
      items: originItems,
    };
  }, [originItems]);

  useEffect(() => {
    dl.current = new DataListClass<T>(eref.current, {
      columns: props.$columns,
      value: items,
      header: props.$header,
      headerHeight: props.$headerHeight,
      footer: props.$footer,
      footerHeight: props.$footerHeight,
      rowHeight: props.$rowHeight,
      outline: props.$outline,
      rowBorder: props.$rowBorder,
      cellBorder: props.$cellBorder,
    });
    initRef.current = true;
    return () => {
      dl.current?.dispose();
    };
  }, []);

  useEffect(() => {
    dl.current.setColumns(props.$columns);
  }, [props.$columns]);

  useEffect(() => {
    dl.current.setValue(items);
  }, [items]);

  return (
    <div
      {...attributes(props, Style.wrap)}
      ref={ref}
    >
      {useMemo(() => <div ref={eref} />, [])}
      {props.$resize && <Resizer direction={props.$resize} />}
    </div>
  );
}) as DataListFC;

export default DataList;