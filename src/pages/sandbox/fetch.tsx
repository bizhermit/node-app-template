import Button from "@/components/elements/button";
import Divider from "@/components/elements/divider";
import Form from "@/components/elements/form";
import TextBox from "@/components/elements/form-items/text-box";
import { NextPage } from "next";

const Page: NextPage = () => {
  return (
    <div className="flex-start p-1 gap-1 w-100">
      <Button
        $onClick={async (unlock) => {
          try {
            const res = await fetch("/api/fetch", {});
            const data = await res.json();
            console.log(data);
          } finally {
            unlock();
          }
        }}
      >
        get
      </Button>
      <Button
        $onClick={async (unlock) => {
          const csrfToken = document.cookie.split(";").find(item => {
            const [key, value] = item.trim().split("=");
            return key === "CSRF-Token";
          })?.split("=")[1];
          console.log(csrfToken);
          try {
            const res = await fetch("/api/fetch", {
              method: "post",
              body: JSON.stringify({ hoge: 1 }),
              // credentials: "same-origin",
              headers: {
                "CSRF-Token": csrfToken ?? "",
              },
            });
            const data = await res.json();
            console.log(data);
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
            const res = await fetch("/api/fetch", {
              method: "put",
              body: JSON.stringify({ hoge: 10 }),
            });
            const data = await res.json();
            console.log(data);
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
            const res = await fetch("/api/fetch", {
              method: "delete",
              body: JSON.stringify({ hoge: 100 }),
            });
            const data = await res.json();
            console.log(data);
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
            const res = await fetch("/api/fetch/1", {});
            const data = await res.json();
            console.log(data);
          } finally {
            unlock();
          }
        }}
      >
        get
      </Button>
      <Form
        className="flex-start gap-1"
        action="/api/fetch"
      >
        <TextBox name="textbox" />
        <Button type="submit">submit</Button>
      </Form>
    </div>
  );
};

export default Page;