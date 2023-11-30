import GroupBox from "#/client/elements/group-box";
import Button from "../../../../foundations/client/elements/button";

const Page = () => {
  return (
    <div className="flex w-100 h-100 p-xs g-s">
      <div className="flex row bottom g-s">
        <GroupBox
          $caption="GroupBox"
          $bodyClassName="pb-xs px-m r-m"
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
          $bodyClassName="px-m p-xs"
        >
          <h1>Header 1</h1>
          <h2>Header 2</h2>
          <h3>Header 3</h3>
          <h4>Header 4</h4>
          <h5>Header 5</h5>
          <h6>Header 6</h6>
          <Button>button</Button>
        </GroupBox>
        <GroupBox
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
        </GroupBox>
      </div>
    </div>
  );
};

export default Page;