import Button from "@/components/elements/button";
import Divider from "@/components/elements/divider";
import { NextPage } from "next";

const Page: NextPage = () => {
  return (
    <div className="flex-start p-1 gap-1 w-100">
      <Button
        $onClick={async (unlock) => {
          try {
            const res = await fetch("/api/session", {});
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
            const res = await fetch("/api/session", {
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
            const res = await fetch("/api/session", {
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
            const res = await fetch("/api/session", {
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
            const res = await fetch("/api/session/1", {});
            const data = await res.json();
            console.log(data);
          } finally {
            unlock();
          }
        }}
      >
        get
      </Button>
    </div>
  );
};

export default Page;