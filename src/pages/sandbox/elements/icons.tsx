import Button from "@/components/elements/button";
import { PlusIcon, CrossIcon, MinusIcon, MenuIcon, RightIcon, LeftIcon, UpIcon, DownIcon, DoubleLeftIcon, DoubleRightIcon, DoubleUpIcon, DoubleDownIcon, ClockIcon, ListIcon, CalendarIcon, TodayIcon, SaveIcon, ClearAllIcon, UndoIcon, RedoIcon } from "@/components/elements/icon";
import Row from "@/components/elements/row";
import Text from "@/components/elements/text";
import { NextPage } from "next";

const Page: NextPage = () => {
  return (
    <div className="flex-start p-2 w-100 h-100 fgc-danger bdc-pure gap-2">
      <Row className="gap-2">
        <Button $icon={<CrossIcon />} $outline $size="xs">XS Button</Button>
        <Button $icon={<CrossIcon />} $outline $size="s">S Button</Button>
        <Button $icon={<CrossIcon />} $outline>M Button</Button>
        <Button $icon={<CrossIcon />} $outline $size="l">L Button</Button>
        <Button $icon={<CrossIcon />} $outline $size="xl">XL Button</Button>
      </Row>
      <div
        className="flex-start p-2 w-100 flex-1_0_0 fgc-danger bgc-pure gap-1"
        style={{
          "flexWrap": "wrap",
        }}
      >
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
          CalendarIcon,
          TodayIcon,
          ClockIcon,
          ListIcon,
          SaveIcon,
          ClearAllIcon,
          UndoIcon,
          RedoIcon,
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
              <Button $icon={<Component />} />
              <Button $icon={<Component />} $outline />
              <Button $icon={<Component />}>{name}</Button>
            </Row>
          );
        })}
      </div>
    </div>
  );
};

export default Page;