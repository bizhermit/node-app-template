import Button from "@/components/elements/button";
import Divider from "@/components/elements/divider";
import Form from "@/components/elements/form";
import TextBox from "@/components/elements/form-items/text-box";
import Row from "@/components/elements/row";
import crossFetch from "@/utilities/cross-fetch";
import { NextPage } from "next";

const Page: NextPage = () => {
  return (
    <div className="flex-start p-1 gap-1 w-100">
      <Button
        $onClick={async (unlock) => {
          try {
            const res = await crossFetch("/api/fetch?hoge=1&hoge=2&fuga=3", {});
            console.log(res);
            // const data = await res.json();
            // console.log(data);
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
            const res = await crossFetch("/api/fetch", {
              method: "post",
              body: JSON.stringify({ hoge: 1 }),
            });
            console.log(res);
            // const data = await res.json();
            // console.log(data);
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
            const res = await crossFetch("/api/fetch", {
              method: "put",
              body: JSON.stringify({ hoge: 10 }),
            });
            console.log(res);
            // const data = await res.json();
            // console.log(data);
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
            const res = await crossFetch("/api/fetch", {
              method: "delete",
              body: JSON.stringify({ hoge: 100 }),
            });
            console.log(res);
            // const data = await res.json();
            // console.log(data);
          } finally {
            unlock();
          }
        }}
      >
        delete
      </Button>
      <Divider />
      <Button
        $onClick={async (unlock) => {
          try {
            const res = await crossFetch("/api/fetch/1", {});
            console.log(res);
            // const data = await res.json();
            // console.log(data);
          } finally {
            unlock();
          }
        }}
      >
        get
      </Button>
      <Form
        className="flex-start gap-1"
        action="/api/form"
      >
        <Row className="gap-1">
          <TextBox name="textbox" />
          <Button type="submit" formMethod="get">get</Button>
          <Button type="submit" formMethod="post">post</Button>
        </Row>
      </Form>
    </div>
  );
};

export default Page;