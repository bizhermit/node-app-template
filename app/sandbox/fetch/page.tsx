"use client";

import Button from "#/client/elements/button";
import Form from "#/client/elements/form";
import FileDrop from "#/client/elements/form/items/file-drop";
import TextBox from "#/client/elements/form/items/text-box";
import GroupBox from "#/client/elements/group-box";
import Loading from "#/client/elements/loading";
import Row from "#/client/elements/row";
import StructView from "#/client/elements/struct-view";
import useFetch from "#/client/hooks/fetch-api";
import useProcess from "#/client/hooks/process";
import { sample_boolean, sample_boolean_num, sample_boolean_str, sample_date, sample_number, sample_string } from "$/data-items/sample/item";
import { useState } from "react";

type Hoge = DataProps<[
  typeof sample_string,
  typeof sample_number,
  typeof sample_boolean,
  typeof sample_boolean_num,
  typeof sample_boolean_str,
  typeof sample_date,
]>;

const Page = () => {
  const api = useFetch();
  const process = useProcess();
  const [response, setResponse] = useState<any>({});

  return (
    <div className="flex p-xs g-s w-100">
      {process.ing && <Loading />}
      <GroupBox
        $caption="/fetch"
        $bodyClassName="p-xs"
      >
        <Row className="g-s">
          <Button
            $onClick={async (unlock) => {
              await process(async () => {
                const res = await api.get("/api/fetch", {
                  s_string: "tetetetette",
                }, {
                  contentType: "json",
                });
                console.log(res);
                setResponse(res);
              }, {
                finished: unlock,
              });
            }}
          >
            get
          </Button>
          <Button
            $onClick={async (unlock) => {
              await process(async () => {
                const res = await api.post("/api/fetch", {
                  text: "a",
                  // file: new File(),
                }, {
                  contentType: "json",
                });
                console.log(res);
                setResponse(res);
              }, {
                finished: unlock,
              });
            }}
          >
            post as json
          </Button>
          <Button
            $onClick={async (unlock) => {
              await process(async () => {
                const res = await api.post("/api/fetch", {
                  // text: "hoge",
                }, {
                  contentType: "formData",
                });
                console.log(res);
                setResponse(res);
              }, {
                finished: unlock,
              });
            }}
          >
            post as formData
          </Button>
          <Button
            $onClick={async (unlock) => {
              await process(async () => {
                const res = await api.put("/api/fetch", {
                });
                console.log(res);
                setResponse(res);
              }, {
                finished: unlock,
              });
            }}
          >
            put
          </Button>
          <Button
            $onClick={async (unlock) => {
              await process(async () => {
                const res = await api.delete("/api/fetch", {
                });
                console.log(res);
                setResponse(res);
              }, {
                finished: unlock,
              });
            }}
          >
            delete
          </Button>
        </Row>
      </GroupBox>
      <GroupBox
        $caption="/fetch formdata"
        $bodyClassName="p-xs"
      >
        <Form
          className="flex g-s"
          $submitDataType="formData"
          $onSubmit={(formData, method) => {
            process(async () => {
              switch (method) {
                case "get":
                  return await api.get("/api/fetch", formData, {
                    contentType: "formData",
                    messageChecked: (ctx) => {
                      console.log(ctx);
                    },
                  });
                case "post":
                  return await api.post("/api/fetch", formData, { contentType: "formData" });
                case "put":
                  return await api.put("/api/fetch", formData, { contentType: "formData" });
                case "delete":
                  return await api.delete("/api/fetch", formData, { contentType: "formData" });
                default:
                  throw new Error("no method");
              }
            }, {
              then: (ret) => {
                console.log(ret);
                setResponse(ret);
              },
            });
          }}
        >
          <TextBox
            // name="text"
            $dataItem={sample_string}
            // $validations={[
            //   (...args) => {
            //     console.log("validation-item:", args);
            //     return undefined;
            //   }
            // ]}
          />
          <FileDrop
            name="file"
            style={{
              width: "20rem",
              height: "10rem",
            }}
          />
          <Row className="g-s">
            <Button type="submit" formMethod="get">get</Button>
            <Button type="submit" formMethod="post">post</Button>
            <Button type="submit" formMethod="put">put</Button>
            <Button type="submit" formMethod="delete">delete</Button>
          </Row>
        </Form>
      </GroupBox>
      <GroupBox
        $caption="/pages/api"
        $bodyClassName="p-xs"
      >
        <Row className="g-s">
          <Button $onClick={async (unlock) => {
            await process(async () => {
              const res = await api.get("/api/hello", {
                hello: "hoge",
              }, {
                contentType: "json",
              });
              console.log(res);
              setResponse(res);
            }, {
              finished: unlock,
            });
          }}>
            hello
          </Button>
        </Row>
      </GroupBox>
      <StructView
        $value={response}
      />
    </div>
  );
};

export default Page;