import StructView, { StructKey } from "@/components/elements/struct-view";
import ArrayUtils from "@bizhermit/basic-utils/dist/array-utils";
import { NextPage } from "next";
import { useMemo } from "react";

const Page: NextPage = () => {

  const struct = useMemo(() => {
    const ret: Struct = {};
    ArrayUtils.generateArray(10, index => {
      ret[`item${index}`] = `value ${index}`;
    });
    return ret;
  }, []);

  const keys = useMemo<Array<StructKey>>(() => {
    return [
      {
        key: "item1",
      }
    ]
  }, []);

  return (
    <div className="flex-start w-100 p-1 gap-1">
      <StructView
        // keys={keys}
        $struct={struct}
      >
        StructView
      </StructView>
    </div>
  );
};

export default Page;