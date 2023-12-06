"use client";

import Button from "#/client/elements/button";
import { CalendarIcon, CircleFillIcon, CircleIcon, ClearAllIcon, ClockIcon, CloudDownloadIcon, CloudIcon, CloudUploadIcon, CrossIcon, DoubleDownIcon, DoubleLeftIcon, DoubleRightIcon, DoubleUpIcon, DownIcon, LeftIcon, ListIcon, MenuIcon, MenuLeftIcon, MenuRightIcon, MinusIcon, PlusIcon, RedoIcon, ReloadIcon, RightIcon, SaveIcon, SyncIcon, TodayIcon, UndoIcon, UnloadIcon, UpIcon } from "#/client/elements/icon";
import Row from "#/client/elements/row";

const Page = () => {
  return (
    <div className="flex p-s w-100 h-100 fgc-danger bdc-pure g-m">
      <Row className="g-m">
        <Button $icon={<CrossIcon />} $outline $size="xs">XS Button</Button>
        <Button $icon={<CrossIcon />} $outline $size="s">S Button</Button>
        <Button $icon={<CrossIcon />} $outline>M Button</Button>
        <Button $icon={<CrossIcon />} $outline $size="l">L Button</Button>
        <Button $icon={<CrossIcon />} $outline $size="xl">XL Button</Button>
      </Row>
      <div
        className="flex p-s w-100 fgc-danger bgc-pure g-s"
      >
        {[
          PlusIcon,
          MinusIcon,
          CrossIcon,
          MenuIcon,
          MenuLeftIcon,
          MenuRightIcon,
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
          ReloadIcon,
          UnloadIcon,
          SyncIcon,
          CloudIcon,
          CloudDownloadIcon,
          CloudUploadIcon,
          CircleIcon,
          CircleFillIcon,
        ].map(Component => {
          const name = Component.name;
          return (
            <Row key={name} className="g-m">
              <Component className="bgc-cool" $size="xs" />
              <Component className="bgc-cool" $size="s" />
              <Component className="bgc-cool" $size="m" />
              <Component className="bgc-cool" $size="l" />
              <Component className="bgc-cool" $size="xl" />
              <div className="fs-xl">
                <Component className="bgc-cool fs-xl" />
              </div>
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