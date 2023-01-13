import Button from "@/components/elements/button";
import Divider from "@/components/elements/divider";
import Form from "@/components/elements/form";
import CheckBox from "@/components/elements/form-items/check-box";
import DateBox from "@/components/elements/form-items/date-box";
import TextBox from "@/components/elements/form-items/text-box";
import Row from "@/components/elements/row";
import StructView from "@/components/elements/struct-view";
import ArrayUtils from "@bizhermit/basic-utils/dist/array-utils";
import { NextPage } from "next";
import { useState } from "react";

const Page: NextPage = () => {
  const [bind, setBind] = useState<Struct>({});
  const [viewBind, setViewBind] = useState(bind);
  const [formBind, setFormBind] = useState<Struct>({
    array: ArrayUtils.generateArray(10, idx => {
      return {
        id: idx,
        text: `item${idx}`,
      };
    })
  });
  const [viewFormBind, setViewFormBind] = useState(formBind);

  return (
    <div className="flex-stretch w-100 p-1">
      <h1>Form</h1>
      <section className="flex-stretch gap-1">
        <h2>submit/reset/button</h2>
        <Form
          className="flex-start gap-1"
          // $bind={formBind}
          $bind
          action="/api/form"
          method="post"
          // $disabled
          // $readOnly
          // $messageDisplayMode="bottom"
          $onSubmit={(fd) => {
            console.log("----submit----");
            console.log(fd);
            setViewFormBind({ ...(() => {
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
            })() });
            // return false;
          }}
          $onReset={() => {
            console.log("reset");
            // return false;
          }}
        >
          <section className="flex-start gap-1">
            <h3>form item</h3>
            <Row>
              <TextBox
                name="text-box"
                $required
                // $defaultValue="fuga"
                $onChange={(a, b) => {
                  console.log(b, "->", a);
                }}
              />
              <CheckBox
                name="check-box"
              $required
              />
            </Row>
            {/* <div className="flex-start">
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
            <Row className="gap-1">
              <Button type="submit">submit / show form bind</Button>
              <Button type="reset">reset</Button>
              <Button $onClick={() => {
                console.log(formBind);
              }}>show form bind</Button>
            </Row>
          </section>
          <Divider />
          <section className="flex-start gap-1">
            <h3>no form item</h3>
            <Row>
              <TextBox
                // name="self-bind-text-box"
                $preventFormBind
                $bind={bind}
                $required
                // $defaultValue="hoge"
                $onChange={(a, b) => {
                  console.log(b, "->", a);
                }}
              />
              <CheckBox
                // name="self-bind-check-box"
                $preventFormBind
                $bind={bind}
                $required
              />
            </Row>
            <Row className="gap-1">
              <Button
                $onClick={() => {
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
        <Row $vAlign="top" className="gap-3">
          <div className="flex-start">
            <h3 className="mt-1">bind data</h3>
            <StructView
              $value={viewBind}
            />
          </div>
          <div className="flex-start">
            <h3 className="mt-1">form bind data</h3>
            <StructView
              $value={viewFormBind}
            />
          </div>
        </Row>
      </section>
    </div>
  );
};

export default Page;