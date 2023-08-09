"use client";

import Button from "#/components/elements/button";
import Divider from "#/components/elements/divider";
import Form from "#/components/elements/form";
import CheckBox from "#/components/elements/form/items/check-box";
import FileDrop from "#/components/elements/form/items/file-drop";
import ToggleBox from "#/components/elements/form/items/toggle-box";
import Row from "#/components/elements/row";
import { sample_file } from "$/data-items/sample/item";
import { useState } from "react";

const FileDropClient = () => {
  const [disabled, setDisabled] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [value, setValue] = useState<Array<File>>([]);
  const [bind, setBind] = useState({});
  const [formBind, setFormBind] = useState({});

  return (
    <div className="flex-start p-xs w-100 h-100 g-s">
      <Row className="g-s" $vAlign="bottom">
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
      <Row className="g-s">
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
      <Row className="g-s">
        <FileDrop
          $tag="no item"
          $onChange={v => console.log("no item: ", v)}
          style={{ height: 100, width: 100, }}
        />
        <FileDrop
          $tag="file"
          $dataItem={sample_file}
          $onChange={v => console.log("file: ", v)}
          style={{ height: 100, width: 100, }}
        />
      </Row>
      <Row className="w-100 g-s">
        <FileDrop
          $tag="useState"
          $disabled={disabled}
          $readOnly={readOnly}
          // $value={value}
          $onChange={v => setValue(v!)}
          $required
          $append
          $multiple
          style={{
            height: 200,
            width: 400,
          }}
        >
          {(value != null && value.length > 0) ? value.map(file => {
            if (file == null) return null;
            return (
              <span
                key={file.name}
                style={{ alignSelf: "flex-start" }}
              >
                {file.name}
              </span>
            );
          }) : "ここにファイルをドロップ"}
        </FileDrop>
        <FileDrop
          $tag="bind"
          $disabled={disabled}
          $readOnly={readOnly}
          name="file-drop-bind"
          $bind={bind}
          $required
          $hideClearButton
          style={{
            height: 200,
            width: 400,
          }}
        >
          File Drop
        </FileDrop>
        <Form
          $bind={formBind}
          $disabled={disabled}
          $readOnly={readOnly}
          method="post"
          action="/api/form"
          // encType="multipart/form-data"
        >
          <FileDrop
            $tag="form bind"
            name="file-drop-form-bind"
            // $required
            $noFileDialog
            // $hideClearButton
            style={{
              height: 200,
              width: 400,
            }}
          >
            Hey!
          </FileDrop>
          <CheckBox
            name="check-box"
          />
          <input type="file" name="file" />
          <Button type="submit">submit</Button>
        </Form>
      </Row>
    </div>
  );
};

export default FileDropClient;