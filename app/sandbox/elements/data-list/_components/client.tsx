"use client";

import Button, { ButtonProps } from "#/client/elements/button";
import DataList from "#/client/elements/data-list";
import { DataListColumn } from "#/client/elements/data-list/class";
import NumberBox from "#/client/elements/form/items/number-box";
import ToggleBox from "#/client/elements/form/items/toggle-box";
import Row from "#/client/elements/row";
import { joinClassNames } from "#/client/utilities/attributes";
import ArrayUtils from "@bizhermit/basic-utils/dist/array-utils";
import { FC, useMemo, useState } from "react";

type Data = {
  id: number;
  col1?: string;
  col2?: string;
  col3?: string;
  col4?: string;
  col5?: string;
  string: string;
  number: number;
  date: string;
};

const generateArray = (length = 0) => {
  return ArrayUtils.generateArray(length, index => {
    return {
      id: index,
      string: `data ${index}`,
      number: index * 1000,
      date: `2023-01-${1 + index}`,
      button: `button${index}`,
    } as Data;
  });
};

const ArraySetterButton: FC<Pick<ButtonProps, "$onClick"> & {
  length: number | null;
}> = (props) => {
  return (
    <Button
      $size="s"
      $fitContent
      $onClick={props.$onClick}
    >
      {String(props.length)}
    </Button>
  )
};

const DataListClient = () => {
  const columns = useMemo(() => {
    const cols: Array<DataListColumn<Data>> = [];
    cols.push(
      {
        name: "string",
        label: "String",
      },
      {
        name: "number",
        dataType: "number",
        label: "Number",
        // align: "left",
        // fill: true,
      },
      {
        name: "date",
        dataType: "date",
        label: "Date",
        width: 120,
        align: "center",
        // border: false,
      },
      {
        name: "multi",
        rows: [{
          columns: [
            {
              name: "multi-string",
              displayName: "string",
              label: "String",
            },
            {
              name: "multi-number",
              displayName: "number",
              label: "Number",
              dataType: "number",
            },
          ],
        }, {
          columns: [
            {
              name: "multi-date",
              displayName: "date",
              label: "Date",
              dataType: "date",
            },
          ],
        }],
      },
      {
        name: "group",
        rows: [{
          columns: [
            {
              name: "group-caption",
              label: "Group",
            }
          ],
          body: false,
        }, {
          columns: [
            {
              name: "group-string",
              displayName: "string",
              label: "String",
            },
            {
              name: "group-number",
              displayName: "number",
              label: "Number",
              dataType: "number",
            },
          ],
        }],
      },
    );
    return cols;
  }, []);

  const [items, setItems] = useState<Array<Data>>(null!);

  const setAndGenerateItems = (length = 0) => {
    setItems(generateArray(length));
  };

  const [outline, setOutline] = useState(true);
  const [rowBorder, setRowBorder] = useState(true);
  const [cellBorder, setCellBorder] = useState(true);
  const [scroll, setScroll] = useState(true);
  const [page, setPage] = useState(false);
  const [perPage, setPerPage] = useState(10);

  return (
    <div className="flex w-100 h-100 g-m p-s">
      <Row className="g-s">
        <Row className="g-s">
          <ArraySetterButton length={null} $onClick={() => setItems(null!)} />
          <ArraySetterButton length={0} $onClick={() => setAndGenerateItems(0)} />
          <ArraySetterButton length={1} $onClick={() => setAndGenerateItems(1)} />
          <ArraySetterButton length={10} $onClick={() => setAndGenerateItems(10)} />
          <ArraySetterButton length={50} $onClick={() => setAndGenerateItems(50)} />
          <ArraySetterButton length={99} $onClick={() => setAndGenerateItems(99)} />
          <ArraySetterButton length={100} $onClick={() => setAndGenerateItems(100)} />
          <ArraySetterButton length={101} $onClick={() => setAndGenerateItems(101)} />
          <ArraySetterButton length={1000} $onClick={() => setAndGenerateItems(1000)} />
          <ArraySetterButton length={10000} $onClick={() => setAndGenerateItems(10000)} />
          <ArraySetterButton length={100000} $onClick={() => setAndGenerateItems(100000)} />
          <ArraySetterButton length={1000000} $onClick={() => setAndGenerateItems(1000000)} />
          <Button $size="s" $fitContent $onClick={() => console.log(items)}>disp</Button>
        </Row>
        <Row className="g-s">
          <ToggleBox $value={outline} $onChange={v => setOutline(v!)}>outline</ToggleBox>
          <ToggleBox $value={rowBorder} $onChange={v => setRowBorder(v!)}>row border</ToggleBox>
          <ToggleBox $value={cellBorder} $onChange={v => setCellBorder(v!)}>cell border</ToggleBox>
          <ToggleBox $value={scroll} $onChange={v => setScroll(v!)}>scroll</ToggleBox>
          <ToggleBox $value={page} $onChange={v => setPage(v!)}>page</ToggleBox>
          <NumberBox $value={perPage} $onChange={v => setPerPage(v ?? 20)} $min={1} $max={100} $width={100} $hideClearButton />
        </Row>
      </Row>
      <DataList
        className={joinClassNames("w-100", scroll ? "flex-1" : undefined)}
        $columns={columns}
        $value={items}
        $resize="xy"
        // $outline={false}
        // $rowBorder={false}
        // $cellBorder={false}
        $headerHeight={60}
        $footerHeight={60}
        $rowHeight={60}
      // $header
      // $emptyText
      // $headerHeight="6rem"
      // $rowHeight="3.6rem"
      // $multiSort
      // $scroll={scroll}
      // $outline={outline}
      // $rowBorder={rowBorder}
      // $cellBorder={cellBorder}
      // $page={page}
      // $perPage={perPage}
      // $onChangePage={(index) => {
      //   console.log(index);
      //   return true;
      // }}
      // $onClick={(ctx, elem) => {
      //   console.log(ctx, elem);
      // }}
      // $radio
      // $stripes
      // $rowPointer
      />
    </div>
  );
};

export default DataListClient;