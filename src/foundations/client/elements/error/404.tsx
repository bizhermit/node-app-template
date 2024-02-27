import { type FC, type HTMLAttributes } from "react";
import joinCn from "../../utilities/join-class-name";
import NextLink from "../link";
import Style from "./index.module.scss";

const Error404: FC<HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => {
  return (
    <div
      {...props}
      className={joinCn(Style.wrap, className)}
    >
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
