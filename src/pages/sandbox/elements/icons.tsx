import Button from "@/components/elements/button";
import { PlusIcon, CrossIcon, MinusIcon, MenuIcon, RightIcon, LeftIcon, UpIcon, DownIcon, DoubleLeftIcon, DoubleRightIcon, DoubleUpIcon, DoubleDownIcon, ClockIcon, ListIcon } from "@/components/elements/icon";
import Row from "@/components/elements/row";
import Text from "@/components/elements/text";
import { NextPage } from "next";

const Page: NextPage = () => {
  return (
    <div className="flex-start p-2 w-100 flex-1_0_0 fgc-danger bgc-pure gap-1">
      <Row className="gap-2">
        <Button $icon={<PlusIcon />}>Button</Button>
        <Button $icon={<CrossIcon />} $outline />
        <Button $icon={<CrossIcon />} $outline $size="s" />
      </Row>
      {[
        PlusIcon,
        MinusIcon,
        CrossIcon,
        MenuIcon,
        LeftIcon,
        DoubleLeftIcon,
        RightIcon,
        DoubleRightIcon,
        UpIcon,
        DoubleUpIcon,
        DownIcon,
        DoubleDownIcon,
        ClockIcon,
        ListIcon,
      ].map(Component => {
        const name = Component.name;
        return (
          <Row key={name} className="gap-2">
            <Component className="bgc-base" $size="xs" />
            <Component className="bgc-base" $size="s" />
            <Component className="bgc-base" $size="m" />
            <Component className="bgc-base" $size="l" />
            <Component className="bgc-base" $size="xl" />
            <Component className="bgc-base" />
            <Text>{name}</Text>
          </Row>
        );
      })}
    </div>
  );
};

export default Page;