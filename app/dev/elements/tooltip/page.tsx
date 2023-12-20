import TextBox from "#/client/elements/form/items/text-box";
import Tooltip from "#/client/elements/tooltip";
import BaseLayout, { BaseSheet } from "@/dev/_components/base-layout";

const Page = () => {
  return (
    <BaseLayout title="Tooltip">
      <BaseSheet>
        <TextBox
          $required
          $messagePosition="tooltip"
        />
        <Tooltip>
          <div
            className="bgc-primary"
            style={{ width: 100, height: 100 }}
          >
            content
          </div>
          <div className="fgc-main">
            tooltip
          </div>
        </Tooltip>
        <div
          style={{
            height: "150vh",
            width: "100%",
            // height: "10rem",
            // height: "100%",
            // width: "150vw",
            // width: "10rem",
            // width: "100%",
            background: "linear-gradient(-225deg, var(--c-main) 0%, var(--c-sub) 100%)",
          }}
        />
        <Tooltip
          style={{ marginLeft: "auto" }}
        >
          <div
            className="bgc-primary"
            style={{
              width: 100,
              height: 100,
            }}
          >
            content
          </div>
          <div className="fgc-main">
            tooltip
          </div>
        </Tooltip>
      </BaseSheet>
    </BaseLayout>
  );
};

export default Page;