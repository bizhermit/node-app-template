import { attributes } from "@/utilities/attributes";
import Link, { LinkProps } from "next/link";
import { UrlObject } from "url";
import { FC, HTMLAttributes, ReactNode } from "react";
import StringUtils from "@bizhermit/basic-utils/dist/string-utils";

const NextLink: FC<Omit<LinkProps, "href"> & HTMLAttributes<HTMLElement> & {
  href?: string | UrlObject;
  $tag?: React.ElementType;
  $noDecoration?: boolean;
  children?: ReactNode;
}> = (props) => {
  const attrs = attributes(props, props.$noDecoration ? "no-decoration" : "");
  const href = attrs.href?.toString();
  if (StringUtils.isEmpty(href)) {
    const Tag = props.$tag ?? "span";
    return <Tag {...attrs} />;
  }
  if (href.startsWith("http")) {
    return <a {...attrs} href={href} />;
  }
  return <Link {...attrs} href={attrs.href!} />;
};

export default NextLink;