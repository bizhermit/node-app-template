import NextLink from "#/client/elements/link";
import BaseLayout, { BaseSection, BaseSheet } from "../_components/base-layout";

const Page = () => {
  return (
    <BaseLayout title="AppRoute">
      <BaseSheet>
        <BaseSection title="dynamic">
          <ul>
            <li>
              <NextLink
                href="/dev/dynamic-route/param/[slug]"
                params={{ slug: 0 }}
              >
                [slug]
              </NextLink>
            </li>
            <li>
              <NextLink
                href="/dev/dynamic-route/slug-param/[...slug]"
                params={{ slug: [1, 2] }}
              >
                [...slug]
              </NextLink>
            </li>
            <li>
              <NextLink
                href="/dev/dynamic-route/slugs-param/[[...slug]]"
                params={{ slug: [3, 4, 5] }}
              >
                [[...slug]]
              </NextLink>
            </li>
          </ul>
        </BaseSection>
      </BaseSheet>
    </BaseLayout>
  );
};

export default Page;