import Link, { type LinkProps } from "next/link";
import { forwardRef, type AnchorHTMLAttributes } from "react";
import replaceDynamicPathname from "../../../objects/url/dynamic-pathname";

export type Href = PagePath | `http${string}` | `tel:${string}` | `mailto:${string}`;

export type NextLinkOptions = {
  href?: Href;
  params?: { [v: string | number | symbol]: any } | null | undefined;
  query?: { [v: string | number | symbol]: any } | null | undefined;
  disabled?: boolean;
} & Omit<LinkProps, "href">;

export type NextLinkProps = OverwriteAttrs<Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">, NextLinkOptions>;

export const NextLink = forwardRef<HTMLAnchorElement, NextLinkProps>(({
  href,
  params,
  query,
  disabled,
  replace,
  scroll,
  shallow,
  passHref,
  prefetch,
  locale,
  legacyBehavior,
  ...props
}, ref) => {
  if (!href || disabled) {
    return <a {...props} aria-disabled="true" tabIndex={-1} />;
  }
  const pathname = replaceDynamicPathname(href, params);
  return (
    <Link
      {...props}
      ref={ref}
      replace={replace}
      scroll={scroll}
      shallow={shallow}
      passHref={passHref}
      prefetch={prefetch ?? false}
      locale={locale}
      legacyBehavior={legacyBehavior}
      href={query ? { pathname, query } : pathname}
    />
  );
});

export default NextLink;
