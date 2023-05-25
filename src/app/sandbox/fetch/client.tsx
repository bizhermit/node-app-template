/* eslint-disable no-console */
"use client";

import Button from "#/components/elements/button";
import Form from "#/components/elements/form";
import FileDrop from "#/components/elements/form-items/file-drop";
import TextBox from "#/components/elements/form-items/text-box";
import GroupBox from "#/components/elements/group-box";
import Loading from "#/components/elements/loading";
import Row from "#/components/elements/row";
import StructView from "#/components/elements/struct-view";
import useFetch from "#/hooks/fetch-api";
import useProcess from "#/hooks/process";
import { useState } from "react";

const FetchClient = () => {
  const api = useFetch();
  const process = useProcess();
  const [response, setResponse] = useState<any>({});

  return (
    <div className="flex-start p-1 gap-1 w-100">
      {process.ing && <Loading />}
      <GroupBox
        $caption="/fetch"
        $bodyClassName="p-1"
      >
        <Row className="gap-1">
          <Button
            $onClick={async (unlock) => {
              await process(async () => {
                const res = await api.get("/fetch", {
                  text: "",
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
                const res = await api.post("/fetch", {
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
                const res = await api.post("/fetch", {
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
                const res = await api.put("/fetch");
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
                const res = await api.delete("/fetch");
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
        $bodyClassName="p-1"
      >
        <Form
          className="flex-start gap-1"
          $submitDataType="formData"
          $onSubmit={(formData, method) => {
            process(async () => {
              switch (method) {
                case "get":
                  return await api.get("/fetch", formData, { contentType: "formData" });
                case "post":
                  return await api.post("/fetch", formData, { contentType: "formData" });
                case "put":
                  return await api.put("/fetch", formData, { contentType: "formData" });
                case "delete":
                  return await api.delete("/fetch", formData, { contentType: "formData" });
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
            name="text"
          />
          <FileDrop
            name="file"
            style={{
              width: "20rem",
              height: "10rem",
            }}
          />
          <Row className="gap-1">
            <Button type="submit" formMethod="get">get</Button>
            <Button type="submit" formMethod="post">post</Button>
            <Button type="submit" formMethod="put">put</Button>
            <Button type="submit" formMethod="delete">delete</Button>
          </Row>
        </Form>
      </GroupBox>
      <StructView
        $value={response}
      />
    </div>
  );
};

export default FetchClient;