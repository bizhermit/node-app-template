import Button from "@/components/elements/button";
import { NextPage } from "next";

const Page: NextPage = () => {
  return (
    <div className="flex-start p-1">
      <Button
        $onClick={async (unlock) => {
          try {
            const res = await fetch("/api/session");
            const data = await res.json();
            console.log(data);
          } finally {
            unlock();
          }
        }}
      >
        count up
      </Button>
      
    </div>
  );
};

export default Page;