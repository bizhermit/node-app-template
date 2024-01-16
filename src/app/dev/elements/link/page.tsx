/* eslint-disable no-console */
"use client";

import LinkButton from "#/client/elements/button/link";
import Divider from "#/client/elements/divider";
import Form from "#/client/elements/form";
import TextBox from "#/client/elements/form/items/text-box";
import { HomeIcon } from "#/client/elements/icon";
import NextLink, { NextLinkProps } from "#/client/elements/link";
import { isNotEmpty } from "#/objects/empty";
import replaceDynamicPathname from "#/objects/url/dynamic-pathname";
import { type FC } from "react";
import BaseLayout, { BaseRow, BaseSection, BaseSheet } from "../../_components/base-layout";
import ControlLayout, { ControlItem } from "../../_components/control-layout";

const NextDynamicRouteLink: FC<NextLinkProps> = (props) => {
  return (
    <NextLink {...props}>
      {props.href} + {JSON.stringify(props.params ?? {})} = {replaceDynamicPathname(props.href!, props.params)}
    </NextLink>
  );
};

const Page: PageFC = ({ searchParams }) => {
  const disabled = isNotEmpty(searchParams?.disabled);
  // const disabled = false;

  return (
    <BaseLayout title="NextLink">
      <ControlLayout>
        <ControlItem caption="switch disabled">
          <BaseRow>
            <LinkButton
              href="/dev/elements/link"
              disabled={!disabled}
              scroll={false}
            >
              enabled
            </LinkButton>
            <LinkButton
              href="/dev/elements/link"
              disabled={disabled}
              query={{ disabled: true }}
              scroll={false}
            >
              disabled
            </LinkButton>
          </BaseRow>
        </ControlItem>
      </ControlLayout>
      <BaseSheet>
        <BaseSection title="link">
          <NextLink
            href="/dev/elements/link"
            disabled={disabled}
          >
            link
          </NextLink>
          <NextLink disabled={disabled}>
            link (no set)
          </NextLink>
          <NextLink
            disabled={disabled}
            href="https://bizhermit.com"
            target="_blank"
          >
            external link
          </NextLink>
          <Divider />
          <style jsx>{`
            ol {
              margin: 0;
            }
            li {
              padding: var(--b-xs) 0;
            }
          `}</style>
          <ol>
            <li>
              <NextDynamicRouteLink
                disabled={disabled}
                href="/dev/dynamic-route/param/[slug]"
              />
            </li>
            <li>
              <NextDynamicRouteLink
                disabled={disabled}
                href="/dev/dynamic-route/param/[slug]"
                params={{ slug: 1 }}
              />
            </li>
            <li>
              <NextDynamicRouteLink
                disabled={disabled}
                href="/dev/dynamic-route/param/[slug]"
                params={{ slug: [2, 3] }}
              />
            </li>
            <li>
              <NextDynamicRouteLink
                disabled={disabled}
                href="/dev/dynamic-route/slug-param/[...slug]"
              />
            </li>
            <li>
              <NextDynamicRouteLink
                disabled={disabled}
                href="/dev/dynamic-route/slug-param/[...slug]"
                params={{ slug: 3 }}
              />
            </li>
            <li>
              <NextDynamicRouteLink
                disabled={disabled}
                href="/dev/dynamic-route/slug-param/[...slug]"
                params={{ slug: [4, 5] }}
              />
            </li>
            <li>

              <NextDynamicRouteLink
                disabled={disabled}
                href="/dev/dynamic-route/slugs-param/[[...slug]]"
              />
            </li>
            <li>
              <NextDynamicRouteLink
                disabled={disabled}
                href="/dev/dynamic-route/slugs-param/[[...slug]]"
                params={{ slug: 6 }}
              />
            </li>
            <li>
              <NextDynamicRouteLink
                disabled={disabled}
                href="/dev/dynamic-route/slugs-param/[[...slug]]"
                params={{ slug: [7, 8] }}
              />
            </li>
          </ol>
        </BaseSection>
        <Divider />
        <BaseSection title="link button">
          <BaseRow>
            <LinkButton
              disabled={disabled}
              href="/dev/elements/link"
            >
              link button
            </LinkButton>
            <LinkButton
              disabled={disabled}
            >
              link button (no set)
            </LinkButton>
            <LinkButton
              disabled={disabled}
              $icon={<HomeIcon />}
              href="/dev/elements/link"
            >
              icon
            </LinkButton>
            <LinkButton
              href="/dev/elements/link"
              $outline
              $round
            >
              outline round
            </LinkButton>
          </BaseRow>
        </BaseSection>
        <Divider />
        <BaseSection title="intercept">
          <BaseRow>
            <LinkButton
              disabled={disabled}
              href="/dev/elements/link"
              onClick={() => {
                console.log("click check", true);
                return true;
              }}
            >
              sync true
            </LinkButton>
            <LinkButton
              disabled={disabled}
              href="/dev/elements/link"
              onClick={() => {
                console.log("click check", false);
                return false;
              }}
            >
              sync flase
            </LinkButton>
            <LinkButton
              disabled={disabled}
              href="/dev/elements/link"
              onClick={async (unlock) => {
                console.log("click check start");
                await new Promise(resolve => setTimeout(resolve, 2000));
                console.log("click check end", true);
                unlock();
                return true;
              }}
            >
              async true
            </LinkButton>
            <LinkButton
              disabled={disabled}
              href="/dev/elements/link"
              target="_blank"
              onClick={async (unlock) => {
                console.log("click check start");
                await new Promise(resolve => setTimeout(resolve, 2000));
                console.log("click check end", true);
                unlock();
                return true;
              }}
            >
              async true (target=_blank)
            </LinkButton>
            <LinkButton
              disabled={disabled}
              href="/dev/elements/link"
              onClick={async (unlock) => {
                console.log("click check start");
                await new Promise(resolve => setTimeout(resolve, 2000));
                console.log("click check end", false);
                unlock();
                return false;
              }}
            >
              async false
            </LinkButton>
          </BaseRow>
        </BaseSection>
        <Divider />
        <BaseSection title="in form">
          <Form
            $layout="flex"
            onSubmit={false}
            $disabled={disabled}
          >
            <TextBox name="text" $required />
            <BaseRow>
              <LinkButton href="/dev/elements/link" $dependsOnForm>ref disabled</LinkButton>
              <LinkButton href="/dev/elements/link" $dependsOnForm="submit">ref disabled/error (like submit)</LinkButton>
              <LinkButton href="/dev/elements/link">not depends on form</LinkButton>
            </BaseRow>
          </Form>
        </BaseSection>
      </BaseSheet>
    </BaseLayout>
  );
};

export default Page;