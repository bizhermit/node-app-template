import { PlusIcon, CrossIcon, MinusIcon } from "@/components/elements/icon";
import Row from "@/components/elements/row";
import Text from "@/components/elements/text";
import { NextPage } from "next";

const Page: NextPage = () => {
  return (
    <div className="flex-start p-2 w-100 flex-1_0_0 fgc-sub bgc-pure">
      {[
        PlusIcon,
        MinusIcon,
        CrossIcon,
      ].map(Component => {
        const name = Component.name;
        return (
          <Row key={name} className="gap-2">
            <Component className="bgc-base" />
            <Text>{name}</Text>
          </Row>
        );
      })}
    </div>
  );
};

export default Page;