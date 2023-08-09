// "use client";

import Divider from "#/components/elements/divider";
import TextBox from "#/components/elements/form/items/text-box";
import { colors } from "#/utilities/sandbox";

const DividerClient = () => {
  return (
    <div className="flex column w-100 p-xs">
      <h1>Divider</h1>
      <section>
        <h2>divider</h2>
        <Divider className="p-xs" />
        <Divider className="p-xs" $height={3} />
        <Divider className="p-xs" $align="right" />
      </section>
      <section>
        <h2>text</h2>
        <Divider className="p-xs" $align="left">left</Divider>
        <Divider className="p-xs" $align="center">center</Divider>
        <Divider className="p-xs" $align="right">right</Divider>
        <Divider>
          <TextBox placeholder="react node" />
        </Divider>
      </section>
      <section>
        <h2>color</h2>
        {colors.map(color => {
          return (
            <div key={color}>
              <Divider
                $color={color}
                className="py-1 px-1"
              >
                {color}
              </Divider>
              <Divider
                $color={color}
                $reverseColor
                className={`py-1 px-1 c-${color}`}
              >
                {`${color} reverse`}
              </Divider>
            </div>
          );
        })}
      </section>
    </div>
  );
};

export default DividerClient;