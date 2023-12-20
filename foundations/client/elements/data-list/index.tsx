"use client";

import { forwardRef, useEffect, useMemo, useRef, type ForwardedRef, type FunctionComponent, type HTMLAttributes, type ReactElement } from "react";
import useLoadableArray from "../../hooks/loadable-array";
import joinCn from "../../utilities/join-class-name";
import Resizer, { type ResizeDirection } from "../resizer";
import DataListClass, { type DataListColumn } from "./class";
import Style from "./index.module.scss";

type Data = { [v: string | number | symbol]: any };

type DataListOptions<T extends Data = Data> = {
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

export type DataListProps<T extends Data = Data> =
  OverwriteAttrs<Omit<HTMLAttributes<HTMLDivElement>, "children">, DataListOptions<T>>;

interface DataListFC extends FunctionComponent<DataListProps> {
  <T extends Data = Data>(
    attrs: ComponentAttrsWithRef<HTMLDivElement, DataListProps<T>>
  ): ReactElement<any> | null;
}

const DataList: DataListFC = forwardRef(<T extends Data = Data>({
  className,
  $columns,
  $value,
  $header,
  $headerHeight,
  $footer,
  $footerHeight,
  $rowHeight,
  $outline,
  $rowBorder,
  $cellBorder,
  $resize,
  ...props
}: DataListProps<T>, ref: ForwardedRef<HTMLDivElement>) => {
  const eref = useRef<HTMLDivElement>(null!);
  const dl = useRef<DataListClass<T>>(null!);
  const initRef = useRef(false);

  const [originItems] = useLoadableArray($value, { preventMemorize: true });
  const { items } = useMemo(() => {
    return {
      items: originItems,
    };
  }, [originItems]);

  useEffect(() => {
    dl.current = new DataListClass<T>(eref.current, {
      columns: $columns,
      value: items,
      header: $header,
      headerHeight: $headerHeight,
      footer: $footer,
      footerHeight: $footerHeight,
      rowHeight: $rowHeight,
      outline: $outline,
      rowBorder: $rowBorder,
      cellBorder: $cellBorder,
    });
    initRef.current = true;
    return () => {
      dl.current?.dispose();
    };
  }, []);

  useEffect(() => {
    dl.current.setColumns($columns);
  }, [$columns]);

  useEffect(() => {
    dl.current.setValue(items);
  }, [items]);

  return (
    <div
      {...props}
      className={joinCn(Style.wrap, className)}
      ref={ref}
    >
      {useMemo(() => <div ref={eref} />, [])}
      {$resize && <Resizer $direction={$resize} />}
    </div>
  );
}) as DataListFC;

export default DataList;