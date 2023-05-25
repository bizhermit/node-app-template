"use client";

import GroupBox from "#/components/elements/group-box";
import Row from "#/components/elements/row";

const GroupBoxClient = () => {
  return (
    <div className="flex-start w-100 h-100 p-1 gap-1">
      <Row className="gap-1">
        <GroupBox
          $caption="GroupBox"
          $bodyClassName="pb-1 px-2"
        >
          <h1>Header 1</h1>
          <h2>Header 2</h2>
          <h3>Header 3</h3>
          <h4>Header 4</h4>
          <h5>Header 5</h5>
          <h6>Header 6</h6>
        </GroupBox>
        <GroupBox
          className="es-2"
          $caption="GroupBox"
          $color="primary"
          $bodyClassName="pb-1 px-2"
        >
          <h1>Header 1</h1>
          <h2>Header 2</h2>
          <h3>Header 3</h3>
          <h4>Header 4</h4>
          <h5>Header 5</h5>
          <h6>Header 6</h6>
        </GroupBox>
        <GroupBox
          className="es-4"
          $color="main"
          $bodyClassName="pb-1 px-2"
        >
          <h1>Header 1</h1>
          <h2>Header 2</h2>
          <h3>Header 3</h3>
          <h4>Header 4</h4>
          <h5>Header 5</h5>
          <h6>Header 6</h6>
        </GroupBox>
      </Row>
    </div>
  );
};

export default GroupBoxClient;