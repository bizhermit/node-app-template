"use client";

import Button from "#/client/elements/button";
import Divider from "#/client/elements/divider";
import Form from "#/client/elements/form";
import FileButton from "#/client/elements/form/items/file-button";
import ToggleSwitch from "#/client/elements/form/items/toggle-switch";
import { RightIcon } from "#/client/elements/icon";
import Row from "#/client/elements/row";
import { sample_file } from "$/data-items/sample";
import { useState } from "react";

const FileButtonClient = () => {
  const [disabled, setDisabled] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [value, setValue] = useState<File>(null!);
  const [bind, setBind] = useState({});
  const [formBind, setFormBind] = useState({});

  return (
    <div className="flex p-xs w-100 h-100 g-s">
      <Row className="g-s" $vAlign="bottom">
        <ToggleSwitch
          $tag="disabled"
          $value={disabled}
          $onChange={v => setDisabled(v!)}
        />
        <ToggleSwitch
          $tag="readOnly"
          $value={readOnly}
          $onChange={v => setReadOnly(v!)}
        />
      </Row>
      <Row className="g-s">
        <Button
          onClick={() => {
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
          onClick={() => {
            setValue(null!);
          }}
        >
          clear state value
        </Button>
        <Button
          $outline
          onClick={() => {
            setBind({});
          }}
        >
          clear bind
        </Button>
        <Button
          $outline
          onClick={() => {
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
        $color="sub"
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
        // $bind={bind}
        $required
      />
      <Form
        className="flex g-s"
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