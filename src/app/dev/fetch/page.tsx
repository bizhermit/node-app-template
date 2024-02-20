/* eslint-disable no-console */
"use client";

import Button from "#/client/elements/button";
import Form from "#/client/elements/form";
import { useFormItem } from "#/client/elements/form/items/hooks";
import NumberBox from "#/client/elements/form/items/number-box";
import TextBox from "#/client/elements/form/items/text-box";
import useFetch from "#/client/hooks/fetch-api";
import BaseLayout, { BaseSection, BaseSheet } from "../_components/base-layout";

const Page = () => {
  const api = useFetch();
  const formItem = useFormItem();

  return (
    <BaseLayout title="Fetch">
      <BaseSheet>
        <BaseSection title="get">
          <Form
            method="get"
            $layout="flex"
            onSubmit={async (data) => {
              try {
                // console.log(data);
                const _res = await api.get("/dev/fetch/api", data, {
                  succeeded: () => {
                    return {
                      finally: async () => {
                        console.log("succeeded");
                        setTimeout(formItem.focus, 200);
                      },
                    };
                  },
                  failed: () => {
                    return {
                      // quiet: true,
                      finally: async () => {
                        console.log("failed.");
                        setTimeout(formItem.focus, 200);
                      },
                    };
                  },
                });
                // const _res = await api.get("/dev/fetch/api", {
                //   // text: "abcd",
                // });
                console.log(JSON.stringify(_res, null, 2));
                // setTimeout(formItem.focus, 0);
              } catch (e) {
                // console.log(e);
              }
            }}
          >
            <TextBox name="text" $ref={formItem} />
            <NumberBox name="num" />
            <Button type="submit">submit</Button>
          </Form>
        </BaseSection>
      </BaseSheet>
    </BaseLayout>
  );
};

export default Page;
