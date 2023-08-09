"use client";

import Button from "#/components/elements/button";
import useMessageBox from "#/hooks/message-box";
import useRouter from "#/hooks/router";

const Page = () => {
  const msg = useMessageBox({ preventUnmountClose: true });
  const router = useRouter();

  return (
    <div className="flex-start p-xs w-100 h-100 g-s">
      <Button
        $onClick={async (unlock) => {
          const res = await msg.alert("alert", { preventEscape: true });
          console.log(res);
          unlock();
        }}
      >
        alert
      </Button>
      <Button
        $onClick={async (unlock) => {
          const res = await msg.alert({
            header: "お知らせ",
            body: "アラート",
            color: "warning",
          }, { preventEscape: true });
          console.log(res);
          unlock();
        }}
      >
        alert:header
      </Button>
      <Button
        $onClick={async (unlock) => {
          const res = await msg.confirm("確認");
          console.log(res);
          unlock();
        }}
      >
        confirm
      </Button>
      <Button
        $onClick={async (unlock) => {
          const res = await msg.confirm({
            header: "確認",
            body: "削除します。\nよろしいですか？",
            color: "danger",
          });
          console.log(res);
          unlock();
        }}
      >
        confirm:header
      </Button>
      <Button
        $onClick={async (unlock) => {
          msg.alert({
            header: "動作確認",
            body: "表示中に遷移",
          }).then(() => {
            console.log("close");
          });
          setTimeout(() => {
            router.push("/sandbox/color");
          }, 1000);
          unlock();
        }}
      >
        router push
      </Button>
    </div>
  );
};

export default Page;