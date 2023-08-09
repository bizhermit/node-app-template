import Card from "#/components/elements/card";
import Row from "#/components/elements/row";
import StructView, { type StructKey } from "#/components/elements/struct-view";
import ArrayUtils from "@bizhermit/basic-utils/dist/array-utils";
import { useMemo } from "react";

const Page = () => {

  const struct = useMemo(() => {
    const ret: Struct = {};
    ArrayUtils.generateArray(10, index => {
      ret[`item${index}`] = `value ${index}`;
    });
    ret.left = "left";
    ret.center = "center";
    ret.right = "right";
    ret.text = "123456789012345678901234567890";
    ret.number = 1234567890;
    ret.date = new Date();
    ret.struct = {
      hoge: "Hoge",
      fuga: "Fuga",
      piyo: "Piyo!"
    };
    return ret;
  }, []);

  const keys = useMemo<Array<StructKey>>(() => {
    return [
      {
        key: "item1",
        label: "項目１",
      },
      {
        key: "item3",
        label: "項目３",
        align: "right",
      },
      {
        key: "item5",
        label: "項目５",
      },
      {
        key: "item7",
        label: "項目７",
      },
      {
        key: "left",
        label: "align left",
        align: "left",
      },
      {
        key: "center",
        label: "align left",
        align: "center",
      },
      {
        key: "right",
        label: "align left",
        align: "right",
      },
      {
        key: "text",
        label: "文字列",
      },
      {
        key: "number",
        label: "数値",
      },
      {
        key: "date",
        label: "日付",
      },
      {
        key: "struct",
        label: "Struct"
      },
      {
        key: "empty",
        label: "Empty",
      },
    ];
  }, []);

  return (
    <div className="flex-start w-100 p-xs g-s">
      <Row className="g-s" $vAlign="top">
        <StructView
          style={{ width: 350 }}
          $keys={keys}
          $value={struct}
          $outline
        />
        <Card
          style={{ width: 400 }}
          $color="sub"
          $accordion
        >
          StructView (auto keys)
          <div className="w-100">
            <StructView
              $color="sub-light"
              $value={struct}
            />
          </div>
        </Card>
      </Row>
    </div>
  );
};

export default Page;