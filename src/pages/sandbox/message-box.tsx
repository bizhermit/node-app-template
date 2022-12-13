import Button from "@/components/elements/button";
import useMessageBox from "@/hooks/message-box";
import { NextPage } from "next";

const Page: NextPage = () => {
  const msg = useMessageBox();

  return (
    <div className="flex-box flex-start p-1 w-100 h-100 gap-1">
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
    </div>
  );
};

export default Page;