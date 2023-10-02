import Badge from "#/client/elements/badge";
import BadgeClient from "@/sandbox/elements/badge/_components/client";

const Page = () => {
  return (
    <>
      <Badge
        $size="s"
      >
        <div className="w-100 h-100 c-main round flex column center middle">
          0
        </div>
      </Badge>
      <BadgeClient />
    </>
  );
};

export default Page;