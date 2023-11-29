import { type FC, type HTMLAttributes } from "react";
import { attributes } from "../../utilities/attributes";
import NextLink from "../link";
import Style from "./index.module.scss";

const Error404: FC<HTMLAttributes<HTMLDivElement>> = (props) => {
  return (
    <div {...attributes(props, Style.wrap)}>
      <h1 className={Style.title}>404&nbsp;|&nbsp;Not&nbsp;Found</h1>
      {props.children ??
        <NextLink href="/">
          back
        </NextLink>
      }
    </div>
  );
};

export default Error404;