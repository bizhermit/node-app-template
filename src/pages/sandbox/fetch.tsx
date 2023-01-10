import Button from "@/components/elements/button";
import Divider from "@/components/elements/divider";
import Form from "@/components/elements/form";
import FileButton from "@/components/elements/form-items/file-button";
import TextArea from "@/components/elements/form-items/text-area";
import TextBox from "@/components/elements/form-items/text-box";
import GroupBox from "@/components/elements/group-box";
import Row from "@/components/elements/row";
import StructView from "@/components/elements/struct-view";
import useFetch from "@/hooks/fetch";
import fetchApi from "@/utilities/fetch-api";
import { NextPage } from "next";
import { useState } from "react";

const Page: NextPage = () => {
  const api = useFetch();
  const [response, setResponse] = useState({});

  return (
    <div className="flex-start p-1 gap-1 w-100">
      <Row $vAlign="top" className="gap-1">
        <GroupBox $caption="fetch">
          <Form
            className="flex-start p-1 gap-1"
            $bind
            $onSubmit={(data) => {
              console.log(data);
              api.post("/fetch", data);
            }}
          >
            <Row className="gap-1">
              <Button
                $onClick={async (unlock) => {
                  try {
                    // const res = await fetchApi crossFetch("/api/fetch?hoge=1&hoge=2&fuga=3", {});
                    api.get("/fetch");
                    const res = await api.get("/fetch", {
                      hoge: 1,
                      fuga: [2, 3],
                    });
                    setResponse(res);
                  } finally {
                    unlock();
                  }
                }}
              >
                get
              </Button>
              <Button
                $onClick={async (unlock) => {
                  try {
                    const res = await fetchApi.post("/fetch");
                    setResponse(res);
                  } finally {
                    unlock();
                  }
                }}
              >
                post
              </Button>
              <Button
                $onClick={async (unlock) => {
                  try {
                    const res = await fetchApi.put("/fetch", { hoge: 10 });
                    // (await (await fetchApi.get("/notfound")).data);
                    setResponse(res);
                  } finally {
                    unlock();
                  }
                }}
              >
                put
              </Button>
              <Button
                $onClick={async (unlock) => {
                  try {
                    const res = await fetchApi.delete("/fetch", { hoge: 100 });
                    setResponse(res);
                  } finally {
                    unlock();
                  }
                }}
              >
                delete
              </Button>
            </Row>
            <Row className="gap-1">
              <Button
                $onClick={async (unlock) => {
                  try {
                    const res = await fetchApi.get("/fetch/[id]", { fuga: 3, id: 1, hoge: [2, 3] });
                    setResponse(res);
                  } finally {
                    unlock();
                  }
                }}
              >
                get (dynamic url)
              </Button>
            </Row>
            <Row>
              <TextBox />
              <Button type="submit">submit</Button>
            </Row>
          </Form>
        </GroupBox>
        <GroupBox $caption="form" $bodyClassName="p-1">
          <Form
            className="flex-start gap-1"
            action="/api/form"
          >
            <TextBox name="textbox" />
            <TextBox name="textbox" />
            <TextArea name="textarea" />
            <Row className="gap-1">
              <Button type="submit" formMethod="get">get</Button>
              <Button type="submit" formMethod="post">post</Button>
            </Row>
          </Form>
        </GroupBox>
        <GroupBox $caption="form (file)" $bodyClassName="p-1">
          <Form
            className="flex-start gap-1"
            action="/api/form"
          >
            <TextBox name="textbox" />
            <TextBox name="textbox" />
            <TextArea name="textarea" />
            <FileButton name="filebutton1" />
            <FileButton name="filebutton2" />
            <Row className="gap-1">
              <Button type="submit" formMethod="get">get</Button>
              <Button type="submit" formMethod="post">post</Button>
            </Row>
          </Form>
        </GroupBox>
      </Row>
      <Divider />
      <GroupBox $caption="response" $bodyClassName="p-1">
        <StructView $value={response} />
      </GroupBox>
    </div>
  );
};

export default Page;