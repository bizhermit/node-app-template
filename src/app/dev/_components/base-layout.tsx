import type { FC, ReactNode } from "react";
import Style from "./base-layout.module.scss";

const BaseLayout: FC<{
  title: ReactNode;
  scroll?: boolean;
  children: ReactNode;
}> = (props) => {
  return (
    <div
      className={Style.base}
      data-scroll={props.scroll}
    >
      <h1 className={Style.title}>
        {props.title}
      </h1>
      <div className={Style.contents}>
        {props.children}
      </div>
    </div>
  );
};

export const BaseSheet: FC<{
  stretch?: boolean;
  children: ReactNode;
}> = (props) => {
  return (
    <div
      className={Style.sheet}
      data-stretch={props.stretch}
    >
      {props.children}
    </div>
  );
};

export const BaseSection: FC<{
  title?: ReactNode;
  stretch?: boolean;
  children?: ReactNode;
}> = (props) => {
  return (
    <section className={Style.section}>
      {props.title && <h2>{props.title}</h2>}
      <div
        className={Style.content}
        data-stretch={props.stretch}
      >
        {props.children}
      </div>
    </section>
  );
};

export const BaseRow: FC<{
  $middle?: boolean;
  children?: ReactNode;
}> = (props) => {
  return (
    <div
      className={Style.row}
      data-middle={props.$middle}
    >
      {props.children}
    </div>
  );
};

export default BaseLayout;
