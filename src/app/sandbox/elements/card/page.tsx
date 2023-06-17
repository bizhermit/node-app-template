import Card from "#/components/elements/card";
import CardClient from "@/sandbox/elements/card/client";

const Page = () => {
  return (
    <>
      <Card $accordion>
        <>head</>
        <>body</>
      </Card>
      <CardClient />
    </>
  );
};

export default Page;