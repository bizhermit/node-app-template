import NextLink from "#/client/elements/link";
import BaseLayout, { BaseRow, BaseSection } from "../../_components/base-layout";
import ControlLayout, { ControlItem } from "../../_components/control-layout";

const Layout: LayoutFC = ({ children, params }) => {
  return (
    <BaseLayout title="slug param layout">
      <ControlLayout>
        <ControlItem caption="route">
          <BaseRow>
            <NextLink href="/dev/dynamic-route/param/[slug]">index</NextLink>
            <NextLink href="/dev/dynamic-route/param/[slug]" params={{ slug: 1 }}>1</NextLink>
            <NextLink href="/dev/dynamic-route/param/[slug]" params={{ slug: 2 }}>2</NextLink>
            <NextLink href="/dev/dynamic-route/param/[slug]" params={{ slug: 3 }}>3</NextLink>
            <NextLink href="/dev/dynamic-route/param/[slug]" params={{ slug: 4 }}>4</NextLink>
            <NextLink href="/dev/dynamic-route/param/[slug]" params={{ slug: 5 }}>5</NextLink>
            <NextLink href="/dev/dynamic-route/param/[slug]" params={{ slug: 10 }}>10</NextLink>
            <NextLink href="/dev/dynamic-route/param/[slug]" params={{ slug: 100 }}>100</NextLink>
            <NextLink href="/dev/dynamic-route/param/[slug]" params={{ slug: "x", hoge: 1 }}>x</NextLink>
            <NextLink href="/dev/dynamic-route/param/[slug]" params={{ slug: "xxx", hoge: 2 }}>xxx</NextLink>
          </BaseRow>
        </ControlItem>
      </ControlLayout>
      <BaseSection title="/param/layout.tsx">
        <pre>
          {JSON.stringify(params, null, 2)}
        </pre>
      </BaseSection>
      {children}
    </BaseLayout>
  );
};

export default Layout;