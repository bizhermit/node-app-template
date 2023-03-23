import DataListClass from "@/components/elements/data-list/class";
import { attributes } from "@/components/utilities/attributes";
import useLoadableArray from "@/hooks/loadable-array";
import { type ForwardedRef, forwardRef, type FunctionComponent, type HTMLAttributes, type ReactElement, useEffect, useMemo, useRef, useState } from "react";
import Style from "$/components/elements/data-list.module.scss";
import Resizer, { type ResizeDirection } from "@/components/elements/resizer";

type OmitAttributes = "children";
type DataListProps<T extends Struct = Struct> = Omit<HTMLAttributes<HTMLDivElement>, OmitAttributes> & {
  $value?: LoadableArray<T>;
  $resize?: ResizeDirection;
};

interface DataListFC extends FunctionComponent<DataListProps> {
  <T extends Struct = Struct>(attrs: DataListProps<T>, ref?: ForwardedRef<HTMLDivElement>): ReactElement<any> | null;
}

const DataList: DataListFC = forwardRef<HTMLDivElement, DataListProps>(<T extends Struct = Struct>(props: DataListProps<T>, ref: ForwardedRef<HTMLDivElement>) => {
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
      value: items,
    });
    initRef.current = true;
    return () => {
      dl.current?.dispose();
    };
  }, []);

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
});

export default DataList;