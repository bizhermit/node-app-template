"use client";

import Button from "#/components/elements/button";
import { CalendarIcon, CircleFillIcon, CircleIcon, ClearAllIcon, ClockIcon, CloudDownloadIcon, CloudIcon, CloudUploadIcon, CrossIcon, DoubleDownIcon, DoubleLeftIcon, DoubleRightIcon, DoubleUpIcon, DownIcon, LeftIcon, ListIcon, MenuIcon, MinusIcon, PlusIcon, RedoIcon, RightIcon, SaveIcon, TodayIcon, UndoIcon, UpIcon } from "#/components/elements/icon";
import Row from "#/components/elements/row";

const Page = () => {
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
        className="flex-start p-2 w-100 fgc-danger bgc-pure gap-1"
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
          CloudIcon,
          CloudDownloadIcon,
          CloudUploadIcon,
          CircleIcon,
          CircleFillIcon,
        ].map(Component => {
          const name = Component.name;
          return (
            <Row key={name} className="gap-2">
              <Component className="bgc-cool" $size="xs" />
              <Component className="bgc-cool" $size="s" />
              <Component className="bgc-cool" $size="m" />
              <Component className="bgc-cool" $size="l" />
              <Component className="bgc-cool" $size="xl" />
              <Component className="bgc-cool" />
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