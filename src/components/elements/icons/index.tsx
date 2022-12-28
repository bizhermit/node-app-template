import { attributes } from "@/components/utilities/attributes";
import React, { HTMLAttributes } from "react";

export namespace Icon {

  export const Add = React.forwardRef<SVGSVGElement, HTMLAttributes<SVGSVGElement>>((props, ref) => {
    return (
      <svg {...attributes(props, "icon")} ref={ref}>
        <line x1="10" y1="30" x2="190" y2="30" stroke="black" stroke-width="2" />
      </svg>
    );
  });

}