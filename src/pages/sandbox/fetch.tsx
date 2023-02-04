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
import { getDynamicUrlContext } from "@/utilities/url";
import { NextPage } from "next";
import { useState } from "react";

const Page: NextPage = () => {
  const api = useFetch();
  const [response, setResponse] = useState({});

  return (
    <div className="flex-start p-1 gap-1 w-100">
      <Row className="gap-1 none">
        <StructView
          $value={(() => {
            const fd = new FormData();
            fd.append("id", "10");
            return {
              url: getDynamicUrlContext("/fetch/[id]", fd),
              data: fd,
            };
          })()}
        />
        <StructView
          $value={(() => {
            const fd = new FormData();
            // fd.append("id", "10");
            return {
              url: getDynamicUrlContext("/fetch/[id]", fd),
              data: fd,
            };
          })()}
        />
        <StructView
          $value={(() => {
            const fd = new FormData();
            fd.append("id", "10");
            return {
              url: getDynamicUrlContext("/fetch/[id]", fd, { appendQuery: false }),
              data: fd,
            };
          })()}
        />
        <StructView
          $value={(() => {
            const fd = new FormData();
            fd.append("id", "10");
            fd.append("hoge", "1");
            fd.append("hoge", "2");
            return {
              url: getDynamicUrlContext("/fetch/[id]", fd, { appendQuery: true }),
              data: fd,
            };
          })()}
        />
      </Row>
      <Row className="gap-1 none">
        <StructView
          $value={(() => {
            const data = {
              id: 10,
            };
            return {
              url: getDynamicUrlContext("/fetch/[id]", data),
              data,
            };
          })()}
        />
        <StructView
          $value={(() => {
            const data = {};
            return {
              url: getDynamicUrlContext("/fetch/[id]", data),
              data,
            };
          })()}
        />
        <StructView
          $value={(() => {
            const data = {
              id: 10
            };
            return {
              url: getDynamicUrlContext("/fetch/[id]", data, { appendQuery: false }),
              data,
            };
          })()}
        />
        <StructView
          $value={(() => {
            const data = {
              id: 10,
              hoge: [1, 2],
            };
            return {
              url: getDynamicUrlContext("/fetch/[id]", data, { appendQuery: true }),
              data,
            };
          })()}
        />
      </Row>
      <Divider />
      <Row $vAlign="top" className="gap-1">
        <GroupBox $caption="fetch">
          <Form
            className="flex-start p-1 gap-1"
            $bind
            $onSubmit={(data) => {
              console.log(data);
              // api.post("/fetch", data);
            }}
          >
            <Row className="gap-1">
              <Button
                $onClick={async (unlock) => {
                  try {
                    const res = await api.get("/fetch", {
                      id: "id1",
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
                    const res = await fetchApi.post("/fetch", {
                      number: "0100",
                      boolean: 2,
                      boolean01: false,
                      title: "titleあ",
                      body: "hoge",
                      release_date: new Date(),
                      date1: "2023-02-03",
                      date2: "2023-02-04",
                      array: [
                        "titleえ"
                      ],
                      arrayStruct: [{
                        title: "titleい",
                        body: "",
                        release_date: new Date(),
                      }],
                      struct: {
                        title: "titleう",
                        body: "",
                        release_date: new Date(),
                      },
                      structItem: {
                        title: "titleお",
                        body: "",
                        release_date: "2022-12-12",
                      }
                    });
                    setResponse(res);
                    console.log(res.data.messages);
                    console.log(res.data.data);
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
                    const res = await fetchApi.get("/fetch/[id]", {
                      id: 1,
                      hoge: "text",
                      fuga: [1, 2, 3]
                    });
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
        <GroupBox $caption="form (file)" $bodyClassName="p-1" className="none">
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