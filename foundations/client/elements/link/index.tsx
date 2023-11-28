import { getDynamicUrl } from "#/utilities/url";
import Link, { type LinkProps } from "next/link";
import { forwardRef, type AnchorHTMLAttributes, type LegacyRef, type ReactNode, type Ref } from "react";
import { attributes } from "../../utilities/attributes";

type Href = PagePath | RelativePagePath | `http${string}` | `tel:${string}` | `mailto:${string}`;

export type NextLinkProps = Omit<LinkProps, "href"> & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href?: Href | {
    pathname?: Href;
    params?: { [key: string]: any };
  };
  $noDecoration?: boolean;
  $disabled?: boolean;
  children?: ReactNode;
};

const NextLink = forwardRef<HTMLAnchorElement, NextLinkProps>((props, ref) => {
  const attrs = attributes(props, props.$noDecoration ? "plain-text" : undefined);
  const href = (() => {
    if (typeof props.href === "string") return props.href;
    if (!props.href?.pathname) return undefined;
    return getDynamicUrl(props.href.pathname, props.href.params, { appendQuery: true });
  })();

  if (!href || props.$disabled) {
    return <a {...attrs} ref={ref} href={undefined} />;
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

  return (
    <Link
      prefetch={false}
      {...attrs}
      href={href}
      ref={ref as Ref<HTMLAnchorElement> | undefined}
    />
  );
});

export default NextLink;