import Link, { type LinkProps } from "next/link";
import { forwardRef, type AnchorHTMLAttributes } from "react";
import { getValue } from "../../../objects/struct/get";

export type Href = PagePath | `http${string}` | `tel:${string}` | `mailto:${string}`;

export type NextLinkOptions = {
  href?: Href;
  params?: { [v: string | number | symbol]: any } | null | undefined;
  query?: { [v: string | number | symbol]: any } | null | undefined;
  disabled?: boolean;
} & Omit<LinkProps, "href">;

export type NextLinkProps = ExtAttrs<Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">, NextLinkOptions>;

export const replaceDynamicPathname = <T extends NextLinkOptions["href"]>(href: T, params: NextLinkOptions["params"]): T => {
  if (href == null) return href;
  return href.replace(/\[\[?([^\]]*)\]?\]/g, seg => {
    const r = seg.match(/^\[{1,2}(\.{3})?([^\]]*)\]{1,2}$/)!;
    const v = getValue(params, r[2]);
    if (Array.isArray(v)) {
      if (r[1]) return v.map(c => `${c}`).join("/");
      return v[0];
    }
    return v || "null";
  }) as T;
};

export const NextLink = forwardRef<HTMLAnchorElement, NextLinkProps>(({
  href,
  params,
  query,
  disabled,
  ...props
}, ref) => {
  if (!href || disabled) {
    return <a {...props} aria-disabled="true" tabIndex={-1} />;
  }
  return (
    <Link
      prefetch={false}
      {...props}
      ref={ref}
      target={props.target}
      href={{
        pathname: replaceDynamicPathname(href, params),
        query,
      }}
    />
  );
});

export default NextLink;