import Button from "@/components/elements/button";
import Form from "@/components/elements/form";
import CheckBox from "@/components/elements/form-items/check-box";
import TextBox from "@/components/elements/form-items/text-box";
import Row from "@/components/templates/row";
import { NextPage } from "next";
import { useState } from "react";

const Page: NextPage = () => {
  const [bind, setBind] = useState<Struct>({});

  return (
    <div className="flex-box p-1">
      <h1>Form</h1>
      <section>
        <h2>submit/reset/button</h2>
        <Form
          className="flex-box gap-1"
          $bind={bind}
          // $disabled
          // $readOnly
          // $messageDisplayMode="bottom"
          $onSubmit={(fd) => {
            console.log("submit", fd);
          }}
          $onReset={() => {
            console.log("reset");
            // return false;
          }}
        >
          <section>
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
          </section>
          <section>
            <h3>no form item</h3>
            <Row>
              <TextBox
                $required
                // $defaultValue="hoge"
                $onChange={(a, b) => {
                  console.log(b, "->", a);
                }}
              />
              <CheckBox
                $required
              />
            </Row>
          </section>
          <Row className="gap-1">
            <Button type="submit">submit</Button>
            <Button type="reset">reset</Button>
            <Button
              $onClick={() => {
                console.log(JSON.stringify(bind, null, 2));
              }}
            >
              button
            </Button>
          </Row>
        </Form>
      </section>
    </div>
  );
};

export default Page;