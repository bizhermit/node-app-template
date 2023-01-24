import { attributes } from "@/components/utilities/attributes";
import Link, { LinkProps } from "next/link";
import { UrlObject } from "url";
import { AnchorHTMLAttributes, FC, ReactNode } from "react";
import StringUtils from "@bizhermit/basic-utils/dist/string-utils";

export type NextLinkProps = Omit<LinkProps, "href"> & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href?: string | UrlObject;
  $tag?: React.ElementType;
  $noDecoration?: boolean;
  children?: ReactNode;
};

const NextLink: FC<NextLinkProps> = (props) => {
  const attrs = attributes(props, props.$noDecoration ? "no-decoration" : undefined);
  const href = attrs.href?.toString();
  if (StringUtils.isEmpty(href)) {
    if (typeof props.children === "object") {
      return <>{props.children}</>;
    }
    const Tag = props.$tag ?? "span";
    return <Tag {...attrs} />;
  }
  if (href.startsWith("http")) {
    return (
      <a
        {...attrs}
        href={href}
        target={props.target ?? "_blank"}
        rel={props.rel ?? "noopener noreferrer"}
      />
    );
  }
  return <Link {...attrs} href={attrs.href!} />;
};

export default NextLink;