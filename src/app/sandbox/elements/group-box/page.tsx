import GroupBox from "#/components/elements/group-box";
import Row from "#/components/elements/row";

const Page = () => {
  return (
    <div className="flex-start w-100 h-100 p-xs g-s">
      <Row className="g-s">
        <GroupBox
          $caption="GroupBox"
          $bodyClassName="pb-xs px-2"
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
          $bodyClassName="pb-xs px-2"
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
          $bodyClassName="pb-xs px-2"
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

export default Page;