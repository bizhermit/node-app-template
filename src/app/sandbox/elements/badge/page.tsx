import Badge from "#/components/elements/badge";
import BadgeClient from "@/sandbox/elements/badge/client";

const Page = () => {
  return (
    <>
      <Badge
        $size="s"
      >
        <div className="w-100 h-100 c-main round flex-center">
          0
        </div>
      </Badge>
      <BadgeClient />
    </>
  );
};

export default Page;