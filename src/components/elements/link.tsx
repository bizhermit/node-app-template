import { attributes, isReactNode } from "@/components/utilities/attributes";
import Link, { type LinkProps } from "next/link";
import type { UrlObject } from "url";
import type { AnchorHTMLAttributes, ElementType, FC, ReactNode } from "react";
import StringUtils from "@bizhermit/basic-utils/dist/string-utils";

export type NextLinkProps = Omit<LinkProps, "href"> & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href?: string | UrlObject;
  $tag?: ElementType;
  $noDecoration?: boolean;
  $disabled?: boolean;
  children?: ReactNode;
};

const NextLink: FC<NextLinkProps> = (props) => {
  const attrs = attributes(props, props.$noDecoration ? "no-decoration" : undefined);
  const href = attrs.href?.toString();

  if (StringUtils.isEmpty(href) || props.$disabled) {
    const Tag = props.$tag ?? (isReactNode(props.children) ? "div" : "span");
    return <Tag {...attrs} />;
  }

  if (/^(http|tel:|mailto:)/.test(href)) {
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