import Divider from "@/components/elements/divider";
import TextBox from "@/components/elements/form-items/text-box";
import { colors } from "@/utilities/sandbox";
import { NextPage } from "next";

const Page: NextPage = () => {
  return (
    <div className="flex-box flex-stretch w-100 p-1">
      <h1>Divider</h1>
      <section>
        <h2>divider</h2>
        <Divider className="p-1" />
        <Divider className="p-1" $height={3} />
        <Divider className="p-1" $align="right" />
      </section>
      <section>
        <h2>text</h2>
        <Divider className="p-1" $align="left">left</Divider>
        <Divider className="p-1" $align="center">center</Divider>
        <Divider className="p-1" $align="right">right</Divider>
        <Divider>
          <TextBox placeholder="react node" />
        </Divider>
      </section>
      <section>
        <h2>color</h2>
        {colors.map(color => {
          return (
            <Divider key={color} $color={color} className="py-1 px-1">{color}</Divider>
          );
        })}
      </section>
    </div>
  );
};

export default Page;