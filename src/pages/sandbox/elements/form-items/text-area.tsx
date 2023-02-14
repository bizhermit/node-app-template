import Button from "@/components/elements/button";
import Divider from "@/components/elements/divider";
import Form from "@/components/elements/form";
import TextArea from "@/components/elements/form-items/text-area";
import ToggleBox from "@/components/elements/form-items/toggle-box";
import Row from "@/components/elements/row";
import { sample_string } from "@/data-items/sample/item";
import { NextPage } from "next";
import { useState } from "react";

const Page: NextPage = () => {
  const [disabled, setDisabled] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [value, setValue] = useState<Nullable<string>>();
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
            setValue(null);
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
        <Button
          $onClick={() => {
            setValue("set");
          }}
        >
          set state value
        </Button>
        <Button
          $onClick={() => {
            setBind({ "text-area-bind": "set" });
          }}
        >
          set bind
        </Button>
        <Button
          $onClick={() => {
            setFormBind({ "text-area-form-bind": "set" });
          }}
        >
          set form bind
        </Button>
      </Row>
      <Divider />
      <Row $vAlign="top" className="gap-1">
        <TextArea
          $tag="useState"
          $disabled={disabled}
          $readOnly={readOnly}
          $value={value}
          $onChange={v => setValue(v)}
          $required
          $messagePosition="bottom"
          $resize
          $width={300}
          $height={300}
          $dataItem={sample_string}
        />
        <TextArea
          name="text-area-bind"
          $bind={bind}
          $tag="bind"
          $disabled={disabled}
          $readOnly={readOnly}
          $required
          $resize="x"
        />
        <Form
          className="flex-start gap-1"
          $bind={formBind}
          $disabled={disabled}
          $readOnly={readOnly}
          action="/api/form"
          method="post"
        >
          <TextArea
            name="text-area-form-bind"
            $tag="form bind"
            $required
            $resize="y"
          />
          <Button type="submit">submit</Button>
        </Form>
        <textarea />
      </Row>
    </div>
  );
};

export default Page;