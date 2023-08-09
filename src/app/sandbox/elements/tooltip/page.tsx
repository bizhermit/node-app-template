import TextBox from "#/components/elements/form/items/text-box";
import Tooltip from "#/components/elements/tooltip";

const Page = () => {
  return (
    <div className="flex-stretch p-xs w-100 h-100">
      <TextBox
        className="ml-auto"
        $required
      />
      <Tooltip className="mt-auto">
        <div className="c-pure p-m">
          content
        </div>
        <div className="c-main p-s r-s e-2">
          Tooltip content
        </div>
      </Tooltip>
    </div>
  );
};

export default Page;