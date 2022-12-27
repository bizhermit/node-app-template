import Button from "@/components/elements/button";
import Divider from "@/components/elements/divider";
import Form from "@/components/elements/form";
import CheckBox from "@/components/elements/form-items/check-box";
import TextBox from "@/components/elements/form-items/text-box";
import Row from "@/components/elements/row";
import StructView from "@/components/elements/struct-view";
import { NextPage } from "next";
import { useState } from "react";

const Page: NextPage = () => {
  const [bind, setBind] = useState<Struct>({});
  const [viewBind, setViewBind] = useState(bind);
  const [formBind, setFormBind] = useState<Struct>({});
  const [viewFormBind, setViewFormBind] = useState(formBind);

  return (
    <div className="flex-stretch w-100 p-1">
      <h1>Form</h1>
      <section className="flex-stretch gap-1">
        <h2>submit/reset/button</h2>
        <Form
          className="flex-start gap-1"
          $bind={formBind}
          action="/api/form"
          method="post"
          // $disabled
          // $readOnly
          // $messageDisplayMode="bottom"
          $onSubmit={(fd) => {
            console.log(fd);
            setViewFormBind({ ...formBind });
            return false;
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
            <Row className="gap-1">
              <Button type="submit">submit / show form bind</Button>
              <Button type="reset">reset</Button>
            </Row>
          </section>
          <Divider />
          <section className="flex-start gap-1">
            <h3>no form item</h3>
            <Row>
              <TextBox
                name="self-bind-text-box"
                $bind={bind}
                $required
                // $defaultValue="hoge"
                $onChange={(a, b) => {
                  console.log(b, "->", a);
                }}
              />
              <CheckBox
                name="self-bind-check-box"
                $bind={bind}
                $required
              />
            </Row>
            <Row className="gap-1">
              <Button
                $onClick={() => {
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
              $struct={viewBind}
            />
          </div>
          <div className="flex-start">
            <h3 className="mt-1">form bind data</h3>
            <StructView
              $struct={viewFormBind}
            />
          </div>
        </Row>
      </section>
    </div>
  );
};

export default Page;