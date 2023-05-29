"use client";

import Button from "#/components/elements/button";
import Divider from "#/components/elements/divider";
import Form from "#/components/elements/form";
import FileButton from "#/components/elements/form-items/file-button";
import ToggleBox from "#/components/elements/form-items/toggle-box";
import { RightIcon } from "#/components/elements/icon";
import Row from "#/components/elements/row";
import { sample_file } from "$/data-items/sample/item";
import { useState } from "react";

const FileButtonClient = () => {
  const [disabled, setDisabled] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [value, setValue] = useState<File>(null!);
  const [bind, setBind] = useState({});
  const [formBind, setFormBind] = useState({});

  return (
    <div className="flex-start p-1 w-100 h-100 gap-1">
      <Row className="gap-1" $vAlign="bottom">
        <ToggleBox
          $tag="disabled"
          $value={disabled}
          $onChange={v => setDisabled(v!)}
        />
        <ToggleBox
          $tag="readOnly"
          $value={readOnly}
          $onChange={v => setReadOnly(v!)}
        />
      </Row>
      <Row className="gap-1">
        <Button
          $onClick={() => {
            console.log("-------------------");
            console.log("useState: ", value);
            console.log("bind: ", bind);
            console.log("formBind: ", formBind);
          }}
        >
          show value
        </Button>
        <Button
          $outline
          $onClick={() => {
            setValue(null!);
          }}
        >
          clear state value
        </Button>
        <Button
          $outline
          $onClick={() => {
            setBind({});
          }}
        >
          clear bind
        </Button>
        <Button
          $outline
          $onClick={() => {
            setFormBind({});
          }}
        >
          clear form bind
        </Button>
      </Row>
      <Divider />
      <FileButton
        $tag="no item"
        $onChange={v => console.log("no item", v)}
      />
      <FileButton
        $tag="file"
        $dataItem={sample_file}
        $onChange={v => console.log("file: ", v)}
        // $multiple
      />
      <FileButton
        $tag="useState"
        $disabled={disabled}
        $readOnly={readOnly}
        $value={value}
        $onChange={v => setValue(v!)}
        $required
        $hideFileName
        $icon={<RightIcon />}
      >
        {value?.name ?? "ファイルを選択"}
      </FileButton>
      <FileButton
        $tag="bind"
        $disabled={disabled}
        $readOnly={readOnly}
        name="file-button-bind"
        $bind={bind}
        $required
      />
      <Form
        className="flex-start gap-1"
        $bind={formBind}
        $disabled={disabled}
        $readOnly={readOnly}
        action="/api/form"
        method="post"
      >
        <FileButton
          $tag="form bind"
          name="file-button-form-bind"
          $required
        />
        <Button type="submit" $outline>submit</Button>
      </Form>
    </div>
  );
};

export default FileButtonClient;