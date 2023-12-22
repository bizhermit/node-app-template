"use client";

import Button from "#/client/elements/button";
import Form from "#/client/elements/form";
import TextBox from "#/client/elements/form/items/text-box";
import useFetch from "#/client/hooks/fetch-api";
import BaseLayout, { BaseSection, BaseSheet } from "@/dev/_components/base-layout";

const Page = () => {
  const api = useFetch();

  return (
    <BaseLayout title="Fetch">
      <BaseSheet>
        <BaseSection title="get">
          <Form
            method="get"
            onSubmit={async (data) => {
              // console.log(data);
              // const res = await api.get("/dev/fetch/api", {
              //   text: "hoge",
              // });
              const _res = await api.get("/dev/fetch/api", data);
              // console.log(JSON.stringify(_res, null, 2));
            }}
          >
            <TextBox name="text" />
            <Button type="submit">submit</Button>
          </Form>
        </BaseSection>
      </BaseSheet>
    </BaseLayout>
  );
};

export default Page;