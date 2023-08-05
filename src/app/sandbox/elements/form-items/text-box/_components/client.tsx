"use client";

import Button from "#/components/elements/button";
import Divider from "#/components/elements/divider";
import Form from "#/components/elements/form";
import TextBox from "#/components/elements/form/items/text-box";
import ToggleBox from "#/components/elements/form/items/toggle-box";
import Row from "#/components/elements/row";
import { sample_number, sample_string } from "$/data-items/sample/item";
import { colors } from "#/utilities/sandbox";
import { useRef, useState } from "react";

const TextBoxClient = () => {
  const [disabled, setDisabled] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [value, setValue] = useState<Nullable<string>>();
  const [bind, setBind] = useState({});
  const [formBind, setFormBind] = useState({});
  const ref = useRef<HTMLDivElement>();

  return (
    <div className="flex-start p-1 gap-1">
      <Row className="gap-1">
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
            setBind({ "text-box-bind": "set" });
          }}
        >
          set bind
        </Button>
        <Button
          $onClick={() => {
            setFormBind({ "text-box-form-bind": "set" });
          }}
        >
          set form bind
        </Button>
      </Row>
      <Divider />
      <section>
        <h2>inputmode</h2>
        <TextBox
          $type="tel"
          ref={ref}
        />
      </section>
      <section>
        <h2>DataItem</h2>
        <Form
          method="post"
          $bind
          $onSubmit={(bindData) => {
            console.log(bindData);
          }}
        >
          <Row className="gap-1" $vAlign="bottom">
            <TextBox
              $tag="no item"
              $onChange={(a, b, data) => {
                console.log("no item: ", a);
                data.errorMessage;
              }}
            />
            <TextBox
              $tag="string"
              $dataItem={sample_string}
              // $required
              $onChange={v => console.log("string: ", v)}
              $messages={{
                required: "",
              }}
              $messagePosition="bottom-hide"
            />
            <TextBox
              $tag="number"
              $dataItem={sample_number}
              $onChange={v => console.log("number: ", v)}
            />
            <Button type="submit">submit</Button>
            <Button type="reset">reset</Button>
          </Row>
        </Form>
      </section>
      <Row className="gap-1">
        <TextBox
          $tag="useState"
          $disabled={disabled}
          $readOnly={readOnly}
          $value={value}
          // $length={4}
          $preventInputWithinLength
          $charType="h-num"
          $onChange={v => setValue(v)}
          $error="ex error"
        />
        <TextBox
          $tag="bind"
          $disabled={disabled}
          $readOnly={readOnly}
          name="text-box-bind"
          $bind={bind}
        />
        <Form
          $bind={formBind}
          $readOnly={readOnly}
          $disabled={disabled}
          action="/api/form"
          method="post"
        >
          <Row $vAlign="bottom" className="gap-1">
            <TextBox
              $tag="form bind"
              name="text-box-form-bind"
            />
            <Button type="submit">submit</Button>
          </Row>
        </Form>
      </Row>
      <section>
        <h2>tag</h2>
        <Row className="gap-1" $vAlign="bottom">
          <TextBox
            placeholder="no tag / placeholder"
            $disabled={disabled}
            $readOnly={readOnly}
            $width={300}
            $maxWidth={400}
            $resize
          />
          <TextBox
            $tag="Tag"
            $disabled={disabled}
            $readOnly={readOnly}
          />
          <TextBox
            $tag="Tag placeholder"
            $tagPosition="placeholder"
            $disabled={disabled}
            $readOnly={readOnly}
          />
          <TextBox
            $tag="round"
            $round
            $disabled={disabled}
            $readOnly={readOnly}
          />
        </Row>
      </section>
      <section>
        <h2>validation</h2>
        <Row className="gap-1">
          <TextBox
            $disabled={disabled}
            $readOnly={readOnly}
            $required
            $maxLength={10}
            $tag="required/max 10"
          />
          <TextBox
            $disabled={disabled}
            $readOnly={readOnly}
            $minLength={3}
            $tag="min3"
          />
          <TextBox
            $disabled={disabled}
            $readOnly={readOnly}
            $length={10}
            $tag="len10"
          />
        </Row>
      </section>
      <section>
        <h2>message position</h2>
        <div className="flex-start gap-2">
          <TextBox
            $disabled={disabled}
            $readOnly={readOnly}
            $required
            $tag="tooltip"
            $messagePosition="tooltip"
          />
          <TextBox
            $disabled={disabled}
            $readOnly={readOnly}
            $required
            $tag="bottom"
            $messagePosition="bottom"
          />
          <TextBox
            $disabled={disabled}
            $readOnly={readOnly}
            $required
            $tag="bottom-hide"
            $messagePosition="bottom-hide"
          />
          <TextBox
            $disabled={disabled}
            $readOnly={readOnly}
            $required
            $tag="hide"
            $messagePosition="hide"
          />
          <TextBox
            $disabled={disabled}
            $readOnly={readOnly}
            $required
            $tag="none"
            $messagePosition="none"
          />
        </div>
      </section>
      <section>
        <h2>color</h2>
        {colors.map(color => {
          return (
            <Row key={color} className="gap-1">
              <TextBox
                $tag={color}
                $color={color}
                $disabled={disabled}
                $readOnly={readOnly}
              />
              <TextBox
                $tag={color}
                $tagPosition="placeholder"
                $color={color}
                $disabled={disabled}
                $readOnly={readOnly}
              />
              <TextBox
                $tag="required"
                $color={color}
                $required
                $disabled={disabled}
                $readOnly={readOnly}
              />
            </Row>
          );
        })}
      </section>
    </div>
  );
};

export default TextBoxClient;