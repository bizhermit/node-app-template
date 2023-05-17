import { attributes, isReactNode } from "@/components/utilities/attributes";
import Link, { type LinkProps } from "next/link";
import type { UrlObject } from "url";
import { type AnchorHTMLAttributes, type ElementType, type LegacyRef, type ReactNode, forwardRef, type Ref } from "react";
import StringUtils from "@bizhermit/basic-utils/dist/string-utils";

export type NextLinkProps = Omit<LinkProps, "href"> & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href?: string | UrlObject;
  $altTag?: ElementType;
  $noDecoration?: boolean;
  $disabled?: boolean;
  children?: ReactNode;
};

const NextLink = forwardRef<HTMLElement, NextLinkProps>((props, ref) => {
  const attrs = attributes(props, props.$noDecoration ? "no-decoration" : undefined);
  const href = attrs.href?.toString();

  if (StringUtils.isEmpty(href) || props.$disabled) {
    const Tag = props.$altTag ?? (isReactNode(props.children) ? "div" : "span");
    return <Tag {...attrs} ref={ref} />;
  }

  if (/^(http|tel:|mailto:)/.test(href)) {
    return (
      <a
        {...attrs}
        ref={ref as LegacyRef<HTMLAnchorElement> | undefined}
        href={href}
        target={props.target ?? "_blank"}
        rel={props.rel ?? "noopener noreferrer"}
      />
    );
  }
  return <Link {...attrs} href={attrs.href!} ref={ref as Ref<HTMLAnchorElement> | undefined} />;
});

export default NextLink;