/* eslint-disable no-console */
"use client";

import LinkButton from "#/client/elements/button/link";
import Form from "#/client/elements/form";
import TextBox from "#/client/elements/form/items/text-box";
import { HomeIcon } from "#/client/elements/icon";
import NextLink from "#/client/elements/link";
import { isNotEmpty } from "#/objects/empty";
import BaseLayout, { BaseRow, BaseSection, BaseSheet } from "@/dev/_components/base-layout";
import ControlLayout, { ControlItem } from "@/dev/_components/control-layout";

const Page: PageFC = ({ searchParams }) => {
  const disabled = isNotEmpty(searchParams?.disabled);

  return (
    <BaseLayout title="NextLink">
      <ControlLayout>
        <ControlItem caption="disabled">
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
            href="/sandbox/dynamic/[id]"
            params={{ id: 1 }}
          >
            dynamic pathname
          </NextLink>
          <NextLink
            disabled={disabled}
            href="/sandbox/dynamic/[id]"
          >
            dynamic pathname (no params)
          </NextLink>
          <NextLink
            disabled={disabled}
            href="/sandbox/dynamic/slug/[...slug]"
            params={{ slug: 2 }}
          >
            dynamic pathname (slug)
          </NextLink>
          <NextLink
            disabled={disabled}
            href="/sandbox/dynamic/slug-arr/[[...slug]]"
            params={{ slug: [3, 4] }}
          >
            dynamic pathname (slug array)
          </NextLink>
          <NextLink
            disabled={disabled}
            href="https://bizhermit.com"
            target="_blank"
          >
            external link
          </NextLink>
        </BaseSection>
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
        <BaseSection title="on check">
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
        <BaseSection title="in form">
          <Form
            $flexLayout
            $onSubmit={false}
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