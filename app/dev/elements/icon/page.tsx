"use client";

import Button from "#/client/elements/button";
import SelectBox from "#/client/elements/form/items/select-box";
import TextBox from "#/client/elements/form/items/text-box";
import { BadgeIcon, ButtonIcon, CalendarIcon, CardIcon, CircleFillIcon, CircleIcon, ClearAllIcon, ClockIcon, CloudDownloadIcon, CloudIcon, CloudUploadIcon, ContainerIcon, CrossIcon, DoubleDownIcon, DoubleLeftIcon, DoubleRightIcon, DoubleUpIcon, DownIcon, ElementIcon, ExLinkIcon, FormIcon, FormItemIcon, HomeIcon, HorizontalDividerIcon, LabelIcon, LeftIcon, LeftRightIcon, ListIcon, LoadingIcon, MagnifyingGlassIcon, MenuIcon, MenuLeftIcon, MenuRightIcon, MinusIcon, NavContainerIcon, PlusIcon, PopupIcon, RedoIcon, ReloadIcon, RightIcon, SaveIcon, SlideContainerIcon, SmileIcon, SplitContainerIcon, StepperIcon, SyncIcon, TabContainerIcon, TextBoxIcon, TodayIcon, TooltipIcon, UndoIcon, UnloadIcon, UpDownIcon, UpIcon, VerticalDividerIcon } from "#/client/elements/icon";
import { isEmpty } from "#/objects/string/empty";
import { colors } from "#/utilities/sandbox";
import BaseLayout, { BaseSheet } from "@/dev/_components/base-layout";
import ControlLayout, { ControlItem } from "@/dev/_components/control-layout";
import { useState } from "react";

const Page = () => {
  const [fgColor, setFgColor] = useState<Color>();
  const [bgColor, setBgColor] = useState<Color>("base");
  const [filterText, setFilterText] = useState<string>();

  return (
    <BaseLayout title="Icon">
      <ControlLayout>
        <ControlItem caption="fg-color">
          <SelectBox
            style={{ width: "20rem" }}
            $value={fgColor}
            $onChange={v => setFgColor(v!)}
            $source={colors.map(color => {
              return { value: color, label: color };
            })}
          />
        </ControlItem>
        <ControlItem caption="bg-color">
          <SelectBox
            style={{ width: "20rem" }}
            $value={bgColor}
            $onChange={v => setBgColor(v!)}
            $source={colors.map(color => {
              return { value: color, label: color };
            })}
          />
        </ControlItem>
        <ControlItem caption="filter">
          <TextBox
            $value={filterText}
            $onChange={v => setFilterText(v!)}
            placeholder="icon name"
          />
        </ControlItem>
      </ControlLayout>
      <BaseSheet>
        <table>
          <style jsx>{`
        table {
          width: fit-content;
          border-spacing: 0;

          th {
            text-align: left;
            padding: var(--b-xs) var(--b-s);
          }
          
          td {
            padding: var(--b-xs);
          }

          tr {
            &:hover {
              background: var(--c-selected);
            }
          }
        }
      `}</style>
          <tbody>
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
              LeftRightIcon,
              UpDownIcon,
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
              HomeIcon,
              ElementIcon,
              SmileIcon,
              ButtonIcon,
              ExLinkIcon,
              ContainerIcon,
              NavContainerIcon,
              PopupIcon,
              FormIcon,
              FormItemIcon,
              MagnifyingGlassIcon,
              TextBoxIcon,
              TabContainerIcon,
              SlideContainerIcon,
              SplitContainerIcon,
              LoadingIcon,
              LabelIcon,
              StepperIcon,
              HorizontalDividerIcon,
              VerticalDividerIcon,
              TooltipIcon,
              BadgeIcon,
              CardIcon
            ].reverse().map(Component => {
              const name = Component.name;
              if (!isEmpty(filterText)) {
                if (name.toLocaleLowerCase().indexOf(filterText.toLowerCase()) < 0) return undefined;
              }
              return (
                <tr key={name} className="g-m">
                  <th>{name}</th>
                  <td>
                    <Component className={`fgc-${fgColor} bgc-${bgColor}`} $size="xs" />
                  </td>
                  <td>
                    <Component className={`fgc-${fgColor} bgc-${bgColor}`} $size="s" />
                  </td>
                  <td>
                    <Component className={`fgc-${fgColor} bgc-${bgColor}`} $size="m" />
                  </td>
                  <td>
                    <Component className={`fgc-${fgColor} bgc-${bgColor}`} $size="l" />
                  </td>
                  <td>
                    <Component className={`fgc-${fgColor} bgc-${bgColor}`} $size="xl" />
                  </td>
                  <td>
                    <Component className={`fgc-${fgColor} bgc-${bgColor} fs-xl`} />
                  </td>
                  <td>
                    <Button $icon={<Component />} $color={fgColor} />
                  </td>
                  <td>
                    <Button $icon={<Component />} $color={fgColor} $outline />
                  </td>
                  <td>
                    <Button $icon={<Component />} $color={fgColor} $fillLabel>{name}</Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </BaseSheet>
    </BaseLayout>
  );
};

export default Page;