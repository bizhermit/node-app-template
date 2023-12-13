"use client";

import Button from "#/client/elements/button";
import Divider from "#/client/elements/divider";
import Form, { useFormRef } from "#/client/elements/form";
import CheckBox from "#/client/elements/form/items/check-box";
import TextBox from "#/client/elements/form/items/text-box";
import Row from "#/client/elements/row";
import StructView from "#/client/elements/struct-view";
import generateArray from "#/objects/array/generator";
import { useState } from "react";

const FormClient = () => {
  const [count, setCount] = useState(0);
  const [bind, setBind] = useState<Struct>({});
  const [viewBind, setViewBind] = useState(bind);
  const [formBind, setFormBind] = useState<Struct>({
    array: generateArray(10, idx => {
      return {
        id: idx,
        text: `item${idx}`,
      };
    })
  });
  const [viewFormBind, setViewFormBind] = useState(formBind);
  const formRef = useFormRef();

  return (
    <div className="flex column w-100 p-xs">
      <h1>Form</h1>
      <section className="flex column g-s">
        <h2>submit/reset/button</h2>
        <Form
          className="flex g-s"
          $bind={formBind}
          // $bind
          action="/api/form"
          method="post"
          // $disabled
          // $readOnly
          // $messageDisplayMode="bottom"
          $formRef={formRef}
          $onSubmit={(fd) => {
            console.log("----submit----");
            console.log(fd);
            setViewFormBind({
              ...(() => {
                if (fd instanceof FormData) {
                  const d: Struct = {};
                  fd.forEach((v, k) => {
                    if (!(k in d)) {
                      d[k] = v;
                      return;
                    }
                    if (!Array.isArray(d[k])) {
                      d[k] = [d[k]];
                    }
                    d[k].push(v);
                  });
                  console.log("formData: ", d);
                  return d;
                }
                return fd;
              })()
            });
            // return false;
          }}
          $onReset={() => {
            console.log("reset");
            // return false;
          }}
        >
          <section className="flex g-s">
            <h3>form item</h3>
            <Row>
              <TextBox
                name="text-box"
                $required
                $defaultValue="fuga"
                $onChange={(a, b) => {
                  console.log(b, "->", a);
                }}
              />
              <CheckBox
                name="check-box"
                $required
              />
            </Row>
            {/* <div className="flex">
              {formBind.array.map(((item: Struct) => {
                return (
                  <Row key={item.id}>
                    <TextBox
                      name="text"
                      $bind={item}
                      $required
                      $preventFormBind
                    />
                    <DateBox
                      name="from"
                      $bind={item}
                      $required
                      $preventFormBind
                      $rangePair={{
                        name: "to",
                        position: "after",
                      }}
                    />
                    <DateBox
                      name="to"
                      $bind={item}
                      $preventFormBind
                      $rangePair={{
                        name: "from",
                        position: "before",
                      }}
                    />
                  </Row>
                );
              }))}
            </div> */}
            <Row className="g-s">
              <Button type="submit">submit / show form bind</Button>
              <Button type="reset">reset</Button>
              <Button onClick={() => {
                console.log(formBind);
              }}>show form bind</Button>
            </Row>
            <Row className="g-s">
              <Button
                onClick={() => {
                  setCount(c => c + 1);
                  formRef.setValue("text-box", `abcd-${count}`);
                  
                }}
              >
                set from outer
              </Button>
              <Button
                onClick={() => {
                  formRef.reset();
                }}
              >
                reset
              </Button>
              <Button
                onClick={() => {
                  setFormBind({});
                }}
              >
                set form bind
              </Button>
            </Row>
          </section>
          <Divider />
          <section className="flex g-s">
            <h3>no form item</h3>
            <Row>
              <TextBox
                // name="self-bind-text-box"
                $preventFormBind
                // $bind={bind}
                $required
                // $defaultValue="hoge"
                $onChange={(a, b) => {
                  console.log(b, "->", a);
                }}
              />
              <CheckBox
                // name="self-bind-check-box"
                $preventFormBind
                // $bind={bind}
                $required
              />
            </Row>
            <Row className="g-s">
              <Button
                onClick={() => {
                  console.log(bind);
                  setViewBind({ ...bind });
                }}
              >
                show bind
              </Button>
            </Row>
          </section>
        </Form>
        <Divider />
        <Row $vAlign="top" className="g-l">
          <div className="flex">
            <h3 className="mt-xs">bind data</h3>
            <StructView
              $value={viewBind}
            />
          </div>
          <div className="flex">
            <h3 className="mt-xs">form bind data</h3>
            <StructView
              $value={viewFormBind}
            />
          </div>
        </Row>
      </section>
    </div>
  );
};

export default FormClient;