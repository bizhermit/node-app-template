import Button from "@/components/elements/button";
import useMessageBox from "@/hooks/message-box";
import { NextPage } from "next";
import { useRouter } from "next/router";

const Page: NextPage = () => {
  const msg = useMessageBox({ preventUnmountClose: true });
  const router = useRouter();

  return (
    <div className="flex-start p-1 w-100 h-100 gap-1">
      <Button
        $onClick={async (unlock) => {
          const res = await msg.alert("alert");
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
          });
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