"use client";

import TextBox from "#/components/elements/form-items/text-box";
import Tooltip from "#/components/elements/tooltip";

const TooltipClient = () => {
  return (
    <div className="flex-stretch p-1 w-100 h-100">
      <TextBox
        className="ml-auto"
        $required
      />
      <Tooltip className="mt-auto">
        <div className="c-pure p-3">
          content
        </div>
        <div className="c-main p-2 r-2 e-2">
          Tooltip content
        </div>
      </Tooltip>
    </div>
  );
};

export default TooltipClient;