import Badge from "@/components/elements/badge";
import Row from "@/components/elements/row";
import { NextPage } from "next";

const Page: NextPage = () => {
  return (
    <div className="flex-box flex-start p-2 w-100 h-100 gap-1">
      <Row className="gap-1">
        <div className="anchor c-primary">
          <Badge
            className="c-base e-4 round"
            $position="left-top"
            $size="m"
          >
            0
          </Badge>
        </div>
        <div className="anchor c-primary">
          <Badge
            className="c-base e-4 round"
            $position="right-top"
          >
            0
          </Badge>
        </div>
      </Row>
      <Row className="gap-1">
        <div className="anchor c-primary">
          <Badge
            className="c-base e-4 round"
            $position="left-bottom"
          >
            0
          </Badge>
        </div>
        <div className="anchor c-primary">
          <Badge
            className="c-base e-4 round"
            $position="right-bottom"
          >
            0
          </Badge>
        </div>
      </Row>
      <style jsx>{`
        .anchor {
          position: relative;
          height: 20rem;
          width: 20rem;
        }
      `}</style>
    </div>
  );
};

export default Page;