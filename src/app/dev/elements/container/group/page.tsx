import Button from "#/client/elements/button";
import GroupContainer from "#/client/elements/group-container";
import BaseLayout, { BaseSheet } from "../../../_components/base-layout";

const Page = () => {
  return (
    <BaseLayout title="GroupContainer">
      <BaseSheet>
        <GroupContainer
          $caption="GroupBox"
          $bodyClassName="pb-xs px-m r-m"
        >
          <h1>Header 1</h1>
          <h2>Header 2</h2>
          <h3>Header 3</h3>
          <h4>Header 4</h4>
          <h5>Header 5</h5>
          <h6>Header 6</h6>
        </GroupContainer>
        <GroupContainer
          className="es-2"
          $caption="GroupBox"
          $color="primary"
          $bodyClassName="px-m p-xs"
        >
          <h1>Header 1</h1>
          <h2>Header 2</h2>
          <h3>Header 3</h3>
          <h4>Header 4</h4>
          <h5>Header 5</h5>
          <h6>Header 6</h6>
          <Button>button</Button>
        </GroupContainer>
        <GroupContainer
          className="es-4"
          $color="main"
          $bodyClassName="pb-xs px-m"
        >
          <h1>Header 1</h1>
          <h2>Header 2</h2>
          <h3>Header 3</h3>
          <h4>Header 4</h4>
          <h5>Header 5</h5>
          <h6>Header 6</h6>
        </GroupContainer>
      </BaseSheet>
    </BaseLayout>
  );
};

export default Page;