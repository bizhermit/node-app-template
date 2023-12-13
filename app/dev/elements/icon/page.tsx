"use client";

import Button from "#/client/elements/button";
import { CalendarIcon, CircleFillIcon, CircleIcon, ClearAllIcon, ClockIcon, CloudDownloadIcon, CloudIcon, CloudUploadIcon, CrossIcon, DoubleDownIcon, DoubleLeftIcon, DoubleRightIcon, DoubleUpIcon, DownIcon, ElementIcon, HomeIcon, LeftIcon, LeftRightIcon, ListIcon, MenuIcon, MenuLeftIcon, MenuRightIcon, MinusIcon, PlusIcon, RedoIcon, ReloadIcon, RightIcon, SaveIcon, SmileIcon, SyncIcon, TodayIcon, UndoIcon, UnloadIcon, UpIcon } from "#/client/elements/icon";
import BaseLayout, { BaseSheet } from "@/dev/_components/base-layout";

const Page = () => {
  return (
    <BaseLayout title="Icon">
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
            ].reverse().map(Component => {
              const name = Component.name;
              return (
                <tr key={name} className="g-m">
                  <th>{name}</th>
                  <td>
                    <Component className="bgc-cool" $size="xs" />
                  </td>
                  <td>
                    <Component className="bgc-cool" $size="s" />
                  </td>
                  <td>
                    <Component className="bgc-cool" $size="m" />
                  </td>
                  <td>
                    <Component className="bgc-cool" $size="l" />
                  </td>
                  <td>
                    <Component className="bgc-cool" $size="xl" />
                  </td>
                  <td>
                    <Component className="bgc-cool fs-xl" />
                  </td>
                  <td>
                    <Button $icon={<Component />} />
                  </td>
                  <td>
                    <Button $icon={<Component />} $outline />
                  </td>
                  <td>
                    <Button $icon={<Component />}>{name}</Button>
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