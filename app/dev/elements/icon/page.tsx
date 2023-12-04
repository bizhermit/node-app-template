"use client";

import Button from "#/client/elements/button";
import { CalendarIcon, CircleFillIcon, CircleIcon, ClearAllIcon, ClockIcon, CloudDownloadIcon, CloudIcon, CloudUploadIcon, CrossIcon, DoubleDownIcon, DoubleLeftIcon, DoubleRightIcon, DoubleUpIcon, DownIcon, HomeIcon, LeftIcon, ListIcon, MenuIcon, MenuLeftIcon, MenuRightIcon, MinusIcon, PlusIcon, RedoIcon, ReloadIcon, ReloadLeftIcon, RightIcon, SaveIcon, SyncIcon, TodayIcon, UndoIcon, UpIcon } from "#/client/elements/icon";

const Page = () => {
  return (
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
          CalendarIcon,
          TodayIcon,
          ClockIcon,
          ListIcon,
          SaveIcon,
          ClearAllIcon,
          UndoIcon,
          RedoIcon,
          ReloadIcon,
          ReloadLeftIcon,
          SyncIcon,
          CloudIcon,
          CloudDownloadIcon,
          CloudUploadIcon,
          CircleIcon,
          CircleFillIcon,
          HomeIcon,
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
  );
};

export default Page;